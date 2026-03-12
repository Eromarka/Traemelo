import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export const Tracking = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const [status, setStatus] = useState('Preparando');
    const [timeLeft, setTimeLeft] = useState('24 min');

    useEffect(() => {
        if (!orderId) return;
        
        const fetchOrder = async () => {
            const { data } = await supabase
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .single();
            
            if (data) {
                setStatus(data.status);
                // Simulate time left
                setTimeLeft('15 min');
            }
        };

        fetchOrder();
    }, [orderId]);

    // Simulated data
    const driver = {
        name: "Carlos Rivera",
        rating: 4.9,
        photo: "https://randomuser.me/api/portraits/men/32.jpg",
        vehicle: "Honda Civic • Blanco"
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col aurora-bg overflow-hidden p-0">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-50 flex items-center p-5 pt-8">
                <button 
                   onClick={() => navigate('/orders')}
                   className="size-11 rounded-2xl bg-black/40 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white active:scale-95 transition-all shadow-2xl"
                >
                    <span className="material-symbols-outlined text-xl">arrow_back_ios_new</span>
                </button>
            </header>

            {/* Map Area */}
            <div className="flex-1 w-full bg-black/20 relative">
                <img 
                    src="/order_map_tracking_1773193928204.png" 
                    alt="Tracking Map" 
                    className="w-full h-full object-cover scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                
                {/* Floating Status Indicator */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute top-28 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3.5 glass-card-intense rounded-full border border-primary/30 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                >
                    <div className="size-3 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
                    <span className="text-white font-black text-xs uppercase tracking-widest">{status}</span>
                </motion.div>
            </div>

            {/* Tracking Info Card (Bottom) */}
            <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ type: "spring", damping: 20 }}
                className="relative z-50 w-full glass-card-intense rounded-t-[3rem] p-8 pb-12 border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]"
            >
                <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8"></div>
                
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em] mb-1">Llegada Estimada</p>
                        <h2 className="text-white font-black text-4xl tracking-tighter">
                            {timeLeft} <span className="text-primary text-xl font-bold">min</span>
                        </h2>
                    </div>
                    <div className="text-right">
                        <button className="size-12 rounded-2xl bg-primary flex items-center justify-center text-black active:scale-90 transition-all shadow-xl shadow-primary/20">
                            <span className="material-symbols-outlined font-black">call</span>
                        </button>
                    </div>
                </div>

                {/* Driver Info */}
                <div className="p-5 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4 mb-6">
                    <div className="size-16 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg relative shrink-0">
                        <img src={driver.photo} alt={driver.name} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 right-0 bg-primary text-black text-[8px] font-black px-1.5 py-0.5 rounded-tl-lg">PRO</div>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h4 className="text-white font-black text-sm tracking-tight">{driver.name}</h4>
                            <div className="flex items-center gap-0.5 bg-white/10 px-1.5 py-0.5 rounded text-yellow-400 text-[9px] font-black">
                                <span className="material-symbols-outlined text-[10px] fill-current">star</span>
                                {driver.rating}
                            </div>
                        </div>
                        <p className="text-white/30 text-[10px] font-medium mt-1">{driver.vehicle}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                   <button className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[11px] uppercase tracking-widest hover:bg-white/10 active:scale-[0.98] transition-all">Cancelar</button>
                   <button className="flex-1 py-4 rounded-2xl bg-primary text-black font-black text-[11px] uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/20">Chat con Carlos</button>
                </div>
            </motion.div>
        </div>
    );
};
