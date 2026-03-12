import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const PAYMENT_METHODS = [
    { id: 'zelle', name: 'Zelle', icon: 'payments', description: 'Pagos en USD sin comisión' },
    { id: 'pagomovil', name: 'Pago Móvil', icon: 'account_balance', description: 'Bolívares a tasa BCV' },
    { id: 'usdt', name: 'Binance Pay (USDT)', icon: 'currency_bitcoin', description: 'Cripto estable 1:1' },
    { id: 'efectivo', name: 'Efectivo', icon: 'local_atm', description: 'USD o Bs al recibir' },
    { id: 'transferencia', name: 'Transferencia', icon: 'sync_alt', description: 'Banesco o Mercantil' }
];

export const Concierge = () => {
    const navigate = useNavigate();
    const { addToCart, getTotal, items } = useCartStore();
    const [selectedPayment, setSelectedPayment] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [addedId, setAddedId] = useState<string | null>(null);
    const { products, loading } = useProducts();
    const { categories, loading: categoriesLoading } = useCategories();

    // Mostrar todos los productos del catálogo — el Concierge los gestiona todos
    const conciergeProducts = selectedCategory
        ? products.filter(p => p.category_id === selectedCategory)
        : products;

    if (loading || categoriesLoading) {
        return (
            <div className="min-h-screen aurora-bg flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleAddToCart = (product: any) => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image_url || '',
        });
        // Feedback visual
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 1200);
    };

    return (
        <div className="relative flex min-h-screen w-full flex-col aurora-bg overflow-x-hidden pb-40">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,183,77,0.1)_0%,transparent_50%)] pointer-events-none"></div>

            <header className="sticky top-0 z-50 flex items-center px-5 pt-6 pb-4 backdrop-blur-3xl border-b border-white/5">
                <button
                    className="relative flex size-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-md active:scale-90 transition-all hover:bg-white/10"
                    onClick={() => navigate('/cart')}
                >
                    <span className="material-symbols-outlined text-white text-xl">shopping_cart</span>
                    {items.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                            {items.length}
                        </span>
                    )}
                </button>
                <div className="flex-1 flex flex-col items-center pr-10">
                    <h1 className="text-base font-black tracking-widest text-primary uppercase leading-tight">
                        Te lo llevamos
                    </h1>
                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">Servicio Concierge</p>
                </div>
            </header>

            <main className="flex flex-col gap-8 px-5 pt-8 relative z-10">
                {/* Hero section for Concierge */}
                <section className="relative overflow-hidden rounded-[32px] p-8 bg-white/5 border border-white/10 backdrop-blur-md">
                    <div className="absolute top-0 right-0 size-32 bg-primary/20 rounded-full blur-[60px]"></div>
                    <div className="relative z-10 space-y-2">
                        <h2 className="text-white text-2xl font-black">¿Qué necesitas hoy?</h2>
                        <p className="text-white/50 text-sm font-medium leading-relaxed max-w-[250px]">
                            Gestionamos tus compras especiales. Si no lo ves aquí, escríbenos.
                        </p>
                    </div>
                </section>

                {/* Product Catalog Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <h3 className="text-white text-sm font-black uppercase tracking-widest">Catálogo Disponible</h3>
                        <span className="text-primary text-[10px] font-bold bg-primary/10 px-2 py-1 rounded-lg border border-primary/20">{conciergeProducts.length} Items</span>
                    </div>

                    {/* Filtro por categoría */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                !selectedCategory ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/10 text-white/50'
                            }`}
                        >
                            Todos
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${
                                    selectedCategory === cat.id ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/10 text-white/50'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {conciergeProducts.length === 0 ? (
                            <div className="col-span-2 py-12 flex flex-col items-center gap-2">
                                <span className="material-symbols-outlined text-white/10 text-5xl">inventory_2</span>
                                <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Sin productos en esta categoría</p>
                            </div>
                        ) : conciergeProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                whileTap={{ scale: 0.95 }}
                                className="glass-card flex flex-col rounded-[24px] overflow-hidden border border-white/5 group"
                            >
                                <div className="h-32 bg-white/5 overflow-hidden relative">
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 border border-white/10">
                                        <p className="text-primary text-[10px] font-black">${product.price.toFixed(2)}</p>
                                    </div>
                                    {product.is_promo && (
                                        <div className="absolute top-2 left-2 bg-primary/80 rounded-md px-1.5 py-0.5">
                                            <p className="text-black text-[9px] font-black uppercase">Promo</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 flex flex-col gap-2">
                                    <h4 className="text-white font-bold text-[11px] leading-tight line-clamp-2">{product.name}</h4>
                                    <button 
                                        onClick={() => handleAddToCart(product)}
                                        className={`w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                            addedId === product.id
                                                ? 'bg-green-500 text-black border-green-500'
                                                : 'bg-white/5 border border-primary/30 text-primary hover:bg-primary hover:text-black'
                                        }`}
                                    >
                                        {addedId === product.id ? '✓ Agregado' : 'Agregar'}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Payment Methods Section */}
                <section className="space-y-5 pb-10">
                    <div className="px-1">
                        <h3 className="text-white text-sm font-black uppercase tracking-widest">Métodos de Pago</h3>
                        <p className="text-white/30 text-[10px] font-medium uppercase mt-1">Selecciona cómo deseas pagar tu pedido</p>
                    </div>

                    <div className="grid gap-3">
                        {PAYMENT_METHODS.map((method) => (
                            <div
                                key={method.id}
                                onClick={() => setSelectedPayment(method.id)}
                                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                                    selectedPayment === method.id 
                                    ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(255,183,77,0.1)]' 
                                    : 'bg-white/5 border-white/10 opacity-60'
                                }`}
                            >
                                <div className={`size-10 rounded-xl flex items-center justify-center border ${
                                    selectedPayment === method.id ? 'bg-primary border-white/20' : 'bg-white/10 border-white/5'
                                }`}>
                                    <span className={`material-symbols-outlined ${selectedPayment === method.id ? 'text-black' : 'text-white/40'}`}>
                                        {method.icon}
                                    </span>
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <p className={`text-xs font-black uppercase tracking-tight ${selectedPayment === method.id ? 'text-white' : 'text-white/40'}`}>
                                        {method.name}
                                    </p>
                                    <p className="text-[10px] text-white/30 font-medium">{method.description}</p>
                                </div>
                                {selectedPayment === method.id && (
                                    <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Bottom Panel */}
            <AnimatePresence>
                {selectedPayment && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-0 left-0 right-0 p-6 z-[60]"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none"></div>
                        <div className="relative glass-card rounded-[32px] p-6 border-primary/30 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <div className="flex flex-col">
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest leading-none">Total estimado</p>
                                    <p className="text-white text-2xl font-black mt-1">${getTotal().toFixed(2)} <span className="text-[10px] text-white/40">+ Comisión</span></p>
                                </div>
                                <button
                                    onClick={() => navigate('/checkout')}
                                    disabled={getTotal() === 0}
                                    className="px-8 py-4 rounded-2xl bg-primary text-black font-black uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
