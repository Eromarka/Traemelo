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
    opening_hours: string;
    user_id: string;
    created_at: string;
    image_url: string;
    status: 'pending' | 'active' | 'rejected';
}

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const { profile } = useAuth();
    const [stores, setStores] = useState<Store[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        // Only allow admins
        if (profile && profile.role !== 'admin') {
            navigate('/home');
        }
        fetchStores();
    }, [profile, activeTab]);

    const fetchStores = async () => {
        setIsLoading(true);
        let query = supabase.from('stores').select('*');
        
        if (activeTab === 'pending') {
            query = query.eq('status', 'pending');
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });

        if (!error && data) {
            setStores(data);
        }
        setIsLoading(false);
    };

    const handleApprove = async (storeId: string) => {
        setActionLoading(storeId);
        const { error } = await supabase
            .from('stores')
            .update({ 
                status: 'active',
                approved_at: new Date().toISOString()
            })
            .eq('id', storeId);

        if (!error) {
            setStores(prev => prev.filter(s => s.id !== storeId));
        }
        setActionLoading(null);
    };

    const handleReject = async (storeId: string) => {
        setActionLoading(storeId);
        const { error } = await supabase
            .from('stores')
            .update({ status: 'rejected' })
            .eq('id', storeId);

        if (!error) {
            setStores(prev => prev.filter(s => s.id !== storeId));
        }
        setActionLoading(null);
    };

    const handleDelete = async (storeId: string) => {
        setActionLoading(storeId);
        const { error } = await supabase
            .from('stores')
            .delete()
            .eq('id', storeId);

        if (!error) {
            setStores(prev => prev.filter(s => s.id !== storeId));
            setShowDeleteConfirm(null);
        } else {
            alert('Error al eliminar el negocio: ' + error.message);
        }
        setActionLoading(null);
    };

    return (
        <div className="relative min-h-screen flex flex-col aurora-bg pb-24 text-white overflow-hidden uppercase font-black tracking-tighter">
            <header className="px-6 pt-10 pb-6 flex flex-col gap-6 sticky top-0 z-50 backdrop-blur-3xl border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-white">Panel <span className="text-primary truncate max-w-[150px] inline-block align-bottom">Admin</span></h1>
                        <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">Gestión de Negocios</p>
                    </div>
                    <button onClick={() => navigate('/home')} className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-white">close</span>
                    </button>
                </div>

                {/* TABS */}
                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                    <button 
                        onClick={() => setActiveTab('pending')}
                        className={`flex-1 py-3 rounded-xl text-[10px] tracking-widest transition-all ${activeTab === 'pending' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40'}`}
                    >
                        PENDIENTES
                    </button>
                    <button 
                        onClick={() => setActiveTab('all')}
                        className={`flex-1 py-3 rounded-xl text-[10px] tracking-widest transition-all ${activeTab === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40'}`}
                    >
                        TODOS
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xs font-black uppercase text-white/40 tracking-[0.2em]">
                        {activeTab === 'pending' ? 'Solicitudes Pendientes' : 'Todos los Negocios'} ({stores.length})
                    </h2>
                    <button onClick={fetchStores} className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">refresh</span> Actualizar
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Cargando...</p>
                    </div>
                ) : stores.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                        <div className="size-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-white/20">
                            <span className="material-symbols-outlined text-5xl">inventory_2</span>
                        </div>
                        <div>
                            <p className="text-white font-black text-lg">Sin registros</p>
                            <p className="text-white/40 text-xs mt-1 lowercase tracking-normal font-normal italic">No hay negocios en esta categoría.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {stores.map((store) => (
                            <motion.div 
                                key={store.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-card-intense rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative"
                            >
                                <div className="p-6 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="size-16 rounded-2xl bg-white/5 overflow-hidden border border-white/10 shrink-0 shadow-inner">
                                            {store.image_url ? (
                                                <img src={store.image_url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white/20">
                                                    <span className="material-symbols-outlined text-2xl">storeframe</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-white font-black text-lg tracking-tight truncate pr-2">{store.business_name}</h3>
                                                <span className={`text-[8px] px-2 py-1 rounded-full font-black tracking-widest ${
                                                    store.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                                                    store.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                                                    'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                }`}>
                                                    {store.status.toUpperCase()}
                                                </span>
                                            </div>
                                            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mt-1 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[12px] text-primary">location_on</span> {store.address || 'Sin dirección'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white/5 rounded-[1.5rem] p-4 border border-white/5">
                                        <p className="text-white/60 text-xs italic leading-relaxed font-normal normal-case break-words">"{store.description}"</p>
                                    </div>

                                    <div className="flex gap-3">
                                        {store.status === 'pending' ? (
                                            <>
                                                <button 
                                                    onClick={() => handleApprove(store.id)}
                                                    disabled={!!actionLoading}
                                                    className="flex-1 h-12 rounded-2xl bg-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] text-black shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    <span className="material-symbols-outlined text-sm">check_circle</span> Aprobar
                                                </button>
                                                <button 
                                                    onClick={() => handleReject(store.id)}
                                                    disabled={!!actionLoading}
                                                    className="px-5 h-12 rounded-2xl bg-white/5 border border-white/10 text-red-400 font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all disabled:opacity-50"
                                                >
                                                    <span className="material-symbols-outlined text-sm">cancel</span>
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex-1 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center px-4 justify-between">
                                                <span className="text-[10px] text-white/40 tracking-widest">ESTADO: {store.status.toUpperCase()}</span>
                                                <button 
                                                    onClick={() => setShowDeleteConfirm(store.id)}
                                                    className="size-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center active:scale-90 transition-all"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Confirmation Modal for Deletion Overlay */}
                                <AnimatePresence>
                                    {showDeleteConfirm === store.id && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-black/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center"
                                        >
                                            <span className="material-symbols-outlined text-red-500 text-4xl mb-2">warning</span>
                                            <h4 className="text-white font-black text-sm uppercase tracking-widest mb-1">¿Eliminar Negocio?</h4>
                                            <p className="text-white/40 text-[10px] lowercase mb-6 font-normal tracking-normal italic px-4">Esta acción es permanente y no se puede deshacer.</p>
                                            <div className="flex gap-3 w-full capitalize font-black">
                                                <button 
                                                    onClick={() => setShowDeleteConfirm(null)}
                                                    className="flex-1 h-12 rounded-2xl bg-white/10 text-white text-[10px] tracking-widest border border-white/10"
                                                >
                                                    Cancelar
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(store.id)}
                                                    className="flex-1 h-12 rounded-2xl bg-red-600 text-white text-[10px] tracking-widest shadow-xl shadow-red-600/20"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};
