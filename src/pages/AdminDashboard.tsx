import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface Store {
    id: string;
    name: string;
    owner_name: string;
    image_url: string;
    description: string;
    status: 'pending' | 'active' | 'suspended';
    created_at: string;
    business_name?: string;
    address?: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
    image_url: string;
    description: string;
    status: 'pending' | 'active' | 'suspended';
    store_id: string;
    stores?: { name: string; business_name?: string; user_id?: string; status?: string };
}

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [stores, setStores] = useState<Store[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [allStores, setAllStores] = useState<Store[]>([]);
    const [activeTab, setActiveTab] = useState<'stores' | 'products' | 'all'>('stores');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error || data?.role !== 'admin') {
                setProfile(data);
                navigate('/home');
                return;
            }

            setProfile(data);
            await fetchData();
        };

        checkAdmin();
    }, [user, navigate]);

    useEffect(() => {
        if (profile) {
            fetchData();
        }
    }, [activeTab]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'stores') {
                const { data, error } = await supabase
                    .from('stores')
                    .select('*')
                    .eq('status', 'pending')
                    .order('created_at', { ascending: false });
                if (!error && data) setStores(data as Store[]);
            } else if (activeTab === 'products') {
                const { data, error } = await supabase
                    .from('products')
                    .select('*, stores(name, business_name, user_id, status)')
                    .eq('status', 'pending')
                    .order('created_at', { ascending: false });
                if (!error && data) setProducts(data as Product[]);
            } else if (activeTab === 'all') {
                const { data, error } = await supabase
                    .from('stores')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (!error && data) setAllStores(data as Store[]);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApproveStore = async (storeId: string) => {
        setActionLoading(storeId);
        try {
            // Get store details for notification
            const { data: storeDetails } = await supabase
                .from('stores')
                .select('name, user_id')
                .eq('id', storeId)
                .single();

            const { error } = await supabase
                .from('stores')
                .update({ status: 'active', is_active: true })
                .eq('id', storeId);

            if (error) throw error;

            setStores(prev => prev.filter(s => s.id !== storeId));

            // Create notification
            if (storeDetails?.user_id) {
                await supabase.from('notifications').insert({
                    user_id: storeDetails.user_id,
                    title: '🎉 ¡Tienda Activa!',
                    message: `Felicidades, tu tienda "${storeDetails.name}" ha sido aprobada.`,
                    type: 'success'
                });
            }
            alert('Tienda aprobada con éxito');
        } catch (err: any) {
            console.error("Error approving store:", err);
            alert('Error: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectStore = async (storeId: string) => {
        setActionLoading(storeId);
        try {
            const { error } = await supabase
                .from('stores')
                .update({ status: 'suspended', is_active: false })
                .eq('id', storeId);

            if (error) throw error;

            setStores(prev => prev.filter(s => s.id !== storeId));
            alert('Tienda rechazada (suspendida)');
        } catch (err: any) {
            console.error("Error rejecting store:", err);
            alert('Error: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleApproveProduct = async (productId: string) => {
        setActionLoading(productId);
        try {
            const { data: prodData, error: fetchErr } = await supabase
                .from('products')
                .select('name, store_id, stores(user_id, status, name)')
                .eq('id', productId)
                .single();

            if (fetchErr) throw fetchErr;

            const storeStatus = (prodData as any).stores?.status;
            if (storeStatus !== 'active') {
                if (!confirm(`La tienda "${(prodData as any).stores?.name}" aún está PENDIENTE. El producto se aprobará pero no será visible hasta que la tienda esté activa. ¿Continuar?`)) {
                    setActionLoading(null);
                    return;
                }
            }

            const { error } = await supabase
                .from('products')
                .update({ status: 'active' })
                .eq('id', productId);

            if (error) throw error;

            setProducts(prev => prev.filter(p => p.id !== productId));

            if (prodData && (prodData as any).stores?.user_id) {
                await supabase.from('notifications').insert({
                    user_id: (prodData as any).stores.user_id,
                    title: '✅ Producto Aprobado',
                    message: `Tu producto "${prodData.name}" ha sido aprobado.`,
                    type: 'success'
                });
            }
            alert('Producto aprobado con éxito');
        } catch (err: any) {
            console.error("Error approving product:", err);
            alert('Error: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectProduct = async (productId: string) => {
        setActionLoading(productId);
        try {
            const { error } = await supabase
                .from('products')
                .update({ status: 'suspended' })
                .eq('id', productId);

            if (error) throw error;

            setProducts(prev => prev.filter(p => p.id !== productId));
            alert('Producto rechazado');
        } catch (err: any) {
            console.error("Error rejecting product:", err);
            alert('Error: ' + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteStore = async (storeId: string) => {
        if (!confirm('⚠️ ¿Eliminar esta tienda permanentemente?')) return;
        setActionLoading(storeId);
        try {
            await supabase.from('products').delete().eq('store_id', storeId);
            const { error } = await supabase.from('stores').delete().eq('id', storeId);
            if (error) throw error;
            setAllStores(prev => prev.filter(s => s.id !== storeId));
            setStores(prev => prev.filter(s => s.id !== storeId));
        } catch (err: any) {
            alert('Error al eliminar: ' + err.message);
        } finally {
            setActionLoading(null);
        }
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
                        className={`flex-1 py-2 rounded-xl text-[9px] tracking-widest transition-all ${activeTab === 'stores' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40'}`}
                    >
                        PENDIENTES
                    </button>
                    <button 
                        onClick={() => setActiveTab('products')}
                        className={`flex-1 py-2 rounded-xl text-[9px] tracking-widest transition-all ${activeTab === 'products' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40'}`}
                    >
                        PRODUCTOS
                    </button>
                    <button 
                        onClick={() => setActiveTab('all')}
                        className={`flex-1 py-2 rounded-xl text-[9px] tracking-widest transition-all ${activeTab === 'all' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-white/40'}`}
                    >
                        TODAS
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xs font-black uppercase text-white/40 tracking-[0.2em]">
                        {activeTab === 'stores' ? `Pendientes (${stores.length})` 
                         : activeTab === 'products' ? `Productos (${products.length})` 
                         : `Todas las tiendas (${allStores.length})`}
                    </h2>
                    <button
                        onClick={fetchData}
                        className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-xs">refresh</span> Actualizar
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="size-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Cargando...</p>
                    </div>
                ) : (activeTab === 'stores' ? stores : activeTab === 'products' ? products : allStores).length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                        <div className="size-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-white/20">
                            <span className="material-symbols-outlined text-5xl">inventory_2</span>
                        </div>
                        <p className="text-white font-black text-lg">Sin elementos</p>
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
                                                <h3 className="text-white font-black text-lg tracking-tight truncate">{store.name || store.business_name}</h3>
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
                                                {actionLoading === store.id ? '...' : 'Aprobar'}
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
                        ) : activeTab === 'all' ? (
                            allStores.map((store) => (
                                <motion.div 
                                    key={store.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    className="glass-card-intense rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
                                >
                                    <div className="p-5 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="size-14 rounded-2xl bg-white/5 overflow-hidden border border-white/10 shrink-0">
                                                {store.image_url
                                                    ? <img src={store.image_url} alt="" className="w-full h-full object-cover" />
                                                    : <span className="material-symbols-outlined text-white/20 text-2xl flex items-center justify-center h-full w-full">store</span>
                                                }
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-white font-black text-base tracking-tight truncate">{store.name || store.business_name || 'Sin nombre'}</h3>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0 ${
                                                store.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                                                store.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                                {store.status}
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => handleDeleteStore(store.id)}
                                            disabled={!!actionLoading}
                                            className="w-full h-11 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete_forever</span> Eliminar
                                        </button>
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
                                                <p className="text-primary text-[9px] font-black uppercase tracking-widest mt-1">{product.stores?.name || product.stores?.business_name || 'Negocio'}</p>
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
                                                {actionLoading === product.id ? '...' : 'Aprobar Producto'}
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
