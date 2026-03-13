import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { useCategories } from '../hooks/useCategories';

export const AddProduct = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { categories } = useCategories();
    const [loading, setLoading] = useState(false);
    const [storeId, setStoreId] = useState<string | null>(null);

    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80', // Default image
        is_promo: false
    });

    const [uploading, setUploading] = useState(false);

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

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user?.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(filePath);

            setProduct({ ...product, image_url: publicUrl });
        } catch (error: any) {
            alert('Error al subir imagen: ' + error.message);
        } finally {
            setUploading(false);
        }
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
                        <div className="flex flex-col gap-4">
                            <label className="w-full">
                                <div className="glass-card-intense rounded-2xl border border-dashed border-white/20 p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 transition-all active:scale-[0.98]">
                                    <span className={`material-symbols-outlined text-3xl ${uploading ? 'animate-spin' : 'text-white/40'}`}>
                                        {uploading ? 'sync' : 'add_a_photo'}
                                    </span>
                                    <span className="text-xs font-bold text-white/60">
                                        {uploading ? 'Subiendo imagen...' : 'Seleccionar foto desde mi teléfono'}
                                    </span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </div>
                            </label>

                            <div className="space-y-2">
                                <label className="text-[9px] uppercase font-black tracking-widest text-white/20 ml-2">O pega una URL directa</label>
                                <div className="glass-card-intense rounded-2xl border border-white/10 p-1">
                                    <input 
                                        type="url"
                                        placeholder="https://..."
                                        className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-sm text-white placeholder-white/20"
                                        value={product.image_url}
                                        onChange={e => setProduct({...product, image_url: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        {product.image_url && (
                            <div className="mt-4 rounded-3xl overflow-hidden h-48 border border-white/10 relative group shadow-2xl">
                                <img src={product.image_url} alt="Vista previa" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Vista previa</p>
                                    <p className="text-xs font-bold text-white/80">Así lo verán tus clientes una vez aprobado</p>
                                </div>
                            </div>
                        )}
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
