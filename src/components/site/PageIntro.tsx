"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { Photo } from "@/components/ui/Photo";
import { HeroAbstract, type HeroAbstractVariant } from "@/components/ui/HeroAbstract";

interface PageFact {
  value: string;
  label: string;
}

interface PageIntroProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  /**
   * Optional hero photo, split-screen with the text. When present, `PageIntro`
   * becomes a full-screen hero band (fills the viewport below the navbar, on
   * every device) -- render it as a direct sibling of `PageContainer`, not
   * inside it, since `PageContainer`'s own vertical padding would push the
   * total past one screen. Shown at every breakpoint (stacked above the text
   * on mobile) so a page never loses its imagery on small screens.
   */
  image?: { src: string; alt: string; unoptimized?: boolean };
  /** Required alongside `image` -- which `HeroAbstract` backdrop this page gets. Every page has its own; see HeroAbstract's doc comment. */
  heroVariant?: HeroAbstractVariant;
  /**
   * A short row of real figures the page already has (package counts,
   * response times, etc.) -- never invented. Fills the lower half of the
   * text column, which otherwise sits mostly empty under a one-line lede.
   */
  facts?: PageFact[];
  className?: string;
  children?: React.ReactNode;
}

// Entrance stagger for the full-screen (image) hero only -- first mount,
// mirrors StepLanding's hand-rolled hero (which carries its own copy since
// it predates this prop and hand-rolls its markup) so every full-screen
// hero, not just Umrah's, feels considered on load rather than static. The
// text-only header (no image) stays plain -- it's a small in-flow block on
// otherwise static pages (legal, help), not a hero.
function useHeroVariants(): { container: Variants; item: Variants } {
  const reduce = useReducedMotion();
  return {
    container: { hidden: {}, show: { transition: reduce ? {} : { staggerChildren: 0.08, delayChildren: 0.05 } } },
    item: reduce
      ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
      : { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } },
  };
}

export function PageIntro({ eyebrow, title, lede, image, heroVariant, facts, className, children }: PageIntroProps) {
  const { container, item } = useHeroVariants();

  if (!image) {
    return (
      <div className={cn("max-w-[52ch]", className)}>
        <header className="max-w-[52ch]">
          {eyebrow && <p className="overline mb-4">{eyebrow}</p>}
          <h1 className="text-[34px] leading-[1.1] text-ink sm:text-[42px]">{title}</h1>
          {lede && <p className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-body">{lede}</p>}
          {facts && facts.length > 0 && (
            <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-hairline pt-6">
              {facts.map((f) => (
                <div key={f.label}>
                  <dd data-numeric className="text-[22px] font-semibold text-ink">
                    {f.value}
                  </dd>
                  <dt className="mt-0.5 text-[12px] text-muted">{f.label}</dt>
                </div>
              ))}
            </dl>
          )}
          {children}
        </header>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex min-h-[calc(100dvh-64px)] items-center overflow-hidden sm:min-h-[calc(100dvh-96px)]",
        className,
      )}
    >
      {heroVariant && <HeroAbstract variant={heroVariant} />}
      <div className="relative mx-auto grid w-full max-w-[1180px] items-center gap-8 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <Photo
          src={image.src}
          alt={image.alt}
          priority
          unoptimized={image.unoptimized}
          sizes="(min-width: 1024px) 38vw, 100vw"
          className="order-first aspect-[16/10] w-full rounded-[12px] border border-hairline lg:order-last lg:aspect-[4/5]"
        />
        <motion.header variants={container} initial="hidden" animate="show">
          {eyebrow && (
            <motion.p variants={item} className="overline mb-4">
              {eyebrow}
            </motion.p>
          )}
          <motion.h1 variants={item} className="text-[34px] leading-[1.1] text-ink sm:text-[42px]">
            {title}
          </motion.h1>
          {lede && (
            <motion.p variants={item} className="mt-4 max-w-[46ch] text-[16px] leading-relaxed text-body">
              {lede}
            </motion.p>
          )}
          {facts && facts.length > 0 && (
            <motion.dl variants={item} className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-hairline pt-6">
              {facts.map((f) => (
                <div key={f.label}>
                  <dd data-numeric className="text-[22px] font-semibold text-ink">
                    {f.value}
                  </dd>
                  <dt className="mt-0.5 text-[12px] text-muted">{f.label}</dt>
                </div>
              ))}
            </motion.dl>
          )}
          {children && <motion.div variants={item}>{children}</motion.div>}
        </motion.header>
      </div>
    </div>
  );
}

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20", className)}>
      {children}
    </div>
  );
}
