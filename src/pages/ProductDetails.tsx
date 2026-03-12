import { useNavigate } from 'react-router-dom';

export const ProductDetails = () => {
    const navigate = useNavigate();

    return (
        <div className="relative max-w-md mx-auto min-h-screen flex flex-col pb-28 aurora-bg">
            <div className="relative w-full h-[40vh] overflow-hidden rounded-b-[2rem] shadow-xl">
                <div className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBrW5iIp3YG9vyc4FyCbdqeUF6ahtoPSNOv3MjHTSFUDSi82_ZztVyOPDdVBMNHHJ1fkfHa9lLsLq6AmcbypnQl74a8tjQebqAYxZIgbbYzo1oDwyzb9kFIxAXnP92jtkDuhKmT_3OEZ-RIv7u9NrDrTdQO9vAqOzn6RWaerKKO_kwKODMowcPjHYHqgNi-MjAH0dF9kIEoGCnJzFNbf1ey2PRLmHVAD5GbMlaK8J-4cqiB5FEr7-P109Iji70-QDlVgXB-O_92IQ")' }}>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/10"></div>
                </div>
                <div className="absolute top-6 left-5">
                    <button onClick={() => navigate(-1)} className="glass w-10 h-10 flex items-center justify-center rounded-2xl shadow-md text-white active:scale-90 transition-transform">
                        <span className="material-symbols-outlined text-lg">arrow_back_ios_new</span>
                    </button>
                </div>
                <div className="absolute top-6 right-5">
                    <button className="glass w-10 h-10 flex items-center justify-center rounded-2xl shadow-md text-white active:scale-90 transition-transform">
                        <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                    </button>
                </div>
            </div>

            <div className="px-4 -mt-16 relative z-10">
                <div className="glass-card rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-white pr-4">Hamburguesa Triple Cheese Deluxe</h1>
                        <span className="text-xl font-bold text-primary">$12.50</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                            <span className="text-yellow-400 material-symbols-outlined text-base mr-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="text-sm font-semibold text-white">4.8</span>
                        </div>
                        <span className="text-xs text-white/60">(120 reseñas)</span>
                    </div>
                    <p className="text-white/80 leading-relaxed text-sm font-light">
                        Pan artesanal Brioche, triple carne Angus, queso cheddar fundido, cebollas caramelizadas y nuestra salsa secreta. Incluye papas fritas crujientes.
                    </p>
                </div>
            </div>

            <div className="px-4 mt-6 space-y-4">
                <h3 className="text-base font-semibold text-white/90 px-2 tracking-wide">Opciones de Personalización</h3>
                <div className="space-y-2">
                    {[
                        { name: 'Extra Queso', price: '+$1.00' },
                        { name: 'Tocineta', price: '+$1.50' },
                        { name: 'Sin Cebolla', price: '' },
                    ].map((opt) => (
                        <label key={opt.name} className="glass-card flex items-center justify-between p-4 rounded-2xl cursor-pointer group active:scale-[0.98] transition-all border-white/5">
                            <div className="flex items-center gap-2">
                                <span className="text-white font-medium text-sm">{opt.name}</span>
                                {opt.price && <span className="text-primary font-semibold text-xs">{opt.price}</span>}
                            </div>
                            <div className="relative flex items-center">
                                <input className="h-5 w-5 rounded-full border-white/20 text-primary focus:ring-primary bg-white/10" type="checkbox" />
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            <div className="px-4 mt-6">
                <h3 className="text-base font-semibold text-white/90 px-2 mb-3 tracking-wide">Instrucciones especiales</h3>
                <div className="glass-card p-4 rounded-2xl">
                    <textarea className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-white/40 text-sm h-20 resize-none p-0" placeholder="Ej: Término medio, sin sal en las papas..."></textarea>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-5 flex justify-center max-w-md mx-auto pointer-events-none z-50">
                <button onClick={() => navigate('/cart')} className="pointer-events-auto w-full py-4 rounded-2xl flex items-center justify-between px-6 shadow-xl active:scale-95 transition-all border border-white/20 bg-gradient-to-tr from-primary to-accent-blue text-white">
                    <div className="flex flex-col items-start">
                        <span className="text-xs uppercase tracking-wider text-white/80 font-semibold">Total</span>
                        <span className="text-xl font-bold text-white leading-none">$12.50</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-base tracking-tight">Añadir al Carrito</span>
                        <div className="bg-white/20 p-1.5 rounded-xl">
                            <span className="material-symbols-outlined text-lg block">shopping_cart</span>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};
