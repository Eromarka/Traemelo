import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        setLoading(false);

        if (error) {
            setError(error.message || 'Error al enviar el correo');
        } else {
            setSent(true);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center aurora-bg overflow-hidden p-6">
            {/* Ambient glows */}
            <div className="absolute top-[-10%] left-[-10%] size-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] size-96 bg-accent-blue/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="z-10 w-full max-w-sm">
                {/* Back button */}
                <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 text-white/40 text-xs font-black uppercase tracking-widest mb-8 hover:text-white transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
                    Volver al login
                </button>

                <motion.div
                    className="p-8 glass-card border border-white/10 rounded-3xl shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <AnimatePresence mode="wait">
                        {!sent ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            lock_reset
                                        </span>
                                    </div>
                                </div>

                                <h1 className="text-2xl font-black text-white text-center mb-2 tracking-tight">
                                    ¿Olvidaste tu clave?
                                </h1>
                                <p className="text-white/40 text-xs text-center mb-6 leading-relaxed">
                                    Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
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

                                <form onSubmit={handleReset} className="flex flex-col gap-4">
                                    <div>
                                        <label className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1.5 block">
                                            Correo Electrónico
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            autoFocus
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/20"
                                            placeholder="tu@email.com"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="mt-2 w-full py-4 rounded-xl bg-primary text-black font-black uppercase tracking-widest transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-sm">send</span>
                                                Enviar enlace
                                            </>
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center text-center gap-4 py-4"
                            >
                                {/* Success icon */}
                                <motion.div
                                    className="size-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                                >
                                    <span className="material-symbols-outlined text-emerald-400 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        mark_email_read
                                    </span>
                                </motion.div>

                                <div>
                                    <h2 className="text-xl font-black text-white tracking-tight">
                                        ¡Correo enviado!
                                    </h2>
                                    <p className="text-white/40 text-xs mt-2 leading-relaxed">
                                        Revisa tu bandeja de entrada en{' '}
                                        <span className="text-primary font-bold">{email}</span>.
                                        El enlace expira en 1 hora.
                                    </p>
                                </div>

                                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-left w-full">
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-2">¿No llegó?</p>
                                    <p className="text-white/30 text-xs leading-relaxed">
                                        Revisa tu carpeta de Spam o{' '}
                                        <button
                                            onClick={() => setSent(false)}
                                            className="text-primary underline font-bold"
                                        >
                                            intenta con otro correo
                                        </button>.
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate('/login')}
                                    className="w-full py-4 rounded-xl bg-primary text-black font-black uppercase tracking-widest transition-all active:scale-95"
                                >
                                    Volver al Login
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};
