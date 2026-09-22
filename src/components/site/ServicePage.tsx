import Link from "next/link";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import type { HeroAbstractVariant } from "@/components/ui/HeroAbstract";
import { cn } from "@/lib/utils";

interface ServicePageProps {
  eyebrow: string;
  title: string;
  lede: string;
  heroImage?: { src: string; alt: string; unoptimized?: boolean };
  /** Required alongside `heroImage` -- see `PageIntro`'s `heroVariant`. */
  heroVariant?: HeroAbstractVariant;
  /** Real figures for the hero (see `PageIntro`'s `facts`), e.g. a count pulled from `sections`. */
  heroFacts?: { value: string; label: string }[];
  children: React.ReactNode;
  cta?: { heading: string; body: string; label: string; href: string };
}

/**
 * Archetype D: a static service page (description, process, inquiry CTA).
 * One shell, reused for every secondary offering, so a new service page is
 * new content dropped into an existing pattern rather than a one-off build.
 */
export function ServicePage({ eyebrow, title, lede, heroImage, heroVariant, heroFacts, children, cta }: ServicePageProps) {
  return (
    <>
      {heroImage ? (
        <PageIntro eyebrow={eyebrow} title={title} lede={lede} image={heroImage} heroVariant={heroVariant} facts={heroFacts} />
      ) : (
        <PageContainer>
          <PageIntro eyebrow={eyebrow} title={title} lede={lede} />
        </PageContainer>
      )}

      <section className="border-t border-hairline bg-canvas">
        <PageContainer className="py-14 sm:py-16">
          <div className="space-y-14">{children}</div>
        </PageContainer>
      </section>

      {cta && (
        <section className="bg-dark text-on-dark">
          <PageContainer className="flex flex-col items-start gap-5 py-14 sm:flex-row sm:items-center sm:justify-between sm:py-16">
            <div>
              <h2 className="text-[24px] font-semibold">{cta.heading}</h2>
              <p className="mt-1.5 text-[14px] text-on-dark-mut">{cta.body}</p>
            </div>
            <Link
              href={cta.href}
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-[10px] bg-on-dark px-5 text-[15px] font-medium text-dark transition-opacity hover:opacity-90"
            >
              {cta.label}
              <ArrowRight size={16} />
            </Link>
          </PageContainer>
        </section>
      )}
    </>
  );
}

export function ServiceSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-[22px] text-ink">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function ServiceSteps({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <ol className="grid gap-6 sm:grid-cols-3">
      {steps.map((s, i) => (
        <li key={s.title} className="border-t border-hairline-firm pt-4">
          <span data-numeric className="text-[13px] font-semibold text-rust-700">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="mt-1.5 text-[15px] font-medium text-ink">{s.title}</p>
          <p className="mt-1 text-[13px] text-body">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function ServiceChecklist({
  title,
  items,
  className,
}: {
  title?: string;
  items: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      {title && <h3 className="text-[16px] font-semibold text-ink">{title}</h3>}
      <ul className={cn("space-y-2.5", title && "mt-4")}>
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-[14px] text-body">
            <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-rust-700" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
