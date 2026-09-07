'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Check, ChevronRight, Info } from 'lucide-react';
import { usePackageStore } from '@/store/usePackageStore';
import { HOTELS_BY_DESTINATION } from '@/data/destinations';
import type { Hotel } from '@/types';
import { StepHeader } from '@/components/ui/StepHeader';
import { Button } from '@/components/ui/Button';
import { formatPKR } from '@/lib/utils';
import { cn } from '@/lib/utils';

// ─── Preference data ──────────────────────────────────────────────────────────

const LOCATIONS = [
  {
    id: 'centre',
    label: 'City Centre',
    desc: 'Walking distance to restaurants, shops, and transport hubs. Best for independent explorers.',
    icon: '🏙️',
    best: 'Dubai, Istanbul, KL, Bangkok',
  },
  {
    id: 'attractions',
    label: 'Near main attractions',
    desc: 'Closest to the sights you came to see — less commuting, more time at the good stuff.',
    icon: '🗺️',
    best: 'Cappadocia, Bali, Hunza, Skardu',
  },
  {
    id: 'beach',
    label: 'Beachfront or waterfront',
    desc: 'Wake up to sea views. Pool and beach access right from the hotel.',
    icon: '🏖️',
    best: 'Maldives, Bali, Antalya, Pattaya',
  },
  {
    id: 'quiet',
    label: 'Quiet & residential',
    desc: 'Away from tourist crowds. More authentic neighbourhood, peaceful environment.',
    icon: '🌿',
    best: 'Naran, Swat, Langkawi, Chiang Mai',
  },
];

const COMFORT_LEVELS = [
  {
    id: 'basic',
    label: 'Clean & simple',
    sublabel: '2–3 star',
    desc: 'Everything you need and nothing you don\'t. Clean rooms, comfortable beds, decent breakfast. You\'ll spend most of your time outside anyway.',
    icon: '🛏️',
  },
  {
    id: 'comfortable',
    label: 'Comfortable',
    sublabel: '4 star',
    desc: 'Good air conditioning, a proper bathroom, a pool, and reliable service. The sweet spot for most travelers.',
    icon: '⭐',
    popular: true,
  },
  {
    id: 'premium',
    label: 'Premium',
    sublabel: '5 star',
    desc: 'Spacious rooms, multiple restaurants, spa, gym, attentive service. Worth it if you want to relax as much as explore.',
    icon: '🌟',
  },
  {
    id: 'luxury',
    label: 'Luxury',
    sublabel: '5 star deluxe',
    desc: 'The hotel is part of the experience — butler service, private pools, signature dining, concierge for everything.',
    icon: '👑',
  },
];

const ROOM_TYPES = [
  { id: 'single', label: 'Single',       sub: '1 person',            icon: '🛏️' },
  { id: 'double', label: 'Double / Twin',sub: '2 people',            icon: '🛏️🛏️', popular: true },
  { id: 'triple', label: 'Triple',       sub: '3 people',            icon: '👪' },
  { id: 'quad',   label: 'Quad / Family',sub: '4 people',            icon: '👨‍👩‍👧‍👦' },
  { id: 'suite',  label: 'Suite',        sub: 'Extra space & luxury', icon: '🏰' },
];

const MEALS = [
  { id: 'room_only',  label: 'Room only',       desc: 'Eat out and explore local food freely.' },
  { id: 'breakfast',  label: 'Breakfast included', desc: 'Start each day sorted — explore meals on your own.', popular: true },
  { id: 'half_board', label: 'Half board',       desc: 'Breakfast + dinner. Convenient for long days out.' },
  { id: 'all',        label: 'All inclusive',    desc: 'Everything covered. Great for resorts and beach hotels.' },
];

// ─── Component ────────────────────────────────────────────────────────────────

type HotelPhase = 'preferences' | 'results';

export function Step07Hotels() {
  const {
    destination,
    comfortLevel, setComfortLevel,
    roomType, setRoomType,
    hotelLocation, setHotelLocation,
    mealPlanPreference, setMealPlanPreference,
    selectedHotel, setSelectedHotel,
    nextStep, prevStep,
  } = usePackageStore();

  const [phase, setPhase] = useState<HotelPhase>('preferences');

  const allHotels: Hotel[] = destination && HOTELS_BY_DESTINATION[destination]
    ? HOTELS_BY_DESTINATION[destination]
    : Object.values(HOTELS_BY_DESTINATION).flat().slice(0, 6);

  const canShowResults = !!comfortLevel && !!roomType;

  return (
    <div className="space-y-7">
      <StepHeader
        step={7}
        totalSteps={10}
        title={phase === 'preferences' ? 'What matters most to you?' : 'Your matched hotels'}
        subtitle={
          phase === 'preferences'
            ? 'Answer a few questions — we\'ll show you hotels that fit, so you don\'t have to wade through options you\'d never choose.'
            : 'Based on your preferences, here are the best matches. Tap one to select it.'
        }
      />

      <AnimatePresence mode="wait">
        {phase === 'preferences' ? (
          <motion.div
            key="prefs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Location preference */}
            <div>
              <p className="label-caps mb-3">Where would you prefer to be based?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LOCATIONS.map((loc) => {
                  const isSelected = hotelLocation === loc.id;
                  return (
                    <button
                      key={loc.id}
                      onClick={() => setHotelLocation(loc.id as any)}
                      className={cn(
                        'p-4 rounded-2xl text-left border flex items-start gap-3.5 transition-colors duration-150',
                        isSelected ? 'card-selected' : 'glass border-[var(--border)] hover:border-[var(--border-gold)]'
                      )}
                    >
                      <span className="text-2xl shrink-0 mt-0.5">{loc.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[var(--text-primary)] text-[16px]">{loc.label}</p>
                        <p className="text-[16px] text-[var(--text-secondary)] mt-1 leading-relaxed">{loc.desc}</p>
                        <p className="text-[13px] text-[var(--text-muted)] mt-1.5">
                          Good for: {loc.best}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-[var(--navy)]" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comfort level */}
            <div>
              <p className="label-caps mb-3">How comfortable do you want the hotel to be?</p>
              <div className="space-y-2.5">
                {COMFORT_LEVELS.map((c) => {
                  const isSelected = comfortLevel === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setComfortLevel(c.id as any)}
                      className={cn(
                        'w-full p-4 rounded-xl text-left border flex items-start gap-4 transition-colors duration-150',
                        isSelected ? 'card-selected' : 'glass border-[var(--border)] hover:border-[var(--border-gold)]'
                      )}
                    >
                      <span className="text-2xl shrink-0 mt-0.5">{c.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[var(--text-primary)] text-[16px]">{c.label}</p>
                          <span className="text-[12px] text-[var(--text-muted)] glass px-2 py-0.5 rounded-full border border-[var(--border)]">{c.sublabel}</span>
                          {c.popular && (
                            <span className="text-[12px] text-[var(--gold)] glass-gold px-2 py-0.5 rounded-full border border-[var(--border-gold)]">Popular</span>
                          )}
                        </div>
                        <p className="text-[16px] text-[var(--text-secondary)] mt-1 leading-relaxed">{c.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full gradient-gold flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 text-[var(--navy)]" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Room type */}
            <div>
              <p className="label-caps mb-3">Room type</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {ROOM_TYPES.map((r) => {
                  const isSelected = roomType === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setRoomType(r.id as any)}
                      className={cn(
                        'p-3.5 rounded-xl text-left border transition-colors duration-150 relative',
                        isSelected ? 'card-selected' : 'glass border-[var(--border)] hover:border-[var(--border-gold)]'
                      )}
                    >
                      {r.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] gradient-gold text-[var(--navy)] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                          Most common
                        </span>
                      )}
                      <span className="text-xl block mb-2">{r.icon}</span>
                      <p className="font-semibold text-[var(--text-primary)] text-[16px]">{r.label}</p>
                      <p className="text-[17px] text-[var(--text-muted)] mt-0.5">{r.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Meal plan */}
            <div>
              <p className="label-caps mb-3">Meal preference</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MEALS.map((m) => {
                  const isSelected = mealPlanPreference === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setMealPlanPreference(m.id)}
                      className={cn(
                        'p-3.5 rounded-xl text-left border flex items-start gap-3 transition-colors duration-150',
                        isSelected ? 'card-selected' : 'glass border-[var(--border)] hover:border-[var(--border-gold)]'
                      )}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[var(--text-primary)] text-[17px]">{m.label}</p>
                          {m.popular && (
                            <span className="text-[12px] text-[var(--gold)] glass-gold px-2 py-0.5 rounded-full border border-[var(--border-gold)]">Popular</span>
                          )}
                        </div>
                        <p className="text-[16px] text-[var(--text-muted)] mt-0.5">{m.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full gradient-gold flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-[var(--navy)]" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={prevStep}>Back</Button>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={nextStep}>Skip hotel</Button>
                <Button
                  onClick={() => setPhase('results')}
                  size="md"
                  disabled={!canShowResults}
                  iconRight={<ChevronRight className="w-4 h-4" />}
                >
                  Show matched hotels
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Preference summary */}
            <div className="glass-gold rounded-xl p-4 flex flex-wrap gap-3">
              {[
                comfortLevel && { emoji: '🏨', value: COMFORT_LEVELS.find((c) => c.id === comfortLevel)?.label },
                roomType && { emoji: '🛏️', value: ROOM_TYPES.find((r) => r.id === roomType)?.label },
                hotelLocation && { emoji: '📍', value: LOCATIONS.find((l) => l.id === hotelLocation)?.label },
                mealPlanPreference && { emoji: '🍽️', value: MEALS.find((m) => m.id === mealPlanPreference)?.label },
              ].filter(Boolean).map((item: any) => (
                <div key={item.emoji} className="flex items-center gap-1.5 text-[16px]">
                  <span>{item.emoji}</span>
                  <span className="text-[var(--gold-light)] font-medium">{item.value}</span>
                </div>
              ))}
              <button
                onClick={() => setPhase('preferences')}
                className="ml-auto text-[16px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors underline underline-offset-2"
              >
                Edit preferences
              </button>
            </div>

            {/* Hotel cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allHotels.map((hotel, i) => {
                const isSelected = selectedHotel?.id === hotel.id;
                return (
                  <motion.div
                    key={hotel.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <button
                      onClick={() => setSelectedHotel(isSelected ? null : hotel)}
                      className={cn(
                        'hover-card relative text-left rounded-2xl overflow-hidden w-full shadow-card',
                        isSelected ? 'ring-2 ring-[var(--gold)] ring-offset-1 ring-offset-[var(--bg)]' : ''
                      )}
                    >
                      <div className="relative overflow-hidden" style={{ height: '190px' }}>
                        <Image src={hotel.image} alt={hotel.name} fill sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover" loading="lazy" quality={70} />
                        <div className="absolute inset-0 overlay-darker" />

                        {isSelected && (
                          <div className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full gradient-gold flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-[var(--navy)]" strokeWidth={3} />
                          </div>
                        )}

                        {/* Star rating */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-center gap-0.5 mb-1">
                            {Array.from({ length: Math.min(hotel.stars, 5) }).map((_, idx) => (
                              <Star key={idx} className="w-3 h-3 fill-[var(--gold)] text-[var(--gold)]" />
                            ))}
                          </div>
                          <h3 className="text-[1.05rem] font-bold text-white leading-snug">{hotel.name}</h3>
                          <div className="flex items-center gap-1 text-[16px] text-white/50 mt-0.5">
                            <MapPin className="w-3 h-3" />{hotel.location}
                          </div>
                        </div>
                      </div>

                      <div className={cn('p-4', isSelected ? 'bg-[rgba(201,168,76,0.08)]' : 'bg-[var(--navy-card)]')}>
                        {/* Amenities */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {hotel.amenities.slice(0, 3).map((a) => (
                            <span key={a} className="text-[17px] px-2 py-0.5 rounded-full glass border border-[var(--border)] text-[var(--text-muted)]">{a}</span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[1.1rem] font-bold text-[var(--gold-light)]">{formatPKR(hotel.pricePerNight)}</span>
                            <span className="text-[16px] text-[var(--text-muted)] ml-1">/ night</span>
                          </div>
                          <span className="text-[17px] glass-gold rounded-full px-2.5 py-1 text-[var(--gold)] border border-[var(--border-gold)]">
                            {hotel.mealPlan}
                          </span>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => setPhase('preferences')}>
                Back to preferences
              </Button>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={nextStep}>Skip</Button>
                <Button onClick={nextStep} size="md" disabled={!selectedHotel}>
                  Continue →
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
