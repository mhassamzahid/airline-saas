"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

export type HeroAbstractVariant =
  | "hajj"
  | "umrah"
  | "tours"
  | "pakistan-tours"
  | "visa-consultation"
  | "air-ticketing"
  | "other-services";

const EASE = [0.16, 1, 0.3, 1] as const;
// Starts after the hero text's own entrance stagger (PageIntro / StepLanding,
// ~0.05-0.8s) is mostly settled, so the backdrop reads as a second beat, not
// a competing one.
const DRAW_DELAY = 0.5;
const DRAW_STAGGER = 0.05;

// Undashed strokes (no custom `strokeDasharray`) get a true draw-in via
// `pathLength` -- Motion reveals these by animating stroke-dasharray itself,
// which would silently strip any hand-set dash pattern, so dashed elements
// (the rays/arcs below) use `fade` instead and keep their dash texture.
function fade(target: number, reduce: boolean | null): Variants {
  return reduce
    ? { hidden: { opacity: target }, show: { opacity: target } }
    : { hidden: { opacity: 0 }, show: { opacity: target, transition: { duration: 0.45, ease: EASE } } };
}

/**
 * A bold abstract backdrop for the inner-page hero bands -- deliberately not
 * another photograph, and deliberately not the homepage's full-bleed
 * crossfade (`CinematicHero`), so neither pattern is ever confused with the
 * other. Built from the existing brand vocabulary rather than invented
 * decoration: the dashed rust arc + waypoint dot from `RouteArc` (rationed to
 * one literal use, on `/experience`, per DESIGN.md -- this borrows its
 * stroke/dash/dot language, not the component itself).
 *
 * Two elements stay identical across every `variant` -- the dot grid and the
 * waypoint-dot pair -- so the pages still read as one family up close; the
 * "big shape" is different per page, loosely tied to what that page is
 * about, so seven hero bands in a row don't look like one copy-pasted
 * background. One accent colour throughout; line art, not a filled gradient
 * mesh, so it reads as drawn rather than generated -- literally so on load,
 * via the draw-in below.
 */
export function HeroAbstract({ variant, className }: { variant: HeroAbstractVariant; className?: string }) {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: { transition: reduce ? {} : { delayChildren: DRAW_DELAY, staggerChildren: DRAW_STAGGER } },
  };
  const stroke: Variants = reduce
    ? { hidden: { pathLength: 1 }, show: { pathLength: 1 } }
    : { hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 0.8, ease: EASE } } };

  return (
    <svg
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
      className={cn("absolute inset-0 h-full w-full", className)}
    >
      <pattern id="hero-dots" width="26" height="26" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="1.5" fill="var(--color-rust-500)" />
      </pattern>
      <motion.g variants={container} initial="hidden" animate="show">
        <motion.rect x="-40" y="420" width="360" height="360" fill="url(#hero-dots)" variants={fade(0.38, reduce)} />
        <motion.circle cx="20" cy="640" r="5" fill="var(--color-rust-700)" variants={fade(0.5, reduce)} />
        <motion.circle
          cx="1180" cy="210" r="5" fill="none" stroke="var(--color-rust-700)" strokeWidth="2" opacity={0.5}
          variants={stroke}
        />
        <BigShape variant={variant} reduce={reduce} stroke={stroke} />
      </motion.g>
    </svg>
  );
}

function BigShape({
  variant,
  reduce,
  stroke,
}: {
  variant: HeroAbstractVariant;
  reduce: boolean | null;
  stroke: Variants;
}) {
  const rust500 = "var(--color-rust-500)";
  const rust700 = "var(--color-rust-700)";

  switch (variant) {
    // Hajj -- pilgrims converging on one point, and the circling of tawaf.
    case "hajj":
      return (
        <g opacity={0.85}>
          {[0, 55, 120, 175, 230, 300].map((deg) => {
            const r1 = 60, r2 = 190;
            const rad = (deg * Math.PI) / 180;
            const cx = 1030, cy = 330;
            return (
              <motion.line
                key={deg}
                x1={cx + r1 * Math.cos(rad)} y1={cy + r1 * Math.sin(rad)}
                x2={cx + r2 * Math.cos(rad)} y2={cy + r2 * Math.sin(rad)}
                stroke={rust500} strokeWidth="1.5" strokeDasharray="2 10" strokeLinecap="round"
                variants={fade(0.4, reduce)}
              />
            );
          })}
          <motion.circle cx="1030" cy="330" r="100" stroke={rust500} strokeWidth="1.3" opacity={0.28} variants={stroke} />
          <motion.circle cx="1030" cy="330" r="230" stroke={rust500} strokeWidth="1" opacity={0.16} variants={stroke} />
        </g>
      );

    // Umrah -- assembling your own package, piece by piece: a loose node graph.
    case "umrah": {
      const nodes: [number, number][] = [
        [900, 260], [1050, 230], [1160, 320], [1010, 380], [880, 390], [1120, 450], [960, 490],
      ];
      const edges: [number, number][] = [[0, 1], [1, 2], [0, 3], [3, 4], [2, 5], [3, 6], [1, 3]];
      return (
        <g opacity={0.85}>
          {edges.map(([a, b], i) => (
            <motion.line
              key={i}
              x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]}
              stroke={rust500} strokeWidth="1.2" opacity={0.3}
              variants={stroke}
            />
          ))}
          {nodes.map(([x, y], i) => (
            <motion.circle
              key={i} cx={x} cy={y} r={i % 3 === 0 ? 5 : 3.5} fill={rust700}
              variants={fade(i % 3 === 0 ? 0.4 : 0.22, reduce)}
            />
          ))}
        </g>
      );
    }

    // International Tours -- many routes crossing, like flight paths on a map.
    case "tours":
      return (
        <g opacity={0.85}>
          <motion.path
            d="M 780 490 Q 1000 210 1220 290" stroke={rust500} strokeWidth="1.5" strokeDasharray="2 11" strokeLinecap="round"
            variants={fade(0.35, reduce)}
          />
          <motion.path
            d="M 860 150 Q 1010 360 1240 430" stroke={rust500} strokeWidth="1.5" strokeDasharray="2 11" strokeLinecap="round"
            variants={fade(0.3, reduce)}
          />
          <motion.path
            d="M 900 510 Q 1120 430 1180 230" stroke={rust500} strokeWidth="1.2" strokeDasharray="2 11" strokeLinecap="round"
            variants={fade(0.22, reduce)}
          />
          <motion.circle cx="1000" cy="320" r="4" fill={rust700} variants={fade(0.4, reduce)} />
        </g>
      );

    // Pakistan Tours -- a ridgeline, not a route: the northern valleys.
    case "pakistan-tours":
      return (
        <g opacity={0.85}>
          <motion.polyline
            points="770,470 860,310 930,390 1010,230 1090,360 1160,280 1240,400"
            stroke={rust500} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity={0.34} fill="none"
            variants={stroke}
          />
          <motion.polyline
            points="800,530 880,410 960,470 1040,350 1130,450 1220,370"
            stroke={rust500} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity={0.18} fill="none"
            variants={stroke}
          />
        </g>
      );

    // Visa Consultation -- a loose scatter of stamps, not a spreadsheet grid.
    case "visa-consultation": {
      const stamps: [number, number, number][] = [
        [900, 270, -8], [990, 320, 5], [1080, 250, 10], [950, 390, -4], [1130, 370, -12], [1050, 430, 7],
      ];
      return (
        <g opacity={0.85}>
          {stamps.map(([x, y, rot], i) => (
            <motion.rect
              key={i} x={x} y={y} width={i % 2 === 0 ? 46 : 34} height={i % 2 === 0 ? 34 : 46}
              rx="3" transform={`rotate(${rot} ${x + 20} ${y + 20})`}
              stroke={rust500} strokeWidth="1.3" fill={i === 2 ? rust700 : "none"} opacity={i === 2 ? 0.08 : 0.3}
              variants={stroke}
            />
          ))}
        </g>
      );
    }

    // Air Ticketing -- a single ascent, ticked off like a flight-progress line.
    case "air-ticketing":
      return (
        <g opacity={0.85}>
          <motion.line x1="800" y1="530" x2="1200" y2="230" stroke={rust500} strokeWidth="1.6" strokeLinecap="round" opacity={0.34} variants={stroke} />
          {[0.15, 0.35, 0.55, 0.75].map((t, i) => {
            const x = 800 + (1200 - 800) * t;
            const y = 530 + (230 - 530) * t;
            return <motion.circle key={i} cx={x} cy={y} r="3" fill={rust700} variants={fade(0.3, reduce)} />;
          })}
          <motion.path d="M 1200 230 L 1180 248 L 1194 254 Z" fill={rust700} variants={fade(0.32, reduce)} />
        </g>
      );

    // Other Services -- a handful of small, unrelated extras.
    case "other-services":
      return (
        <g opacity={0.85}>
          <motion.circle cx="920" cy="290" r="6" fill={rust700} variants={fade(0.3, reduce)} />
          <motion.circle cx="1080" cy="260" r="3" fill={rust700} variants={fade(0.4, reduce)} />
          <motion.circle cx="1180" cy="370" r="9" stroke={rust500} strokeWidth="1.3" opacity={0.28} variants={stroke} />
          <motion.circle cx="1010" cy="430" r="4" fill={rust700} variants={fade(0.24, reduce)} />
          <motion.line x1="1050" y1="310" x2="1090" y2="325" stroke={rust500} strokeWidth="1.5" strokeLinecap="round" opacity={0.3} variants={stroke} />
          <motion.line x1="930" y1="390" x2="960" y2="375" stroke={rust500} strokeWidth="1.5" strokeLinecap="round" opacity={0.26} variants={stroke} />
        </g>
      );

    default:
      return null;
  }
}
