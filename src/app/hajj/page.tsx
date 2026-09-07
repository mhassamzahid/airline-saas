import Link from "next/link";
import { ArrowRight, UsersThree, Clock } from "@phosphor-icons/react/dist/ssr";
import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { HAJJ_PACKAGES } from "@/data/hajj";

export const metadata = {
  title: "Hajj",
  description: "Fixed, quota'd Hajj packages for the season. Browse what's included and request a place.",
};

export default function HajjPage() {
  return (
    <PageContainer>
      <PageIntro
        eyebrow="Hajj"
        title="A place for the season"
        lede="Hajj allocation is genuinely limited, so it isn't a filter: it's a short list of fixed packages, each with its own quota and application deadline. Open one to see what's included and request a place."
        className="mb-10"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {HAJJ_PACKAGES.map((p) => (
          <Link
            key={p.slug}
            href={`/hajj/${p.slug}`}
            className="group block overflow-hidden rounded-[12px] border border-hairline bg-canvas transition-all hover:-translate-y-1 hover:h-shadow-md"
          >
            <Photo
              src={p.image}
              alt={p.name}
              sizes="(min-width: 640px) 50vw, 100vw"
              className="aspect-[16/10] w-full"
            >
              <div
                className="photo-caption absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(20,32,31,0.85) 0%, rgba(20,32,31,0.3) 32%, rgba(20,32,31,0) 55%)",
                }}
              />
              <div className="photo-caption absolute inset-x-0 bottom-0 p-5 text-on-dark">
                <h2 className="text-[20px] font-semibold leading-tight">{p.name}</h2>
                <p className="mt-1 text-[13px] text-on-dark/80">{p.strap}</p>
              </div>
            </Photo>
            <div className="flex items-center justify-between gap-3 border-t border-hairline bg-canvas p-4">
              <span className="flex items-center gap-1.5 text-[13px] text-body">
                <UsersThree size={15} className="text-rust-700" />
                {p.quota}
              </span>
              <span className="flex items-center gap-1.5 text-[13px] text-body">
                <Clock size={15} className="text-rust-700" />
                Apply {p.applicationDeadline}
              </span>
              <span className="flex items-center gap-1 text-[13px] font-medium text-rust-700 transition-transform group-hover:translate-x-0.5">
                Details
                <ArrowRight size={13} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
