import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BottomNav } from '../components/layout/BottomNav';
import { useAnalytics } from '../hooks/useAnalytics';
import { useBusinesses } from '../hooks/useBusinesses';
import { useCategories } from '../hooks/useCategories';

export const BusinessDirectory = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
    const [searchQuery, setSearchQuery] = useState('');
    const { trackAction } = useAnalytics();
    const { businesses, loading: loadingBiz } = useBusinesses();
    const { categories, loading: loadingCat } = useCategories();

    useEffect(() => {
        if (initialCategory) {
            setSelectedCategory(initialCategory);
        }
    }, [initialCategory]);

    const filteredBusinesses = businesses.filter(r => {
        const matchesCategory = selectedCategory ? r.category_id === selectedCategory || r.category === selectedCategory : true;
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loadingBiz || loadingCat) {
        return (
            <div className="min-h-screen aurora-bg flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col aurora-bg overflow-x-hidden pb-24">
            <header className="flex items-center bg-transparent px-4 pt-6 pb-3 justify-between sticky top-0 z-50 backdrop-blur-xl border-b border-white/5">
                <Button variant="ghost" className="size-9" onClick={() => navigate('/home')}>
                    <span className="material-symbols-outlined text-white text-xl">chevron_left</span>
                </Button>
                <h1 className="text-white text-base font-bold tracking-tight flex-1 text-center">Directorio de Negocios</h1>
                <div className="size-9"></div>
            </header>

            <main className="flex-1 p-4">
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="flex w-full items-stretch rounded-xl h-12 glass-card-intense border-white/10 shadow-lg">
                        <div className="text-white/60 flex items-center justify-center pl-4">
                            <span className="material-symbols-outlined text-[20px]">search</span>
                        </div>
                        <input 
                            type="text" 
                            placeholder="Buscar negocios o servicios..." 
                            className="bg-transparent border-none focus:ring-0 text-white placeholder-white/40 text-sm flex-1 px-3"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Categories Pills */}
                <div className="mb-6 flex overflow-x-auto gap-2 no-scrollbar pb-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${!selectedCategory ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/10 text-white/60'}`}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border whitespace-nowrap ${selectedCategory === cat.id ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/10 text-white/60'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Business Grid */}
                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence mode="popLayout">
                        {filteredBusinesses.map((business) => (
                            <motion.div
                                key={business.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="glass-card-intense rounded-2xl overflow-hidden border border-white/10 shadow-xl group cursor-pointer active:scale-[0.99] transition-all"
                            >
                                <div className="relative h-40">
                                    <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url("${business.image_url}")` }}></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute top-3 right-3">
                                        <div className="glass-panel px-2 py-1 rounded-lg flex items-center gap-1">
                                            <span className="material-symbols-outlined text-yellow-400 text-sm fill-1">star</span>
                                            <span className="text-white text-xs font-bold">{business.rating}</span>
                                        </div>
                                    </div>
                                    <div className="absolute bottom-3 left-4">
                                        <Badge variant="primary" className="text-[10px] uppercase font-black tracking-widest bg-primary text-black border-none">
                                            {categories.find(c => c.id === business.category_id || c.id === business.category)?.name || 'Negocio'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-white font-black text-lg tracking-tight group-hover:text-primary transition-colors">{business.name}</h3>
                                        <p className="text-white/50 text-xs font-medium mt-0.5 flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            {business.delivery_time}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                trackAction(business.name, 'call');
                                                window.open(`tel:${business.phone}`); 
                                            }}
                                            className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-xl">call</span>
                                        </button>
                                        <button 
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                trackAction(business.name, 'whatsapp');
                                                window.open(`https://wa.me/${business.phone.replace('+', '')}`); 
                                            }}
                                            className="size-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 hover:bg-green-500/30 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-xl">chat</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredBusinesses.length === 0 && (
                    <div className="py-20 text-center">
                        <span className="material-symbols-outlined text-white/10 text-6xl mb-4">search_off</span>
                        <p className="text-white/30 uppercase text-[10px] font-black tracking-[0.2em]">No se encontraron resultados</p>
                    </div>
                )}
            </main>

            <BottomNav />
        </div>
    );
};
