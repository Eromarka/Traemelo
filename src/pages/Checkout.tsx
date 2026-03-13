import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useAnalytics } from '../hooks/useAnalytics';

export const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { items, getTotal, clearCart } = useCartStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const { trackAction } = useAnalytics();

    const paymentMethodId = location.state?.paymentMethod || 'Efectivo';
    
    // Mapeo de IDs legibles para el mensaje
    const paymentLabels: Record<string, string> = {
        'pagomovil': 'Pago Móvil (BDV)',
        'zinli': 'Zinli',
        'bybit': 'Bybit Pay',
        'binance': 'Binance Pay',
        'crypto': 'Criptomonedas',
        'efectivo': 'Efectivo'
    };

    const subtotal = getTotal();
    const tax = subtotal * 0.12;
    const total = subtotal + tax;

    const handleConfirmOrder = async (confirmType: 'whatsapp' | 'call') => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (items.length === 0) return;

        trackAction('Traemelo Checkout', confirmType);

        if (confirmType === 'whatsapp') {
            const orderDetails = items.map(item => `▪ ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})`).join('%0A');
            const paymentLabel = paymentLabels[paymentMethodId] || paymentMethodId;
            
            const message = `*¡Hola! Quiero realizar un pedido en Traemelo:*%0A%0A*Items:*%0A${orderDetails}%0A%0A*Subtotal:* $${subtotal.toFixed(2)}%0A*Comisión/Impuesto:* $${tax.toFixed(2)}%0A*Total a Pagar:* $${total.toFixed(2)}%0A%0A*Método de Pago:* ${paymentLabel}%0A%0A_Mi ubicación es:_ Casa • Principal`;
            
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
                status: 'pending',
                payment_method: paymentMethodId
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
        <div className="relative flex min-h-screen w-full flex-col aurora-bg overflow-x-hidden pb-36 selection:bg-primary selection:text-black bg-[#020617]">
            {/* Ambient Lighting */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-[radial-gradient(circle_at_50%_0%,rgba(0,242,255,0.05)_0%,transparent_70%)] pointer-events-none"></div>

            <header className="sticky top-0 z-50 flex items-center px-5 pt-6 pb-4 backdrop-blur-md border-b border-white/5">
                <button
                    className="flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-md active:scale-90 transition-all hover:bg-white/10"
                    onClick={() => navigate(-1)}
                >
                    <span className="material-symbols-outlined text-white text-xl">arrow_back_ios_new</span>
                </button>
                <h1 className="flex-1 text-center text-base font-black tracking-widest text-white uppercase pr-10">
                    Finalizar Pedido
                </h1>
            </header>

            <main className="flex flex-col gap-6 px-5 pt-6 relative z-10 overflow-y-auto no-scrollbar pb-6">
                {/* Delivery Address Section */}
                <section className="flex flex-col gap-3">
                    <div className="flex justify-between items-end px-1">
                        <div className="space-y-0.5">
                            <h2 className="text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Entregar en</h2>
                            <p className="text-[8px] text-primary/50 font-black uppercase tracking-[0.2em]">Ubicación Guardada</p>
                        </div>
                    </div>

                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="glass-card rounded-2xl p-4 flex items-center gap-4 border-white/5 shadow-xl relative overflow-hidden"
                    >
                        <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                            <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1 overflow-hidden">
                            <h3 className="text-white font-black text-xs uppercase tracking-tight">Casa • Principal</h3>
                            <p className="text-white/40 text-[10px] font-bold line-clamp-1 tracking-wide">Av. Las Mercedes, Edif. Aurora, Apt 4B, Caracas</p>
                        </div>
                    </motion.div>
                </section>

                {/* Payment Detail Section */}
                <section className="flex flex-col gap-3">
                    <h2 className="text-white text-[10px] font-black uppercase tracking-[0.2em] px-1 opacity-40">Método de Pago</h2>
                    <div className="glass-card rounded-2xl p-4 flex items-center gap-4 border-white/5 shadow-xl">
                        <div className="size-11 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                            <span className="material-symbols-outlined text-white/50 text-xl">payments</span>
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-white font-black text-xs uppercase tracking-tight">{paymentLabels[paymentMethodId] || paymentMethodId}</h3>
                            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Confirmación pendiente vía WhatsApp</p>
                        </div>
                    </div>
                </section>

                {/* Billing Summary Section */}
                <section className="flex flex-col gap-3">
                    <h2 className="text-white text-[10px] font-black uppercase tracking-[0.2em] px-1 opacity-40">Resumen de Cuenta</h2>
                    <div className="glass-card rounded-3xl p-6 space-y-4 border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                            <p>Subtotal ({items.length} items)</p>
                            <p className="text-white font-bold tracking-normal">${subtotal.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between items-center pb-1 text-[10px] font-black uppercase tracking-widest text-white/40">
                            <p>Tasa de Servicio / ISLR</p>
                            <p className="text-white font-bold tracking-normal">${tax.toFixed(2)}</p>
                        </div>

                        <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                            <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Total a Pagar</p>
                            <div className="text-right">
                                <p className="text-primary font-bold text-4xl tracking-tighter aurora-glow-cyan leading-none">${total.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 mt-2">
                    <p className="text-[9px] text-primary/60 font-medium leading-relaxed uppercase tracking-widest text-center">
                        Tu pedido será procesado inmediatamente después de enviar el mensaje de confirmación por WhatsApp.
                    </p>
                </div>
            </main>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 z-50">
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col gap-3">
                    <button
                        onClick={() => handleConfirmOrder('whatsapp')}
                        disabled={isProcessing || items.length === 0}
                        className="w-full py-4 rounded-2xl intense-glass bg-[#25D366] text-[#012611] font-black text-sm uppercase tracking-widest shadow-[0_12px_32px_-8px_rgba(37,211,102,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        <span className="material-symbols-outlined text-lg">chat</span>
                        WhatsApp para Confirmar
                    </button>
                    <button
                        onClick={() => handleConfirmOrder('call')}
                        disabled={isProcessing || items.length === 0}
                        className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">call</span>
                        Llamar a la Tienda
                    </button>
                </div>
            </div>
        </div>
    );
};

