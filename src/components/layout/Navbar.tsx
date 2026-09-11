"use client";

import { useState } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { List, Phone, X } from "@phosphor-icons/react";
import { Wordmark } from "@/components/ui/Wordmark";

const FALLBACK_LINKS = [
  { label: "Umrah", href: "/umrah" },
  { label: "Hajj", href: "/hajj" },
  { label: "Tours", href: "/tours" },
  { label: "Manage trip", href: "/manage" },
  { label: "Help", href: "/help" },
];

type NavLink = { label: string; href: string };

const FALLBACK_TAGLINE = "Flying from London Gatwick, Manchester & Edinburgh";
const FALLBACK_PHONE = "+44 20 7946 0192";

export function Navbar({
  siteTitle = "Halcyon",
  logoUrl = null,
  navLinks,
  cta,
  tagline,
  phone,
}: {
  siteTitle?: string;
  logoUrl?: string | null;
  navLinks?: NavLink[];
  cta?: { label: string; href: string };
  tagline?: string;
  phone?: string;
}) {
  const [open, setOpen] = useState(false);

  const LINKS = navLinks && navLinks.length > 0 ? navLinks : FALLBACK_LINKS;
  const ctaLabel = cta?.label || "Sign in";
  const ctaHref = cta?.href || "/signin";
  const strapline = tagline || FALLBACK_TAGLINE;
  const phoneNumber = phone || FALLBACK_PHONE;

  return (
    <header className="sticky top-0 z-40 bg-canvas-soft/90 backdrop-blur-md">
      <div className="hidden border-b border-hairline/70 sm:block">
        <div className="mx-auto flex h-8 max-w-[1180px] items-center justify-between px-5 text-[12px] text-muted sm:px-8">
          <span>{strapline}</span>
          <span className="flex items-center gap-1.5">
            <Phone size={13} />
            {phoneNumber}
          </span>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between border-b border-hairline px-5 sm:px-8">
        <Link href="/" aria-label={`${siteTitle} home`}>
          <Wordmark text={siteTitle} logoUrl={logoUrl} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="rounded-[10px] px-3 py-2 text-[14px] text-body transition-colors hover:bg-canvas hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={ctaHref}
            className="inline-flex h-10 items-center rounded-[10px] bg-rust-700 px-[18px] text-[14px] font-semibold text-on-rust shadow-[0_2px_5px_rgba(74,31,10,0.28),inset_0_1px_0_rgba(255,255,255,0.16)] transition-colors hover:bg-rust-600 active:translate-y-px"
          >
            {ctaLabel}
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-[10px] text-ink transition-colors hover:bg-canvas md:hidden"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-[2px] md:hidden"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild forceMount aria-describedby={undefined}>
                <motion.div
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed inset-x-3 top-3 z-50 rounded-[14px] border border-hairline bg-canvas p-3 h-shadow-md md:hidden"
                >
                  <div className="flex items-center justify-between px-2 py-1">
                    <Dialog.Title className="sr-only">Menu</Dialog.Title>
                    <Wordmark text={siteTitle} logoUrl={logoUrl} />
                    <Dialog.Close
                      aria-label="Close menu"
                      className="grid h-9 w-9 place-items-center rounded-[10px] text-muted hover:bg-canvas-soft hover:text-ink"
                    >
                      <X size={16} />
                    </Dialog.Close>
                  </div>
                  <div className="mt-1 flex flex-col">
                    {LINKS.map((l) => (
                      <Link
                        key={l.label}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="rounded-[10px] px-2 py-2.5 text-[15px] text-ink transition-colors hover:bg-canvas-soft"
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </header>
  );
}
