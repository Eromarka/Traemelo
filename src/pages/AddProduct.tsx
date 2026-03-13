import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { useCategories } from '../hooks/useCategories';
import { useImageUpload } from '../hooks/useImageUpload';

export const AddProduct = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { categories } = useCategories();
    const [loading, setLoading] = useState(false);
    const [storeId, setStoreId] = useState<string | null>(null);
    const { uploadImage, uploading, progress, error: uploadError, clearError } = useImageUpload('products', user?.id);

    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: '',
        is_promo: false
    });

    useEffect(() => {
        const fetchUserStore = async () => {
            if (!user) return;
            const { data } = await supabase
                .from('stores')
                .select('id')
                .eq('user_id', user.id)
                .single();
            
            if (data) setStoreId(data.id);
        };
        fetchUserStore();
    }, [user]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // Mostrar preview local inmediatamente
        const localPreview = URL.createObjectURL(file);
        setProduct(prev => ({ ...prev, image_url: localPreview }));
        // Subir a Supabase Storage
        const publicUrl = await uploadImage(file);
        if (publicUrl) {
            setProduct(prev => ({ ...prev, image_url: publicUrl }));
        } else {
            // Si falla, limpiar preview
            setProduct(prev => ({ ...prev, image_url: '' }));
        }
        // Limpiar el input para poder re-seleccionar el mismo archivo
        e.target.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!storeId) return alert('No se encontró una tienda asociada a tu cuenta');
        
        setLoading(true);
        try {
            const { error } = await supabase
                .from('products')
                .insert([{
                    ...product,
                    store_id: storeId,
                    price: parseFloat(product.price) || 0,
                    category_id: product.category_id || null,
                    status: 'pending' // Siempre pendiente de aprobación por admin
                }]);

            if (error) throw error;
            
            alert('Producto enviado para revisión. El administrador lo aprobará pronto.');
            navigate('/business/dashboard');
        } catch (err: any) {
            alert('Error al guardar: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col aurora-bg text-white overflow-hidden pb-10">
            <header className="px-6 pt-10 pb-6 flex items-center gap-4 sticky top-0 z-50 backdrop-blur-3xl border-b border-white/5">
                <button 
                    onClick={() => navigate('/business/dashboard')}
                    className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-all"
                >
                    <span className="material-symbols-outlined text-white">chevron_left</span>
                </button>
                <h1 className="text-xl font-black tracking-tighter">Añadir <span className="text-primary italic">Producto</span></h1>
            </header>

            <main className="flex-1 p-6 z-10">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-2">Nombre del Producto</label>
                        <div className="glass-card-intense rounded-2xl border border-white/10 p-1">
                            <input 
                                required
                                type="text"
                                placeholder="Ej: Pizza Margarita XL"
                                className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-white placeholder-white/20"
                                value={product.name}
                                onChange={e => setProduct({...product, name: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-2">Descripción</label>
                        <div className="glass-card-intense rounded-2xl border border-white/10 p-1">
                            <textarea 
                                placeholder="Ingredientes, porciones, etc..."
                                className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-white placeholder-white/20 min-h-[100px]"
                                value={product.description}
                                onChange={e => setProduct({...product, description: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-2">Precio ($)</label>
                            <div className="glass-card-intense rounded-2xl border border-white/10 p-1">
                                <input 
                                    required
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-white placeholder-white/20 font-black text-lg"
                                    value={product.price}
                                    onChange={e => setProduct({...product, price: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-2">Categoría</label>
                            <div className="glass-card-intense rounded-2xl border border-white/10 p-1 overflow-hidden">
                                <select 
                                    className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-white cursor-pointer"
                                    value={product.category_id}
                                    onChange={e => setProduct({...product, category_id: e.target.value})}
                                >
                                    <option value="" className="bg-slate-900">Seleccionar...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id} className="bg-slate-900">{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-2">Foto del Producto</label>

                        {/* Error de upload */}
                        <AnimatePresence>
                            {uploadError && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/30"
                                >
                                    <span className="material-symbols-outlined text-red-400 text-lg shrink-0 mt-0.5">error</span>
                                    <div className="flex-1">
                                        <p className="text-red-300 text-xs font-bold">{uploadError}</p>
                                    </div>
                                    <button onClick={clearError} className="text-red-400/60 hover:text-red-300 transition-colors">
                                        <span className="material-symbols-outlined text-base">close</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Preview o zona de carga */}
                        <AnimatePresence mode="wait">
                            {product.image_url ? (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative rounded-3xl overflow-hidden h-56 border border-white/10 shadow-2xl group"
                                >
                                    <img
                                        src={product.image_url}
                                        alt="Vista previa"
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                                    />
                                    {/* Barra de progreso superpuesta */}
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3">
                                            <span className="material-symbols-outlined text-primary text-4xl animate-spin">sync</span>
                                            <div className="w-2/3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(0,242,255,0.8)]"
                                                    initial={{ width: '0%' }}
                                                    animate={{ width: `${progress}%` }}
                                                    transition={{ ease: 'easeOut', duration: 0.4 }}
                                                />
                                            </div>
                                            <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Subiendo {progress}%</p>
                                        </div>
                                    )}
                                    {/* Overlay con acciones */}
                                    {!uploading && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                                            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Vista Previa ✓</p>
                                                    <p className="text-[9px] text-white/60 font-bold">Así la verán tus clientes</p>
                                                </div>
                                                <label className="cursor-pointer">
                                                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 active:scale-95 transition-all">
                                                        <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
                                                        <span className="text-[9px] font-black uppercase tracking-wider text-white">Cambiar</span>
                                                    </div>
                                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.label
                                    key="dropzone"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="w-full block cursor-pointer"
                                >
                                    <div className="glass-card-intense rounded-3xl border-2 border-dashed border-white/15 hover:border-primary/50 transition-all duration-300 p-10 flex flex-col items-center justify-center gap-4 active:scale-[0.98]">
                                        <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>add_photo_alternate</span>
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-white font-black text-sm uppercase tracking-tight">Toca para subir foto</p>
                                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">JPG · PNG · WEBP · HEIC · Máx 5MB</p>
                                        </div>
                                    </div>
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                </motion.label>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-3 p-4 glass-panel rounded-3xl border border-white/5">
                        <input 
                            type="checkbox"
                            id="is_promo"
                            className="w-6 h-6 rounded-lg bg-white/5 border-white/20 text-primary focus:ring-primary/20"
                            checked={product.is_promo}
                            onChange={e => setProduct({...product, is_promo: e.target.checked})}
                        />
                        <label htmlFor="is_promo" className="text-sm font-bold cursor-pointer">Marcar como Oferta Especial</label>
                    </div>

                    <Button 
                        disabled={loading}
                        className="w-full h-16 rounded-[2rem] text-lg font-black tracking-tighter shadow-2xl shadow-primary/20"
                    >
                        {loading ? 'Guardando...' : 'Publicar Producto'}
                    </Button>
                </form>
            </main>
        </div>
    );
};
