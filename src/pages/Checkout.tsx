import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useAnalytics } from '../hooks/useAnalytics';

export const Checkout = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, getTotal, clearCart } = useCartStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const { trackAction } = useAnalytics();

    const subtotal = getTotal();
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    const handleConfirmOrder = async (method: 'whatsapp' | 'call') => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (items.length === 0) return;

        trackAction('Traemelo Checkout', method);

        if (method === 'whatsapp') {
            const orderDetails = items.map(item => `▪ ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`).join('%0A');
            const message = `*¡Hola! Quiero realizar un pedido en Traemelo:*%0A%0A${orderDetails}%0A%0A*Subtotal:* $${subtotal.toFixed(2)}%0A*Comisión/Impuesto:* $${tax.toFixed(2)}%0A*Total a Pagar:* $${total.toFixed(2)}%0A%0A_Mi ubicación es:_ Casa • Principal`;
            window.open(`https://wa.me/584247810500?text=${message}`, '_blank');
        } else {
            window.open('tel:+584247810500', '_self');
        }

        setIsProcessing(true);
        try {
            const { error } = await supabase.from('orders').insert({
                user_id: user.id,
                total_price: total,
                items: items,
                status: 'pending'
            });

            if (error) throw error;

            clearCart();
            navigate('/orders');
        } catch (err) {
            console.error("Error saving order:", err);
            alert("No se pudo procesar la orden. Inténtalo de nuevo.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col aurora-bg overflow-x-hidden pb-36 selection:bg-primary selection:text-black">
            {/* Ambient Lighting */}
            <div className="fixed top-[-10%] left-[20%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.06)_0%,transparent_50%)] pointer-events-none"></div>

            <header className="sticky top-0 z-50 flex items-center px-5 pt-6 pb-4 backdrop-blur-3xl border-b border-white/5">
                <button
                    className="flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-md active:scale-90 transition-all hover:bg-white/10"
                    onClick={() => navigate(-1)}
                >
                    <span className="material-symbols-outlined text-white text-xl">arrow_back_ios_new</span>
                </button>
                <h1 className="flex-1 text-center text-base font-bold tracking-wider text-white uppercase pr-10">
                    Finalizar Pago
                </h1>
            </header>

            <main className="flex flex-col gap-6 px-5 pt-5 relative z-10 overflow-y-auto no-scrollbar pb-6">
                {/* Delivery Address Section */}
                <section className="flex flex-col gap-3">
                    <div className="flex justify-between items-end px-1">
                        <div className="space-y-0.5">
                            <h2 className="text-white text-base font-bold tracking-tight uppercase">Entrega en</h2>
                            <p className="text-[8px] text-white/30 font-semibold uppercase tracking-wider">Verificado vía GPS</p>
                        </div>
                    </div>

                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="glass-card rounded-2xl p-4 flex items-center gap-4 border-white/5 shadow-xl relative group overflow-hidden"
                    >
                        <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                            <h3 className="text-white font-bold text-sm uppercase tracking-tight">Casa • Principal</h3>
                            <p className="text-white/50 text-xs font-medium line-clamp-1 tracking-wide">Av. Las Mercedes, Edif. Aurora, Apt 4B, Caracas</p>
                        </div>
                    </motion.div>
                </section>

                {/* Billing Summary Section */}
                <section className="flex flex-col gap-3">
                    <h2 className="text-white text-base font-bold tracking-tight uppercase px-1">Tu Orden Premium</h2>
                    <div className="glass-card rounded-2xl p-6 space-y-4 border-white/5 shadow-xl relative overflow-hidden">
                        <div className="flex justify-between items-center">
                            <p className="text-white/50 font-semibold uppercase tracking-wider text-[10px]">Subtotal ({items.length} items)</p>
                            <p className="text-white font-bold text-base tracking-tight">${subtotal.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between items-center pb-1">
                            <p className="text-white/50 font-semibold uppercase tracking-wider text-[10px]">ISLR / Tasa (12%)</p>
                            <p className="text-white font-bold text-base tracking-tight">${tax.toFixed(2)}</p>
                        </div>

                        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                            <p className="text-white text-base font-bold uppercase tracking-wider">Total</p>
                            <div className="text-right">
                                <p className="text-primary font-bold text-3xl tracking-tighter aurora-glow-cyan leading-none">${total.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-5 z-50">
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col gap-3">
                    <button
                        onClick={() => handleConfirmOrder('whatsapp')}
                        disabled={isProcessing || items.length === 0}
                        className="w-full py-4 rounded-2xl glass-card bg-[#25D366]/20 border border-[#25D366]/50 text-white font-bold text-base tracking-tight transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[#25D366]">chat</span>
                        Pedir por WhatsApp
                    </button>
                    <button
                        onClick={() => handleConfirmOrder('call')}
                        disabled={isProcessing || items.length === 0}
                        className="w-full py-4 rounded-2xl glass-card bg-primary/20 border border-primary/50 text-white font-bold text-base tracking-tight transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-primary">call</span>
                        Llamar al Negocio
                    </button>
                </div>
            </div>
        </div>
    );
};
