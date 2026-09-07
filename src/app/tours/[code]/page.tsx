import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, MapPinLine, TrendUp } from "@phosphor-icons/react/dist/ssr";
import { DESTINATIONS, destinationByCode, BLOCK_MINUTES } from "@/data/airports";
import { PageContainer } from "@/components/site/PageIntro";
import { DestinationCard } from "@/components/site/DestinationCard";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Photo } from "@/components/ui/Photo";
import { formatGBP, formatDuration } from "@/lib/utils";

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ code: d.code }));
}

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const d = destinationByCode(code.toUpperCase());
  if (!d) return {};
  return {
    title: d.city,
    description: `Fly nonstop to ${d.city}, ${d.country}, from ${formatGBP(d.baseFareGBP)}. ${d.blurb}`,
  };
}

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const d = destinationByCode(code.toUpperCase());
  if (!d) notFound();

  const flightTime = BLOCK_MINUTES[d.code];
  const more = DESTINATIONS.filter((x) => x.code !== d.code).slice(0, 3);

  return (
    <>
      <PageContainer className="pb-10 sm:pb-12">
        <Photo
          src={d.image}
          alt={`${d.city}, ${d.country}`}
          priority
          sizes="100vw"
          className="aspect-[16/9] w-full rounded-[10px] border border-hairline sm:aspect-[21/9]"
        >
          <div className="photo-caption absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/35 to-transparent" />
          <div className="photo-caption absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 sm:p-8">
            <div className="min-w-0">
              <span className="mb-2 inline-block rounded-full bg-on-dark/15 px-2.5 py-1 text-[12px] font-medium text-on-dark backdrop-blur-sm">
                {d.region}
              </span>
              <h1 className="text-[32px] font-semibold leading-[1.05] text-on-dark sm:text-[44px]">
                {d.city}
              </h1>
              <p className="mt-1.5 text-[14px] text-on-dark/80">
                {d.name}, {d.country}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[11px] text-on-dark/60">from</p>
              <p data-numeric className="text-[26px] font-semibold text-on-dark sm:text-[30px]">
                {formatGBP(d.baseFareGBP)}
              </p>
            </div>
          </div>
        </Photo>
      </PageContainer>

      <section className="border-t border-hairline bg-canvas">
        <PageContainer className="py-14 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
            <div>
              <p className="overline mb-3">{d.tagline}</p>
              <p className="max-w-[64ch] text-[16px] leading-relaxed text-body">{d.blurb}</p>

              <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-hairline-firm pt-6">
                <div>
                  <dt className="flex items-center gap-1.5 text-[12px] text-muted">
                    <Clock size={14} /> Flight time
                  </dt>
                  <dd data-numeric className="mt-1 text-[18px] font-semibold text-ink">
                    {flightTime ? formatDuration(flightTime) : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-[12px] text-muted">
                    <MapPinLine size={14} /> Region
                  </dt>
                  <dd className="mt-1 text-[18px] font-semibold text-ink">{d.region}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-[12px] text-muted">
                    <TrendUp size={14} /> Demand
                  </dt>
                  <dd className="mt-1 text-[18px] font-semibold text-ink">
                    {d.popular ? "Popular route" : "Standard"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:sticky lg:top-24">
              <div className="rounded-[10px] border border-hairline bg-canvas-soft p-5 h-shadow-sm">
                <p className="text-[13px] text-muted">One-way economy fare from</p>
                <p data-numeric className="mt-1 text-[28px] font-semibold text-ink">
                  {formatGBP(d.baseFareGBP)}
                </p>
                <p className="mt-1 text-[12px] text-muted">Per adult, before taxes and cabin</p>
              </div>
              <div className="mt-4">
                <InquiryForm subject={`the ${d.city} tour`} leadTime="2 business days" />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer className="py-14 sm:py-16">
        <h2 className="text-[22px] text-ink">More destinations</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {more.map((m) => (
            <DestinationCard key={m.code} d={m} />
          ))}
        </div>
        <Link
          href="/tours"
          className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-rust-700 hover:text-rust-600"
        >
          See all destinations
          <ArrowRight size={13} />
        </Link>
      </PageContainer>
    </>
  );
}
