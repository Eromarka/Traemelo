import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

export const ResetPassword = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Verificar que estamos en un contexto de recuperación
        const hash = window.location.hash;
        if (!hash || !hash.includes('type=recovery')) {
            // Uncomment to enforce only arriving via email link:
            // navigate('/login');
        }
    }, [navigate]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        setLoading(false);

        if (error) {
            setError(error.message || 'Error al actualizar la contraseña');
        } else {
            alert('¡Contraseña actualizada con éxito!');
            navigate('/login');
        }
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center aurora-bg overflow-hidden p-6">
            {/* Ambient glows */}
            <div className="absolute top-[-10%] right-[-10%] size-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] size-96 bg-accent-blue/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="z-10 w-full max-w-sm">
                <motion.div
                    className="p-8 glass-card border border-white/10 rounded-3xl shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex justify-center mb-6">
                        <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                key
                            </span>
                        </div>
                    </div>

                    <h1 className="text-2xl font-black text-white text-center mb-2 tracking-tight">
                        Nueva Contraseña
                    </h1>
                    <p className="text-white/40 text-xs text-center mb-6 leading-relaxed">
                        Ingresa y confirma tu nueva contraseña para recuperar el acceso a tu cuenta.
                    </p>

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

                    <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                        <div>
                            <label className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1.5 block">
                                Nueva Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/20"
                                    placeholder="Mínimo 6 caracteres"
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
                            disabled={loading || password.length < 6}
                            className="mt-2 w-full py-4 rounded-xl bg-primary text-black font-black uppercase tracking-widest transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    Actualizando...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm">save</span>
                                    Guardar y Entrar
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};
