import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, Clock, MapPinLine } from "@phosphor-icons/react/dist/ssr";
import { HAJJ_PACKAGES, hajjPackageBySlug } from "@/data/hajj";
import { PageContainer } from "@/components/site/PageIntro";
import { ServiceSteps } from "@/components/site/ServicePage";
import { Photo } from "@/components/ui/Photo";
import { InquiryForm } from "@/components/site/InquiryForm";
import { formatGBP } from "@/lib/utils";

export function generateStaticParams() {
  return HAJJ_PACKAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = hajjPackageBySlug(slug);
  if (!p) return {};
  return { title: p.name, description: p.blurb };
}

export default async function HajjPackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = hajjPackageBySlug(slug);
  if (!p) notFound();

  return (
    <PageContainer>
      <Link
        href="/hajj"
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted hover:text-ink"
      >
        <ArrowLeft size={13} />
        Hajj
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:gap-14">
        <div>
          <span className="mb-3 inline-block rounded-full border border-hairline-firm bg-canvas-soft px-2.5 py-1 text-[12px] font-medium text-body">
            {p.type}
          </span>
          <h1 className="text-[32px] leading-[1.05] text-ink sm:text-[42px]">{p.name}</h1>
          <p className="mt-3 max-w-[52ch] text-[16px] text-body">{p.blurb}</p>

          <div className="mt-6 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-y border-hairline-firm py-4">
            <span className="flex items-baseline gap-1.5 text-[13px] text-body">
              <span data-numeric className="text-[17px] font-semibold text-ink">
                {p.nights}
              </span>
              nights
            </span>
            <span className="text-[13px] text-body">
              <span className="text-muted">from</span>{" "}
              <span data-numeric className="text-[17px] font-semibold text-ink">
                {formatGBP(p.fromPriceGBP)}
              </span>
            </span>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-[10px] border border-warning/30 bg-warning-bg px-4 py-3.5">
            <Clock size={17} weight="fill" className="mt-0.5 shrink-0 text-warning" />
            <p className="text-[13px] leading-relaxed text-ink">
              <span className="font-semibold">Apply {p.applicationDeadline}.</span> {p.quota},
              allocated in the order applications arrive.
            </p>
          </div>

          <Photo
            src={p.image}
            alt={p.name}
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="mt-8 aspect-[16/10] w-full rounded-[10px] border border-hairline"
          />

          <h2 className="mt-10 text-[18px] font-semibold text-ink">Accommodation</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {p.accommodation.map((a) => (
              <div key={a.location} className="rounded-[10px] border border-hairline-firm bg-canvas-soft p-4">
                <p className="flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                  <MapPinLine size={15} className="text-rust-700" />
                  {a.location}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-body">{a.detail}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-[18px] font-semibold text-ink">What else is included</h2>
          <ul className="mt-4 space-y-2.5">
            {[
              { label: "Transport", detail: p.transport },
              { label: "Meals", detail: p.meals },
              { label: "Guide", detail: p.guide },
            ].map((item) => (
              <li key={item.label} className="flex items-start gap-2.5 text-[14px] text-body">
                <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-rust-700" />
                <span>
                  <span className="font-medium text-ink">{item.label}.</span> {item.detail}
                </span>
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-[18px] font-semibold text-ink">Itinerary outline</h2>
          <div className="mt-5">
            <ServiceSteps steps={p.itinerary} />
          </div>

          {p.gallery.length > 0 && (
            <>
              <h2 className="mt-10 text-[18px] font-semibold text-ink">Gallery</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {p.gallery.map((src, i) => (
                  <Photo
                    key={i}
                    src={src}
                    alt={`${p.name}, photo ${i + 2}`}
                    className="aspect-square w-full rounded-[10px] border border-hairline"
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-3 text-[16px] font-semibold text-ink">Inquire now</h2>
          <InquiryForm subject={p.name} leadTime={p.applicationDeadline} askGroupSize />
        </div>
      </div>
    </PageContainer>
  );
}
