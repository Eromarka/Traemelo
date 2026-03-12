import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    variant?: 'glass' | 'glass-panel' | 'glass-card' | 'glass-card-intense' | 'intense-glass';
    onClick?: () => void;
}

export const Card = ({
    children,
    className = '',
    variant = 'glass-card',
    onClick,
}: CardProps) => {
    return (
        <motion.div
            whileHover={onClick ? { scale: 1.02, translateY: -4 } : {}}
            whileTap={onClick ? { scale: 0.98 } : {}}
            onClick={onClick}
            className={`
                rounded-3xl shadow-xl overflow-hidden
                ${variant}
                ${onClick ? 'cursor-pointer' : ''}
                ${className}
            `}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
            {children}
        </motion.div>
    );
};
