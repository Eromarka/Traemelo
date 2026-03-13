import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export const BusinessDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [stats] = useState({
        sales: 4520.50,
        orders: 12,
        avgTicket: 376.70,
        rating: 4.8
    });

    const [recentOrders, setRecentOrders] = useState([
        { id: '1', customer: 'Juan Pérez', status: 'preparando', total: 450, time: 'Hace 5 min' },
        { id: '2', customer: 'Maria García', status: 'en camino', total: 320, time: 'Hace 15 min' },
    ]);
    const [storeStatus, setStoreStatus] = useState<string>('active');
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchStoreData = async () => {
            if (!user) return;
            
            // Fetch store managed by this user
            const { data: storeData } = await supabase
                .from('stores')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (storeData) {
                setStoreStatus(storeData.status);
                
                // Fetch products for this store
                const { data: productsData } = await supabase
                    .from('products')
                    .select('*')
                    .eq('store_id', storeData.id)
                    .order('created_at', { ascending: false });
                
                if (productsData) setProducts(productsData);

                // Fetch orders for this store
                const { data: orders } = await supabase
                    .from('orders')
                    .select('*')
                    .limit(5);
                
                if (orders) {
                    setRecentOrders(orders.map(o => ({
                        id: o.id,
                        customer: 'Cliente #' + o.id.slice(0,4),
                        status: o.status,
                        total: o.total_price,
                        time: 'Reciente'
                    })));
                }
            }
        };

        fetchStoreData();
    }, [user]);

    const deleteProduct = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) alert('Error al eliminar');
        else setProducts(products.filter(p => p.id !== id));
    };

    return (
        <div className="relative min-h-screen flex flex-col aurora-bg pb-24 text-white overflow-hidden">
            {/* Header */}
            <header className="px-6 pt-10 pb-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-3xl border-b border-white/5">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter text-white">Dashboard <span className="text-primary truncate max-w-[150px] inline-block align-bottom">Negocio</span></h1>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">Gestión en Tiempo Real</p>
                </div>
                <button className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-white">settings</span>
                </button>
            </header>

            <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
                {storeStatus === 'pending' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-5 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 flex flex-col items-center text-center gap-3"
                    >
                        <div className="size-14 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500">
                            <span className="material-symbols-outlined text-3xl">pending_actions</span>
                        </div>
                        <div>
                            <h3 className="text-amber-500 font-black text-lg tracking-tight">Solicitud Pendiente</h3>
                            <p className="text-white/60 text-xs font-medium mt-1">Estamos revisando tu negocio. Te notificaremos cuando puedas empezar a vender.</p>
                        </div>
                    </motion.div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="glass-card-intense p-5 rounded-3xl border border-white/10"
                    >
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Ventas Hoy</p>
                        <h4 className="text-white font-black text-xl tracking-tighter">${stats.sales.toLocaleString()}</h4>
                        <div className="mt-2 text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            +12% vs ayer
                        </div>
                    </motion.div>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="glass-card-intense p-5 rounded-3xl border border-white/10"
                    >
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Pedidos</p>
                        <h4 className="text-white font-black text-xl tracking-tighter">{stats.orders}</h4>
                        <div className="mt-2 text-[9px] text-primary/60 font-medium">8 Activos</div>
                    </motion.div>
                </div>

                {/* Main Action Banner */}
                <motion.div 
                    whileTap={storeStatus === 'pending' ? {} : { scale: 0.98 }}
                    onClick={() => storeStatus !== 'pending' && navigate('/business/add-product')}
                    className={`relative overflow-hidden p-6 rounded-[2rem] border shadow-2xl transition-all ${
                        storeStatus === 'pending' 
                        ? 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed' 
                        : 'bg-gradient-to-br from-primary via-primary/80 to-primary/40 border-primary/20 shadow-primary/20 cursor-pointer text-black'
                    }`}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-8xl">add_shopping_cart</span>
                    </div>
                    <div className="relative z-10 text-black">
                        <h3 className="font-black text-2xl tracking-tighter leading-none mb-2">Añadir Producto</h3>
                        <p className="text-[10px] font-black uppercase tracking-wider opacity-70">
                            {storeStatus === 'pending' ? 'Disponible tras aprobación' : 'Crea una oferta nueva para hoy'}
                        </p>
                    </div>
                </motion.div>

                {/* Products List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xs font-black uppercase text-white/40 tracking-[0.2em]">Tu Inventario ({products.length})</h2>
                    </div>
                    {products.length === 0 ? (
                        <div className="p-10 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center gap-3 text-center opacity-40">
                             <span className="material-symbols-outlined text-4xl">inventory</span>
                             <p className="text-sm font-medium">No has añadido productos aún</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {products.map((prod) => (
                                <div key={prod.id} className="glass-card rounded-[2rem] p-4 flex items-center justify-between border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="size-16 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                                            <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm tracking-tight">{prod.name}</h4>
                                            <p className="text-primary font-black text-lg">${prod.price}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => deleteProduct(prod.id)}
                                        className="size-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Orders List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xs font-black uppercase text-white/40 tracking-[0.2em]">Pedidos Recientes</h2>
                        <button className="text-primary text-[10px] font-black uppercase tracking-widest">Ver Todos</button>
                    </div>
                    {recentOrders.map((order, idx) => (
                        <motion.div 
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}
                            className="glass-card rounded-2xl p-4 flex items-center justify-between group hover:bg-white/5 transition-all border-white/5"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${order.status === 'preparando' ? 'bg-amber-400/20 text-amber-400' : order.status === 'en camino' ? 'bg-primary/20 text-primary' : 'bg-emerald-400/20 text-emerald-400'}`}>
                                    <span className="material-symbols-outlined">{order.status === 'preparando' ? 'restaurant' : 'local_shipping'}</span>
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">{order.customer}</h4>
                                    <p className="text-white/30 text-[10px] uppercase font-black tracking-tight">{order.time} • ${order.total}</p>
                                </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'preparando' ? 'bg-amber-400/10 text-amber-400' : 'bg-primary/10 text-primary'}`}>
                                {order.status}
                            </span>
                        </motion.div>
                    ))}
                </div>

                {/* Store Management Sections */}
                <div className="grid grid-cols-2 gap-3">
                   <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
                       <span className="material-symbols-outlined text-xl">inventory_2</span>
                       <span className="text-[10px] font-black uppercase tracking-widest">Inventario</span>
                   </button>
                   <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
                       <span className="material-symbols-outlined text-xl">campaign</span>
                       <span className="text-[10px] font-black uppercase tracking-widest">Promociones</span>
                   </button>
                </div>
            </main>

            {/* Admin Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 p-4 z-50">
               <div className="glass-card-intense rounded-3xl p-3 flex justify-around items-center border border-white/10 shadow-2xl">
                    <button className="p-3 text-primary flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-2xl fill-1">dashboard</span>
                    </button>
                    <button className="p-3 text-white/40 flex flex-col items-center gap-1" onClick={() => navigate('/home')}>
                        <span className="material-symbols-outlined text-2xl">storefront</span>
                    </button>
                    <button className="p-3 text-white/40 flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-2xl">insights</span>
                    </button>
               </div>
            </nav>
        </div>
    );
};
