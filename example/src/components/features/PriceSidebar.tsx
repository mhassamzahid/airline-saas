'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { usePackageStore } from '@/store/usePackageStore';
import { formatPKR } from '@/lib/utils';
import { INTERNATIONAL_DESTINATIONS, PAKISTAN_DESTINATIONS } from '@/data/destinations';

const DEST_MAP = [...INTERNATIONAL_DESTINATIONS, ...PAKISTAN_DESTINATIONS].reduce(
  (acc, d) => { acc[d.id] = d; return acc; },
  {} as Record<string, { name: string; emoji: string; image: string; tagline: string }>
);

const WA_ICON = (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function PriceSidebar() {
  const {
    estimatedPrice, packageScore, travelType,
    destination, travelers, budgetTier, flightClass,
    selectedHotel, selectedActivities, transportType,
  } = usePackageStore();

  const destInfo = destination ? DEST_MAP[destination] : null;
  const totalPeople = travelers.males + travelers.females + travelers.children;

  const lineItems = [
    { label: 'Base & Flights', amount: estimatedPrice * 0.60, show: !!budgetTier },
    { label: 'Accommodation',  amount: selectedHotel ? selectedHotel.pricePerNight * 5 : 0, show: !!selectedHotel },
    { label: 'Activities',     amount: selectedActivities.reduce((s, a) => s + a.price, 0), show: selectedActivities.length > 0 },
  ].filter((i) => i.show && i.amount > 0);

  const selections = [
    { label: 'Destination', value: destInfo?.name,                                                    emoji: '📍' },
    { label: 'Travelers',   value: totalPeople > 0 ? `${totalPeople} people` : null,                  emoji: '👥' },
    { label: 'Budget',      value: budgetTier ? budgetTier.charAt(0).toUpperCase() + budgetTier.slice(1) : null, emoji: '💰' },
    { label: 'Cabin',       value: flightClass ? flightClass.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : null, emoji: '✈️' },
    { label: 'Hotel',       value: selectedHotel?.name.split(' ').slice(0, 3).join(' '),              emoji: '🏨' },
    { label: 'Activities',  value: selectedActivities.length > 0 ? `${selectedActivities.length} selected` : null, emoji: '🎯' },
    { label: 'Transport',   value: transportType ? transportType.charAt(0).toUpperCase() + transportType.slice(1) : null, emoji: '🚗' },
  ].filter((s) => s.value);

  const waMsg = encodeURIComponent(
    `Hi! I built a travel package.\n📍 ${destInfo?.name ?? 'Custom'}\n👥 ${totalPeople} travelers\n💰 Est. ${formatPKR(estimatedPrice)}\n\nPlease contact me!`
  );

  return (
    <div className="space-y-3">
      {/* Destination photo — Next.js Image */}
      {destInfo && (
        <div className="relative rounded-2xl overflow-hidden shadow-card" style={{ height: '135px' }}>
          <Image
            src={(destInfo as any).image}
            alt={destInfo.name}
            fill
            sizes="320px"
            className="object-cover"
            loading="lazy"
            quality={70}
          />
          <div className="absolute inset-0 overlay-darker" />
          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">{destInfo.emoji} Destination</p>
            <p className="text-[1.15rem] font-bold text-white leading-tight">{destInfo.name}</p>
          </div>
        </div>
      )}

      {/* Main card — solid glass, no blur */}
      <div className="glass rounded-2xl overflow-hidden">
        {/* Price hero */}
        <div className="p-5 border-b border-[var(--border)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="label-caps mb-1">Estimated Total</p>
              <motion.p
                key={estimatedPrice}
                initial={{ opacity: 0.5, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="text-[1.9rem] font-bold text-[var(--gold-light)] leading-none"
              >
                {formatPKR(estimatedPrice)}
              </motion.p>
              {totalPeople > 1 && (
                <p className="text-[16px] text-[var(--text-muted)] mt-1">
                  ≈ {formatPKR(Math.round(estimatedPrice / totalPeople))} / person
                </p>
              )}
            </div>
            <div className="glass-gold rounded-xl px-3 py-2 text-center">
              <motion.p key={packageScore} initial={{ scale: 1.1 }} animate={{ scale: 1 }}
                className="text-[1.05rem] font-bold text-[var(--gold)]">{packageScore}%</motion.p>
              <p className="text-[16px] text-[var(--text-muted)]">match</p>
            </div>
          </div>

          {/* Score bar */}
          <div className="h-1.5 rounded-full bg-[var(--surface-hover)] overflow-hidden">
            <motion.div
              animate={{ width: `${packageScore}%` }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="h-full gradient-gold rounded-full"
            />
          </div>
          <p className="text-[13px] text-[var(--text-muted)] mt-1.5">
            {packageScore >= 90 ? '🔥 Nearly complete!' : packageScore >= 60 ? '⭐ Keep going' : '✨ Building your package…'}
          </p>
        </div>

        {/* Line items */}
        {lineItems.length > 0 && (
          <div className="px-5 py-4 border-b border-[var(--border)] space-y-2">
            {lineItems.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-[15px] text-[var(--text-muted)]">{item.label}</span>
                <span className="text-[15px] font-medium text-[var(--text-secondary)]">{formatPKR(item.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Selections */}
        <div className="px-5 py-4 space-y-2">
          {selections.length > 0 ? (
            <>
              <p className="label-caps mb-3">Your selections</p>
              {selections.map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-[16px]">
                  <span className="w-4 text-center">{s.emoji}</span>
                  <span className="text-[var(--text-muted)] w-16 shrink-0">{s.label}</span>
                  <span className="text-[var(--text-secondary)] font-medium truncate">{s.value}</span>
                </div>
              ))}
            </>
          ) : (
            <p className="text-[17px] text-[var(--text-muted)] py-2 text-center">Make selections to see your package.</p>
          )}
        </div>
      </div>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/923001234567?text=${waMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-semibold text-[16px] text-white hover:brightness-105 transition-all duration-150 active:scale-98"
        style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
      >
        {WA_ICON}
        Chat on WhatsApp
      </a>

      <p className="text-[17px] text-[var(--text-muted)] text-center">
        🔒 Private. No payment required to get a quote.
      </p>
    </div>
  );
}
