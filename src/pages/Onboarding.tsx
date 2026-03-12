import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import imgExplore from '../assets/onboarding/explore.png';
import imgTracking from '../assets/onboarding/tracking.png';
import imgEnjoy from '../assets/onboarding/enjoy.png';

export const Onboarding = () => {
    const [step, setStep] = useState(0);
    const navigate = useNavigate();

    const steps = [
        {
            title: 'Explora y Elige',
            desc: 'Descubre los mejores negocios de tu ciudad con una interfaz moderna y fluida.',
            img: imgExplore
        },
        {
            title: 'Seguimiento Real',
            desc: 'Sigue tu pedido en vivo desde la cocina hasta la puerta de tu casa.',
            img: imgTracking
        },
        {
            title: 'Disfruta al Máximo',
            desc: 'Recibe tus platillos favoritos con la calidad y rapidez que mereces.',
            img: imgEnjoy
        }
    ];

    const nextStep = () => {
        if (step < steps.length - 1) setStep(step + 1);
        else navigate('/home');
    };

    return (
        <div className="relative h-screen w-full flex flex-col overflow-hidden aurora-bg">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    className="flex-1 flex flex-col pt-12 px-8 items-center text-center"
                >
                    <div className="relative w-full aspect-square max-w-[260px] mb-8">
                        <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full"></div>
                        <div className="relative glass-card rounded-2xl w-full h-full flex items-center justify-center p-6">
                            <div className="w-full h-full bg-cover bg-center rounded-xl" style={{
                                backgroundImage: `url(${steps[step].img || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq_rR-X8Vp-0B-8S-5D-7N-3-A-7B-C-D-E-F-G-H-I-J-K-L-M-N-O-P-Q-R-S-T-U-V-W-X-Y-Z-a'})`
                            }}></div>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-4 tracking-tight leading-none uppercase">
                        {steps[step].title}
                    </h2>
                    <p className="text-white/60 text-base font-medium leading-relaxed max-w-[240px]">
                        {steps[step].desc}
                    </p>
                </motion.div>
            </AnimatePresence>

            <div className="p-8 flex flex-col gap-6">
                <div className="flex justify-center gap-3">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-10 bg-primary shadow-[0_0_10px_rgba(0,242,255,0.5)]' : 'w-1.5 bg-white/20'}`}
                        ></div>
                    ))}
                </div>

                <div className="flex gap-3">
                    {step < steps.length - 1 && (
                        <button onClick={() => setStep(steps.length - 1)} className="flex-1 py-4 rounded-2xl glass text-white/40 font-bold uppercase tracking-widest text-[10px] active:scale-95 transition-all">
                            Saltar
                        </button>
                    )}
                    <button
                        onClick={nextStep}
                        className="flex-[2] py-4 rounded-2xl intense-glass bg-white text-black font-bold text-base shadow-xl shadow-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <span>{step === steps.length - 1 ? 'Empezar' : 'Siguiente'}</span>
                        <span className="material-symbols-outlined text-black font-bold text-lg">arrow_forward</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
