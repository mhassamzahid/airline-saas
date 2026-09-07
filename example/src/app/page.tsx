'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePackageStore } from '@/store/usePackageStore';
import { Navbar } from '@/components/layout/Navbar';
import { PriceSidebar } from '@/components/features/PriceSidebar';
import { Step01Welcome } from '@/components/steps/Step01Welcome';
import { Step02Destination } from '@/components/steps/Step02Destination';
import { Step03Travelers } from '@/components/steps/Step03Travelers';
import { Step04Dates } from '@/components/steps/Step04Dates';
import { Step05Budget } from '@/components/steps/Step05Budget';
import { Step06Flights } from '@/components/steps/Step06Flights';
import { Step07Hotels } from '@/components/steps/Step07Hotels';
import { Step08Activities } from '@/components/steps/Step08Activities';
import { Step09Transport } from '@/components/steps/Step09Transport';
import { StepHajjUmrah } from '@/components/steps/StepHajjUmrah';
import { StepSummary } from '@/components/steps/StepSummary';
import { formatPKR } from '@/lib/utils';

function getSteps(travelType: string | null): string[] {
  if (travelType === 'hajj' || travelType === 'umrah') {
    return ['welcome', 'hajj-umrah', 'travelers', 'dates', 'budget', 'summary'];
  }
  return ['welcome', 'destination', 'travelers', 'dates', 'budget', 'flights', 'hotels', 'activities', 'transport', 'summary'];
}

const pageVariants = {
  enter: { opacity: 0, x: 48, scale: 0.98 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -48, scale: 0.98 },
};

export default function Home() {
  const { currentStep, travelType } = usePackageStore();
  const steps = getSteps(travelType);
  const stepId = steps[currentStep] ?? 'welcome';
  const isWelcome = stepId === 'welcome';
  const isSummary = stepId === 'summary';
  const showSidebar = !isWelcome && !isSummary && currentStep > 0;

  return (
    <div
      className="min-h-screen"
      style={{
        background: `
          radial-gradient(ellipse 70% 45% at 15% -10%, rgba(201,168,76,0.07) 0%, transparent 55%),
          radial-gradient(ellipse 60% 50% at 85% 110%, rgba(201,168,76,0.05) 0%, transparent 55%),
          #F8F5F0
        `,
      }}
    >

      <Navbar />

      <main className="pt-[62px]">
        {isWelcome ? (
          <AnimatePresence mode="wait">
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Step01Welcome />
            </motion.div>
          </AnimatePresence>
        ) : (
          /* pb-24 on mobile so mobile bottom bar never covers content */
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8 sm:py-10 pb-28 lg:pb-10">
            <div className={showSidebar ? 'grid lg:grid-cols-[1fr_340px] gap-10' : ''}>
              {/* Main content */}
              <div className="min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stepId}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {stepId === 'destination' && <Step02Destination />}
                    {stepId === 'hajj-umrah' && <StepHajjUmrah />}
                    {stepId === 'travelers' && <Step03Travelers />}
                    {stepId === 'dates' && <Step04Dates />}
                    {stepId === 'budget' && <Step05Budget />}
                    {stepId === 'flights' && <Step06Flights />}
                    {stepId === 'hotels' && <Step07Hotels />}
                    {stepId === 'activities' && <Step08Activities />}
                    {stepId === 'transport' && <Step09Transport />}
                    {stepId === 'summary' && <StepSummary />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Sidebar */}
              {showSidebar && (
                <aside className="hidden lg:block">
                  <div className="sticky top-[78px]">
                    <PriceSidebar />
                  </div>
                </aside>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Mobile bottom bar */}
      <AnimatePresence>
        {currentStep > 2 && !isSummary && (
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-[var(--border)] shadow-[0_-4px_24px_rgba(0,0,0,0.07)] safe-bottom"
          >
            <MobileBar />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileBar() {
  const { estimatedPrice, packageScore } = usePackageStore();

  return (
    <div className="flex items-center justify-between px-5 py-3.5 max-w-lg mx-auto safe-bottom">
      <div>
        <p className="text-[12px] font-medium text-[var(--text-muted)]">Estimated total</p>
        <motion.p
          key={estimatedPrice}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[1.25rem] font-bold text-[var(--gold-light)] leading-tight"
        >
          {formatPKR(estimatedPrice)}
        </motion.p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-center">
          <p className="text-[12px] text-[var(--text-muted)]">Match</p>
          <p className="text-[16px] font-bold text-[var(--gold-light)]">{packageScore}%</p>
        </div>

        <motion.a
          href={`https://wa.me/923001234567?text=${encodeURIComponent("Hi! I'd like to book a travel package.")}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold text-[13px]"
          style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp
        </motion.a>
      </div>
    </div>
  );
}
