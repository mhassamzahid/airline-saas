import Link from "next/link";
import type { Destination } from "@/data/airports";
import { Photo } from "@/components/ui/Photo";
import { formatGBP } from "@/lib/utils";

/**
 * A plain link into a destination's detail page; visually related to the
 * booking wizard's selectable PhotoCard (same overlay language) but this one
 * navigates rather than selects, so it's a Link, not a styled radio input.
 */
export function DestinationCard({ d }: { d: Destination }) {
  return (
    <Link
      href={`/tours/${d.code}`}
      className="group relative block overflow-hidden rounded-[12px] border border-hairline bg-canvas transition-all hover:-translate-y-1 hover:h-shadow-md"
    >
      <Photo src={d.image} alt={`${d.city}, ${d.country}`} className="aspect-[5/6] w-full">
        <div
          className="photo-caption absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(20,32,31,0.9) 0%, rgba(20,32,31,0.45) 26%, rgba(20,32,31,0) 52%)",
          }}
        />
        <div className="photo-caption absolute inset-x-0 bottom-0 p-4 text-on-dark">
          <span className="text-[11px] font-medium uppercase tracking-wide text-on-dark/60">
            {d.region}
          </span>
          <div className="mt-1 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[20px] font-semibold leading-tight text-on-dark">{d.city}</h3>
              <p className="truncate text-[13px] text-on-dark/75">{d.tagline}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[11px] text-on-dark/60">from</p>
              <p data-numeric className="text-[16px] font-semibold text-on-dark">
                {formatGBP(d.baseFareGBP)}
              </p>
            </div>
          </div>
        </div>
      </Photo>
    </Link>
  );
}
