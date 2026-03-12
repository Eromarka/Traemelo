import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Badge } from '../components/ui/Badge';
import { BottomNav } from '../components/layout/BottomNav';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { localCategories } from '../data/localData';
import { useAuth } from '../contexts/AuthContext';

export const Home = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const { products } = useProducts();
    const { categories } = useCategories();
    const { profile } = useAuth();
    const avatarUrl = profile?.avatar_url || '';
    const displayName = profile?.full_name || profile?.business_name || 'U';
    const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    const displayCategories = categories.length > 0 ? categories : localCategories;

    const promoProducts = products.filter(p => p.is_promo);
    const healthProducts = products.filter(p => p.category_id === '5' || p.name.toLowerCase().includes('ensalada'));
    const discountProducts = products.filter(p => p.price < 5);

    const fallbackSuggestions = [
        { id: 's1', name: 'Hamburguesa Triple', store_name: 'San Juan Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop', path: '/product' },
        { id: 's2', name: 'Pizza Gourmet', store_name: 'Bella Italia', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop', path: '/pizza-details' },
        { id: 's3', name: 'Vino Tinto', store_name: 'Prolicor', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop', path: '/search' },
        { id: 's4', name: 'Vitamina C', store_name: 'FARMA24', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop', path: '/search' },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24 aurora-bg">
            {/* Header */}
            <header className="flex items-center bg-transparent px-4 py-2.5 justify-between sticky top-0 z-50 backdrop-blur-xl border-b border-white/5">
                <button onClick={() => navigate('/profile')} className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 overflow-hidden active:scale-95 transition-all">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} className="size-8 rounded-full object-cover" />
                    ) : (
                        <span className="text-primary text-[10px] font-black">{initials}</span>
                    )}
                </button>
                <div className="flex items-center justify-center flex-1 gap-2">
                    <img src="/assets/logo.png" alt="Logo" className="h-7 w-auto drop-shadow-[0_0_8px_rgba(79,172,254,0.4)]" />
                    <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] via-[#00f2fe] to-[#8E2DE2] animate-gradient-x text-2xl font-black tracking-tighter text-crisp text-glow-aurora">
                        Traemelo
                    </h2>
                </div>
                <div className="flex size-8 items-center justify-end">
                    <button onClick={() => navigate('/notifications')} className="flex items-center justify-center size-8 rounded-full bg-white/10 text-white border border-white/10 active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-[18px] text-primary">notifications</span>
                    </button>
                </div>
            </header>

            {/* Search */}
            <div className="px-4 py-3" onClick={() => navigate('/search')}>
                <div className="flex w-full items-stretch rounded-xl h-11 glass-card-intense border-white/10">
                    <div className="text-white/60 flex items-center justify-center pl-4">
                        <span className="material-symbols-outlined text-[20px]">search</span>
                    </div>
                    <div className="flex items-center text-white/60 px-3 text-sm font-medium italic">¿Qué quieres comprar hoy?</div>
                </div>
            </div>

            {/* Hero Banner Slider */}
            <div className="px-4 pt-1">
                <div className="relative overflow-hidden rounded-[24px] h-48 shadow-2xl ring-1 ring-white/5">
                    <motion.div
                        className="flex h-full"
                        style={{ width: '300%' }}
                        animate={{ x: `-${(step % 3) * (100 / 3)}%` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {/* Slide 1 */}
                        <div className="relative flex-none w-1/3 h-full flex flex-col justify-end">
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop")' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="relative p-3 pb-5 flex items-end justify-between w-full gap-2">
                                <div className="glass-card-intense px-3 py-1.5 rounded-lg border border-white/20 backdrop-blur-xl w-fit shadow-lg">
                                    <div className="inline-block px-1.5 py-0.5 rounded bg-blue-500/30 border border-blue-400/30 mb-0.5">
                                        <p className="text-white text-[10px] font-black tracking-widest uppercase">San Juan Burger</p>
                                    </div>
                                    <h2 className="text-white text-lg font-black tracking-tight text-crisp leading-none drop-shadow-md">Envío Gratis</h2>
                                    <p className="text-white/80 text-[11px] mt-1">Usa: <span className="text-blue-300 font-bold uppercase tracking-wider">TRAEMELO</span></p>
                                </div>
                                <button className="glass-panel bg-blue-600/70 text-white font-black px-4 py-1.5 rounded-lg backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(37,99,235,0.4)] active:scale-95 transition-all text-[10px] uppercase tracking-tighter shrink-0 mb-1">
                                    Pedir
                                </button>
                            </div>
                        </div>
                        {/* Slide 2 */}
                        <div className="relative flex-none w-1/3 h-full flex flex-col justify-end">
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800&auto=format&fit=crop")' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="relative p-3 pb-5 flex items-end justify-between w-full gap-2">
                                <div className="glass-card-intense px-3 py-1.5 rounded-lg border border-white/20 backdrop-blur-xl w-fit shadow-lg">
                                    <div className="inline-block px-1.5 py-0.5 rounded bg-purple-500/30 border border-purple-400/30 mb-0.5">
                                        <p className="text-white text-[10px] font-black tracking-widest uppercase">Prolicor</p>
                                    </div>
                                    <h2 className="text-white text-lg font-black tracking-tight text-crisp leading-none drop-shadow-md">Licores 24/7</h2>
                                    <p className="text-white/80 text-[11px] mt-1">Usa: <span className="text-purple-300 font-bold uppercase tracking-wider">NOCHE</span></p>
                                </div>
                                <button className="glass-panel bg-purple-600/70 text-white font-black px-4 py-1.5 rounded-lg backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(147,51,234,0.4)] active:scale-95 transition-all text-[10px] uppercase tracking-tighter shrink-0 mb-1">
                                    Pedir
                                </button>
                            </div>
                        </div>
                        {/* Slide 3 */}
                        <div className="relative flex-none w-1/3 h-full flex flex-col justify-end">
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=800&auto=format&fit=crop")' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="relative p-3 pb-5 flex items-end justify-between w-full gap-2">
                                <div className="glass-card-intense px-3 py-1.5 rounded-lg border border-white/20 backdrop-blur-xl w-fit shadow-lg">
                                    <div className="inline-block px-1.5 py-0.5 rounded bg-red-500/30 border border-red-400/30 mb-0.5">
                                        <p className="text-white text-[10px] font-black tracking-widest uppercase">FARMA24</p>
                                    </div>
                                    <h2 className="text-white text-lg font-black tracking-tight text-crisp leading-none drop-shadow-md">Salud 24h</h2>
                                    <p className="text-white/80 text-[11px] mt-1">Usa: <span className="text-red-300 font-bold uppercase tracking-wider">CUIDATE</span></p>
                                </div>
                                <button className="glass-panel bg-red-600/70 text-white font-black px-4 py-1.5 rounded-lg backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(220,38,38,0.4)] active:scale-95 transition-all text-[10px] uppercase tracking-tighter shrink-0 mb-1">
                                    Pedir
                                </button>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Minimalist Indicators */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/5">
                        {[0, 1, 2].map((i) => (
                            <div 
                                key={i} 
                                className={`h-1 rounded-full transition-all duration-300 ${step % 3 === i ? 'w-4 bg-primary' : 'w-1 bg-white/40'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* We Do Shopping For You Card */}
            <div className="px-4 mt-6">
                <div 
                    onClick={() => navigate('/concierge')} 
                    className="relative overflow-hidden rounded-[28px] p-6 bg-white/10 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] backdrop-blur-[40px] flex items-center gap-5 cursor-pointer active:scale-95 transition-all group"
                >
                    {/* Ambient Glows */}
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-[40px]"></div>
                    
                    <div className="flex-1 z-10">
                        <div className="inline-block px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 mb-2.5">
                            <p className="text-primary text-[10px] font-black tracking-widest uppercase">Concierge Premium</p>
                        </div>
                        <h3 className="text-white text-xl font-black tracking-tight leading-tight">
                            Te lo llevamos
                        </h3>
                        <p className="text-white/70 text-[13px] mt-1.5 leading-snug font-medium">Si no encuentras algo en el catálogo, nosotros lo buscamos y te lo llevamos a casa.</p>
                    </div>
                    
                    <div className="z-10 shrink-0 bg-primary/20 w-12 h-12 flex items-center justify-center rounded-2xl border border-primary/30 text-primary shadow-[0_4px_12px_rgba(0,0,0,0.25)]">
                        <span className="material-symbols-outlined text-[24px]">shopping_cart_checkout</span>
                    </div>
                </div>
            </div>

            {/* B2B Merchant Registration Banner */}
            <div className="px-4 mt-4 mb-2">
                <div 
                    onClick={() => navigate('/register-business')}
                    className="relative overflow-hidden rounded-[28px] p-5 bg-gradient-to-br from-gray-900 to-black border border-white/5 shadow-xl flex items-center gap-4 cursor-pointer active:scale-95 transition-all group"
                >
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-[60px]"></div>
                    
                    <div className="z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/40 transition-colors">
                        <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
                    </div>
                    
                    <div className="flex-1 z-10">
                        <h4 className="text-white text-sm font-black tracking-tight leading-none mb-1">¿Tienes un negocio?</h4>
                        <p className="text-white/40 text-[10px] font-medium leading-tight">Vende en Traemelo y llega a más clientes hoy mismo.</p>
                    </div>
                    
                    <div className="z-10 px-3 py-1.5 rounded-xl bg-white text-black font-black text-[9px] uppercase tracking-widest shadow-lg">
                        Unirse
                    </div>
                </div>
            </div>

            {/* Categories Horizontal Pills with Minimalist Icons */}
            <div className="mt-8 flex flex-col gap-4">
                <div className="px-4 flex items-center justify-between">
                    <h3 className="text-white font-black text-lg tracking-tighter text-crisp">Categorías</h3>
                </div>
                <div className="flex overflow-x-auto gap-3 px-4 no-scrollbar pb-2">
                    {displayCategories.map((cat) => (
                        <button
                            key={cat.id || cat.name}
                            onClick={() => navigate(`/directory?category=${cat.id}`)}
                            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl glass-card border border-white/10 shadow-lg active:scale-95 transition-all flex-none bg-white/5 backdrop-blur-2xl group border-l-white/20 border-t-white/20 min-w-[130px]"
                        >
                            <span className={`material-symbols-outlined text-[20px] ${cat.color} group-hover:scale-110 transition-transform filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]`}>
                                {cat.icon}
                            </span>
                            <span className="text-sm font-bold text-white/90 tracking-tight whitespace-nowrap">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Suggestions */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-6"
            >
                <div className="px-4 flex items-center justify-between mb-3">
                    <h3 className="text-white font-black text-lg tracking-tighter text-crisp">Sugerencias para ti</h3>
                </div>
                <div className="flex overflow-x-auto gap-4 px-4 no-scrollbar pb-3">
                    {(products.length > 0 ? products.map(p => ({
                        id: p.id, name: p.name, store_name: p.store_name, image: p.image_url,
                        path: '/product'
                    })) : fallbackSuggestions).map((item) => (
                        <div key={item.id} className="flex-none w-52 group cursor-pointer active:scale-[0.98] transition-transform" onClick={() => navigate(item.path)}>
                            <div className="relative h-32 rounded-xl overflow-hidden mb-2 ring-1 ring-white/10 shadow-lg bg-black/40">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url("${item.image}")` }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] pointer-events-none"></div>
                            </div>
                            <h4 className="text-white font-bold text-sm px-1 text-crisp">{item.name}</h4>
                            <p className="text-white/60 text-xs font-bold px-1 uppercase tracking-wider">{item.store_name || 'Negocio Local'}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Discounts */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6"
            >
                <div className="px-4 flex items-center justify-between mb-3">
                    <h3 className="text-white font-black text-lg tracking-tighter text-crisp">OFERTA ACTIVA</h3>
                </div>
                <div className="flex overflow-x-auto gap-4 px-4 no-scrollbar pb-3">
                    {(discountProducts.length > 0 ? discountProducts : products.slice(0, 4)).map((p) => (
                        <div key={p.id + '-discount'} className="flex-none w-44 group cursor-pointer active:scale-[0.98] transition-transform" onClick={() => navigate('/product')}>
                            <div className="relative h-44 rounded-2xl overflow-hidden mb-2 ring-1 ring-white/10 shadow-lg">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url("${p.image_url}")` }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                                <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.2)] pointer-events-none"></div>
                                <div className="absolute bottom-3 left-3 flex flex-col">
                                    <span className="text-primary font-black text-xl leading-none origin-left drop-shadow-[0_2px_4px_rgba(255,167,38,0.5)]">${p.price}</span>
                                    <span className="text-white/80 text-xs line-through font-black mt-1">${(p.price * 1.5).toFixed(2)}</span>
                                </div>
                                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full glass-panel bg-red-600 font-black text-xs text-white uppercase tracking-tighter border border-white/40 shadow-xl">Oferta</div>
                            </div>
                            <h4 className="text-white font-bold text-sm px-1 text-crisp truncate">{p.name}</h4>
                            <p className="text-white/80 text-xs font-bold px-1 uppercase tracking-wider">{p.store_name || 'Oferta Local'}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Most Requested */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mt-8"
            >
                <div className="px-4 flex items-center justify-between mb-3">
                    <h3 className="text-white font-black text-lg tracking-tighter text-crisp uppercase">Top Pedidos</h3>
                    <button onClick={() => navigate('/restaurants')} className="text-primary text-xs font-black uppercase tracking-widest active:opacity-70">Ver todos</button>
                </div>
                <div className="px-4 pb-4">
                    {promoProducts.length > 0 ? (
                        promoProducts.map(promo => (
                            <div key={promo.id} className="relative w-full h-32 rounded-2xl overflow-hidden group cursor-pointer active:scale-[0.99] transition-all border border-white/10 shadow-xl mb-4" onClick={() => navigate('/product')}>
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url("${promo.image_url}")` }}></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent"></div>
                                <div className="absolute inset-y-0 left-0 p-5 flex flex-col justify-center gap-1">
                                    <Badge variant="primary" className="text-[10px] px-2 py-0.5">Oferta Especial</Badge>
                                    <h4 className="text-white font-black text-xl text-crisp leading-tight tracking-tight drop-shadow-lg">{promo.name}</h4>
                                    <p className="text-white/70 text-[11px] font-black uppercase tracking-widest">{promo.store_name || 'Negocio Local'}</p>
                                    <p className="text-primary font-black text-base uppercase tracking-wider drop-shadow-md">${promo.price}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="relative w-full h-32 rounded-2xl overflow-hidden group cursor-pointer active:scale-[0.99] transition-all border border-white/10 shadow-xl" onClick={() => navigate('/product')}>
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop")' }}></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent"></div>
                            <div className="absolute inset-y-0 left-0 p-5 flex flex-col justify-center gap-1">
                                <Badge variant="primary">2x1 Hoy</Badge>
                                <h4 className="text-white font-black text-lg text-crisp leading-tight tracking-tight drop-shadow-lg">Ensalada Mediana</h4>
                                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">San Juan Burger</p>
                            </div>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2">
                                <div className="size-11 rounded-full bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(255,167,38,0.5)] rotate-[-15deg] border border-white/20">
                                    <span className="material-symbols-outlined text-black text-2xl font-black">local_offer</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Healthy Options - MOVED TO LAST */}
            {healthProducts.length > 0 && (
                <div className="mt-6 mb-4">
                    <div className="px-4 flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold text-base text-crisp">Opción Saludable</h3>
                    </div>
                    <div className="flex overflow-x-auto gap-4 px-4 no-scrollbar pb-3">
                        {healthProducts.map((p) => (
                            <div key={p.id} className="flex-none w-52 group cursor-pointer active:scale-[0.98] transition-transform" onClick={() => navigate('/product')}>
                                <div className="relative h-32 rounded-xl overflow-hidden mb-2 ring-1 ring-white/10 shadow-lg border border-green-500/20">
                                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url("${p.image_url}")` }}></div>
                                    <div className="absolute top-2 right-2 flex items-center justify-center p-1.5 rounded-lg bg-green-500/80 backdrop-blur-md">
                                        <span className="material-symbols-outlined text-white text-xs">eco</span>
                                    </div>
                                </div>
                                <h4 className="text-white font-bold text-sm px-1 text-crisp">{p.name}</h4>
                                <p className="text-white/60 text-xs font-bold px-1 uppercase tracking-wider">{p.store_name || 'Huerto Fresco'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
};
