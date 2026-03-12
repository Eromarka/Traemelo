import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../components/layout/BottomNav';
import { motion } from 'framer-motion';

import { useBusinesses } from '../hooks/useBusinesses';
import { useCategories } from '../hooks/useCategories';

export const SearchResults = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const { businesses } = useBusinesses();
    const { categories } = useCategories();

    const filteredResults = query 
        ? businesses.filter(r => 
            r.name.toLowerCase().includes(query.toLowerCase()) || 
            categories.find(c => c.id === r.category_id || c.id === r.category)?.name.toLowerCase().includes(query.toLowerCase())
        )
        : businesses;

    return (
        <div className="relative flex min-h-screen w-full flex-col aurora-bg overflow-x-hidden pb-32">
            <div className="sticky top-0 z-50 px-4 pt-6 pb-3 glass-card-intense border-b border-white/5 backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-3">
                    <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full glass active:scale-95 transition-all">
                        <span className="material-symbols-outlined text-white text-lg">chevron_left</span>
                    </button>
                    <h1 className="text-base font-bold tracking-wider text-white uppercase">Buscar</h1>
                    <div className="w-9"></div>
                </div>
                <div className="flex w-full items-center rounded-xl glass-card-intense h-11 px-4 gap-2 border border-white/10 shadow-lg">
                    <span className="material-symbols-outlined text-primary text-xl">search</span>
                    <input
                        className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/20 text-sm font-medium outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar productos o negocios..."
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="text-white/20 flex items-center justify-center active:scale-95 transition-all">
                            <span className="material-symbols-outlined text-base">cancel</span>
                        </button>
                    )}
                </div>
            </div>

            <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
                {['Cerca de mí', '4+ Estrellas', 'Envío Gratis', 'Ofertas'].map(filter => (
                    <button key={filter} className="flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full glass-card border border-white/5 px-4 active:scale-95 transition-all shadow-md">
                        <p className="text-primary text-[10px] font-semibold uppercase tracking-wider">{filter}</p>
                        <span className="material-symbols-outlined text-xs text-primary">expand_more</span>
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-4 p-4">
                {filteredResults.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08 }}
                        onClick={() => navigate('/directory')}
                        className="glass-card-intense rounded-2xl overflow-hidden flex flex-col group cursor-pointer active:scale-[0.99] transition-all border border-white/10 shadow-xl"
                    >
                        <div className="relative h-40 w-full overflow-hidden">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: `url("${item.image_url}")` }}></div>
                            <div className="absolute top-3 left-3 glass-card-intense text-primary px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border border-white/10">Verificado</div>
                        </div>
                        <div className="p-4 flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <h3 className="text-white text-base font-bold leading-tight group-hover:text-primary transition-colors">{item.name}</h3>
                                <div className="flex items-center gap-1.5 glass-card-intense px-2.5 py-1 rounded-xl border border-white/5">
                                    <span className="material-symbols-outlined text-xs text-yellow-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                    <span className="text-xs font-black text-white">{item.rating}</span>
                                </div>
                            </div>
                            <p className="text-white/40 text-sm font-medium">{categories.find(c => c.id === item.category_id || c.id === item.category)?.name}</p>
                            <div className="flex items-center justify-between mt-3">
                                <div className="flex flex-col">
                                    <p className="text-white font-bold text-base">Disponible</p>
                                    <p className="text-white/30 text-[9px] font-semibold uppercase tracking-wider">{item.delivery_time}</p>
                                </div>
                                <button className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all">
                                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                                </button>
                             </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <BottomNav />
        </div>
    );
};
