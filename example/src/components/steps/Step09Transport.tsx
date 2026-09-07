'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { usePackageStore } from '@/store/usePackageStore';
import { TransportType } from '@/types';
import { StepHeader } from '@/components/ui/StepHeader';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const TRANSPORT = [
  { id: 'shared'  as TransportType, emoji: '🚌', name: 'Shared Transport', sub: 'Group buses & vans',    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=70', accent: '#6B7280', badge: 'Affordable', extra: 'Included', perks: ['Air-conditioned', 'Fixed schedule', 'Group transfers'] },
  { id: 'private' as TransportType, emoji: '🚐', name: 'Private Vehicle',   sub: 'Your schedule',        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=70', accent: '#3B82F6', badge: 'Popular',    extra: '+15%',    perks: ['Dedicated driver', 'Door-to-door', 'Flexible timing'] },
  { id: 'luxury'  as TransportType, emoji: '🚗', name: 'Luxury Vehicle',   sub: 'Land Cruiser · Merc',   image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=70', accent: '#C9A84C', badge: 'Premium',    extra: '+35%',    perks: ['Premium SUV', 'Chauffeur', 'Airport meet & greet'] },
];

const SPECIALS = [
  { id: 'visa',        emoji: '📋', label: 'Visa Assistance' },
  { id: 'elderly',     emoji: '👴', label: 'Elderly Care' },
  { id: 'wheelchair',  emoji: '♿', label: 'Wheelchair Support' },
  { id: 'honeymoon',   emoji: '💕', label: 'Honeymoon Package' },
  { id: 'anniversary', emoji: '🎊', label: 'Anniversary' },
  { id: 'family',      emoji: '👨‍👩‍👧', label: 'Family Friendly' },
  { id: 'halal',       emoji: '🍽️', label: 'Halal Food Only' },
  { id: 'photographer',emoji: '📸', label: 'Trip Photographer' },
];

export function Step09Transport() {
  const { transportType, specialRequirements, setTransportType, toggleSpecialRequirement, nextStep, prevStep } = usePackageStore();

  return (
    <div className="space-y-8">
      <StepHeader step={9} totalSteps={10} title="Transport & extras" subtitle="Choose how you'll get around, and let us know any special needs." />

      {/* Transport — CSS hover */}
      <div>
        <p className="label-caps mb-4">Transport preference</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TRANSPORT.map((opt, i) => {
            const isSelected = transportType === opt.id;
            return (
              <motion.div key={opt.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <button
                  onClick={() => setTransportType(opt.id)}
                  className={cn(
                    'hover-card relative text-left rounded-2xl overflow-hidden w-full shadow-card',
                    isSelected ? 'ring-2 ring-offset-1 ring-offset-[var(--bg)]' : ''
                  )}
                  style={isSelected ? { '--tw-ring-color': opt.accent } as React.CSSProperties : undefined}
                >
                  <div className="relative overflow-hidden" style={{ height: '145px' }}>
                    <Image src={opt.image} alt={opt.name} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" loading="lazy" quality={68} />
                    <div className="absolute inset-0 overlay-darker" />
                    <div className="absolute inset-0 opacity-22" style={{ background: `linear-gradient(to top right, ${opt.accent}40, transparent 60%)` }} />

                    <div className="absolute top-3 left-3 text-[12px] font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background: `${opt.accent}25`, color: opt.accent, border: `1px solid ${opt.accent}40` }}>
                      {opt.badge}
                    </div>

                    {isSelected && (
                      <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: opt.accent }}>
                        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      </div>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[1rem] font-bold text-white">{opt.emoji} {opt.name}</p>
                          <p className="text-[13px] text-white/50">{opt.sub}</p>
                        </div>
                        <span className="text-[12px] font-bold px-2.5 py-1 rounded-lg" style={{ background: `${opt.accent}25`, color: opt.accent }}>{opt.extra}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-[var(--navy-card)]">
                    <ul className="space-y-1.5">
                      {opt.perks.map((p) => (
                        <li key={p} className="flex items-start gap-2 text-[16px] text-[var(--text-secondary)]">
                          <Check className="w-3 h-3 shrink-0 mt-0.5" style={{ color: opt.accent }} strokeWidth={2.5} />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Special requirements */}
      <div>
        <p className="label-caps mb-1.5">Special requirements</p>
        <p className="text-[17px] text-[var(--text-muted)] mb-4">Optional — select all that apply.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SPECIALS.map((req, i) => {
            const active = specialRequirements.includes(req.id);
            return (
              <motion.div key={req.id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
                <button
                  onClick={() => toggleSpecialRequirement(req.id)}
                  className={cn(
                    'relative p-3 rounded-xl text-left w-full border transition-colors duration-150',
                    active ? 'card-selected' : 'glass border-[var(--border)] hover:border-[var(--border-gold)]'
                  )}
                >
                  {active && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full gradient-gold flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-[var(--navy)]" strokeWidth={3} />
                    </div>
                  )}
                  <span className="text-[1.4rem] block mb-1.5">{req.emoji}</span>
                  <p className="text-[16px] font-semibold text-[var(--text-primary)] leading-tight">{req.label}</p>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={prevStep}>Back</Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={nextStep}>Skip</Button>
          <Button onClick={nextStep} size="md">Build My Package →</Button>
        </div>
      </div>
    </div>
  );
}
