'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { usePackageStore } from '@/store/usePackageStore';
import { BudgetTier } from '@/types';
import { StepHeader } from '@/components/ui/StepHeader';
import { Button } from '@/components/ui/Button';
import { formatPKR } from '@/lib/utils';
import { cn } from '@/lib/utils';

const TIERS: {
  id: BudgetTier;
  label: string;
  badge: string;
  amount: number;
  accent: string;
  image: string;
  features: string[];
}[] = [
  { id: 'budget',   label: 'Budget',       badge: 'Smart Choice',   amount: 80000,   accent: '#6B7280', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600&q=70', features: ['Economy class', '3-star hotels', 'Group transport', 'Shared tours'] },
  { id: 'standard', label: 'Standard',     badge: 'Most Popular',   amount: 150000,  accent: '#3B82F6', image: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&q=70', features: ['Economy / PE', '4-star hotels', 'Private transport', 'Guided tours'] },
  { id: 'premium',  label: 'Premium',      badge: 'Recommended',    amount: 280000,  accent: '#8B5CF6', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=70', features: ['Premium Economy', '5-star hotels', 'Private SUV', 'VIP activities'] },
  { id: 'luxury',   label: 'Luxury',       badge: 'First Class',    amount: 500000,  accent: '#C9A84C', image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=70', features: ['Business class', 'Luxury resorts', 'Chauffeur', 'Private tours'] },
  { id: 'ultra',    label: 'Ultra Luxury', badge: 'The Pinnacle',   amount: 1000000, accent: '#E8C96A', image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=70', features: ['First class', 'Palace hotels', 'Concierge', 'Bespoke everything'] },
];

export function Step05Budget() {
  const { budgetTier, setBudgetTier, nextStep, prevStep, estimatedPrice } = usePackageStore();

  return (
    <div className="space-y-7">
      <StepHeader step={5} totalSteps={10} title="Set your budget" subtitle="Choose your comfort level. We'll build the best possible experience within your range." />

      {/* Tier cards — CSS hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {TIERS.map((tier, i) => {
          const isSelected = budgetTier === tier.id;
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => setBudgetTier(tier.id)}
                className={cn(
                  'hover-card relative text-left rounded-2xl overflow-hidden w-full shadow-card',
                  isSelected ? 'ring-2 ring-offset-1 ring-offset-[var(--bg)]' : ''
                )}
                style={isSelected ? { '--tw-ring-color': tier.accent } as React.CSSProperties : undefined}
              >
                {/* Image */}
                <div className="relative" style={{ height: '130px' }}>
                  <Image src={tier.image} alt={tier.label} fill sizes="(max-width: 640px) 50vw, 20vw" className="object-cover" loading="lazy" quality={65} />
                  <div className="absolute inset-0 overlay-darker" />
                  <div className="absolute inset-0 opacity-35" style={{ background: `linear-gradient(to top, ${tier.accent}40, transparent)` }} />

                  <div
                    className="absolute top-3 left-3 text-[12px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${tier.accent}25`, color: tier.accent, border: `1px solid ${tier.accent}40` }}
                  >
                    {tier.badge}
                  </div>

                  {isSelected && (
                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: tier.accent }}>
                      <Check className="w-3.5 h-3.5 text-[var(--navy)]" strokeWidth={3} />
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-bold text-[16px] leading-none">{tier.label}</p>
                    <p className="text-white/55 text-[14px] mt-0.5">{formatPKR(tier.amount)}+</p>
                  </div>
                </div>

                {/* Features */}
                <div className={cn('p-3', isSelected ? 'bg-[rgba(201,168,76,0.08)]' : 'bg-[var(--navy-card)]')}>
                  <ul className="space-y-1.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-[14px] text-[var(--text-secondary)]">
                        <span className="shrink-0 mt-px" style={{ color: tier.accent }}>·</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Live estimate */}
      <AnimatePresence>
        {budgetTier && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-4 p-4 glass-gold rounded-2xl">
            <div className="w-10 h-10 rounded-xl glass-gold flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[var(--gold)]" />
            </div>
            <div className="flex-1">
              <p className="text-[16px] text-[var(--text-muted)]">Running total estimate</p>
              <motion.p key={estimatedPrice} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-[1.35rem] font-bold text-[var(--gold-light)]">{formatPKR(estimatedPrice)}</motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={prevStep}>Back</Button>
        <Button onClick={nextStep} size="md" disabled={!budgetTier}>Continue →</Button>
      </div>
    </div>
  );
}
