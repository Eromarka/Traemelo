import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/layout/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

interface NotificationItem {
    id: string | number;
    title: string;
    desc: string;
    time: string;
    type: 'delivery' | 'promo' | 'info';
    icon: string;
    color: string;
    bg: string;
    image?: string;
    action?: () => void;
    isNew?: boolean;
}

const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Ahora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
};

export const Notifications = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Todo');

    useEffect(() => {
        const fetchRealNotifications = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                // Fetch direct notifications from the 'notifications' table first
                const { data: directNotifs } = await supabase
                    .from('notifications')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(10);

                // Fetch recent orders to turn into notifications if no direct notifications exist or to supplement
                const { data: orders, error: orderError } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (orderError) throw orderError;

                const orderNotifications: NotificationItem[] = (orders || []).map(order => {
                    let title = 'Pedido actualizado';
                    let desc = `Tu pedido #${order.id.slice(0, 8)} ha cambiado de estado.`;
                    let icon = 'receipt_long';
                    let color = 'text-primary';
                    let bg = 'bg-primary/10';
                    let type: 'delivery' | 'info' = 'info';

                    const status = order.status.toLowerCase();
                    if (status === 'pending' || status === 'pendiente') {
                        title = 'Pedido Recibido 📥';
                        desc = 'Estamos procesando tu orden. Te avisaremos pronto.';
                    } else if (status === 'processing' || status === 'preparando') {
                        title = 'En Preparación 🍳';
                        desc = 'Tu comida está siendo preparada con cuidado.';
                        icon = 'restaurant';
                        color = 'text-amber-400';
                        bg = 'bg-amber-400/10';
                    } else if (status === 'delivery' || status === 'en camino') {
                        title = '¡En Camino! 🛵';
                        desc = 'Tu repartidor ya salió. ¡Prepárate!';
                        icon = 'local_shipping';
                        type = 'delivery';
                    } else if (status === 'completed' || status === 'entregado') {
                        title = 'Pedido Entregado ✅';
                        desc = '¡Buen provecho! Cuéntanos qué tal estuvo tu experiencia.';
                        icon = 'task_alt';
                        color = 'text-emerald-400';
                        bg = 'bg-emerald-400/10';
                    }

                    return {
                        id: order.id,
                        title,
                        desc,
                        time: getTimeAgo(order.created_at),
                        type,
                        icon,
                        color,
                        bg,
                        isNew: status !== 'completed' && status !== 'entregado',
                        action: () => navigate(`/tracking/${order.id}`)
                    };
                });

                // Map direct notifications from DB
                const dbNotifs: NotificationItem[] = (directNotifs || []).map(n => ({
                    id: n.id,
                    title: n.title,
                    desc: n.message,
                    time: getTimeAgo(n.created_at),
                    type: n.type as any,
                    icon: n.type === 'order' ? 'local_shipping' : 'info',
                    color: n.type === 'order' ? 'text-primary' : 'text-white',
                    bg: n.type === 'order' ? 'bg-primary/10' : 'bg-white/5',
                    isNew: !n.is_read,
                    action: () => n.type === 'order' ? navigate('/orders') : null
                }));

                const promoNotifications: NotificationItem[] = [
                    {
                        id: 'promo-1',
                        title: 'Regalo para ti 🎁',
                        desc: 'Usa el código AURORA20 para un 20% de descuento en tu próxima orden.',
                        time: 'Hoy',
                        type: 'promo',
                        icon: 'redeem',
                        color: 'text-aurora-violet',
                        bg: 'bg-aurora-violet/10',
                        isNew: true
                    }
                ];

                // Merge and filter duplicates (simple ID check)
                const allNotifs = [...dbNotifs, ...orderNotifications, ...promoNotifications];
                const uniqueNotifs = allNotifs.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
                
                setNotifications(uniqueNotifs);
            } catch (err) {
                console.error("Error fetching notifications:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRealNotifications();

        // Real-time subscription for notifications table
        if (user) {
            const channel = supabase
                .channel('notifs_realtime')
                .on('postgres_changes', { 
                    event: 'INSERT', 
                    schema: 'public', 
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                }, () => fetchRealNotifications())
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user, navigate]);

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'Todo') return true;
        if (activeTab === 'Promociones') return n.type === 'promo';
        if (activeTab === 'Pedidos') return n.type === 'delivery' || n.type === 'info';
        return true;
    });

    return (
        <div className="relative min-h-screen flex flex-col aurora-bg pb-24 text-white overflow-hidden">
            {/* Ambient Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-aurora-violet/10 blur-[100px] rounded-full"></div>

            <header className="sticky top-0 z-50 px-4 pt-6 pb-3 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center justify-between mb-3">
                    <button className="p-2 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 active:scale-95 transition-all" onClick={() => navigate(-1)}>
                        <span className="material-symbols-outlined text-white text-lg">arrow_back_ios_new</span>
                    </button>
                    <h1 className="text-lg font-bold text-white tracking-tight">Notificaciones</h1>
                    <button className="p-2 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-white text-lg">more_horiz</span>
                    </button>
                </div>
                <div className="flex gap-2">
                    {['Todo', 'Promociones', 'Pedidos'].map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all ${activeTab === tab ? 'bg-primary text-black shadow-md shadow-primary/20' : 'bg-white/5 text-white/60 border border-white/5 hover:bg-white/10'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </header>

            <main className="flex-1 px-4 space-y-4 pt-4 relative z-10 overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-[9px] font-semibold text-white/40 uppercase tracking-wider">Más Recientes</h2>
                    {notifications.some(n => n.isNew) && (
                        <span className="text-[9px] font-semibold text-primary uppercase tracking-wider">Nuevas</span>
                    )}
                </div>

                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="glass-card rounded-2xl p-4 flex gap-3 animate-pulse">
                            <div className="size-10 rounded-xl bg-white/5 shrink-0"></div>
                            <div className="flex-1 space-y-2 pt-1">
                                <div className="h-3 bg-white/10 rounded w-1/3"></div>
                                <div className="h-2 bg-white/5 rounded w-full"></div>
                            </div>
                        </div>
                    ))
                ) : filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notif, index) => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card rounded-2xl p-4 flex gap-3 relative group active:scale-[0.98] transition-all border-white/5"
                            onClick={notif.action}
                        >
                            {notif.isNew && <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]"></div>}

                            <div className={`size-10 rounded-xl ${notif.bg} flex items-center justify-center shrink-0 border border-white/5 shadow-inner`}>
                                <span className={`material-symbols-outlined ${notif.color} text-xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{notif.icon}</span>
                            </div>

                            <div className="flex flex-col gap-1 flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-semibold text-white text-sm leading-tight tracking-tight">{notif.title}</h3>
                                    <span className="text-[8px] text-white/30 font-semibold uppercase mt-0.5 tracking-tight">{notif.time}</span>
                                </div>
                                <p className="text-white/60 text-xs leading-relaxed">{notif.desc}</p>

                                {notif.image && (
                                    <motion.div
                                        className="mt-3 rounded-xl overflow-hidden h-28 w-full relative border border-white/10 cursor-pointer"
                                        whileHover={{ scale: 1.02 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (notif.action) notif.action();
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${notif.image}")` }}></div>
                                        <div className="absolute inset-0 bg-black/20"></div>
                                        <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Rastrear ahora</span>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 opacity-20">
                        <span className="material-symbols-outlined text-6xl">notifications_off</span>
                        <p className="text-xs font-bold uppercase tracking-widest mt-4">Sin notificaciones</p>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
};
