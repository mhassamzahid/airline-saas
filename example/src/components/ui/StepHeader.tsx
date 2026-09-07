'use client';

import { motion } from 'framer-motion';

interface StepHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  emoji?: string;
  label?: string;
}

export function StepHeader({ step, totalSteps, title, subtitle, emoji, label }: StepHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      {/* Step progress row */}
      <div className="flex items-center gap-3 mb-5">
        <span className="label-caps">{label ?? `Step ${step} of ${totalSteps}`}</span>
        <div className="flex-1 h-[2px] rounded-full bg-[var(--border)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-full gradient-gold rounded-full"
          />
        </div>
        <span className="label-caps">{Math.round((step / totalSteps) * 100)}%</span>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <h2 className="text-[1.85rem] sm:text-[2.3rem] font-bold leading-tight tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "'Playfair Display Variable', 'Playfair Display', Georgia, serif" }}>
          {emoji && <span className="mr-3">{emoji}</span>}
          {title}
        </h2>
        {subtitle && (
          <p className="text-[15px] sm:text-[16px] text-[var(--text-secondary)] leading-relaxed max-w-2xl" style={{ fontFamily: "'Inter Variable', 'Inter', system-ui, sans-serif" }}>
            {subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
}
