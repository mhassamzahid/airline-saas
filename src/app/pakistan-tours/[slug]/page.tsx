import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarBlank, MapPinLine, Star, Users } from "@phosphor-icons/react/dist/ssr";
import { PAKISTAN_TOUR_PACKAGES, pakistanTourPackageBySlug } from "@/data/pakistan-tours";
import { PageContainer } from "@/components/site/PageIntro";
import { ServiceChecklist } from "@/components/site/ServicePage";
import { PakistanTourCard } from "@/components/site/PakistanTourCard";
import { Photo } from "@/components/ui/Photo";
import { InquiryForm } from "@/components/site/InquiryForm";
import { formatGBP } from "@/lib/utils";

export function generateStaticParams() {
  return PAKISTAN_TOUR_PACKAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = pakistanTourPackageBySlug(slug);
  if (!p) return {};
  return { title: p.name, description: p.blurb };
}

export default async function PakistanTourPackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = pakistanTourPackageBySlug(slug);
  if (!p) notFound();

  const more = PAKISTAN_TOUR_PACKAGES.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <PageContainer>
      <Link
        href="/pakistan-tours"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink"
      >
        <ArrowLeft size={13} /> Pakistan Tours
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
        <div>
          <div className="mb-3 flex flex-wrap gap-1.5">
            <span className="inline-block rounded-full border border-hairline-firm bg-canvas-soft px-2.5 py-1 text-[12px] font-medium text-body">
              {p.region}
            </span>
            {p.cardTag && (
              <span className="inline-block rounded-full bg-rust-700 px-2.5 py-1 text-[12px] font-medium text-on-rust">
                {p.cardTag}
              </span>
            )}
          </div>
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

          <h2 className="mt-10 text-[18px] font-semibold text-ink">Itinerary</h2>
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

          <ServiceChecklist title="What's included" items={p.inclusions} className="mt-10" />

          <h2 className="mt-10 text-[18px] font-semibold text-ink">Hotel & camping info</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {p.stays.map((s) => (
              <div key={s.location} className="rounded-[10px] border border-hairline-firm bg-canvas-soft p-4">
                <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                  <MapPinLine size={15} className="text-rust-700" /> {s.location}
                  <span className="rounded-full bg-canvas px-2 py-0.5 text-[11px] font-medium text-muted">
                    {s.type}
                  </span>
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-[13px] text-ink">
                  {s.name}
                  {s.rating && (
                    <span className="inline-flex items-center gap-0.5 text-rust-500">
                      {Array.from({ length: s.rating }).map((_, i) => (
                        <Star key={i} size={11} weight="fill" />
                      ))}
                    </span>
                  )}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-body">{s.detail}</p>
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
          <h2 className="mb-3 text-[16px] font-semibold text-ink">Book now</h2>
          <InquiryForm subject={p.name} leadTime="2 business days" askGroupSize />
        </div>
      </div>

      <div className="mt-16 border-t border-hairline pt-12">
        <h2 className="text-[22px] text-ink">More tour packages</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {more.map((m) => (
            <PakistanTourCard key={m.slug} p={m} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
