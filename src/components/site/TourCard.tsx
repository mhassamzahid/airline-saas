import Link from "next/link";
import type { TourPackage } from "@/data/tours";
import { Photo } from "@/components/ui/Photo";
import { formatGBP } from "@/lib/utils";

/**
 * Two explicit CTAs per the brief (View Details / Inquire Now), so the photo
 * itself is the only clickable "card" surface -- the buttons below are plain
 * anchors styled like Button (see not-found.tsx for the same pattern), not a
 * <Button> nested inside a <Link>.
 */
export function TourCard({ p }: { p: TourPackage }) {
  return (
    <div className="group overflow-hidden rounded-[12px] border border-hairline bg-canvas transition-all hover:-translate-y-1 hover:h-shadow-md">
      <Link href={`/tours/${p.slug}`} className="block">
        <Photo src={p.image} alt={p.name} sizes="(min-width: 640px) 33vw, 100vw" className="aspect-[4/3] w-full">
          <div
            className="photo-caption absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(20,32,31,0.85) 0%, rgba(20,32,31,0.3) 32%, rgba(20,32,31,0) 55%)",
            }}
          />
          <div className="photo-caption absolute inset-x-0 bottom-0 p-4 text-on-dark">
            <span className="mb-2 inline-block rounded-full bg-on-dark/15 px-2.5 py-1 text-[11px] font-medium text-on-dark backdrop-blur-sm">
              {p.country}
            </span>
            <h3 className="text-[17px] font-semibold leading-tight">{p.name}</h3>
            <p className="mt-1 text-[12px] text-on-dark/80">{p.strap}</p>
          </div>
        </Photo>
      </Link>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="flex items-center gap-1.5 text-[13px] text-body">
            <span data-numeric>{p.durationDays}</span> days
          </span>
          <div className="text-right">
            <p className="text-[11px] text-muted">Estimated from</p>
            <p data-numeric className="text-[17px] font-semibold text-ink">
              {formatGBP(p.fromPriceGBP)}
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-hairline pt-3">
          <Link
            href={`/tours/${p.slug}`}
            className="inline-flex h-9 items-center justify-center rounded-[10px] border border-hairline-firm bg-canvas px-3 text-[13px] font-medium text-ink transition-colors hover:bg-canvas-soft"
          >
            View details
          </Link>
          <Link
            href={`/tours/${p.slug}#inquire`}
            className="inline-flex h-9 items-center justify-center rounded-[10px] bg-rust-700 px-3 text-[13px] font-medium text-on-rust transition-colors hover:bg-rust-600"
          >
            Inquire now
          </Link>
        </div>
      </div>
    </div>
  );
}
