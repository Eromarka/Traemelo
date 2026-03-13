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

    useEffect(() => {
        const fetchUserStore = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('stores')
                .select('id')
                .eq('user_id', user.id)
                .single();
            
            if (data) setStoreId(data.id);
        };
        fetchUserStore();
    }, [user]);

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
                    category_id: product.category_id || null
                }]);

            if (error) throw error;
            
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

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-2">URL de Imagen</label>
                        <div className="glass-card-intense rounded-2xl border border-white/10 p-1">
                            <input 
                                type="url"
                                className="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-white placeholder-white/20"
                                value={product.image_url}
                                onChange={e => setProduct({...product, image_url: e.target.value})}
                            />
                        </div>
                        <div className="mt-4 rounded-3xl overflow-hidden h-40 border border-white/10 relative group">
                            <img src={product.image_url} alt="Vista previa" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <p className="absolute bottom-4 left-4 text-[10px] font-black uppercase tracking-widest opacity-60">Vista previa de imagen</p>
                        </div>
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
