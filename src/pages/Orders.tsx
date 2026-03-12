import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/layout/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

const getStatusConfig = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'pending' || s === 'pendiente') return { label: 'Pendiente', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: 'schedule' };
    if (s === 'processing' || s === 'preparando') return { label: 'En Cocina', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: 'restaurant' };
    if (s === 'delivery' || s === 'en camino') return { label: 'En Camino', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: 'delivery_dining' };
    if (s === 'completed' || s === 'entregado') return { label: 'Entregado', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: 'check_circle' };
    if (s === 'cancelled' || s === 'cancelado') return { label: 'Cancelado', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: 'block' };
    return { label: status, color: 'bg-white/10 text-white border-white/20', icon: 'receipt_long' };
};

export const Orders = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();

        if (user) {
            const channel = supabase
                .channel('orders_realtime')
                .on('postgres_changes', { 
                    event: '*', 
                    schema: 'public', 
                    table: 'orders',
                    filter: `user_id=eq.${user.id}`
                }, () => {
                    fetchOrders();
                })
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user]);

    const activeOrders = orders.filter(o => !['completed', 'entregado', 'cancelled', 'cancelado'].includes(o.status.toLowerCase()));
    const history = orders.filter(o => ['completed', 'entregado', 'cancelled', 'cancelado'].includes(o.status.toLowerCase()));

    const getStatusStep = (status: string) => {
        const s = status.toLowerCase();
        if (s === 'pending' || s === 'pendiente') return 1;
        if (s === 'processing' || s === 'preparando') return 2;
        if (s === 'delivery' || s === 'en camino') return 3;
        if (s === 'completed' || s === 'entregado') return 4;
        return 0;
    };

    const SkeletonOrder = () => (
        <div className="glass-card-intense rounded-3xl p-5 border border-white/5 animate-pulse mb-4">
            <div className="flex gap-4">
                <div className="size-14 rounded-2xl bg-white/5"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-1/3"></div>
                    <div className="h-3 bg-white/5 rounded w-1/2"></div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative flex min-h-screen w-full flex-col aurora-bg overflow-x-hidden pb-32">
            <header className="sticky top-0 z-50 flex items-center bg-black/20 backdrop-blur-3xl px-5 pt-7 pb-4 border-b border-white/5">
                <button 
                   onClick={() => navigate('/home')}
                   className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
                </button>
                <h1 className="flex-1 text-center text-base font-black tracking-widest text-white uppercase pr-10">Mis Pedidos</h1>
            </header>

            <main className="px-5 pt-6 space-y-8">
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary text-xl">conversion_path</span>
                            <h2 className="text-white font-black text-sm uppercase tracking-tighter">Pedidos Activos</h2>
                            {activeOrders.length > 0 && (
                                <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-black border border-primary/20">
                                    {activeOrders.length}
                                </span>
                            )}
                        </div>
                        <button 
                            onClick={() => fetchOrders()}
                            className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 transition-all"
                        >
                            <span className="material-symbols-outlined text-sm">refresh</span>
                        </button>
                    </div>

                    {loading ? (
                        [1, 2].map(i => <SkeletonOrder key={i} />)
                    ) : activeOrders.length > 0 ? (
                        activeOrders.map((order) => {
                            const config = getStatusConfig(order.status);
                            const currentStep = getStatusStep(order.status);
                            
                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="glass-card-intense rounded-3xl p-5 border-white/10 shadow-2xl mb-6 relative overflow-hidden group hover:border-primary/30 transition-all"
                                >
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] -mr-16 -mt-16"></div>
                                    
                                    <div className="flex gap-4 relative z-10 mb-4">
                                        <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                            <span className="material-symbols-outlined text-primary text-2xl">{config.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-white font-black text-sm tracking-tight">Pedido #{order.id.slice(0, 8).toUpperCase()}</h3>
                                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-wider mt-0.5">
                                                        Total: ${order.total_price.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className={`px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${config.color}`}>
                                                    {config.label}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative z-10 px-2 py-4">
                                        <div className="flex justify-between relative">
                                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -translate-y-1/2"></div>
                                            <div 
                                                className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 transition-all duration-1000"
                                                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                                            ></div>

                                            {[1, 2, 3, 4].map((step) => (
                                                <div 
                                                    key={step}
                                                    className={`size-2.5 rounded-full relative z-10 transition-all duration-500 ${step <= currentStep ? 'bg-primary shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'bg-white/10'}`}
                                                ></div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between mt-2 px-1">
                                            <span className={`text-[8px] font-bold uppercase tracking-tighter ${currentStep >= 1 ? 'text-primary' : 'text-white/20'}`}>Recibido</span>
                                            <span className={`text-[8px] font-bold uppercase tracking-tighter ${currentStep >= 2 ? 'text-primary' : 'text-white/20'}`}>Cocina</span>
                                            <span className={`text-[8px] font-bold uppercase tracking-tighter ${currentStep >= 3 ? 'text-primary' : 'text-white/20'}`}>Camino</span>
                                            <span className={`text-[8px] font-bold uppercase tracking-tighter ${currentStep >= 4 ? 'text-primary' : 'text-white/20'}`}>Entregado</span>
                                        </div>
                                    </div>

                                    <div className="mt-2 flex gap-2 relative z-10">
                                        <button 
                                            onClick={() => navigate(`/tracking/${order.id}`)}
                                            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 active:scale-[0.98] transition-all"
                                        >
                                            Seguir Envío
                                        </button>
                                        <button className="px-5 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center hover:bg-primary/20 active:scale-[0.98] transition-all">
                                            <span className="material-symbols-outlined text-lg">chat</span>
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="glass-card rounded-[2.5rem] p-10 flex flex-col items-center gap-4 border-dashed border-white/10">
                            <div className="size-16 rounded-full bg-white/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white/20 text-3xl">shopping_cart</span>
                            </div>
                            <div className="text-center">
                                <h3 className="text-white/40 font-black text-sm uppercase tracking-widest">Nada en curso</h3>
                                <p className="text-white/20 text-xs mt-1 font-medium italic">¿Tienes hambre? Pide algo delicioso</p>
                            </div>
                        </div>
                    )}
                </section>

                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-white/40 text-xl">history</span>
                        <h2 className="text-white/40 font-black text-sm uppercase tracking-tighter">Historial Reciente</h2>
                    </div>

                    <div className="space-y-3">
                        {loading ? (
                            [1, 2].map(i => <div key={i} className="h-20 glass-card rounded-2xl animate-pulse"></div>)
                        ) : history.length > 0 ? (
                            history.map((order) => {
                                const config = getStatusConfig(order.status);
                                return (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="glass-card rounded-2xl p-4 border border-white/5 flex items-center justify-between group hover:border-white/10 transition-all active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                                                <span className="material-symbols-outlined text-white/40 text-xl">{config.icon}</span>
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-sm tracking-tight">Pedido #{order.id.slice(0, 5).toUpperCase()}</h4>
                                                <p className="text-white/30 text-[9px] font-black uppercase tracking-widest mt-0.5">
                                                    {new Date(order.created_at).toLocaleDateString()} • {order.items?.length || 0} productos
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-black text-sm tracking-tight">${order.total_price.toFixed(2)}</p>
                                            <button 
                                                onClick={() => navigate('/directory')}
                                                className="text-primary text-[9px] font-black uppercase tracking-widest mt-1 hover:underline active:opacity-70 transition-all"
                                            >Re-ordenar</button>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : !loading && (
                            <div className="text-center py-12">
                                <span className="material-symbols-outlined text-white/5 text-6xl">receipt_long</span>
                                <p className="text-white/10 font-black text-[10px] uppercase tracking-[0.2em] mt-2">Aún no hay historial</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <BottomNav />
        </div>
    );
};
