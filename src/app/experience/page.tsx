import Link from "next/link";
import { ArrowRight, WifiHigh, ForkKnife, Leaf, Waveform } from "@phosphor-icons/react/dist/ssr";
import { CABINS } from "@/data/cabins";
import { DESTINATIONS, ORIGINS } from "@/data/airports";
import { FLEET, FLEET_STATS } from "@/data/fleet";
import { PageContainer } from "@/components/site/PageIntro";
import { Photo } from "@/components/ui/Photo";
import { RouteArc } from "@/components/ui/RouteArc";
import { stock } from "@/lib/img";
import { formatGBP } from "@/lib/utils";
import { getSiteSettings } from "@/lib/cms";

export async function generateMetadata() {
  const { site_title } = await getSiteSettings();
  return {
    title: "The experience",
    description: `Quiet cabins, food on your schedule, and a fleet chosen for how you feel when you land. What flying ${site_title} is actually like.`,
  };
}

export default function ExperiencePage() {
  return (
    <>
      {/* Hero */}
      <PageContainer className="relative pb-10 sm:pb-12">
        <RouteArc
          from="LGW"
          to="SYD"
          className="pointer-events-none absolute -top-8 right-[-24px] hidden h-[260px] w-[640px] lg:block"
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
          <div>
            <p className="overline mb-4">The experience</p>
            <h1 className="text-[38px] leading-[1.05] text-ink sm:text-[52px]">
              Long-haul that does not
              <br />
              cost you the next day.
            </h1>
            <p className="mt-4 max-w-[46ch] text-[16px] text-body">
              We fly one aircraft family, keep the cabins dark and quiet, and let you
              eat and sleep on your own clock. The point is to land ready.
            </p>
            <Link
              href="/umrah"
              className="mt-7 inline-flex h-11 items-center gap-2 rounded-[10px] bg-rust-700 px-5 text-[15px] font-medium text-on-rust transition-colors hover:bg-rust-600"
            >
              Plan a trip
              <ArrowRight size={16} />
            </Link>
          </div>
          <Photo
            src={stock("photo-1540339832862-474599807836", 900, 1125)}
            alt="A darkened wide-body cabin at cruise, reading lights low"
            priority
            sizes="(min-width: 1024px) 38vw, 0px"
            className="hidden aspect-[4/5] rounded-[10px] border border-hairline lg:block"
          />
        </div>
      </PageContainer>

      {/* Cabins: editorial list */}
      <section className="border-t border-hairline bg-canvas">
        <PageContainer className="py-14 sm:py-16">
          <h2 className="text-[24px] text-ink">Four ways to travel</h2>
          <p className="mt-2 max-w-[52ch] text-[15px] text-body">
            Every cabin is on every route. Prices below are the lowest return fare
            per adult on our shortest sectors, before taxes.
          </p>
          <ul className="mt-8 divide-y divide-hairline border-y border-hairline">
            {CABINS.map((c) => {
              const from = Math.min(...DESTINATIONS.map((d) => d.baseFareGBP)) * c.multiplier * 2;
              return (
                <li key={c.id}>
                  <Link
                    href="/umrah"
                    className="group flex flex-col gap-2 py-5 transition-colors hover:bg-canvas-soft sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <span className="w-32 shrink-0 text-[16px] font-semibold text-ink">
                      {c.name}
                    </span>
                    <span className="flex-1 text-[14px] text-body">{c.strap}</span>
                    <span className="flex items-baseline gap-3">
                      <span className="text-[12px] text-muted">from</span>
                      <span data-numeric className="text-[15px] font-semibold text-ink">
                        {formatGBP(from)}
                      </span>
                      <ArrowRight
                        size={15}
                        className="text-muted transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </PageContainer>
      </section>

      {/* What's different: bento */}
      <PageContainer className="py-14 sm:py-16">
        <h2 className="text-[24px] text-ink">What we build around</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3 md:grid-rows-2">
          <Photo
            src={stock("photo-1436491865332-7a61a109cc05", 800, 1000)}
            alt="A quiet cabin aisle with soft floor lighting"
            sizes="(min-width: 768px) 33vw, 100vw"
            className="row-span-2 min-h-[320px] rounded-[10px] border border-hairline"
          >
            <div className="photo-caption absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-dark/90 via-dark/35 to-transparent p-6 text-on-dark">
              <Waveform size={20} weight="fill" />
              <h3 className="mt-3 text-[18px] font-semibold">Quiet by design</h3>
              <p className="mt-1.5 text-[13px] text-on-dark-mut">
                A350 and 787 airframes, engines kept off the boarding stand until
                the last minute, and a crew briefed to keep announcements short.
              </p>
            </div>
          </Photo>

          <article className="rounded-[10px] border border-hairline bg-canvas p-5">
            <ForkKnife size={20} className="text-rust-700" />
            <h3 className="mt-3 text-[16px] font-semibold text-ink">Food on your clock</h3>
            <p className="mt-1.5 text-[13px] text-body">
              Order when you are hungry, not when the trolley arrives. Business and
              First get an à la carte menu with no fixed service.
            </p>
          </article>

          <article className="rounded-[10px] border border-hairline bg-canvas p-5">
            <WifiHigh size={20} className="text-rust-700" />
            <h3 className="mt-3 text-[16px] font-semibold text-ink">Wi-Fi that holds up</h3>
            <p className="mt-1.5 text-[13px] text-body">
              Streaming-quality on a single flat fee for the whole trip. Messaging
              is free in every cabin.
            </p>
          </article>

          <article className="rounded-[10px] border border-rust-500 bg-rust-100 p-5 md:col-span-2">
            <Leaf size={20} className="text-rust-700" weight="fill" />
            <h3 className="mt-3 text-[16px] font-semibold text-ink">
              Carbon: measured, then removed
            </h3>
            <p className="mt-1.5 max-w-[52ch] text-[13px] text-rust-700">
              We publish the fuel burn for every route. The default contribution on
              your ticket goes to permanent removal, not offsets that expire.
            </p>
          </article>
        </div>
      </PageContainer>

      {/* Fleet */}
      <section className="border-t border-hairline bg-canvas">
        <PageContainer className="py-14 sm:py-16">
          <h2 className="text-[24px] text-ink">The fleet</h2>
          <p className="mt-2 max-w-[52ch] text-[15px] text-body">
            One family, three variants. Fewer types means better-trained crews and
            fewer surprises when a schedule has to change.
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
            {FLEET_STATS.map((s) => (
              <div key={s.label} className="border-t border-hairline-firm pt-3">
                <dt className="text-[13px] text-muted">{s.label}</dt>
                <dd data-numeric className="mt-1 text-[22px] font-semibold text-ink">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>

          <ul className="mt-10 divide-y divide-hairline border-y border-hairline">
            {FLEET.map((a) => (
              <li key={a.type} className="grid gap-2 py-5 sm:grid-cols-[200px_1fr_1.4fr] sm:gap-6">
                <div>
                  <p className="text-[15px] font-semibold text-ink">{a.type}</p>
                  <p data-numeric className="text-[13px] text-muted">
                    {a.count} in service
                  </p>
                </div>
                <p className="text-[13px] text-body">
                  {a.seats}
                  <br />
                  <span className="text-muted">{a.routes}</span>
                </p>
                <p className="text-[13px] text-body">{a.note}</p>
              </li>
            ))}
          </ul>
        </PageContainer>
      </section>

      {/* Route snapshot: a teaser; the full filterable list lives at /tours */}
      <PageContainer className="py-14 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[24px] text-ink">Where we fly</h2>
            <p className="mt-2 text-[15px] text-body">
              Non-stop from three UK bases, with a second frequency on the routes
              that fill.
            </p>
          </div>
          <Link
            href="/tours"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-rust-700 hover:text-rust-600"
          >
            Browse all destinations
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {ORIGINS.map((o) => (
            <span
              key={o.code}
              className="rounded-full border border-hairline-firm bg-canvas-soft px-3 py-1.5 text-[13px] text-body"
            >
              <span data-numeric className="font-medium text-ink">{o.code}</span>{" "}
              {o.city}
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.filter((d) => d.popular).map((d) => (
            <Link
              key={d.code}
              href={`/tours/${d.code}`}
              className="flex items-baseline justify-between gap-3 border-b border-hairline py-3 transition-colors hover:border-hairline-firm"
            >
              <span className="flex items-baseline gap-2.5">
                <span data-numeric className="text-[13px] font-medium text-muted">
                  {d.code}
                </span>
                <span className="text-[15px] text-ink">{d.city}</span>
              </span>
              <span className="flex items-baseline gap-1 text-[13px] text-body">
                <span className="text-muted">from</span>
                <span data-numeric>{formatGBP(d.baseFareGBP)}</span>
              </span>
            </Link>
          ))}
        </div>
      </PageContainer>

      {/* CTA */}
      <section className="bg-dark text-on-dark">
        <PageContainer className="flex flex-col items-start gap-5 py-14 sm:flex-row sm:items-center sm:justify-between sm:py-16">
          <div>
            <h2 className="text-[24px] font-semibold">See it priced for your trip</h2>
            <p className="mt-1.5 text-[14px] text-on-dark-mut">
              Route, dates and cabin. Two minutes, no account needed.
            </p>
          </div>
          <Link
            href="/umrah"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-[10px] bg-on-dark px-5 text-[15px] font-medium text-dark transition-opacity hover:opacity-90"
          >
            Build your fare
            <ArrowRight size={16} />
          </Link>
        </PageContainer>
      </section>
    </>
  );
}
