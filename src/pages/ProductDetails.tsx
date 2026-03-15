import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useCartStore } from '../store/useCartStore';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    store_name: string;
    store_id: string;
    category_id: string;
    is_promo: boolean;
}

export const ProductDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const addToCart = useCartStore(s => s.addToCart);

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [notes, setNotes] = useState('');
    const [added, setAdded] = useState(false);
    const [isFav, setIsFav] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) { setLoading(false); return; }
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*, stores(name)')
                    .eq('id', id)
                    .single();
                if (error) throw error;
                
                // Map store name for easier access in UI
                if (data) {
                    const mappedData = {
                        ...data,
                        store_name: (data as any).stores?.name || 'Negocio Local'
                    };
                    setProduct(mappedData);
                }
            } catch (err) {
                console.error('Error cargando producto:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image_url,
            store_name: product.store_name,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    // Skeleton loading
    if (loading) {
        return (
            <div className="relative max-w-md mx-auto min-h-screen flex flex-col aurora-bg animate-pulse">
                <div className="w-full h-[45vh] bg-white/5 rounded-b-[2rem]" />
                <div className="px-4 -mt-16 relative z-10 space-y-4">
                    <div className="glass-card rounded-2xl p-6 space-y-3">
                        <div className="h-6 bg-white/10 rounded-xl w-3/4" />
                        <div className="h-4 bg-white/5 rounded-xl w-1/2" />
                        <div className="h-16 bg-white/5 rounded-xl w-full" />
                    </div>
                </div>
            </div>
        );
    }

    // Producto no encontrado
    if (!product) {
        return (
            <div className="relative max-w-md mx-auto min-h-screen flex flex-col items-center justify-center aurora-bg p-6 gap-4">
                <span className="material-symbols-outlined text-white/20 text-7xl">inventory_2</span>
                <h1 className="text-white font-black text-xl uppercase tracking-tight">Producto no encontrado</h1>
                <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-2xl bg-primary/20 border border-primary/30 text-primary font-black text-sm uppercase tracking-widest">
                    Volver
                </button>
            </div>
        );
    }

    const totalPrice = (product.price * quantity).toFixed(2);

    return (
        <div className="relative max-w-md mx-auto min-h-screen flex flex-col pb-36 aurora-bg overflow-x-hidden">
            {/* Hero Image */}
            <div className="relative w-full h-[45vh] overflow-hidden rounded-b-[2.5rem] shadow-2xl">
                <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-700 scale-105"
                    style={{ backgroundImage: `url("${product.image_url}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />

                {/* Nav buttons */}
                <div className="absolute top-6 left-5">
                    <button
                        onClick={() => navigate(-1)}
                        className="glass w-10 h-10 flex items-center justify-center rounded-2xl shadow-md text-white active:scale-90 transition-transform backdrop-blur-xl border border-white/20"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back_ios_new</span>
                    </button>
                </div>
                <div className="absolute top-6 right-5">
                    <button
                        onClick={() => setIsFav(!isFav)}
                        className="glass w-10 h-10 flex items-center justify-center rounded-2xl shadow-md text-white active:scale-90 transition-all backdrop-blur-xl border border-white/20"
                    >
                        <span
                            className="material-symbols-outlined text-xl transition-colors"
                            style={{
                                fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0",
                                color: isFav ? '#ef4444' : 'white'
                            }}
                        >
                            favorite
                        </span>
                    </button>
                </div>

                {/* Promo badge */}
                {product.is_promo && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-red-500/80 backdrop-blur-md border border-red-400/40 shadow-xl">
                        <p className="text-white text-[10px] font-black uppercase tracking-widest">Oferta Especial</p>
                    </div>
                )}

                {/* Store tag at bottom of image */}
                <div className="absolute bottom-6 left-5">
                    <div className="glass-card-intense px-3 py-1.5 rounded-xl border border-white/20 backdrop-blur-xl shadow-lg w-fit">
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary">{product.store_name || 'Negocio Local'}</p>
                    </div>
                </div>
            </div>

            {/* Content card */}
            <div className="px-4 -mt-6 relative z-10">
                <div className="glass-card rounded-3xl p-5 border border-white/10 shadow-2xl">
                    <div className="flex justify-between items-start mb-3">
                        <h1 className="text-xl font-black leading-tight tracking-tight text-white pr-4 flex-1">{product.name}</h1>
                        <div className="text-right shrink-0">
                            <span className="text-2xl font-black text-primary leading-none">${product.price.toFixed(2)}</span>
                        </div>
                    </div>

                    {product.description && (
                        <p className="text-white/70 leading-relaxed text-sm font-medium mt-2">
                            {product.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Quantity selector */}
            <div className="px-4 mt-4">
                <div className="glass-card rounded-3xl p-5 border border-white/5">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Cantidad</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5 bg-black/40 rounded-2xl px-4 py-3 border border-white/10">
                            <button
                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                className="text-white/60 hover:text-primary transition-colors active:scale-110"
                            >
                                <span className="material-symbols-outlined text-xl">remove</span>
                            </button>
                            <span className="text-white font-black text-lg min-w-[2rem] text-center">{quantity}</span>
                            <button
                                onClick={() => setQuantity(q => q + 1)}
                                className="text-white/60 hover:text-primary transition-colors active:scale-110"
                            >
                                <span className="material-symbols-outlined text-xl">add</span>
                            </button>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Subtotal</p>
                            <p className="text-primary font-black text-xl">${totalPrice}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notas especiales */}
            <div className="px-4 mt-4">
                <div className="glass-card rounded-3xl p-5 border border-white/5">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Instrucciones especiales</h3>
                    <textarea
                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-white/30 text-sm h-16 resize-none p-0 font-medium"
                        placeholder="Ej: Sin cebolla, término medio..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                    />
                </div>
            </div>

            {/* Add to cart — fixed footer */}
            <div className="fixed bottom-0 left-0 right-0 p-5 flex flex-col gap-2 max-w-md mx-auto pointer-events-none z-50">
                <AnimatePresence>
                    {added && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="pointer-events-auto flex items-center justify-center gap-2 py-3 rounded-2xl bg-green-500/20 border border-green-500/30 backdrop-blur-xl"
                        >
                            <span className="material-symbols-outlined text-green-400 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            <p className="text-green-300 text-xs font-black uppercase tracking-widest">¡Añadido al carrito!</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={handleAddToCart}
                    className="pointer-events-auto w-full py-4 rounded-2xl flex items-center justify-between px-6 shadow-2xl active:scale-[0.98] transition-all border border-white/20 bg-gradient-to-tr from-primary to-accent-blue text-white overflow-hidden relative"
                >
                    <div className="flex flex-col items-start">
                        <span className="text-[9px] uppercase tracking-widest text-white/70 font-bold">Total</span>
                        <span className="text-xl font-black text-white leading-none">${totalPrice}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-black text-base tracking-tight">Añadir al Carrito</span>
                        <div className="bg-white/20 p-1.5 rounded-xl">
                            <span className="material-symbols-outlined text-lg block">shopping_cart</span>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};
