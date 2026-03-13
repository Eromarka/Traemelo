import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

const PAYMENT_METHODS = [
    { 
        id: 'pagomovil', 
        name: 'Pago Móvil (BDV)', 
        icon: 'account_balance', 
        details: 'TLF: 04120407770\nC.I. 15.453.817',
        color: 'from-orange-500/20 to-red-500/20'
    },
    { 
        id: 'zinli', 
        name: 'Zinli', 
        icon: 'wallet', 
        details: 'eromark@icloud.com',
        color: 'from-purple-500/20 to-blue-500/20'
    },
    { 
        id: 'bybit', 
        name: 'Bybit Pay', 
        icon: 'currency_exchange', 
        details: 'eromark@icloud.com',
        color: 'from-yellow-400/20 to-orange-400/20'
    },
    { 
        id: 'binance', 
        name: 'Binance Pay', 
        icon: 'currency_bitcoin', 
        details: 'eromark@icloud.com',
        color: 'from-orange-400/20 to-yellow-600/20'
    },
    { 
        id: 'crypto', 
        name: 'Criptomonedas', 
        icon: 'token', 
        details: 'USDT, BTC, ETH (Red BSC/Tron)',
        color: 'from-cyan-500/20 to-blue-600/20'
    }
];

export const Cart = () => {
    const navigate = useNavigate();
    const { items, updateQuantity, removeFromCart, getTotal } = useCartStore();
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

    const subtotal = getTotal();
    const taxes = subtotal * 0.12;
    const total = subtotal + taxes;

    if (items.length === 0) {
        return (
            <div className="relative flex flex-col min-h-screen w-full items-center justify-center aurora-bg p-6 text-center">
                <div className="size-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 animate-pulse">
                    <span className="material-symbols-outlined text-5xl text-white/20">shopping_cart</span>
                </div>
                <h1 className="text-xl font-bold text-white uppercase tracking-tight mb-3">Carrito Vacío</h1>
                <p className="text-white/40 text-sm max-w-[220px] mb-8 leading-relaxed">Parece que aún no tienes productos premium en tu pedido.</p>
                <button
                    onClick={() => navigate('/home')}
                    className="w-full max-w-[180px] py-3.5 rounded-2xl intense-glass bg-primary text-black font-bold text-base tracking-tight hover:scale-105 active:scale-95 transition-all shadow-[0_12px_24px_-5px_#0dccf266]"
                >
                    Explorar Catálogo
                </button>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col min-h-screen w-full overflow-x-hidden aurora-bg no-scrollbar bg-[#020617]">
            {/* Top Backlighting */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[200px] bg-[radial-gradient(circle_at_50%_0%,rgba(13,204,242,0.08)_0%,transparent_70%)] pointer-events-none z-0"></div>

            <header className="relative z-10 flex items-center px-5 pt-6 pb-4 backdrop-blur-md">
                <button
                    className="flex h-10 w-10 items-center justify-center rounded-xl intense-glass border border-white/10 active:scale-90 transition-all shadow-lg"
                    onClick={() => navigate(-1)}
                >
                    <span className="material-symbols-outlined text-white text-xl">arrow_back_ios_new</span>
                </button>
                <h1 className="flex-1 text-center text-xl font-bold tracking-tight text-white mr-10 uppercase">Tu Carrito</h1>
            </header>

            <main className="relative z-10 flex flex-col gap-8 px-5 pb-48">
                {/* Items List */}
                <div className="flex flex-col gap-3">
                    <h2 className="text-white text-[10px] font-black uppercase tracking-[0.2em] px-1 opacity-50">Productos Seleccionados</h2>
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="intense-glass rounded-2xl p-4 flex items-center gap-4 border border-white/5 shadow-xl relative group overflow-hidden"
                        >
                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="absolute top-3 right-3 text-white/20 hover:text-red-400 transition-colors z-20"
                            >
                                <span className="material-symbols-outlined text-lg">close</span>
                            </button>

                            <div
                                className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl size-20 shrink-0 shadow-[0_8px_16px_rgba(0,0,0,0.3)] ring-1 ring-white/10"
                                style={{ backgroundImage: `url("${item.image}")` }}
                            />

                            <div className="flex flex-col flex-1 gap-0.5">
                                <h3 className="text-white text-sm font-bold leading-tight tracking-tight uppercase truncate max-w-[140px]">{item.name}</h3>
                                <p className="text-primary font-bold text-xs">${item.price.toFixed(2)}</p>

                                <div className="flex items-center gap-3 mt-2">
                                    <div className="flex items-center justify-between bg-black/40 rounded-xl px-2.5 py-1.5 border border-white/5 min-w-[90px] shadow-inner">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="text-white/40 hover:text-primary transition-colors flex items-center active:scale-125"
                                        >
                                            <span className="material-symbols-outlined text-base">remove</span>
                                        </button>
                                        <span className="text-white font-bold text-sm min-w-[1.2rem] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="text-white/40 hover:text-primary transition-colors flex items-center active:scale-125"
                                        >
                                            <span className="material-symbols-outlined text-base">add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Payment Methods Section */}
                <section className="flex flex-col gap-4">
                    <div className="px-1 flex items-center justify-between">
                        <h2 className="text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Método de Pago</h2>
                        {selectedPayment && (
                            <span className="text-primary text-[9px] font-black uppercase tracking-widest animate-pulse">Seleccionado</span>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                        {PAYMENT_METHODS.map((method) => (
                            <motion.div
                                key={method.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedPayment(method.id)}
                                className={`relative p-4 rounded-2xl border transition-all cursor-pointer overflow-hidden group ${
                                    selectedPayment === method.id 
                                    ? 'bg-white/[0.08] border-primary/50 shadow-lg' 
                                    : 'bg-white/[0.03] border-white/5 grayscale opacity-60'
                                }`}
                            >
                                {/* Background glow on select */}
                                {selectedPayment === method.id && (
                                    <div className={`absolute inset-0 bg-gradient-to-r ${method.color} animate-pulse`}></div>
                                )}
                                
                                <div className="relative z-10 flex items-center gap-4">
                                    <div className={`size-10 rounded-xl flex items-center justify-center border transition-colors ${
                                        selectedPayment === method.id 
                                        ? 'bg-primary border-white/20 text-black shadow-lg shadow-primary/20' 
                                        : 'bg-white/5 border-white/10 text-white/40'
                                    }`}>
                                        <span className="material-symbols-outlined text-xl">{method.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-xs font-black uppercase tracking-wider ${selectedPayment === method.id ? 'text-white' : 'text-white/60'}`}>
                                            {method.name}
                                        </h4>
                                        <p className="text-[9px] text-white/40 font-bold tracking-tight whitespace-pre-line mt-0.5">
                                            {method.details}
                                        </p>
                                    </div>
                                    <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                        selectedPayment === method.id 
                                        ? 'border-primary bg-primary' 
                                        : 'border-white/10'
                                    }`}>
                                        {selectedPayment === method.id && <span className="material-symbols-outlined text-[14px] text-black font-black">check</span>}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Order Summary */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4"
                >
                    <h2 className="text-white text-[10px] font-black uppercase tracking-[0.2em] px-1 opacity-50">Resumen de Orden</h2>
                    <div className="glass-card rounded-3xl p-6 space-y-4 border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full"></div>

                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                            <p>Subtotal</p>
                            <p className="text-white font-bold tracking-normal">${subtotal.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between items-center pb-1 text-[10px] font-black uppercase tracking-widest text-white/40">
                            <p>ISLR / Tasa (12%)</p>
                            <p className="text-white font-bold tracking-normal">${taxes.toFixed(2)}</p>
                        </div>
                        <div className="border-t border-white/10 pt-4 flex justify-between items-end">
                            <div>
                                <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Total Final</p>
                                <p className="text-white/20 text-[8px] font-bold uppercase tracking-tight italic">Tasa BCV Aplicada</p>
                            </div>
                            <p className="text-primary font-bold text-4xl tracking-tighter aurora-glow-cyan leading-none">${total.toFixed(2)}</p>
                        </div>
                    </div>
                </motion.section>

                <div className="text-[8px] font-bold text-center uppercase tracking-[0.2em] text-white/20 pb-10">
                    <p>Entrega Premium garantizada por Traemelo</p>
                </div>
            </main>

            {/* Sticky Action Footer */}
            <footer className="fixed bottom-0 left-0 right-0 p-6 z-[60]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/95 to-transparent pointer-events-none"></div>
                
                <AnimatePresence>
                    {!selectedPayment ? (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="relative flex items-center justify-center p-4 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-md mb-2"
                        >
                            <span className="material-symbols-outlined text-primary text-sm mr-2 animate-bounce">info</span>
                            <p className="text-primary text-[9px] font-black uppercase tracking-widest">Selecciona un método de pago para continuar</p>
                        </motion.div>
                    ) : null}
                </AnimatePresence>

                <button
                    disabled={!selectedPayment}
                    className="relative w-full py-4 rounded-2xl intense-glass bg-white text-black font-black text-sm uppercase tracking-[0.15em] transition-all active:scale-[0.98] shadow-[0_20px_40px_-12px_rgba(0,242,255,0.4)] group overflow-hidden disabled:opacity-20 disabled:grayscale"
                    onClick={() => navigate('/checkout', { state: { paymentMethod: selectedPayment } })}
                >
                    <div className="absolute inset-0 bg-primary/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        Proceder al Pago
                        <span className="material-symbols-outlined text-black text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    </span>
                </button>
            </footer>
        </div>
    );
};

