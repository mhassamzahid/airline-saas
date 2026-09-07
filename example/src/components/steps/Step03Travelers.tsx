'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { usePackageStore } from '@/store/usePackageStore';
import { StepHeader } from '@/components/ui/StepHeader';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface CounterProps {
  label: string;
  sub: string;
  value: number;
  min?: number;
  onChange: (v: number) => void;
}

function Counter({ label, sub, value, min = 0, onChange }: CounterProps) {
  return (
    <div className="flex items-center justify-between py-5 border-b border-[var(--border)] last:border-0">
      <div>
        <p className="text-[16px] font-semibold text-[var(--text-primary)]">{label}</p>
        <p className="text-[14px] text-[var(--text-muted)] mt-0.5">{sub}</p>
      </div>
      <div className="flex items-center gap-5">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className={cn(
            'w-10 h-10 rounded-full border flex items-center justify-center transition-colors duration-150',
            value <= min
              ? 'border-[var(--border)] text-[var(--text-muted)] opacity-30 cursor-not-allowed'
              : 'border-[var(--border-mid)] text-[var(--text-primary)] hover:border-[var(--border-gold)] hover:text-[var(--gold-light)] active:scale-95'
          )}
          style={{ transition: 'border-color 0.15s, color 0.15s, transform 0.1s' }}
        >
          <Minus className="w-4 h-4" />
        </button>

        <motion.span
          key={value}
          initial={{ scale: 1.35, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          className="text-[1.6rem] font-bold text-[var(--text-primary)] w-9 text-center tabular-nums"
        >
          {value}
        </motion.span>

        <button
          onClick={() => onChange(value + 1)}
          className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-[var(--navy)] hover:brightness-110 active:scale-95"
          style={{ transition: 'filter 0.15s, transform 0.1s' }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function Step03Travelers() {
  const { travelers, setTravelers, nextStep, prevStep } = usePackageStore();

  const total = travelers.males + travelers.females + travelers.children + travelers.infants;

  return (
    <div className="space-y-7">
      <StepHeader
        step={3}
        totalSteps={10}
        title="Who's traveling?"
        subtitle="Tell us how many people — rooms, activities, and pricing all depend on your group size."
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="glass rounded-2xl px-6 py-2"
      >
        <div className="flex items-center justify-between py-4 border-b border-[var(--border)]">
          <p className="font-semibold text-[var(--text-primary)]">Total travelers</p>
          <motion.div
            key={total}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            className="glass-gold rounded-full px-3.5 py-1 text-[17px] font-bold text-[var(--gold)]"
          >
            {total} {total === 1 ? 'person' : 'people'}
          </motion.div>
        </div>
        <Counter label="Males"    sub="All ages"   value={travelers.males}    min={0} onChange={(v) => setTravelers({ ...travelers, males: v })} />
        <Counter label="Females"  sub="All ages"   value={travelers.females}  min={0} onChange={(v) => setTravelers({ ...travelers, females: v })} />
        <Counter label="Children" sub="Ages 2–11"  value={travelers.children}         onChange={(v) => setTravelers({ ...travelers, children: v })} />
        <Counter label="Infants"  sub="Under 2"    value={travelers.infants}          onChange={(v) => setTravelers({ ...travelers, infants: v })} />
      </motion.div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} size="md" disabled={total < 1}>Continue →</Button>
      </div>
    </div>
  );
}
