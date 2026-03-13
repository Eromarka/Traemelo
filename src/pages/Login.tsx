import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            navigate('/home');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center aurora-bg overflow-hidden p-6">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] size-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] size-96 bg-accent-blue/10 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                className="z-10 w-full max-w-sm p-8 glass-card border border-white/10 rounded-3xl shadow-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Logo / Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            storefront
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Bienvenido</h1>
                    <p className="text-white/30 text-xs mt-1">Inicia sesión en tu cuenta</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 mb-4 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-sm">error</span>
                        {error}
                    </motion.div>
                )}
                
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    {/* Email */}
                    <div>
                        <label className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1.5 block">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/20"
                            placeholder="tu@email.com"
                        />
                    </div>
                    
                    {/* Contraseña con ojo */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="text-white/60 text-xs font-bold uppercase tracking-widest">
                                Contraseña
                            </label>
                            <button
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="text-primary text-[10px] font-bold uppercase tracking-widest hover:text-primary/80 transition-colors"
                            >
                                ¿Olvidaste tu clave?
                            </button>
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/20"
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
                        className="mt-2 w-full py-4 rounded-xl bg-primary text-black font-black uppercase tracking-widest transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                Iniciando...
                            </>
                        ) : 'Entrar'}
                    </button>
                    
                    <div className="flex items-center gap-3 my-1">
                        <div className="flex-1 h-px bg-white/5" />
                        <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">o</span>
                        <div className="flex-1 h-px bg-white/5" />
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate('/register')}
                        className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors active:scale-95"
                    >
                        ¿No tienes cuenta? Regístrate
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
