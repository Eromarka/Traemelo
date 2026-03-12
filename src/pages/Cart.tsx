import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

export const Cart = () => {
    const navigate = useNavigate();
    const { items, updateQuantity, removeFromCart, getTotal } = useCartStore();

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

            <main className="relative z-10 flex flex-col gap-5 px-5 pb-36">
                <div className="flex flex-col gap-3">
                    {items.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            className="intense-glass rounded-2xl p-4 flex items-center gap-4 border border-white/5 shadow-xl relative group overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

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
                                <h3 className="text-white text-base font-bold leading-tight tracking-tight uppercase truncate max-w-[140px]">{item.name}</h3>
                                <p className="text-primary font-bold text-sm">${item.price.toFixed(2)}</p>

                                <div className="flex items-center gap-3 mt-2">
                                    <div className="flex items-center justify-between bg-black/40 rounded-xl px-3 py-1.5 border border-white/5 min-w-[100px] shadow-inner">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="text-white/40 hover:text-primary transition-colors flex items-center active:scale-125"
                                        >
                                            <span className="material-symbols-outlined text-lg">remove</span>
                                        </button>
                                        <span className="text-white font-bold text-base min-w-[1.2rem] text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="text-white/40 hover:text-primary transition-colors flex items-center active:scale-125"
                                        >
                                            <span className="material-symbols-outlined text-lg">add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 mt-2"
                >
                    <h2 className="text-white text-base font-bold uppercase tracking-wider px-1">Resumen de Orden</h2>
                    <div className="glass-card rounded-2xl p-6 space-y-4 border border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full"></div>

                        <div className="flex justify-between items-center">
                            <p className="text-white/40 font-semibold uppercase tracking-wider text-[10px]">Subtotal</p>
                            <p className="text-white font-bold text-base tracking-tight">${subtotal.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between items-center pb-1">
                            <p className="text-white/40 font-semibold uppercase tracking-wider text-[10px]">ISLR / Tasa (12%)</p>
                            <p className="text-white font-bold text-base tracking-tight">${taxes.toFixed(2)}</p>
                        </div>
                        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                            <p className="text-white text-base font-bold uppercase tracking-wider">Total Final</p>
                            <p className="text-primary font-bold text-3xl tracking-tighter aurora-glow-cyan leading-none">${total.toFixed(2)}</p>
                        </div>
                    </div>
                </motion.section>

                <div className="flex flex-col gap-3 opacity-40 px-2 text-[9px] font-medium text-center uppercase tracking-wider">
                    <p>Al procesar el pago, aceptas nuestros Términos de Servicio Premium</p>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 p-5 z-50">
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent pointer-events-none"></div>
                <button
                    className="relative w-full py-4 rounded-2xl intense-glass bg-white text-black font-bold text-lg tracking-tight transition-all active:scale-[0.98] shadow-[0_16px_40px_-12px_rgba(0,242,255,0.35)] group overflow-hidden"
                    onClick={() => navigate('/checkout')}
                >
                    <div className="absolute inset-0 bg-primary/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3">
                        Ir al Pago
                        <div className="size-7 rounded-xl bg-black/5 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                            <span className="material-symbols-outlined text-black text-lg">arrow_forward</span>
                        </div>
                    </span>
                </button>
            </footer>
        </div>
    );
};
