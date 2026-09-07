'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, ChevronRight, Info } from 'lucide-react';
import { usePackageStore } from '@/store/usePackageStore';
import { DEPARTURE_CITIES } from '@/data/destinations';
import { StepHeader } from '@/components/ui/StepHeader';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// ─── Data ────────────────────────────────────────────────────────────────────

const DURATIONS = [
  { days: 10, label: '10 Days', note: 'Umrah only' },
  { days: 14, label: '14 Days', note: 'Most popular' },
  { days: 21, label: '21 Days', note: 'With Madinah' },
  { days: 30, label: '30 Days', note: 'Full experience' },
];

// What actually matters to pilgrims — not hotel brand names
const HARAM_ZONES = [
  {
    id: 'walking_5',
    label: 'Within 5 minutes walk',
    sublabel: 'Right next to Haram',
    desc: 'You can walk to any prayer, including Fajr at 4am, without needing transport. Ideal for elderly or those wanting maximum prayer time.',
    icon: '🕋',
    ring: 'ring-[#C9A84C]',
    accent: '#C9A84C',
    priceHint: 'Highest cost',
    image: 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=600&q=70',
    practical: ['Walk to every Salah', 'No transport needed', 'Best for elderly pilgrims', 'Haram view rooms available'],
  },
  {
    id: 'walking_15',
    label: '10–15 minutes walk',
    sublabel: 'Close & comfortable',
    desc: 'A short pleasant walk to the Haram. Most pilgrims find this ideal — close enough to walk for most prayers, easy to come and go.',
    icon: '🚶',
    ring: 'ring-emerald-400',
    accent: '#10B981',
    priceHint: 'Good value',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=70',
    practical: ['10-15 min walk each way', 'Fine for fit travelers', 'Great value for money', 'Quieter surroundings'],
  },
  {
    id: 'shuttle',
    label: 'Shuttle distance (1–2 km)',
    sublabel: 'Hotel bus available',
    desc: 'Hotel provides regular shuttle buses to Haram. You\'ll need to time prayers around the shuttle schedule, which runs every 15–30 minutes.',
    icon: '🚌',
    ring: 'ring-blue-400',
    accent: '#3B82F6',
    priceHint: 'Budget-friendly',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=70',
    practical: ['Hotel shuttle included', 'Schedule-dependent', 'More spacious rooms', 'Lower cost, more comfort'],
  },
  {
    id: 'bus',
    label: 'Bus route (2–4 km)',
    sublabel: 'Public transport nearby',
    desc: 'Use the Makkah public bus or taxi. More independent but requires planning around transport. Best for pilgrims on a strict budget.',
    icon: '🏨',
    ring: 'ring-slate-400',
    accent: '#6B7280',
    priceHint: 'Most affordable',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=70',
    practical: ['Public bus/taxi available', 'Most affordable option', 'Spacious hotel rooms', 'Good for young pilgrims'],
  },
];

const COMFORT_LEVELS = [
  {
    id: 'basic',
    label: 'Simple & clean',
    desc: 'Clean, functional rooms. Everything you need for worship — nothing more. Shared facilities may apply.',
    icon: '🙏',
    note: 'Focus: Ibadah',
  },
  {
    id: 'comfortable',
    label: 'Comfortable',
    desc: 'Good air conditioning, private bathroom, decent food. Most pilgrims choose this. Reliable and restful.',
    icon: '⭐',
    note: '4-star equivalent',
  },
  {
    id: 'premium',
    label: 'Premium',
    desc: 'Spacious rooms, multiple restaurants, excellent service. Great if you\'re bringing elderly parents or want extra comfort after long rituals.',
    icon: '🌟',
    note: '5-star hotels',
  },
  {
    id: 'luxury',
    label: 'Luxury',
    desc: 'The finest hotels with Haram views, butler service, private lounges. The entire experience is elevated.',
    icon: '👑',
    note: 'Fairmont, Hilton Towers',
  },
];

const ROOM_TYPES = [
  { id: 'single',  label: 'Single room',      sub: '1 person',               icon: '🛏️' },
  { id: 'double',  label: 'Double / Twin',     sub: '2 people sharing',       icon: '🛏️🛏️' },
  { id: 'triple',  label: 'Triple room',       sub: '3 people',               icon: '👪' },
  { id: 'quad',    label: 'Quad / Family',     sub: '4 people',               icon: '👨‍👩‍👧‍👦' },
  { id: 'suite',   label: 'Family suite',      sub: 'Large family or VIP',    icon: '🏰' },
];

type Phase = 'journey' | 'location' | 'comfort' | 'inclusions';

// ─── Component ───────────────────────────────────────────────────────────────

export function StepHajjUmrah() {
  const {
    travelType,
    departureCity, setDepartureCity,
    hotelDistanceFromHaram, setHotelDistanceFromHaram,
    comfortLevel, setComfortLevel,
    roomType, setRoomType,
    groupOrPrivate, setGroupOrPrivate,
    mealsIncluded, setMealsIncluded,
    includesMadinah, setIncludesMadinah,
    elderlyAssistance, setElderlyAssistance,
    directFlightPreferred, setDirectFlightPreferred,
    hajjUmrahDuration, setHajjUmrahDuration,
    nextStep, prevStep,
  } = usePackageStore();

  const [phase, setPhase] = useState<Phase>('journey');
  const isUmrah = travelType === 'umrah';

  const selectedZone = HARAM_ZONES.find((z) => z.id === hotelDistanceFromHaram);

  const PHASES: { id: Phase; label: string }[] = [
    { id: 'journey',    label: 'Journey' },
    { id: 'location',   label: 'Location' },
    { id: 'comfort',    label: 'Comfort' },
    { id: 'inclusions', label: 'Inclusions' },
  ];

  function canAdvanceFrom(p: Phase) {
    if (p === 'journey')    return !!departureCity;
    if (p === 'location')   return !!hotelDistanceFromHaram;
    if (p === 'comfort')    return !!comfortLevel && !!roomType;
    return true;
  }

  const PHASE_ORDER: Phase[] = ['journey', 'location', 'comfort', 'inclusions'];

  function advance() {
    const idx = PHASE_ORDER.indexOf(phase);
    if (idx < PHASE_ORDER.length - 1) {
      setPhase(PHASE_ORDER[idx + 1]);
    } else {
      nextStep();
    }
  }

  function goBack() {
    const idx = PHASE_ORDER.indexOf(phase);
    if (idx > 0) setPhase(PHASE_ORDER[idx - 1]);
    else prevStep();
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Phase header */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          {PHASES.map((p, i) => {
            const done = PHASE_ORDER.indexOf(p.id) < PHASE_ORDER.indexOf(phase);
            const active = p.id === phase;
            return (
              <div key={p.id} className="flex items-center gap-2">
                <button
                  onClick={() => done ? setPhase(p.id) : undefined}
                  className={cn(
                    'flex items-center gap-1.5 text-[16px] font-semibold transition-colors duration-200',
                    active ? 'text-[var(--gold-light)]' : done ? 'text-[var(--text-secondary)] hover:text-[var(--gold-light)] cursor-pointer' : 'text-[var(--text-muted)] cursor-default'
                  )}
                >
                  <span className={cn(
                    'w-5 h-5 rounded-full text-[16px] flex items-center justify-center font-bold',
                    active ? 'gradient-gold text-[var(--navy)]' : done ? 'bg-emerald-500 text-white' : 'bg-[var(--surface)] text-[var(--text-muted)]'
                  )}>
                    {done ? <Check className="w-3 h-3" strokeWidth={3} /> : i + 1}
                  </span>
                  <span className="hidden sm:inline">{p.label}</span>
                </button>
                {i < PHASES.length - 1 && <ChevronRight className="w-3 h-3 text-[var(--text-muted)]" />}
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {phase === 'journey'    && <JourneyPhase    {...{ isUmrah, departureCity, setDepartureCity, hajjUmrahDuration, setHajjUmrahDuration, groupOrPrivate, setGroupOrPrivate }} />}
            {phase === 'location'   && <LocationPhase   {...{ hotelDistanceFromHaram, setHotelDistanceFromHaram, selectedZone }} />}
            {phase === 'comfort'    && <ComfortPhase    {...{ comfortLevel, setComfortLevel, roomType, setRoomType }} />}
            {phase === 'inclusions' && <InclusionsPhase {...{ isUmrah, mealsIncluded, setMealsIncluded, includesMadinah, setIncludesMadinah, elderlyAssistance, setElderlyAssistance, directFlightPreferred, setDirectFlightPreferred }} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={goBack}>
          Back
        </Button>
        <Button
          onClick={advance}
          size="md"
          disabled={!canAdvanceFrom(phase)}
        >
          {phase === 'inclusions' ? 'Continue →' : 'Next →'}
        </Button>
      </div>
    </div>
  );
}

// ─── Phase 1: Journey details ─────────────────────────────────────────────────

function JourneyPhase({ isUmrah, departureCity, setDepartureCity, hajjUmrahDuration, setHajjUmrahDuration, groupOrPrivate, setGroupOrPrivate }: any) {
  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-[1.75rem] font-bold text-[var(--text-primary)] mb-1">
          {isUmrah ? 'Plan your Umrah' : 'Plan your Hajj'}
        </h2>
        <p className="text-[var(--text-secondary)] text-[17px]">
          Let's start with the basics — where you're flying from and how long you'll stay.
        </p>
      </div>

      {/* City */}
      <div>
        <p className="label-caps mb-3">Departure city</p>
        <div className="flex flex-wrap gap-2">
          {DEPARTURE_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setDepartureCity(city)}
              className={cn(
                'px-4 py-2.5 rounded-xl text-[17px] font-medium transition-colors duration-150 border',
                departureCity === city
                  ? 'gradient-gold text-[var(--navy)] border-transparent'
                  : 'glass border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-gold)]'
              )}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <p className="label-caps mb-3">How long?</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DURATIONS.map((d) => (
            <button
              key={d.days}
              onClick={() => setHajjUmrahDuration(d.days)}
              className={cn(
                'p-4 rounded-2xl text-left border transition-colors duration-150',
                hajjUmrahDuration === d.days
                  ? 'card-selected'
                  : 'glass border-[var(--border)] hover:border-[var(--border-gold)]'
              )}
            >
              <p className="text-[1.4rem] font-bold text-[var(--text-primary)]">{d.days}</p>
              <p className="text-[17px] font-semibold text-[var(--text-primary)]">days</p>
              <p className="text-[17px] text-[var(--text-muted)] mt-1">{d.note}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Group or private */}
      <div>
        <p className="label-caps mb-3">Traveling with…</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'group',   emoji: '👥', label: 'Group package',   desc: 'Join other pilgrims. More affordable, structured schedule, religious guide included.' },
            { id: 'private', emoji: '🌙', label: 'Private package', desc: 'Just your family or close friends. Flexible timing, dedicated service, full privacy.' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setGroupOrPrivate(opt.id as 'group' | 'private')}
              className={cn(
                'p-4 rounded-2xl text-left border transition-colors duration-150',
                groupOrPrivate === opt.id
                  ? 'card-selected'
                  : 'glass border-[var(--border)] hover:border-[var(--border-gold)]'
              )}
            >
              <span className="text-2xl block mb-2">{opt.emoji}</span>
              <p className="font-bold text-[var(--text-primary)] text-[16px] mb-1">{opt.label}</p>
              <p className="text-[16px] text-[var(--text-muted)] leading-relaxed">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Phase 2: Hotel location ──────────────────────────────────────────────────

function LocationPhase({ hotelDistanceFromHaram, setHotelDistanceFromHaram, selectedZone }: any) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[1.75rem] font-bold text-[var(--text-primary)] mb-1">
          How close to the Haram?
        </h2>
        <p className="text-[var(--text-secondary)] text-[17px]">
          This is the most important decision. Think about who's traveling — distance affects every single prayer time.
        </p>
      </div>

      {/* Visual proximity diagram */}
      <div className="glass rounded-2xl p-5">
        <p className="label-caps mb-4">Masjid Al-Haram — distance guide</p>
        <div className="flex items-center gap-0">
          {/* Kaaba */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-12 h-12 glass-gold rounded-xl flex items-center justify-center text-2xl shadow-card">🕋</div>
            <span className="text-[16px] text-[var(--gold)] font-semibold mt-1 text-center">Haram</span>
          </div>

          {/* Distance zones */}
          {HARAM_ZONES.map((zone, i) => {
            const isSelected = hotelDistanceFromHaram === zone.id;
            return (
              <div key={zone.id} className="flex items-center">
                {/* Connector line, gets longer with distance */}
                <div
                  className="h-[2px] transition-colors duration-200"
                  style={{
                    width: `${20 + i * 8}px`,
                    background: isSelected ? zone.accent : 'var(--border)',
                  }}
                />
                <button
                  onClick={() => setHotelDistanceFromHaram(zone.id)}
                  className={cn(
                    'flex flex-col items-center transition-all duration-200',
                    isSelected ? 'scale-110' : 'opacity-60 hover:opacity-100'
                  )}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-base shadow-card transition-all duration-200"
                    style={{
                      background: isSelected ? zone.accent : 'var(--surface)',
                      boxShadow: isSelected ? `0 0 16px ${zone.accent}40` : undefined,
                    }}
                  >
                    🏨
                  </div>
                  <span
                    className="text-[9px] font-bold mt-1 text-center leading-tight max-w-[48px]"
                    style={{ color: isSelected ? zone.accent : 'var(--text-muted)' }}
                  >
                    {zone.icon}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zone cards */}
      <div className="space-y-3">
        {HARAM_ZONES.map((zone) => {
          const isSelected = hotelDistanceFromHaram === zone.id;
          const isExpanded = expanded === zone.id;

          return (
            <div
              key={zone.id}
              className={cn(
                'rounded-2xl border overflow-hidden transition-all duration-200 cursor-pointer',
                isSelected ? 'ring-2 ring-offset-1 ring-offset-[var(--bg)]' : 'glass border-[var(--border)] hover:border-[var(--border-mid)]'
              )}
              style={isSelected ? { '--tw-ring-color': zone.accent } as React.CSSProperties : undefined}
              onClick={() => setHotelDistanceFromHaram(zone.id)}
            >
              <div className="flex items-center gap-4 p-4">
                {/* Zone image thumbnail */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                  <Image src={zone.image} alt={zone.label} fill sizes="64px" className="object-cover" loading="lazy" quality={60} />
                  <div className="absolute inset-0 overlay-dark opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">{zone.icon}</div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-[var(--text-primary)] text-[16px] leading-tight">{zone.label}</p>
                      <p className="text-[16px] font-medium mt-0.5" style={{ color: zone.accent }}>{zone.sublabel}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[13px] text-[var(--text-muted)] hidden sm:block">{zone.priceHint}</span>
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: zone.accent }}>
                          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpanded(isExpanded ? null : zone.id); }}
                          className="w-6 h-6 rounded-full glass border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                        >
                          <Info className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-[16px] text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                    {zone.desc}
                  </p>
                </div>
              </div>

              {/* Practical tips — expanded or selected */}
              <AnimatePresence>
                {(isSelected || isExpanded) && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="px-4 pb-4 pt-0 grid grid-cols-2 gap-2"
                      style={{ borderTop: `1px solid ${zone.accent}25` }}
                    >
                      {zone.practical.map((tip) => (
                        <div key={tip} className="flex items-start gap-2 text-[16px] text-[var(--text-secondary)]">
                          <Check className="w-3 h-3 shrink-0 mt-0.5" style={{ color: zone.accent }} strokeWidth={2.5} />
                          {tip}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Phase 3: Comfort & room ──────────────────────────────────────────────────

function ComfortPhase({ comfortLevel, setComfortLevel, roomType, setRoomType }: any) {
  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-[1.75rem] font-bold text-[var(--text-primary)] mb-1">
          Comfort & room type
        </h2>
        <p className="text-[var(--text-secondary)] text-[17px]">
          After long days of worship, a comfortable room matters. Tell us what you need — we'll match the right hotel.
        </p>
      </div>

      {/* Comfort level */}
      <div>
        <p className="label-caps mb-3">How comfortable do you want your stay?</p>
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
                    <span className="text-[12px] text-[var(--text-muted)] glass px-2 py-0.5 rounded-full border border-[var(--border)]">{c.note}</span>
                  </div>
                  <p className="text-[17px] text-[var(--text-secondary)] mt-1 leading-relaxed">{c.desc}</p>
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

      {/* Room type */}
      <div>
        <p className="label-caps mb-3">Room type</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {ROOM_TYPES.map((r) => {
            const isSelected = roomType === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRoomType(r.id as any)}
                className={cn(
                  'p-3.5 rounded-xl text-left border transition-colors duration-150',
                  isSelected ? 'card-selected' : 'glass border-[var(--border)] hover:border-[var(--border-gold)]'
                )}
              >
                <span className="text-xl block mb-2">{r.icon}</span>
                <p className="font-semibold text-[var(--text-primary)] text-[17px]">{r.label}</p>
                <p className="text-[17px] text-[var(--text-muted)] mt-0.5">{r.sub}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Phase 4: Inclusions & special needs ─────────────────────────────────────

function InclusionsPhase({ isUmrah, mealsIncluded, setMealsIncluded, includesMadinah, setIncludesMadinah, elderlyAssistance, setElderlyAssistance, directFlightPreferred, setDirectFlightPreferred }: any) {
  const TOGGLES = [
    {
      id: 'meals',
      emoji: '🍽️',
      label: 'Meals included',
      desc: 'Breakfast, lunch & dinner provided by the hotel. Removes the stress of finding halal food in an unfamiliar city.',
      value: mealsIncluded,
      set: setMealsIncluded,
      recommended: true,
    },
    {
      id: 'madinah',
      emoji: '🕌',
      label: isUmrah ? 'Include Madinah visit' : 'Extended Madinah stay',
      desc: 'Visit Masjid-e-Nabawi, the Prophet\'s Mosque ﷺ. Most pilgrims consider this the most spiritually rewarding part.',
      value: includesMadinah,
      set: setIncludesMadinah,
      recommended: true,
    },
    {
      id: 'direct',
      emoji: '✈️',
      label: 'Direct flights only',
      desc: 'No connecting flights or layovers. Especially important for elderly travelers or those with young children.',
      value: directFlightPreferred,
      set: setDirectFlightPreferred,
    },
    {
      id: 'elderly',
      emoji: '🤲',
      label: 'Elderly or mobility assistance',
      desc: 'Wheelchair arrangements, shorter walking distances, ground-floor rooms, and dedicated support during rituals.',
      value: elderlyAssistance,
      set: setElderlyAssistance,
    },
  ];

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-[1.75rem] font-bold text-[var(--text-primary)] mb-1">
          What's included?
        </h2>
        <p className="text-[var(--text-secondary)] text-[17px]">
          Customize inclusions for your comfort. Recommended options are pre-selected — adjust as needed.
        </p>
      </div>

      <div className="space-y-3">
        {TOGGLES.map((item) => (
          <button
            key={item.id}
            onClick={() => item.set(!item.value)}
            className={cn(
              'w-full p-4 rounded-xl text-left border flex items-start gap-4 transition-colors duration-150',
              item.value ? 'card-selected' : 'glass border-[var(--border)] hover:border-[var(--border-gold)]'
            )}
          >
            <span className="text-2xl shrink-0">{item.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold text-[var(--text-primary)] text-[16px]">{item.label}</p>
                {item.recommended && (
                  <span className="text-[12px] text-[var(--gold)] glass-gold px-2 py-0.5 rounded-full border border-[var(--border-gold)]">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-[16px] text-[var(--text-secondary)] mt-1 leading-relaxed">{item.desc}</p>
            </div>
            {/* Toggle pill */}
            <div
              className={cn(
                'relative w-11 h-6 rounded-full shrink-0 mt-0.5 transition-colors duration-200',
                item.value ? 'gradient-gold' : 'bg-[var(--surface-hover)]'
              )}
            >
              <div
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                style={{ transform: `translateX(${item.value ? 20 : 2}px)` }}
              />
            </div>
          </button>
        ))}
      </div>

      {/* What's always included */}
      <div className="glass-gold rounded-xl p-4">
        <p className="text-[17px] font-bold text-[var(--gold)] mb-3">
          📖 Always included in every package
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
          {[
            'Licensed religious scholar guide',
            'Pre-departure orientation session',
            'Miqat rituals assistance',
            'Tawaf & Sa\'i step-by-step guidance',
            isUmrah ? 'Flexible Umrah schedule' : 'All 5 Hajj days covered',
            'Ziyarat tours (historic sites)',
            'Group WhatsApp for real-time help',
            '24/7 on-ground support team',
          ].map((item) => (
            <div key={item} className="flex items-start gap-2 text-[16px] text-[var(--text-secondary)]">
              <Check className="w-3 h-3 shrink-0 mt-0.5 text-[var(--gold)]" strokeWidth={2.5} />
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
