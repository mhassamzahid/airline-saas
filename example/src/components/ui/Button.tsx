'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'ghost' | 'outline' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Button({
  children, className, variant = 'gold', size = 'md',
  loading, icon, iconRight, disabled, ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 select-none',
        'disabled:opacity-40 disabled:pointer-events-none',
        size === 'sm' && 'px-4 py-2.5 text-[15px] min-h-[42px]',
        size === 'md' && 'px-6 py-3 text-[16px] min-h-[46px]',
        size === 'lg' && 'px-7 py-4 text-[17px] min-h-[52px]',
        variant === 'gold' && [
          'gradient-gold text-[var(--navy)] glow-gold-sm',
          'hover:brightness-110 hover:shadow-[0_0_30px_rgba(201,168,76,0.4)]',
        ],
        variant === 'ghost' && 'bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(0,0,0,0.05)]',
        variant === 'outline' && 'glass border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-gold)] hover:text-[var(--gold-light)]',
        variant === 'dark' && 'glass-dark border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-mid)] hover:text-[var(--text-primary)]',
        className
      )}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.button>)}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon}
      {children}
      {!loading && iconRight}
    </motion.button>
  );
}
