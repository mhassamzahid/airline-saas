'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Check, Search } from 'lucide-react';
import { usePackageStore } from '@/store/usePackageStore';
import { INTERNATIONAL_DESTINATIONS, PAKISTAN_DESTINATIONS } from '@/data/destinations';
import { StepHeader } from '@/components/ui/StepHeader';
import { Button } from '@/components/ui/Button';
import { formatPKR } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function Step02Destination() {
  const { travelType, destination, setDestination, nextStep, prevStep } = usePackageStore();
  const [query, setQuery] = useState('');

  const all = travelType === 'pakistan' ? PAKISTAN_DESTINATIONS : INTERNATIONAL_DESTINATIONS;
  const destinations = query.trim()
    ? all.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()))
    : all;

  function handleSelect(id: string) {
    setDestination(id);
  }

  const selectedDest = destination ? all.find((d) => d.id === destination) : null;

  return (
    <div className="space-y-7">
      <StepHeader
        step={2}
        totalSteps={10}
        title="Choose your destination"
        subtitle="Tap a place that sparks excitement — we'll craft the perfect itinerary around it."
      />

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search destinations…"
          className="w-full glass rounded-xl pl-11 pr-4 py-3 text-[17px] text-[var(--text-primary)] placeholder-[var(--text-muted)] border border-[var(--border)] focus:border-[var(--border-gold)] focus:outline-none transition-colors"
        />
      </div>

      {/* Grid — plain buttons with CSS hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {destinations.map((dest, i) => {
          const isSelected = destination === dest.id;

          return (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.24), ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => handleSelect(dest.id)}
                className={cn(
                  'hover-card relative text-left rounded-2xl overflow-hidden w-full shadow-card',
                  isSelected ? 'ring-2 ring-[var(--gold)] ring-offset-2 ring-offset-[var(--bg)]' : ''
                )}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: '210px' }}>
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover"
                    loading={i < 4 ? 'eager' : 'lazy'}
                    quality={72}
                  />
                  <div className="absolute inset-0 overlay-darker" />

                  {/* Popular */}
                  {dest.popular && (
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 glass-dark rounded-full px-3 py-1 border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      <span className="text-[17px] font-semibold text-white/80">Popular</span>
                    </div>
                  )}

                  {/* Selected check */}
                  {isSelected && (
                    <div className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full gradient-gold flex items-center justify-center shadow-lg">
                      <Check className="w-4 h-4 text-[var(--navy)]" strokeWidth={3} />
                    </div>
                  )}

                  {/* Overlay content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[17px] font-semibold text-white/50 uppercase tracking-widest mb-0.5">
                          {dest.emoji}
                        </p>
                        <h3 className="text-[1.35rem] font-bold text-white leading-tight">{dest.name}</h3>
                        <p className="text-[16px] text-white/50 italic mt-0.5">{dest.tagline}</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="text-[12px] text-white/40 mb-0.5">from</p>
                        <p className="text-[16px] font-bold text-[var(--gold-light)]">{formatPKR(dest.startingPrice)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meta strip */}
                <div className={cn(
                  'px-4 py-3 flex items-center justify-between',
                  isSelected ? 'bg-[rgba(201,168,76,0.10)]' : 'bg-[var(--navy-card)]'
                )}>
                  <div className="flex items-center gap-2 text-[16px] text-[var(--text-muted)]">
                    <span>{dest.weather}</span>
                    <span className="opacity-40">·</span>
                    <span>{dest.highlights[0]}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-[var(--gold)] text-[var(--gold)]" />
                    <span className="text-[16px] font-bold text-[var(--gold)]">{dest.rating}</span>
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}

        {destinations.length === 0 && (
          <div className="col-span-full text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-[var(--text-muted)]">No destinations match "{query}"</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={prevStep}>Back</Button>
        <AnimatePresence>
          {destination && (
            <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <Button onClick={nextStep} size="md">
                Continue with {selectedDest?.name} →
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
