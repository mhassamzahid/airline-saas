'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, Star, Heart } from 'lucide-react';
import { usePackageStore } from '@/store/usePackageStore';
import { TravelType } from '@/types';
import { cn } from '@/lib/utils';

const TRAVEL_TYPES = [
  {
    id: 'international' as TravelType,
    label: 'International',
    sub: 'World Tours',
    cta: 'Explore the world',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=900&q=75',
    accent: '#3B82F6',
    destinations: 'Turkey · Dubai · Maldives · Thailand · Bali',
    stat: '50+ destinations',
  },
  {
    id: 'pakistan' as TravelType,
    label: 'Pakistan',
    sub: 'Local Wonders',
    cta: 'Discover Pakistan',
    image: 'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?w=900&q=75',
    accent: '#10B981',
    destinations: 'Hunza · Skardu · Swat · Naran · Kashmir',
    stat: '20+ destinations',
  },
  {
    id: 'hajj' as TravelType,
    label: 'Hajj',
    sub: 'Sacred Journey',
    cta: 'Begin your pilgrimage',
    image: 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=900&q=75',
    accent: '#F59E0B',
    destinations: 'Makkah · Madinah · Mina · Arafat',
    stat: 'Expert guidance',
  },
  {
    id: 'umrah' as TravelType,
    label: 'Umrah',
    sub: 'Spiritual Retreat',
    cta: 'Plan your Umrah',
    image: 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=900&q=75',
    accent: '#8B5CF6',
    destinations: 'Makkah · Madinah · Jeddah · Taif',
    stat: 'Year-round packages',
  },
];

const TRUST = [
  { icon: Shield, label: 'IATA & ATAB', sub: 'Certified agency' },
  { icon: Star,   label: '4.9 / 5.0',   sub: '2,400+ reviews' },
  { icon: Clock,  label: '24 / 7',       sub: 'Expert support' },
  { icon: Heart,  label: '10,000+',      sub: 'Happy travelers' },
];

export function Step01Welcome() {
  const { setTravelType, nextStep } = usePackageStore();
  const [hovered, setHovered] = useState<string | null>(null);

  function handleSelect(type: TravelType) {
    setTravelType(type);
    setTimeout(() => nextStep(), 180);
  }

  return (
    <div className="min-h-[calc(100vh-58px)] flex flex-col">

      {/* Hero headline */}
      <div className="relative z-10 text-center px-4 pt-14 pb-10">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass-gold rounded-full px-4 py-1.5 mb-7"
        >
          <span className="w-1.5 h-1.5 rounded-full gradient-gold" />
          <span className="text-[14px] font-semibold text-[var(--gold-light)] tracking-wide">
            Pakistan's #1 Custom Travel Builder
          </span>
          <span className="w-1.5 h-1.5 rounded-full gradient-gold" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="text-[2.4rem] sm:text-[3.5rem] md:text-[4.5rem] font-bold leading-[1.05] tracking-tight mb-5"
        >
          Where do you want
          <br />
          <span className="shimmer-text">to go next?</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="text-[17px] text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed"
        >
          Build your perfect trip in minutes. Instant pricing. Every detail, your way.
        </motion.p>
      </div>

      {/* Travel type cards — CSS hover only, no whileHover */}
      <div className="flex-1 px-4 pb-6 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {TRAVEL_TYPES.map((type, i) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onMouseEnter={() => setHovered(type.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleSelect(type.id)}
                className="hover-card relative overflow-hidden rounded-2xl cursor-pointer text-left w-full shadow-card"
                style={{ height: 'clamp(260px, 36vw, 380px)' }}
              >
                {/* Background image — Next.js Image for optimization */}
                <div className="absolute inset-0">
                  <Image
                    src={type.image}
                    alt={type.label}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
                    className="object-cover"
                    priority={i < 2}
                    quality={75}
                    style={{
                      transform: hovered === type.id ? 'scale(1.07)' : 'scale(1)',
                      transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
                    }}
                  />
                  <div className="absolute inset-0 overlay-darker" />
                  {/* Coloured tint on hover */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(ellipse at bottom left, ${type.accent}, transparent 65%)`,
                      opacity: hovered === type.id ? 0.2 : 0,
                    }}
                  />
                </div>

                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] origin-left transition-transform duration-300"
                  style={{
                    background: `linear-gradient(90deg, ${type.accent}, transparent)`,
                    transform: `scaleX(${hovered === type.id ? 1 : 0})`,
                  }}
                />

                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <span className="label-caps" style={{ color: type.accent }}>{type.sub}</span>
                  <div>
                    <h3 className="text-[1.6rem] sm:text-[1.9rem] font-bold text-white leading-tight mb-1.5">
                      {type.label}
                    </h3>
                    <p className="text-[16px] text-white/50 mb-4 leading-relaxed hidden sm:block">
                      {type.destinations}
                    </p>
                    <div
                      className="flex items-center gap-2 text-[15px] font-semibold transition-all duration-200"
                      style={{
                        color: type.accent,
                        opacity: hovered === type.id ? 1 : 0,
                        transform: `translateY(${hovered === type.id ? 0 : 6}px)`,
                      }}
                    >
                      {type.cta} <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Stat badge */}
                <div className="absolute top-4 right-4 glass-dark rounded-full px-2.5 py-1 text-[12px] font-medium text-white/70 border border-white/10">
                  {type.stat}
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trust strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="px-4 pb-10"
      >
        <div className="max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TRUST.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg glass-gold flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-[var(--text-primary)] leading-none mb-0.5">{label}</p>
                <p className="text-[13px] text-[var(--text-muted)] leading-none">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
