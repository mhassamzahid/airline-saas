import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, UsersThree, Clock } from "@phosphor-icons/react/dist/ssr";
import { HAJJ_PACKAGES, hajjPackageBySlug } from "@/data/hajj";
import { PageContainer } from "@/components/site/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { InquiryForm } from "@/components/site/InquiryForm";

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
          <p className="overline mb-3">Hajj</p>
          <h1 className="text-[32px] leading-[1.05] text-ink sm:text-[42px]">{p.name}</h1>
          <p className="mt-3 max-w-[52ch] text-[16px] text-body">{p.blurb}</p>

          <div className="mt-6 flex flex-wrap gap-4 border-y border-hairline-firm py-4">
            <span className="flex items-center gap-1.5 text-[13px] text-body">
              <UsersThree size={16} className="text-rust-700" />
              {p.quota}
            </span>
            <span className="flex items-center gap-1.5 text-[13px] text-body">
              <Clock size={16} className="text-rust-700" />
              Apply {p.applicationDeadline}
            </span>
          </div>

          <Photo
            src={p.image}
            alt={p.name}
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="mt-8 aspect-[16/10] w-full rounded-[10px] border border-hairline"
          />

          <h2 className="mt-10 text-[18px] font-semibold text-ink">What&apos;s included</h2>
          <ul className="mt-4 space-y-2.5">
            {p.inclusions.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[14px] text-body">
                <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-rust-700" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <InquiryForm subject={p.name} leadTime={p.applicationDeadline} askGroupSize />
        </div>
      </div>
    </PageContainer>
  );
}
