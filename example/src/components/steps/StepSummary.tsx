'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Users, Calendar, Sparkles, Plane, Building, Zap, Car, Check, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { usePackageStore } from '@/store/usePackageStore';
import { INTERNATIONAL_DESTINATIONS, PAKISTAN_DESTINATIONS } from '@/data/destinations';
import { StepHeader } from '@/components/ui/StepHeader';
import { Button } from '@/components/ui/Button';
import { formatPKR } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { submitEnquiry } from '@/app/actions';

const ALL_DESTS = [...INTERNATIONAL_DESTINATIONS, ...PAKISTAN_DESTINATIONS].reduce(
  (acc, d) => { acc[d.id] = d; return acc; },
  {} as Record<string, { name: string; emoji: string; image: string; tagline: string }>
);

const WA_SVG = (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function StepSummary() {
  const store = usePackageStore();
  const [name, setName] = useState(store.leadName);
  const [phone, setPhone] = useState(store.leadPhone);
  const [email, setEmail] = useState(store.leadEmail);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const destInfo = store.destination ? ALL_DESTS[store.destination] : null;

  const waMsg = encodeURIComponent(
    `Hi! I built a custom package:\n📍 ${destInfo?.name ?? 'Custom'}\n👥 ${store.travelers.males + store.travelers.females + store.travelers.children} travelers\n💰 Est. ${formatPKR(store.estimatedPrice)}\n\nPlease contact me!`
  );

  async function handleSubmit() {
    store.setLeadInfo(name, phone, email);
    setLoading(true);
    try {
      await submitEnquiry({
        leadName:       name,
        leadPhone:      phone,
        leadEmail:      email,
        travelType:     store.travelType,
        destination:    store.destination,
        males:          store.travelers.males,
        females:        store.travelers.females,
        children:       store.travelers.children,
        infants:        store.travelers.infants,
        estimatedPrice: store.estimatedPrice,
        packageData:    {
          travelType:          store.travelType,
          destination:         store.destination,
          travelers:           store.travelers,
          dateRange:           store.dateRange,
          budgetTier:          store.budgetTier,
          flightClass:         store.flightClass,
          selectedHotel:       store.selectedHotel,
          selectedActivities:  store.selectedActivities,
          transportType:       store.transportType,
          packageScore:        store.packageScore,
        },
      });
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center py-16 space-y-7 max-w-md mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 15 }}
          className="w-24 h-24 rounded-full gradient-gold mx-auto flex items-center justify-center glow-gold"
        >
          <span className="text-4xl">🎉</span>
        </motion.div>

        <div className="space-y-2">
          <h2 className="text-[2rem] font-bold text-[var(--text-primary)]">Request Sent!</h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Our travel expert will reach you within{' '}
            <span className="font-semibold text-[var(--gold-light)]">2 hours</span> to confirm your package and start booking.
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <p className="label-caps mb-2">Estimated Package</p>
          <p className="text-[2.5rem] font-bold text-[var(--gold-light)]">{formatPKR(store.estimatedPrice)}</p>
          <p className="text-[16px] text-[var(--text-muted)] mt-1">Subject to final confirmation by our agent</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <motion.a
            href={`https://wa.me/923001234567?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white font-semibold"
            style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
          >
            {WA_SVG} WhatsApp Now
          </motion.a>
          <Button variant="outline" onClick={store.reset} className="flex-1">
            Build Another Package
          </Button>
        </div>
      </motion.div>
    );
  }

  const detailRows = [
    { icon: <MapPin className="w-4 h-4" />, label: 'Destination', value: destInfo ? `${destInfo.emoji} ${destInfo.name}` : null },
    { icon: <Users className="w-4 h-4" />, label: 'Travelers', value: `${store.travelers.males}M · ${store.travelers.females}F · ${store.travelers.children} Children · ${store.travelers.infants} Infants` },
    store.dateRange.from && {
      icon: <Calendar className="w-4 h-4" />,
      label: 'Dates',
      value: store.dateRange.to
        ? `${format(store.dateRange.from, 'MMM d')} – ${format(store.dateRange.to, 'MMM d, yyyy')}`
        : format(store.dateRange.from, 'MMM d, yyyy'),
    },
    { icon: <Sparkles className="w-4 h-4" />, label: 'Budget', value: store.budgetTier ? store.budgetTier.charAt(0).toUpperCase() + store.budgetTier.slice(1) : null },
    { icon: <Plane className="w-4 h-4" />, label: 'Cabin', value: store.flightClass ? store.flightClass.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : null },
    { icon: <Building className="w-4 h-4" />, label: 'Hotel', value: store.selectedHotel?.name, highlight: true },
    { icon: <Zap className="w-4 h-4" />, label: 'Activities', value: store.selectedActivities.length > 0 ? store.selectedActivities.map(a => a.name).join(', ') : null },
    { icon: <Car className="w-4 h-4" />, label: 'Transport', value: store.transportType ? store.transportType.charAt(0).toUpperCase() + store.transportType.slice(1) : null },
  ].filter(Boolean).filter((r: any) => r.value) as Array<{ icon: React.ReactNode; label: string; value: string; highlight?: boolean }>;

  return (
    <div className="space-y-7 max-w-2xl">
      <StepHeader
        step={10}
        totalSteps={10}
        title="Your package is ready"
        subtitle="Review your selections and get your personalised quote from our travel experts."
      />

      {/* Destination hero */}
      {destInfo && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl overflow-hidden shadow-card"
          style={{ height: '220px' }}
        >
          <img src={(destInfo as any).image} alt={destInfo.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
          <div className="absolute inset-0 overlay-darker" />
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="flex items-end justify-between">
              <div>
                <p className="label-caps text-white/40 mb-1">{destInfo.emoji} Your destination</p>
                <h3 className="text-[2rem] font-bold text-white leading-tight">{destInfo.name}</h3>
                <p className="text-[13px] text-white/45 italic">{destInfo.tagline}</p>
              </div>
              <div className="text-right">
                <p className="label-caps text-white/40 mb-1">Estimated</p>
                <p className="text-[1.8rem] font-bold text-[#E8C96A]">{formatPKR(store.estimatedPrice)}</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Package score */}
      <div className="flex items-center gap-4 p-4 glass-gold rounded-2xl">
        <div className="w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center shrink-0">
          <span className="text-[var(--navy)] font-bold text-[1rem]">{store.packageScore}%</span>
        </div>
        <div>
          <p className="font-bold text-[var(--text-primary)]">Package Score</p>
          <p className="text-[17px] text-[var(--text-secondary)]">
            {store.packageScore >= 90
              ? 'Excellent — almost everything is covered.'
              : 'Looking good — our agents will refine the details.'}
          </p>
        </div>
      </div>

      {/* Detail rows */}
      <div className="glass rounded-2xl overflow-hidden">
        <p className="label-caps px-5 pt-5 pb-3">Package details</p>
        {detailRows.map((row, i) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className={cn(
              'flex items-start gap-4 px-5 py-3.5 border-t border-[var(--border)]',
              row.highlight ? 'bg-[rgba(201,168,76,0.04)]' : ''
            )}
          >
            <span className={cn('mt-0.5 shrink-0', row.highlight ? 'text-[var(--gold)]' : 'text-[var(--text-muted)]')}>
              {row.icon}
            </span>
            <span className="text-[17px] text-[var(--text-muted)] w-20 shrink-0">{row.label}</span>
            <span className={cn('text-[16px] font-medium flex-1 leading-snug', row.highlight ? 'text-[var(--gold-light)]' : 'text-[var(--text-primary)]')}>
              {row.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Lead form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-6 space-y-5"
      >
        <div>
          <h3 className="text-[1.1rem] font-bold text-[var(--text-primary)]">Get your personalised quote</h3>
          <p className="text-[17px] text-[var(--text-secondary)] mt-1">
            Share your contact details — a travel expert will call within 2 hours.
          </p>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Your name *', value: name, set: setName, placeholder: 'Muhammad Ali', type: 'text' },
            { label: 'Email (optional)', value: email, set: setEmail, placeholder: 'ali@example.com', type: 'email' },
          ].map((field) => (
            <div key={field.label}>
              <label className="label-caps mb-1.5 block">{field.label}</label>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                placeholder={field.placeholder}
                className="w-full glass rounded-xl px-4 py-3 text-[16px] text-[var(--text-primary)] placeholder-[var(--text-muted)] border border-[var(--border)] focus:border-[var(--border-gold)] focus:outline-none transition-colors"
              />
            </div>
          ))}

          <div>
            <label className="label-caps mb-1.5 block">WhatsApp number *</label>
            <div className="flex gap-2">
              <span className="glass border border-[var(--border)] rounded-xl px-3 flex items-center text-[17px] text-[var(--text-secondary)] shrink-0 gap-1.5">
                🇵🇰 +92
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="300 1234567"
                className="flex-1 glass rounded-xl px-4 py-3 text-[16px] text-[var(--text-primary)] placeholder-[var(--text-muted)] border border-[var(--border)] focus:border-[var(--border-gold)] focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        <Button
          className="w-full text-[var(--navy)] font-bold"
          size="lg"
          onClick={handleSubmit}
          loading={loading}
          disabled={!name || !phone}
        >
          {loading ? 'Sending your request…' : 'Get My Custom Quote →'}
        </Button>

        <div className="flex items-center justify-center gap-2 text-[16px] text-[var(--text-muted)]">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          100% private — we never share your information
        </div>
      </motion.div>

      {/* Instant WhatsApp */}
      <div className="text-center space-y-3">
        <p className="text-[17px] text-[var(--text-muted)]">Or connect instantly via WhatsApp</p>
        <motion.a
          href={`https://wa.me/923001234567?text=${waMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-white font-semibold shadow-lg"
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
        >
          {WA_SVG}
          Chat on WhatsApp Now
        </motion.a>
      </div>

      <div className="flex items-center justify-start pt-2">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={store.prevStep}>
          Back
        </Button>
      </div>
    </div>
  );
}
