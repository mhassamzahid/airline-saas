import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { getFooterSettings } from "@/lib/cms";

// The brand-name column heading follows the CMS site title; everything else
// is fixed navigation.
function columns(siteTitle: string) {
  return [
    {
      title: "Travel",
      links: [
        { label: "Build an Umrah package", href: "/umrah" },
        { label: "Hajj", href: "/hajj" },
        { label: "International Tours", href: "/tours" },
        { label: "Pakistan Tours", href: "/pakistan-tours" },
        { label: "The fleet", href: "/experience" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Visa Consultation", href: "/visa-consultation" },
        { label: "Air Ticketing", href: "/air-ticketing" },
        { label: "Other Services", href: "/other-services" },
        { label: "Manage your trip", href: "/manage" },
      ],
    },
    {
      title: siteTitle,
      links: [
        { label: "The experience", href: "/experience" },
        { label: "Sustainability", href: "/experience" },
        { label: "Newsroom", href: "/help" },
        { label: "Careers", href: "/help" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "Contact us", href: "/contact" },
        { label: "Disruption and refunds", href: "/help" },
        { label: "Manage your trip", href: "/manage" },
        { label: "Accessibility", href: "/help" },
      ],
    },
  ];
}

const FALLBACK_TAGLINE =
  "An independent long-haul airline flying from London Gatwick, Manchester and Edinburgh. Quiet cabins, honest fares, and a plan you can see the whole way through.";

export async function Footer({
  siteTitle = "Halcyon",
  logoUrl = null,
}: {
  siteTitle?: string;
  logoUrl?: string | null;
}) {
  const cms = await getFooterSettings();
  const tagline = cms?.tagline || FALLBACK_TAGLINE;
  // Editor can set a real legal-entity name; otherwise follows the site title.
  const legalLine =
    cms?.legal_line || `${siteTitle} is a design prototype, not a real airline.`;
  // Editor can fully replace the nav columns; otherwise these follow the site
  // title in the brand column, same as everywhere else on the site.
  const COLUMNS = cms?.columns.length ? cms.columns : columns(siteTitle);

  return (
    <footer className="mt-24 bg-dark text-on-dark">
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.2fr_2fr]">
          <div>
            <Wordmark tone="light" text={siteTitle} logoUrl={logoUrl} />
            <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-on-dark-mut">
              {tagline}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="text-[13px] font-semibold text-on-dark">{col.title}</h3>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[13px] text-on-dark-mut transition-colors hover:text-on-dark"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-[12px] text-on-dark-mut sm:flex-row sm:items-center sm:justify-between">
          <p>{legalLine}</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-on-dark">Privacy</Link>
            <Link href="/privacy-policy#cookies" className="hover:text-on-dark">Cookies</Link>
            <Link href="/terms-of-service" className="hover:text-on-dark">Conditions of carriage</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
