'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Clock, Sparkles } from 'lucide-react';
import { usePackageStore } from '@/store/usePackageStore';
import { ACTIVITIES_BY_DESTINATION } from '@/data/destinations';
import { Activity } from '@/types';
import { StepHeader } from '@/components/ui/StepHeader';
import { Button } from '@/components/ui/Button';
import { formatPKR } from '@/lib/utils';
import { cn } from '@/lib/utils';

const CATS = ['All', 'Adventure', 'Sightseeing', 'Culture', 'Nature', 'Wellness', 'Luxury'];
const CAT_COLORS: Record<string, string> = {
  Adventure: '#EF4444', Sightseeing: '#3B82F6', Culture: '#F59E0B',
  Nature: '#10B981', Wellness: '#8B5CF6', Luxury: '#C9A84C', Shopping: '#EC4899',
};

export function Step08Activities() {
  const { destination, selectedActivities, toggleActivity, nextStep, prevStep } = usePackageStore();
  const [cat, setCat] = useState('All');

  const allActivities: Activity[] = destination && ACTIVITIES_BY_DESTINATION[destination]
    ? ACTIVITIES_BY_DESTINATION[destination]
    : Object.values(ACTIVITIES_BY_DESTINATION).flat().slice(0, 9);

  const filtered = cat === 'All' ? allActivities : allActivities.filter((a) => a.category === cat);
  const isSelected = (id: string) => selectedActivities.some((a) => a.id === id);
  const totalCost = selectedActivities.reduce((s, a) => s + a.price, 0);

  return (
    <div className="space-y-7">
      <StepHeader step={8} totalSteps={10} title="Add activities" subtitle="Choose experiences that excite you. Your package and pricing update instantly." />

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className={cn('shrink-0 px-4 py-2 rounded-full text-[17px] font-medium transition-colors duration-150',
              cat === c ? 'gradient-gold text-[var(--navy)]'
                : 'glass border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-gold)]')}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid — CSS hover, not motion.div */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((activity, i) => {
          const selected = isSelected(activity.id);
          const accent = CAT_COLORS[activity.category] ?? '#C9A84C';

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.045, 0.2) }}
            >
              <div
                className={cn(
                  'relative rounded-2xl overflow-hidden shadow-card',
                  selected ? 'ring-2 ring-offset-1 ring-offset-[var(--bg)]' : ''
                )}
                style={selected ? { '--tw-ring-color': accent } as React.CSSProperties : undefined}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: '155px' }}>
                  <Image src={activity.image} alt={activity.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover" loading="lazy" quality={68}
                    style={{ transform: selected ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.35s ease' }}
                  />
                  <div className="absolute inset-0 overlay-darker" />

                  <div className="absolute top-3 left-3 text-[12px] font-bold px-2.5 py-0.5 rounded-full"
                    style={{ background: `${accent}25`, color: accent, border: `1px solid ${accent}40` }}>
                    {activity.category}
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[13px] text-white/55">
                    <Clock className="w-3 h-3" />{activity.duration}
                  </div>
                  <div className="absolute bottom-3 right-3 text-xl">{activity.icon}</div>
                </div>

                {/* Content */}
                <div className={cn('p-4 flex items-center justify-between', selected ? 'bg-[rgba(201,168,76,0.08)]' : 'bg-[var(--navy-card)]')}>
                  <div className="flex-1 min-w-0 mr-3">
                    <h3 className="font-semibold text-[var(--text-primary)] text-[16px] leading-snug truncate">{activity.name}</h3>
                    <p className="text-[16px] font-bold mt-0.5" style={{ color: selected ? accent : 'var(--gold-light)' }}>
                      {formatPKR(activity.price)}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleActivity(activity)}
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 active:scale-90"
                    style={selected
                      ? { background: `linear-gradient(135deg, ${accent}, ${accent}99)`, color: 'white' }
                      : { background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  >
                    {selected ? <Minus className="w-4 h-4" strokeWidth={2.5} /> : <Plus className="w-4 h-4" strokeWidth={2.5} />}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary bar */}
      <AnimatePresence>
        {selectedActivities.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            className="glass-gold rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl gradient-gold flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-[var(--navy)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[17px] font-bold text-[var(--text-primary)]">
                {selectedActivities.length} {selectedActivities.length === 1 ? 'activity' : 'activities'} selected
              </p>
              <p className="text-[16px] text-[var(--text-muted)] truncate mt-0.5">
                {selectedActivities.map((a) => a.name).join(' · ')}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[17px] font-bold text-[var(--gold-light)]">+{formatPKR(totalCost)}</p>
              <p className="text-[13px] text-[var(--text-muted)]">added</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={prevStep}>Back</Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={nextStep}>Skip</Button>
          <Button onClick={nextStep} size="md">Continue →</Button>
        </div>
      </div>
    </div>
  );
}
