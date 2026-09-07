'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
  hover?: boolean;
  gold?: boolean;
  delay?: number;
}

export function GlassCard({ children, className, selected, onClick, hover = true, gold = false, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover && onClick ? { y: -2, scale: 1.01 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={cn(
        'rounded-2xl transition-all duration-300',
        gold ? 'glass-gold' : 'glass',
        hover && onClick ? 'cursor-pointer glass-hover' : '',
        selected ? 'card-selected' : '',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
