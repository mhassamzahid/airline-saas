'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  addDays, addMonths, subMonths, format,
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  isSameMonth, isSameDay, isAfter, isBefore, isToday, differenceInDays,
} from 'date-fns';
import { usePackageStore } from '@/store/usePackageStore';
import { StepHeader } from '@/components/ui/StepHeader';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const QUICK = [
  { label: 'Next weekend', days: 3, offset: 5 },
  { label: '1 week',       days: 7, offset: 14 },
  { label: '10 days',      days: 10, offset: 21 },
  { label: '2 weeks',      days: 14, offset: 30 },
  { label: '3 weeks',      days: 21, offset: 45 },
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface RangeCalendarProps {
  from: Date | null;
  to: Date | null;
  minDate: Date;
  onChange: (from: Date | null, to: Date | null) => void;
}

function RangeCalendar({ from, to, minDate, onChange }: RangeCalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => from ?? new Date());
  const [hovered, setHovered] = useState<Date | null>(null);

  const selecting = !!from && !to;

  function handleDayClick(day: Date) {
    if (isBefore(day, minDate) && !isSameDay(day, minDate)) return;

    if (!from || (from && to)) {
      onChange(day, null);
    } else {
      if (isSameDay(day, from)) {
        onChange(null, null);
      } else if (isBefore(day, from)) {
        onChange(day, from);
      } else {
        onChange(from, day);
      }
    }
  }

  function generateDays() {
    const start = startOfWeek(startOfMonth(viewMonth));
    const end = endOfWeek(endOfMonth(viewMonth));
    const days: Date[] = [];
    let d = start;
    while (!isAfter(d, end)) {
      days.push(new Date(d));
      d = addDays(d, 1);
    }
    return days;
  }

  const days = generateDays();

  return (
    <div className="w-full select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          className="w-11 h-11 rounded-xl glass border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--border-gold)] hover:text-[var(--gold-light)] transition-colors active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <p className="text-[18px] font-bold text-[var(--text-primary)]">
          {format(viewMonth, 'MMMM yyyy')}
        </p>
        <button
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="w-11 h-11 rounded-xl glass border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:border-[var(--border-gold)] hover:text-[var(--gold-light)] transition-colors active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[12px] font-bold text-[var(--text-muted)] py-1 uppercase tracking-wide">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {days.map((day, i) => {
          const disabled = isBefore(day, minDate) && !isSameDay(day, minDate);
          const inCurrentMonth = isSameMonth(day, viewMonth);
          const isStart = from ? isSameDay(day, from) : false;
          const isEnd = to ? isSameDay(day, to) : false;

          const rangeEnd = to ?? (selecting && hovered ? hovered : null);
          const inRange = !!(
            from && rangeEnd &&
            isAfter(day, isStart ? day : from) && isBefore(day, rangeEnd) &&
            !isSameDay(day, from)
          );

          const isRangeEnd = !!(rangeEnd && isSameDay(day, rangeEnd) && !isSameDay(day, from ?? new Date(0)));
          const todayDay = isToday(day);

          return (
            <div
              key={i}
              className={cn(
                'relative flex items-center justify-center h-11',
                inRange ? 'bg-[rgba(201,168,76,0.10)]' : '',
                isStart && (to || (selecting && hovered && isAfter(hovered, from!))) ? 'rounded-l-full' : '',
                (isEnd || isRangeEnd) && !isStart ? 'rounded-r-full' : '',
                isStart && !to && !(selecting && hovered) ? 'rounded-full' : '',
              )}
            >
              <button
                disabled={disabled}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => selecting && setHovered(day)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  'w-10 h-10 sm:w-11 sm:h-11 rounded-full text-[15px] font-medium transition-all duration-100 flex items-center justify-center',
                  !inCurrentMonth ? 'opacity-20 pointer-events-none' : '',
                  disabled ? 'opacity-15 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
                  isStart || isEnd ? 'gradient-gold text-[var(--navy)] font-bold shadow-[0_0_12px_rgba(201,168,76,0.4)]' : '',
                  !isStart && !isEnd && !disabled && inCurrentMonth
                    ? 'text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.07)] active:scale-90'
                    : '',
                  todayDay && !isStart && !isEnd ? 'ring-1 ring-[var(--border-gold)] text-[var(--gold-light)]' : '',
                )}
              >
                {format(day, 'd')}
              </button>
            </div>
          );
        })}
      </div>

      {/* Selection hint */}
      {from && !to && (
        <p className="text-center text-[14px] text-[var(--text-muted)] mt-4">
          Now tap your return date
        </p>
      )}
    </div>
  );
}

export function Step04Dates() {
  const { dateRange, setDateRange, nextStep, prevStep } = usePackageStore();

  const fromDate = dateRange.from ?? null;
  const toDate   = dateRange.to   ?? null;
  const today    = new Date();
  const nights   = fromDate && toDate ? differenceInDays(toDate, fromDate) : null;

  function applyQuick(offset: number, days: number) {
    const from = addDays(today, offset);
    setDateRange({ from, to: addDays(from, days) });
  }

  return (
    <div className="space-y-7">
      <StepHeader
        step={4}
        totalSteps={10}
        title="When are you traveling?"
        subtitle="Pick your departure and return dates — or use a quick shortcut below."
      />

      {/* Quick select */}
      <div>
        <p className="label-caps mb-3">Quick select</p>
        <div className="flex flex-wrap gap-2">
          {QUICK.map((q) => {
            const active = fromDate && toDate && differenceInDays(toDate, fromDate) === q.days;
            return (
              <button
                key={q.label}
                onClick={() => applyQuick(q.offset, q.days)}
                className={cn(
                  'px-4 py-2.5 rounded-full text-[15px] font-medium transition-colors duration-150 min-h-[42px]',
                  active
                    ? 'gradient-gold text-[var(--navy)]'
                    : 'glass border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-gold)]'
                )}
              >
                {q.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-5 sm:p-7"
      >
        <RangeCalendar
          from={fromDate}
          to={toDate}
          minDate={today}
          onChange={(f, t) => setDateRange({ from: f, to: t })}
        />
      </motion.div>

      {/* Selection summary */}
      {fromDate && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 sm:p-5 glass-gold rounded-xl"
        >
          <Calendar className="w-6 h-6 text-[var(--gold)] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-semibold text-[var(--text-primary)]">
              {format(fromDate, 'MMM d, yyyy')}
              {toDate ? ` → ${format(toDate, 'MMM d, yyyy')}` : ' → Choose return date'}
            </p>
            {nights && nights > 0 && (
              <p className="text-[15px] text-[var(--text-secondary)] mt-0.5">{nights} nights · {nights + 1} days</p>
            )}
          </div>
          {nights && (
            <div className="glass-gold rounded-full px-4 py-1.5 text-[15px] font-bold text-[var(--gold)] shrink-0">
              {nights}N
            </div>
          )}
        </motion.div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={prevStep}>Back</Button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={nextStep}>Skip</Button>
          <Button onClick={nextStep} size="md" disabled={!fromDate}>Continue →</Button>
        </div>
      </div>
    </div>
  );
}
