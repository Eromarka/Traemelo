import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'glass' | 'ghost';
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

export const Button = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    disabled = false,
    type = 'button',
}: ButtonProps) => {
    const baseStyles = 'inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

    const variantStyles = {
        primary: 'bg-primary text-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-105',
        secondary: 'bg-white text-black rounded-2xl shadow-lg hover:bg-zinc-100',
        glass: 'glass-card-intense text-white rounded-2xl border border-white/10 backdrop-blur-xl',
        ghost: 'bg-transparent text-white hover:bg-white/10 rounded-full'
    };

    return (
        <motion.button
            whileTap={{ scale: 0.96 }}
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
            {children}
        </motion.button>
    );
};
