import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface Store {
    id: string;
    business_name: string;
    address: string;
    description: string;
    user_id: string;
    created_at: string;
    image_url: string;
    status: 'pending' | 'active' | 'rejected';
}

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    store_id: string;
    status: 'pending' | 'approved' | 'rejected';
    stores?: { business_name: string };
}

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [stores, setStores] = useState<Store[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'stores' | 'products' | 'all'>('stores');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        if (profile && profile.role !== 'admin') {
            navigate('/home');
        }
        if (activeTab === 'stores') fetchStores();
        if (activeTab === 'products') fetchProducts();
    }, [profile, activeTab]);

    const fetchStores = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('stores')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (!error && data) setStores(data);
        setIsLoading(false);
    };

    const fetchProducts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*, stores(business_name)')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (!error && data) setProducts(data);
        setIsLoading(false);
    };

    const handleApproveStore = async (storeId: string) => {
        setActionLoading(storeId);
        const { error } = await supabase
            .from('stores')
            .update({ status: 'active', approved_at: new Date().toISOString() })
            .eq('id', storeId);

        if (!error) setStores(prev => prev.filter(s => s.id !== storeId));
        setActionLoading(null);
    };

    const handleApproveProduct = async (productId: string) => {
        setActionLoading(productId);
        const { error } = await supabase
            .from('products')
            .update({ status: 'approved' })
            .eq('id', productId);

        if (!error) setProducts(prev => prev.filter(p => p.id !== productId));
        setActionLoading(null);
    };

    const handleRejectStore = async (storeId: string) => {
        setActionLoading(storeId);
        await supabase.from('stores').update({ status: 'rejected' }).eq('id', storeId);
        setStores(prev => prev.filter(s => s.id !== storeId));
        setActionLoading(null);
    };

    const handleRejectProduct = async (productId: string) => {
        setActionLoading(productId);
        await supabase.from('products').update({ status: 'rejected' }).eq('id', productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
        setActionLoading(null);
    };

    return (
        <div className="relative min-h-screen flex flex-col aurora-bg pb-24 text-white overflow-hidden uppercase font-black tracking-tighter">
            <header className="px-6 pt-10 pb-6 flex flex-col gap-6 sticky top-0 z-50 backdrop-blur-3xl border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-white">Panel <span className="text-primary truncate max-w-[150px] inline-block align-bottom">Admin</span></h1>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">Gestión Global</p>
                    </div>
                    <button onClick={() => navigate('/home')} className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-white">close</span>
                    </button>
                </div>

                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    <button 
                        onClick={() => setActiveTab('stores')}
                        className={`flex-1 py-3 rounded-xl text-[10px] tracking-widest transition-all ${activeTab === 'stores' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40'}`}
                    >
                        NEGOCIOS
                    </button>
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`flex-1 py-3 rounded-xl text-[10px] tracking-widest transition-all ${activeTab === 'products' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40'}`}
                    >
                        PRODUCTOS
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xs font-black uppercase text-white/40 tracking-[0.2em]">
                        {activeTab === 'stores' ? 'Negocios Pendientes' : 'Productos Pendientes'} ({activeTab === 'stores' ? stores.length : products.length})
                    </h2>
                    <button onClick={activeTab === 'stores' ? fetchStores : fetchProducts} className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">refresh</span> Actualizar
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Cargando...</p>
                    </div>
                ) : (activeTab === 'stores' ? stores : products).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                        <div className="size-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-white/20">
                            <span className="material-symbols-outlined text-5xl">inventory_2</span>
                        </div>
                        <p className="text-white font-black text-lg">Sin pendientes</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {activeTab === 'stores' ? (
                            stores.map((store) => (
                                <motion.div 
                                    key={store.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    className="glass-card-intense rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative"
                                >
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="size-16 rounded-2xl bg-white/5 overflow-hidden border border-white/10 shrink-0">
                                                <img src={store.image_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-black text-lg tracking-tight truncate">{store.business_name}</h3>
                                                <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mt-1">Negocio Nuevo</p>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 rounded-[1.5rem] p-4 border border-white/5">
                                            <p className="text-white/60 text-xs normal-case font-normal italic leading-relaxed">"{store.description}"</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => handleApproveStore(store.id)}
                                                disabled={!!actionLoading}
                                                className="flex-1 h-12 rounded-2xl bg-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] text-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
                                            >
                                                Aprobar Negocio
                                            </button>
                                            <button 
                                                onClick={() => handleRejectStore(store.id)}
                                                disabled={!!actionLoading}
                                                className="px-5 h-12 rounded-2xl bg-white/5 border border-white/10 text-red-400 font-black text-[10px]"
                                            >
                                                <span className="material-symbols-outlined text-sm">cancel</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            products.map((product) => (
                                <motion.div 
                                    key={product.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    className="glass-card-intense rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative"
                                >
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="size-16 rounded-2xl bg-white/5 overflow-hidden border border-white/10 shrink-0">
                                                <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-black text-lg tracking-tight truncate">{product.name}</h3>
                                                <p className="text-primary text-[9px] font-black uppercase tracking-widest mt-1">{product.stores?.business_name || 'Negocio'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-emerald-400">${product.price}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 rounded-[1.5rem] p-4 border border-white/5">
                                            <p className="text-white/60 text-xs normal-case font-normal italic leading-relaxed">"{product.description}"</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => handleApproveProduct(product.id)}
                                                disabled={!!actionLoading}
                                                className="flex-1 h-12 rounded-2xl bg-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] text-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
                                            >
                                                Aprobar Producto
                                            </button>
                                            <button 
                                                onClick={() => handleRejectProduct(product.id)}
                                                disabled={!!actionLoading}
                                                className="px-5 h-12 rounded-2xl bg-white/5 border border-white/10 text-red-400 font-black text-[10px]"
                                            >
                                                <span className="material-symbols-outlined text-sm">cancel</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};
