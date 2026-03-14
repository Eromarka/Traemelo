import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCartStore } from '../../store/useCartStore';

export const BottomNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { profile } = useAuth();
    const totalItems = useCartStore(s => s.getTotalItems());

    const avatarUrl = profile?.avatar_url || '';
    const displayName = profile?.full_name || profile?.business_name || 'U';
    const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    const tabs = [
        { name: 'Inicio', icon: 'home', path: '/home', badge: 0 },
        { name: 'Crea', icon: 'storefront', path: '/register-business', badge: 0 },
        { name: 'Directorio', icon: 'explore', path: '/directory', badge: 0 },
        { name: 'Carrito', icon: 'shopping_cart', path: '/cart', badge: totalItems },
        { name: 'Pedidos', icon: 'receipt_long', path: '/orders', badge: 0 },
        { name: 'Perfil', icon: 'person', path: '/profile', badge: 0 },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 px-5 pb-4">
            <div className="mx-auto max-w-md glass-card-intense !bg-white/10 border-white/20 rounded-2xl px-4 py-2.5 flex justify-between items-center shadow-2xl backdrop-blur-2xl">
                {tabs.map((tab) => {
                    const isActive = location.pathname === tab.path;

                    if (tab.name === 'Perfil') {
                        return (
                            <button
                                key={tab.name}
                                onClick={() => navigate('/profile')}
                                className={`flex flex-col items-center gap-0.5 transition-colors ${isActive ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                            >
                                <div className="relative flex h-6 w-6 items-center justify-center">
                                    <div className={`size-6 rounded-full bg-primary/20 ring-1 transition-all flex items-center justify-center overflow-hidden ${isActive ? 'ring-primary border border-primary/20' : 'ring-white/20'}`}>
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt={displayName} className="size-6 rounded-full object-cover" />
                                        ) : (
                                            <span className="text-primary text-[8px] font-black">{initials}</span>
                                        )}
                                    </div>
                                    {isActive && <div className="absolute -bottom-2 size-1 bg-primary rounded-full shadow-[0_0_8px_#38bdf8]" />}
                                </div>
                                <p className="text-[9px] font-semibold tracking-wider uppercase">{tab.name}</p>
                            </button>
                        );
                    }

                    return (
                        <button
                            key={tab.name}
                            onClick={() => navigate(tab.path)}
                            className={`flex flex-col items-center gap-0.5 transition-colors ${isActive ? 'text-primary' : 'text-white/40 hover:text-white'}`}
                        >
                            <div className="relative flex h-6 items-center justify-center">
                                <span className={`material-symbols-outlined text-xl ${isActive ? 'fill-1' : ''}`}>{tab.icon}</span>
                                {tab.badge > 0 && (
                                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-red-500/40 border border-red-400/50 leading-none animate-bounce">
                                        {tab.badge > 99 ? '99+' : tab.badge}
                                    </span>
                                )}
                                {isActive && <div className="absolute -bottom-2 size-1 bg-primary rounded-full shadow-[0_0_8px_#38bdf8]" />}
                            </div>
                            <p className="text-[9px] font-semibold tracking-wider uppercase">{tab.name}</p>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
