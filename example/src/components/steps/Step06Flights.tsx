'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Plane } from 'lucide-react';
import { usePackageStore } from '@/store/usePackageStore';
import { FlightClass } from '@/types';
import { StepHeader } from '@/components/ui/StepHeader';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const CLASSES: {
  id: FlightClass;
  name: string;
  tagline: string;
  seat: string;
  pitch: string;
  image: string;
  accent: string;
  multiplier: string;
  perks: string[];
  airlines: string;
  popular?: boolean;
}[] = [
  { id: 'economy',         name: 'Economy',         tagline: 'Get there affordably',   seat: 'Standard seat', pitch: '30–32" pitch',       image: 'https://images.unsplash.com/photo-1483450388369-9ed95738483c?w=600&q=70', accent: '#6B7280', multiplier: '1×',   perks: ['Carry-on + checked bag', 'In-flight entertainment', 'Meal on long-haul'],                               airlines: 'PIA · FlyDubai · Air Arabia' },
  { id: 'premium_economy', name: 'Premium Economy', tagline: 'More comfort, less cost', seat: 'Wider seat',     pitch: '38" pitch',          image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600&q=70', accent: '#3B82F6', multiplier: '1.4×', perks: ['Priority boarding', '2× checked bags', 'Premium meals & drinks', 'Extra legroom'],                     airlines: 'Emirates · Qatar Airways' },
  { id: 'business',        name: 'Business',        tagline: 'Arrive feeling ready',    seat: 'Lie-flat',       pitch: '180° flat bed',      image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=600&q=70', accent: '#8B5CF6', multiplier: '2.2×', perks: ['Lounge access', 'Gourmet dining', 'Chauffeur service', 'Priority everywhere', 'Amenity kit'], popular: true, airlines: 'Emirates · Qatar Qsuite' },
  { id: 'first',           name: 'First Class',     tagline: 'The journey IS the trip', seat: 'Private suite',  pitch: 'Closing door suite', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=70', accent: '#C9A84C', multiplier: '3.5×', perks: ['Private suite', 'On-board shower', 'Personal butler', 'Michelin-star dining'],                          airlines: 'Emirates First · Etihad' },
];

export function Step06Flights() {
  const { flightClass, setFlightClass, nextStep, prevStep } = usePackageStore();

  return (
    <div className="space-y-7">
      <StepHeader step={6} totalSteps={10} title="Choose your cabin" subtitle="How you fly sets the tone for the whole experience. Pick the class that feels right." />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CLASSES.map((cls, i) => {
          const isSelected = flightClass === cls.id;
          return (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => setFlightClass(cls.id)}
                className={cn(
                  'hover-card relative text-left rounded-2xl overflow-hidden w-full shadow-card',
                  isSelected ? 'ring-2 ring-offset-1 ring-offset-[var(--bg)]' : ''
                )}
                style={isSelected ? { '--tw-ring-color': cls.accent } as React.CSSProperties : undefined}
              >
                {/* Hero image */}
                <div className="relative overflow-hidden" style={{ height: '170px' }}>
                  <Image src={cls.image} alt={cls.name} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" loading="lazy" quality={70} />
                  <div className="absolute inset-0 overlay-darker" />
                  <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(to top right, ${cls.accent}40, transparent 60%)` }} />

                  {cls.popular && (
                    <div className="absolute top-3.5 left-3.5 text-[17px] font-bold px-3 py-1 rounded-full"
                      style={{ background: `${cls.accent}30`, color: cls.accent, border: `1px solid ${cls.accent}50` }}>
                      Most Popular
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: cls.accent }}>
                      <Check className="w-4 h-4 text-[var(--navy)]" strokeWidth={3} />
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[17px] font-semibold uppercase tracking-widest mb-1" style={{ color: `${cls.accent}CC` }}>
                          {cls.seat} · {cls.pitch}
                        </p>
                        <h3 className="text-[1.35rem] font-bold text-white leading-tight">{cls.name}</h3>
                        <p className="text-[16px] text-white/50 mt-0.5">{cls.tagline}</p>
                      </div>
                      <div className="text-[12px] font-bold px-3 py-1.5 rounded-xl shrink-0 ml-3"
                        style={{ background: `${cls.accent}20`, color: cls.accent, border: `1px solid ${cls.accent}40` }}>
                        {cls.multiplier}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Perks */}
                <div className="p-4 bg-[var(--navy-card)]">
                  <ul className="space-y-2">
                    {cls.perks.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-[17px] text-[var(--text-secondary)]">
                        <Check className="w-3.5 h-3.5 shrink-0" style={{ color: cls.accent }} strokeWidth={2.5} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center gap-1.5 text-[17px] text-[var(--text-muted)]">
                    <Plane className="w-3 h-3" />
                    {cls.airlines}
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={prevStep}>Back</Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={nextStep}>Skip</Button>
          <Button onClick={nextStep} size="md" disabled={!flightClass}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}
