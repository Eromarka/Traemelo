import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

interface Stats {
    totalRevenue: number;
    totalOrders: number;
    avgTicket: number;
    storeRating: number;
    activeOrders: number;
    pendingProducts: number;
}

interface RecentOrder {
    id: string;
    customer: string;
    status: string;
    total: number;
    time: string;
}

const SkeletonCard = () => (
    <div className="glass-card-intense p-5 rounded-3xl border border-white/10 animate-pulse">
        <div className="h-2.5 bg-white/10 rounded-full w-1/2 mb-3" />
        <div className="h-6 bg-white/10 rounded-full w-3/4 mb-2" />
        <div className="h-2 bg-white/10 rounded-full w-1/3" />
    </div>
);

const SkeletonRow = () => (
    <div className="glass-card rounded-2xl p-4 flex items-center gap-4 border border-white/5 animate-pulse">
        <div className="size-12 rounded-xl bg-white/10 shrink-0" />
        <div className="flex-1 space-y-2">
            <div className="h-3 bg-white/10 rounded-full w-1/3" />
            <div className="h-2 bg-white/10 rounded-full w-1/4" />
        </div>
        <div className="h-5 w-16 bg-white/10 rounded-full" />
    </div>
);

const statusConfig: Record<string, { color: string; icon: string; label: string }> = {
    pending:    { color: 'amber',   icon: 'hourglass_empty', label: 'Pendiente' },
    preparing:  { color: 'blue',    icon: 'restaurant',      label: 'Preparando' },
    delivering: { color: 'primary', icon: 'local_shipping',  label: 'En Camino'  },
    completed:  { color: 'emerald', icon: 'check_circle',    label: 'Completado' },
    cancelled:  { color: 'red',     icon: 'cancel',          label: 'Cancelado'  },
};

const colorMap: Record<string, { bg: string; text: string }> = {
    amber:   { bg: 'bg-amber-400/20',   text: 'text-amber-400'   },
    blue:    { bg: 'bg-blue-400/20',    text: 'text-blue-400'    },
    primary: { bg: 'bg-primary/20',     text: 'text-primary'     },
    emerald: { bg: 'bg-emerald-400/20', text: 'text-emerald-400' },
    red:     { bg: 'bg-red-400/20',     text: 'text-red-400'     },
};

function timeAgo(dateStr: string): string {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60)   return 'Ahora';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)}h`;
    return `Hace ${Math.floor(diff / 86400)}d`;
}

export const BusinessDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [stats, setStats]             = useState<Stats | null>(null);
    const [storeData, setStoreData]     = useState<any>(null);
    const [products, setProducts]       = useState<any[]>([]);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            if (!user) return;
            setLoadingData(true);

            // ── 1. Fetch store ─────────────────────────────────────────────
            const { data: store, error: storeErr } = await supabase
                .from('stores')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (storeErr || !store) {
                setLoadingData(false);
                return;
            }
            setStoreData(store);

            // ── 2. Fetch products ──────────────────────────────────────────
            const { data: prods } = await supabase
                .from('products')
                .select('*')
                .eq('store_id', store.id)
                .order('created_at', { ascending: false });

            const allProducts = prods ?? [];
            setProducts(allProducts);

            // ── 3. Fetch store orders (para calcular stats) ────────────────
            const { data: allOrders } = await supabase
                .from('orders')
                .select('id, status, total_price, created_at, user_id, profiles(full_name)')
                .eq('store_id', store.id)
                .order('created_at', { ascending: false });

            const orders = allOrders ?? [];

            // ── 4. Calcular estadísticas ───────────────────────────────────
            const completedOrders = orders.filter(o => o.status === 'completed');
            const activeOrders    = orders.filter(o =>
                ['pending', 'preparing', 'delivering'].includes(o.status)
            );

            const totalRevenue = completedOrders.reduce(
                (sum, o) => sum + Number(o.total_price ?? 0), 0
            );
            const totalOrders  = orders.length;
            const avgTicket    = completedOrders.length > 0
                ? totalRevenue / completedOrders.length
                : 0;

            setStats({
                totalRevenue,
                totalOrders,
                avgTicket,
                storeRating:     Number(store.rating ?? 5.0),
                activeOrders:    activeOrders.length,
                pendingProducts: allProducts.filter(p => p.status === 'pending').length,
            });

            // ── 5. Recent orders (últimos 5) ───────────────────────────────
            const recent = orders.slice(0, 5).map(o => ({
                id:       o.id,
                customer: (o.profiles as any)?.full_name || 'Cliente #' + o.id.slice(0, 6).toUpperCase(),
                status:   o.status,
                total:    Number(o.total_price ?? 0),
                time:     timeAgo(o.created_at),
            }));
            setRecentOrders(recent);

            setLoadingData(false);
        };

        fetchAll();
    }, [user]);

    // ── Handlers ────────────────────────────────────────────────────────────
    const deleteProduct = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) alert('Error al eliminar: ' + error.message);
        else setProducts(prev => prev.filter(p => p.id !== id));
    };

    const isPending = storeData?.status === 'pending';

    if (!loadingData && !storeData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center aurora-bg pb-24 text-white px-6 text-center">
                <span className="material-symbols-outlined text-7xl text-white/20 mb-4">store_off</span>
                <h2 className="text-2xl font-black mb-2">Tienda no encontrada</h2>
                <p className="text-white/60 text-sm mb-8 max-w-xs">Parece que eres comerciante pero no completaste el registro de tu local o hubo un error.</p>
                <button onClick={() => navigate('/register-business')} className="bg-primary text-black px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 flex items-center gap-2">
                    <span className="material-symbols-outlined">storefront</span>
                    Completar Registro
                </button>
                <button onClick={() => navigate('/profile')} className="mt-6 text-white/40 font-bold text-sm hover:text-white transition-colors">
                    Volver al Perfil
                </button>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col aurora-bg pb-24 text-white overflow-hidden">

            {/* ── Header ── */}
            <header className="px-6 pt-10 pb-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-3xl border-b border-white/5">
                <div>
                    <h1 className="text-2xl font-black tracking-tighter text-white">
                        Dashboard <span className="text-primary">Negocio</span>
                    </h1>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">
                        {storeData?.name ?? 'Cargando...'}
                    </p>
                </div>
                <button className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-white">settings</span>
                </button>
            </header>

            <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">

                {/* ── Pending store banner ── */}
                {!loadingData && isPending && (
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
                            <p className="text-white/60 text-xs font-medium mt-1">
                                Estamos revisando tu negocio. Te notificaremos cuando puedas empezar a vender.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* ── Stats Grid ── */}
                {loadingData ? (
                    <div className="grid grid-cols-2 gap-4">
                        <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {/* Ingresos Totales */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="glass-card-intense p-5 rounded-3xl border border-white/10 col-span-2"
                        >
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">
                                Ingresos Totales
                            </p>
                            <h4 className="text-white font-black text-3xl tracking-tighter">
                                ${stats!.totalRevenue.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h4>
                            <div className="mt-2 text-[9px] text-emerald-400 font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                De {stats!.totalOrders} pedidos en total
                            </div>
                        </motion.div>

                        {/* Pedidos totales */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                            className="glass-card-intense p-5 rounded-3xl border border-white/10"
                        >
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Pedidos</p>
                            <h4 className="text-white font-black text-2xl tracking-tighter">{stats!.totalOrders}</h4>
                            <div className="mt-2 text-[9px] text-primary font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">sync</span>
                                {stats!.activeOrders} activos
                            </div>
                        </motion.div>

                        {/* Ticket Promedio */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                            className="glass-card-intense p-5 rounded-3xl border border-white/10"
                        >
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Ticket Prom.</p>
                            <h4 className="text-white font-black text-2xl tracking-tighter">
                                ${stats!.avgTicket.toFixed(2)}
                            </h4>
                            <div className="mt-2 text-[9px] text-white/30 font-bold">por pedido completado</div>
                        </motion.div>

                        {/* Rating */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                            className="glass-card-intense p-5 rounded-3xl border border-white/10"
                        >
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Rating</p>
                            <h4 className="text-white font-black text-2xl tracking-tighter flex items-center gap-1">
                                {stats!.storeRating.toFixed(1)}
                                <span className="material-symbols-outlined text-amber-400 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            </h4>
                            <div className="mt-2 text-[9px] text-white/30 font-bold">calificación de la tienda</div>
                        </motion.div>

                        {/* Productos pendientes de aprobación */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="glass-card-intense p-5 rounded-3xl border border-white/10"
                        >
                            <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">En Revisión</p>
                            <h4 className="text-white font-black text-2xl tracking-tighter">{stats!.pendingProducts}</h4>
                            <div className="mt-2 text-[9px] text-amber-400 font-bold flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">inventory_2</span>
                                productos pendientes
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* ── Add Product CTA ── */}
                <motion.div
                    whileTap={isPending ? {} : { scale: 0.98 }}
                    onClick={() => !isPending && navigate('/business/add-product')}
                    className={`relative overflow-hidden p-6 rounded-[2rem] border shadow-2xl transition-all ${
                        isPending
                        ? 'bg-white/5 border-white/10 opacity-50 cursor-not-allowed'
                        : 'bg-gradient-to-br from-primary via-primary/80 to-primary/40 border-primary/20 shadow-primary/20 cursor-pointer'
                    }`}
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <span className="material-symbols-outlined text-8xl text-black">add_shopping_cart</span>
                    </div>
                    <div className="relative z-10 text-black">
                        <h3 className="font-black text-2xl tracking-tighter leading-none mb-2">Añadir Producto</h3>
                        <p className="text-[10px] font-black uppercase tracking-wider opacity-70">
                            {isPending ? 'Disponible tras aprobación' : 'Crea una oferta nueva para hoy'}
                        </p>
                    </div>
                </motion.div>

                {/* ── Products List ── */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xs font-black uppercase text-white/40 tracking-[0.2em]">
                            Tu Inventario ({products.length})
                        </h2>
                    </div>

                    {loadingData ? (
                        <div className="space-y-3">
                            <SkeletonRow /><SkeletonRow />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="p-10 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center gap-3 text-center opacity-40">
                            <span className="material-symbols-outlined text-4xl">inventory</span>
                            <p className="text-sm font-medium">No has añadido productos aún</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {products.map(prod => (
                                <motion.div
                                    key={prod.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-card rounded-[2rem] p-4 flex items-center justify-between border border-white/5"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="size-16 rounded-2xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                                            {prod.image_url
                                                ? <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                                                : <span className="material-symbols-outlined text-white/20 text-3xl m-auto flex items-center justify-center h-full">image</span>
                                            }
                                        </div>
                                        <div>
                                            <h4 className="font-black text-sm tracking-tight">{prod.name}</h4>
                                            <p className="text-primary font-black text-lg">${prod.price}</p>
                                            {prod.status === 'pending' && (
                                                <span className="text-[9px] font-black uppercase tracking-widest text-amber-400">
                                                    ⏳ Pendiente revisión
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteProduct(prod.id)}
                                        className="size-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-all active:scale-95"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Recent Orders ── */}
                <div className="space-y-4">
                    <h2 className="text-xs font-black uppercase text-white/40 tracking-[0.2em]">Pedidos Recientes</h2>

                    {loadingData ? (
                        <div className="space-y-3">
                            <SkeletonRow /><SkeletonRow /><SkeletonRow />
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div className="p-8 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center gap-2 opacity-40">
                            <span className="material-symbols-outlined text-3xl">receipt_long</span>
                            <p className="text-xs font-medium">Sin pedidos todavía</p>
                        </div>
                    ) : (
                        recentOrders.map((order, idx) => {
                            const cfg   = statusConfig[order.status] ?? statusConfig.pending;
                            const color = colorMap[cfg.color] ?? colorMap.amber;
                            return (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.06 }}
                                    className="glass-card rounded-2xl p-4 flex items-center justify-between border border-white/5"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${color.bg} ${color.text}`}>
                                            <span className="material-symbols-outlined">{cfg.icon}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm">{order.customer}</h4>
                                            <p className="text-white/30 text-[10px] uppercase font-black tracking-tight">
                                                {order.time} • ${order.total.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${color.bg} ${color.text}`}>
                                        {cfg.label}
                                    </span>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* ── Quick Actions ── */}
                <div className="grid grid-cols-2 gap-3">
                    <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white flex flex-col items-center gap-2 hover:bg-white/10 transition-all active:scale-95">
                        <span className="material-symbols-outlined text-xl text-primary">inventory_2</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Inventario</span>
                    </button>
                    <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white flex flex-col items-center gap-2 hover:bg-white/10 transition-all active:scale-95">
                        <span className="material-symbols-outlined text-xl text-primary">campaign</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">Promociones</span>
                    </button>
                </div>
            </main>

            {/* ── Bottom Nav ── */}
            <nav className="fixed bottom-0 left-0 right-0 p-4 z-50">
                <div className="glass-card-intense rounded-3xl p-3 flex justify-around items-center border border-white/10 shadow-2xl">
                    <button className="p-3 text-primary flex flex-col items-center gap-1">
                        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
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
