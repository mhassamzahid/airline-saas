'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Phone } from 'lucide-react';
import { usePackageStore } from '@/store/usePackageStore';
import { formatPKR } from '@/lib/utils';

export function Navbar() {
  const { estimatedPrice, currentStep, travelType } = usePackageStore();
  const steps = (travelType === 'hajj' || travelType === 'umrah') ? 6 : 10;
  const progress = currentStep > 0 ? (currentStep / steps) * 100 : 0;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {currentStep > 0 && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--border)]">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-full gradient-gold"
          />
        </div>
      )}

      <div className="glass-blur" style={{ paddingTop: currentStep > 0 ? '2px' : 0 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[62px] flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-[17px] font-bold text-[var(--navy)]"
              style={{ background: 'linear-gradient(135deg, #E8C96A, #C9A84C)' }}
            >
              ✈
            </div>
            <div className="leading-none">
              <p className="font-bold text-[var(--text-primary)] text-[17px] tracking-tight">Travocom</p>
              <p className="text-[11px] text-[var(--text-muted)] tracking-widest uppercase">Premium Travel</p>
            </div>
          </div>

          {/* Step pills */}
          {currentStep > 0 && (
            <div className="hidden md:flex items-center gap-1.5">
              {Array.from({ length: steps }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === currentStep - 1 ? 28 : i < currentStep ? 8 : 6,
                    opacity: i < currentStep ? 1 : 0.25,
                    background: i < currentStep
                      ? 'linear-gradient(90deg, #E8C96A, #C9A84C)'
                      : 'rgba(0,0,0,0.10)',
                  }}
                />
              ))}
            </div>
          )}

          {/* Right */}
          <div className="flex items-center gap-2 shrink-0">
            <AnimatePresence>
              {estimatedPrice > 50000 && currentStep > 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="hidden sm:flex items-center gap-2 glass-gold rounded-full px-3.5 py-1.5"
                >
                  <span className="text-[11px] text-[var(--text-muted)]">est.</span>
                  <motion.span
                    key={estimatedPrice}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[14px] font-bold text-[var(--gold-light)]"
                  >
                    {formatPKR(estimatedPrice)}
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>

            <a
              href="tel:+923001234567"
              className="flex items-center gap-2 px-3.5 py-2 rounded-full glass border-[var(--border)] border text-[var(--text-secondary)] text-[14px] hover:border-[var(--border-gold)] hover:text-[var(--gold-light)] transition-colors duration-200"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">0300 123 4567</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
