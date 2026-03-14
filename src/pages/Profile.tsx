import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { useImageUpload } from '../hooks/useImageUpload';
import { supabase } from '../lib/supabaseClient';

export const Profile = () => {
    const navigate = useNavigate();
    const { profile, user, signOut, refreshProfile } = useAuth();
    const { uploadImage, uploading } = useImageUpload('profiles', user?.id);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login');
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
        
        const url = await uploadImage(file);
        if (url) {
            await supabase
                .from('profiles')
                .update({ avatar_url: url })
                .eq('id', user.id);
            
            await refreshProfile();
        }
    };

    const initials = profile?.full_name?.split(' ').map((n: any) => n[0]).join('').toUpperCase() || 'U';

    return (
        <div className="relative min-h-screen flex flex-col aurora-bg text-white pb-24 overflow-hidden">
            <header className="px-6 pt-12 pb-8 sticky top-0 z-50 backdrop-blur-3xl border-b border-white/5">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-black tracking-tighter">Mi <span className="text-primary italic">Perfil</span></h1>
                    <button 
                        onClick={() => navigate('/home')}
                        className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center active:scale-95 transition-all"
                    >
                        <span className="material-symbols-outlined text-white">close</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 p-6 space-y-8 z-10">
                {/* User Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card-intense rounded-[2.5rem] p-8 border border-white/10 flex flex-col items-center text-center gap-4 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                    
                    <div className="relative group">
                        <div className="size-24 rounded-[2rem] bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center text-black font-black text-3xl shadow-2xl shadow-primary/30 ring-4 ring-white/5 overflow-hidden">
                            {uploading ? (
                                <div className="size-8 border-4 border-black border-t-transparent rounded-full animate-spin" />
                            ) : profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : initials}
                        </div>
                        
                        <label className="absolute -bottom-2 -right-2 size-10 rounded-2xl bg-white text-black shadow-xl flex items-center justify-center cursor-pointer active:scale-90 transition-all border-4 border-[#070707]">
                            <span className="material-symbols-outlined text-lg">add_a_photo</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
                        </label>
                    </div>

                    <div>
                        <h2 className="text-xl font-black tracking-tight">{profile?.full_name || 'Usuario Increíble'}</h2>
                        <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mt-1">{profile?.role === 'admin' ? 'Administrador Global' : profile?.role === 'merchant' ? 'Dueño de Negocio' : 'Miembro Premium'}</p>
                    </div>

                    <div className="flex gap-2 w-full mt-2">
                        <div className="flex-1 p-3 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">Pedidos</p>
                            <p className="text-sm font-black italic">12</p>
                        </div>
                        <div className="flex-1 p-3 rounded-2xl bg-white/5 border border-white/5">
                            <p className="text-[8px] text-white/40 font-black uppercase tracking-widest mb-1">Nivel</p>
                            <p className="text-sm font-black italic text-primary">Oro</p>
                        </div>
                    </div>
                </motion.div>

                {/* Section Links */}
                <div className="space-y-3">
                    <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 ml-4 mb-4">Ajustes de Cuenta</h3>
                    
                    {[
                        { icon: 'person', label: 'Información Personal', sub: 'Nombre, email, teléfono' },
                        { icon: 'location_on', label: 'Mis Direcciones', sub: 'Gestionar lugares de entrega' },
                        { icon: 'payments', label: 'Métodos de Pago', sub: 'Zelle, Pago Móvil, Tarjetas' },
                        { icon: 'notifications', label: 'Notificaciones', sub: 'Alertas de pedidos y ofertas' },
                    ].map((item, idx) => (
                        <motion.button 
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            className="w-full p-4 rounded-3xl glass-card border border-white/5 flex items-center justify-between group active:scale-[0.98] transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 group-hover:text-primary transition-colors">
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                </div>
                                <div className="text-left">
                                    <h4 className="font-bold text-sm tracking-tight">{item.label}</h4>
                                    <p className="text-white/30 text-[10px] uppercase tracking-wide font-black">{item.sub}</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-white/20">chevron_right</span>
                        </motion.button>
                    ))}
                </div>

                {/* Special Actions */}
                <div className="pt-4 space-y-4">
                    {profile?.role === 'merchant' ? (
                        <div className="flex flex-col gap-3">
                            <Button 
                                onClick={() => navigate('/business/dashboard')}
                                className="w-full h-16 rounded-[2rem] bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20"
                            >
                                <div className="flex items-center justify-center gap-3">
                                    <span className="material-symbols-outlined">dashboard</span>
                                    <span>Panel de Negocio</span>
                                </div>
                            </Button>
                            <button
                                onClick={async () => {
                                    await supabase.from('profiles').update({ role: 'user' }).eq('id', user?.id);
                                    await refreshProfile();
                                }}
                                className="w-full py-4 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Cambiar a vista de Comprador
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Button 
                                onClick={() => navigate('/register-business')}
                                className="w-full h-16 rounded-[2rem] bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest shadow-xl shadow-primary/20 border-none"
                                style={{ backgroundImage: 'linear-gradient(to right, #ffb74d, #f57c00)' }}
                            >
                                <div className="flex items-center justify-center gap-3 text-sm">
                                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
                                    <span>Inscribir mi Negocio</span>
                                </div>
                            </Button>
                            {profile?.business_name && (
                                <button
                                    onClick={async () => {
                                        await supabase.from('profiles').update({ role: 'merchant' }).eq('id', user?.id);
                                        await refreshProfile();
                                    }}
                                    className="w-full py-4 text-white/40 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    Activar modo Negocio
                                </button>
                            )}
                        </div>
                    )}

                    <button 
                        onClick={handleSignOut}
                        className="w-full py-5 text-red-500 font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-red-500/5 rounded-3xl transition-all"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Cerrar Sesión
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Profile;
