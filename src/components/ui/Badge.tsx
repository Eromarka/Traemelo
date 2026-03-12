import type { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'glass' | 'error' | 'success';
    className?: string;
}

export const Badge = ({
    children,
    variant = 'primary',
    className = '',
}: BadgeProps) => {
    const baseStyles = 'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all';

    const variantStyles = {
        primary: 'bg-primary/20 text-primary border-primary/30 aurora-glow-cyan',
        secondary: 'bg-white/10 text-white border-white/20',
        glass: 'glass-card-intense text-white border-white/10 backdrop-blur-md',
        error: 'bg-red-500/20 text-red-400 border-red-500/30',
        success: 'bg-green-500/20 text-green-400 border-green-500/30'
    };

    return (
        <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
            {children}
        </span>
    );
};
