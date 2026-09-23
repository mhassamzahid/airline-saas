"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Photo } from "@/components/ui/Photo";
import type { HeroAbstractVariant } from "@/components/ui/HeroAbstract";
import { stock } from "@/lib/img";

interface PageFact {
  value: string;
  label: string;
}

interface PageIntroProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  /** Optional page-specific photo. Pages without one receive a route-relevant stock image. */
  image?: { src: string; alt: string; unoptimized?: boolean };
  /** Kept for callers that identify the service category. */
  heroVariant?: HeroAbstractVariant;
  /** Optional factual figures shown below the breadcrumb. */
  facts?: PageFact[];
  className?: string;
  children?: React.ReactNode;
}

// A restrained entrance stagger for the title and supporting details.
function useHeroVariants(): { container: Variants; item: Variants } {
  const reduce = useReducedMotion();
  return {
    container: { hidden: {}, show: { transition: reduce ? {} : { staggerChildren: 0.08, delayChildren: 0.05 } } },
    item: reduce
      ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
      : { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } },
  };
}

export function PageIntro({ eyebrow, title, lede, image, facts, className, children }: PageIntroProps) {
  const { container, item } = useHeroVariants();
  const pathname = usePathname() || "/";
  const heroImage = image || getPageHero(pathname);
  const crumbs = pathname.split("/").filter(Boolean).map((part) => part.replace(/-/g, " "));

  return (
    <div className={cn("relative left-1/2 flex min-h-[340px] w-screen -translate-x-1/2 items-center justify-center overflow-hidden bg-dark px-5 py-16 text-center sm:min-h-[416px] sm:px-8", className)}>
      <Photo src={heroImage.src} alt={heroImage.alt} priority unoptimized={heroImage.unoptimized} sizes="100vw" className="absolute inset-0 h-full w-full" />
      <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,18,32,.72),rgba(8,18,32,.46),rgba(8,18,32,.7))]" />
      <motion.header variants={container} initial="hidden" animate="show" className="relative z-10 mx-auto w-full max-w-[900px] text-on-dark">
        {eyebrow && <motion.p variants={item} className="mb-3 text-[11px] font-semibold uppercase tracking-[.22em] text-white/75">{eyebrow}</motion.p>}
        <motion.h1 variants={item} className="text-[34px] font-semibold leading-[1.1] text-white sm:text-[48px]">{title}</motion.h1>
        {lede && <motion.p variants={item} className="mx-auto mt-4 max-w-[58ch] text-[15px] leading-relaxed text-white/85">{lede}</motion.p>}
        <motion.nav variants={item} aria-label="Breadcrumb" className="mt-5 text-[11px] font-medium uppercase tracking-[.18em] text-white/80">
          <span>Home</span>{crumbs.map((crumb, i) => <span key={`${crumb}-${i}`}><span className="mx-2 text-white/55">/</span>{crumb}</span>)}
        </motion.nav>
        {facts && facts.length > 0 && <motion.dl variants={item} className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-4">{facts.map((f) => <div key={f.label}><dd data-numeric className="text-[20px] font-semibold text-white">{f.value}</dd><dt className="mt-0.5 text-[12px] text-white/70">{f.label}</dt></div>)}</motion.dl>}
        {children && <motion.div variants={item}>{children}</motion.div>}
      </motion.header>
    </div>
  );
}

function getPageHero(pathname: string): { src: string; alt: string } {
  const route = pathname.split("/").filter(Boolean)[0] || "";
  const heroes: Record<string, { id: string; alt: string }> = {
    manage: { id: "photo-1436491865332-7a61a109cc05", alt: "Passenger aircraft flying above the clouds" },
    help: { id: "photo-1436491865332-7a61a109cc05", alt: "Passenger aircraft flying above the clouds" },
    experience: { id: "photo-1540339832862-474599807836", alt: "A calm long-haul aircraft cabin" },
    "privacy-policy": { id: "photo-1450101499163-c8848c66ca85", alt: "Travel documents on a desk" },
    "terms-of-service": { id: "photo-1450101499163-c8848c66ca85", alt: "Travel documents on a desk" },
    tours: { id: "photo-1500530855697-b586d89ba3ee", alt: "A dramatic mountain landscape" },
    "pakistan-tours": { id: "photo-1544735716-392fe2489ffa", alt: "Mountain peaks in northern Pakistan" },
    hajj: { id: "photo-1564769625905-50e93615e769", alt: "The Grand Mosque in Makkah" },
    umrah: { id: "photo-1564769625905-50e93615e769", alt: "The Grand Mosque in Makkah" },
    "visa-consultation": { id: "photo-1524661135-423995f22d0b", alt: "A world map ready for travel planning" },
    "air-ticketing": { id: "photo-1517479149777-5f3b1511d5ad", alt: "Aircraft wing above the clouds" },
    "other-services": { id: "photo-1600880292203-757bb62b4baf", alt: "Travel service team helping a customer" },
  };
  const selected = heroes[route] || heroes.tours;
  return { src: stock(selected.id, 2000, 800), alt: selected.alt };
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
