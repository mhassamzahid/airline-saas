import { AirplaneInFlight, AirplaneTakeoff } from "@phosphor-icons/react/dist/ssr";
import { Wordmark } from "@/components/ui/Wordmark";
import { cn } from "@/lib/utils";

export interface PassLeg {
  label: string;
  flightNo: string;
  date: string;
  dep: string;
  arr: string;
}

interface BoardingPassProps {
  reference: string;
  status: "confirmed" | "sample";
  from: { code: string; city: string };
  to: { code: string; city: string };
  passenger: string;
  cabin: string;
  legs: PassLeg[];
  /** Rendered in the tear-off stub, under the perforation (actions for the real pass). */
  stub?: React.ReactNode;
  className?: string;
}

export function BoardingPass({
  reference,
  status,
  from,
  to,
  passenger,
  cabin,
  legs,
  stub,
  className,
}: BoardingPassProps) {
  const sample = status === "sample";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[14px] border bg-canvas h-shadow-raised",
        sample ? "border-dashed border-hairline-firm" : "border-hairline",
        className,
      )}
    >
      {/* Face */}
      <div className="relative p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <Wordmark />
          <span
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
              sample ? "bg-canvas-sink text-muted" : "bg-success-bg text-success",
            )}
          >
            {sample ? "Sample" : "Confirmed"}
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p data-numeric className="text-[34px] font-semibold leading-none text-ink">
              {from.code}
            </p>
            <p className="mt-1 text-[12px] text-muted">{from.city}</p>
          </div>
          <div className="mb-2 flex flex-1 items-center gap-1.5 text-rust-700">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            <span className="h-px flex-1 border-t border-dashed border-current" />
            <AirplaneInFlight size={16} weight="fill" className="shrink-0" />
            <span className="h-px flex-1 border-t border-dashed border-current" />
            <span className="h-1.5 w-1.5 shrink-0 rounded-full border border-current" />
          </div>
          <div className="text-right">
            <p data-numeric className="text-[34px] font-semibold leading-none text-ink">
              {to.code}
            </p>
            <p className="mt-1 text-[12px] text-muted">{to.city}</p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-y-3 border-t border-hairline pt-4 text-[13px] sm:grid-cols-3">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.1em] text-muted">Passenger</dt>
            <dd className="mt-0.5 font-medium text-ink">{passenger}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.1em] text-muted">Cabin</dt>
            <dd className="mt-0.5 font-medium text-ink">{cabin}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-[0.1em] text-muted">Flights</dt>
            <dd data-numeric className="mt-0.5 font-medium text-ink">{legs.length}</dd>
          </div>
        </dl>

        <div className="mt-4 space-y-2.5">
          {legs.map((leg) => (
            <div key={leg.label} className="flex items-center gap-3 text-[13px]">
              <AirplaneTakeoff size={15} weight="fill" className="shrink-0 text-rust-700" />
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.08em] text-muted">
                  {leg.label} · {leg.date}
                </p>
                <p data-numeric className="text-ink">
                  <span className="text-muted">{leg.flightNo}</span> {leg.dep}
                  <span className="text-muted"> to </span>
                  {leg.arr}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Perforation */}
      <div className="relative">
        <span className="absolute -left-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-hairline-firm bg-canvas-soft" />
        <span className="absolute -right-2.5 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-hairline-firm bg-canvas-soft" />
        <div className="mx-6 border-t-2 border-dotted border-hairline-firm" />
      </div>

      {/* Stub */}
      <div className="bg-canvas-soft p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.1em] text-muted">Booking reference</p>
            <p data-numeric className="mt-0.5 text-[18px] font-semibold text-ink">
              {reference}
            </p>
          </div>
          <div
            aria-hidden
            className="h-10 w-28 shrink-0 opacity-70"
            style={{
              background:
                "repeating-linear-gradient(90deg, var(--color-ink) 0 1px, transparent 1px 3px, var(--color-ink) 3px 5px, transparent 5px 6px, var(--color-ink) 6px 8px, transparent 8px 11px)",
            }}
          />
        </div>
        {stub && <div className="mt-4">{stub}</div>}
      </div>
    </div>
  );
}
