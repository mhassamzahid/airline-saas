import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarBlank, MapPinLine, Star, Users, XCircle } from "@phosphor-icons/react/dist/ssr";
import { TOUR_PACKAGES, tourPackageBySlug } from "@/data/tours";
import { PageContainer } from "@/components/site/PageIntro";
import { ServiceChecklist } from "@/components/site/ServicePage";
import { TourCard } from "@/components/site/TourCard";
import { Photo } from "@/components/ui/Photo";
import { InquiryForm } from "@/components/site/InquiryForm";
import { formatGBP } from "@/lib/utils";

export function generateStaticParams() {
  return TOUR_PACKAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = tourPackageBySlug(slug);
  if (!p) return {};
  return { title: p.name, description: p.blurb };
}

export default async function TourPackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = tourPackageBySlug(slug);
  if (!p) notFound();

  const more = TOUR_PACKAGES.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <PageContainer>
      <Link
        href="/tours"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink"
      >
        <ArrowLeft size={13} /> International Tours
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
        <div>
          <span className="mb-3 inline-block rounded-full border border-hairline-firm bg-canvas-soft px-2.5 py-1 text-[12px] font-medium text-body">
            {p.country}
          </span>
          <h1 className="text-[32px] leading-[1.05] text-ink sm:text-[42px]">{p.name}</h1>
          <p className="mt-3 max-w-[52ch] text-[16px] text-body">{p.blurb}</p>

          <div className="mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-y border-hairline-firm py-4">
            <span className="flex items-baseline gap-1.5 text-[13px] text-body">
              <span data-numeric className="text-[17px] font-semibold text-ink">
                {p.durationDays}
              </span>
              days
            </span>
            <span className="text-[13px] text-body">
              <span className="text-muted">Estimated from</span>{" "}
              <span data-numeric className="text-[17px] font-semibold text-ink">
                {formatGBP(p.fromPriceGBP)}
              </span>
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-body">
              <CalendarBlank size={14} className="text-muted" /> Best in {p.season}
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-body">
              <Users size={14} className="text-muted" /> {p.groupTypes.join(" · ")}
            </span>
          </div>

          <Photo
            src={p.image}
            alt={p.name}
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="mt-8 aspect-[16/10] w-full rounded-[10px] border border-hairline"
          />

          <h2 className="mt-10 text-[18px] font-semibold text-ink">Day-by-day itinerary</h2>
          <ol className="mt-5 space-y-5">
            {p.itinerary.map((step) => (
              <li key={step.day} className="border-t border-hairline-firm pt-4">
                <span className="text-[12px] font-semibold uppercase tracking-wide text-rust-700">
                  {step.day}
                </span>
                <p className="mt-1 text-[15px] font-medium text-ink">{step.title}</p>
                <p className="mt-1 text-[13px] text-body">{step.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <ServiceChecklist title="What's included" items={p.inclusions} />
            <div>
              <h3 className="text-[16px] font-semibold text-ink">Not included</h3>
              <ul className="mt-4 space-y-2.5">
                {p.exclusions.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[14px] text-muted">
                    <XCircle size={16} className="mt-0.5 shrink-0 text-faint" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <h2 className="mt-10 text-[18px] font-semibold text-ink">Hotels</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {p.hotels.map((h) => (
              <div key={h.city} className="rounded-[10px] border border-hairline-firm bg-canvas-soft p-4">
                <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                  <MapPinLine size={15} className="text-rust-700" /> {h.city}
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-[13px] text-ink">
                  {h.name}
                  <span className="inline-flex items-center gap-0.5 text-rust-500">
                    {Array.from({ length: h.rating }).map((_, i) => (
                      <Star key={i} size={11} weight="fill" />
                    ))}
                  </span>
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-body">{h.detail}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-[18px] font-semibold text-ink">Gallery</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Photo
              src={p.image}
              alt={p.name}
              className="aspect-square w-full rounded-[10px] border border-hairline"
            />
            {p.gallery.map((src, i) => (
              <Photo
                key={i}
                src={src}
                alt={`${p.name}, photo ${i + 2}`}
                className="aspect-square w-full rounded-[10px] border border-hairline"
              />
            ))}
          </div>
        </div>

        <div id="inquire" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-3 text-[16px] font-semibold text-ink">Inquire now</h2>
          <InquiryForm subject={p.name} leadTime="2 business days" askGroupSize />
        </div>
      </div>

      <div className="mt-16 border-t border-hairline pt-12">
        <h2 className="text-[22px] text-ink">More tour packages</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {more.map((m) => (
            <TourCard key={m.slug} p={m} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
