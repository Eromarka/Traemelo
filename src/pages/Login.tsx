import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            
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
            <div className="absolute top-[-10%] right-[-10%] size-96 bg-primary/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] left-[-10%] size-96 bg-accent-blue/10 blur-[120px] rounded-full"></div>

            <div className="z-10 w-full max-w-sm p-8 glass-card border border-white/10 rounded-3xl shadow-2xl">
                <h1 className="text-2xl font-black text-white text-center mb-6 tracking-tight">Bienvenido</h1>
                
                {error && (
                    <div className="p-3 mb-4 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full py-4 rounded-xl bg-primary text-black font-black uppercase tracking-widest transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 flex items-center justify-center"
                    >
                        {loading ? 'Iniciando...' : 'Entrar'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate('/register')}
                        className="text-white/40 text-xs font-semibold hover:text-white transition-colors mt-2"
                    >
                        ¿No tienes cuenta? Regístrate
                    </button>
                </form>
            </div>
        </div>
    );
};
