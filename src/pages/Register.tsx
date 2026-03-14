import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });
            
            if (error) throw error;
            
            if (data.user) {
                // Optionally insert the profile data manually if not handled by triggers
                await supabase.from('profiles').insert({
                    id: data.user.id,
                    full_name: fullName,
                    role: 'user',
                });
            }

            navigate('/home');
        } catch (err: any) {
            setError(err.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center aurora-bg overflow-hidden p-6">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] size-96 bg-primary/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] size-96 bg-accent-blue/10 blur-[120px] rounded-full"></div>

            <div className="z-10 w-full max-w-sm p-8 glass-card border border-white/10 rounded-3xl shadow-2xl">
                <h1 className="text-2xl font-black text-white text-center mb-6 tracking-tight">Crear Cuenta</h1>
                
                {error && (
                    <div className="p-3 mb-4 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div>
                        <label className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1.5 block">Nombre Completo</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="Tu nombre"
                        />
                    </div>

                    <div>
                        <label className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1.5 block">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="tu@email.com"
                        />
                    </div>
                    
                    <div>
                        <label className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1.5 block">Contraseña</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white/70 transition-colors"
                                tabIndex={-1}
                                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                            >
                                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full py-4 rounded-xl bg-primary text-black font-black uppercase tracking-widest transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 flex items-center justify-center"
                    >
                        {loading ? 'Creando...' : 'Registrarse'}
                    </button>
                    
                    <div className="flex flex-col items-center gap-1 mt-2">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-white/40 text-xs font-semibold hover:text-white transition-colors"
                        >
                            ¿Ya tienes cuenta? Inicia sesión
                        </button>
                        <div className="w-12 h-px bg-white/5 my-2" />
                        <button
                            type="button"
                            onClick={() => navigate('/register-business')}
                            className="text-primary text-[10px] font-black uppercase tracking-widest hover:brightness-125 transition-all"
                        >
                            ¿Tienes un Negocio? Regístrate aquí
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
