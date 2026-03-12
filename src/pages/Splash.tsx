import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Splash = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/onboarding');
        }, 3500);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-between overflow-hidden bg-background-dark font-display">
            <div className="absolute inset-0 overflow-hidden z-0 bg-gradient-to-b from-[#0a0c10] to-[#0f172a]">
                <div className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.4)_0%,rgba(44,138,226,0.3)_25%,rgba(0,242,255,0.2)_50%,transparent_70%)] blur-[80px] opacity-80 rotate-[-15deg]"></div>
                <div className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2 bg-[radial-gradient(ellipse_at_20%_80%,#2c8ae2_0%,transparent_60%)] blur-[80px] opacity-80 rotate-[10deg]"></div>
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="h-16 w-full relative z-10"></div>

            <div className="flex flex-col items-center justify-center flex-1 z-10">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="mb-6 flex size-24 items-center justify-center rounded-[2rem] glass-card relative group shadow-[0_0_40px_rgba(79,172,254,0.2)]"
                >
                    <div className="absolute inset-0 rounded-[2rem] bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all"></div>
                    <img src="/assets/logo.png" alt="Logo" className="w-16 h-auto relative z-20 drop-shadow-[0_0_15px_rgba(79,172,254,0.5)]" />
                </motion.div>
                <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#4facfe] via-[#00f2fe] to-[#8E2DE2] animate-gradient-x text-glow-aurora mb-1 uppercase">
                    Traemelo
                </h1>
                <p className="text-white/40 text-[11px] font-bold tracking-[0.3em] uppercase opacity-90">Premium Experience</p>
            </div>

            <div className="w-full max-w-xs px-8 pb-20 z-10 flex flex-col items-center gap-8">
                <div className="w-full space-y-4">
                    <div className="flex justify-center">
                        <p className="text-white text-[10px] font-semibold tracking-[0.25em] uppercase opacity-80 animate-pulse">Iniciando sesión segura</p>
                    </div>
                    <div className="h-[3px] w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                        <div className="h-full bg-primary glow-line rounded-full" style={{ width: '45%' }}></div>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
                    <span className="material-symbols-outlined text-[12px] text-primary">verified_user</span>
                    <p className="text-[8px] font-semibold text-white/70 uppercase tracking-wider">Encrypted Service</p>
                </div>
            </div>
        </div>
    );
};
