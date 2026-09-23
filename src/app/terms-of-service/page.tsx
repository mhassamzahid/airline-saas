import Link from "next/link";
import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { ServiceSection } from "@/components/site/ServicePage";
import { getSiteSettings } from "@/lib/cms";

export async function generateMetadata() {
  const { site_title } = await getSiteSettings();
  return {
    title: "Terms of Service",
    description: `The terms that apply when you use ${site_title} or book a package through us.`,
  };
}

const LAST_UPDATED = "17 September 2026";

const P = "mt-3 max-w-[68ch] text-[15px] leading-relaxed text-body";
const UL = "mt-3 max-w-[68ch] list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-body";

export default async function TermsOfServicePage() {
  const { site_title } = await getSiteSettings();

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Legal"
        title="Terms of Service"
        lede={`Last updated ${LAST_UPDATED}. These terms apply whenever you use this site or ask ${site_title} to arrange a package or service.`}
        className="-mt-16 mb-4 sm:-mt-20"
      />
      <p className="mb-12 max-w-[68ch] text-[13px] italic text-muted">
        {site_title} is a design prototype, not a real travel agency or travel agency. This page is sample
        legal content written for demonstration purposes and should not be relied on as an actual
        terms of service.
      </p>

      <div className="space-y-12">
        <ServiceSection title="Acceptance of these terms">
          <p className={P}>
            By browsing this site, submitting an enquiry, or asking us to arrange an Umrah, Hajj,
            tour package, visa consultation or ticketing service, you agree to these terms. If you
            don't agree with them, please don't use the site.
          </p>
        </ServiceSection>

        <ServiceSection title="What we do">
          <p className={P}>
            We help travellers plan and book Umrah, Hajj, international tour and Pakistan tour
            packages, and arrange related services such as visa consultation and air ticketing.
            Prices shown across the site are estimates until a booking is confirmed by our sales
            team — the final price and availability are confirmed directly with you before payment.
          </p>
        </ServiceSection>

        <ServiceSection title="Bookings and payment">
          <ul className={UL}>
            <li>A booking is only confirmed once you've received written confirmation from us, not on submitting an enquiry or holding a quote.</li>
            <li>Prices are quoted in GBP and may change until confirmed, to reflect currency, availability or supplier pricing.</li>
            <li>You're responsible for making sure passenger names and details match travel documents exactly, as errors can affect visas and travel.</li>
          </ul>
        </ServiceSection>

        <ServiceSection title="Changes, cancellations and refunds">
          <p className={P}>
            Changes and cancellations are handled case by case, depending on the package, supplier
            terms, and how close to departure the request is made. Full details are confirmed with
            your booking; our general disruption and refunds approach is set out on{" "}
            <Link href="/help" className="text-rust-700 hover:text-rust-600">Help</Link>.
          </p>
        </ServiceSection>

        <ServiceSection title="Your responsibilities">
          <ul className={UL}>
            <li>Holding a passport valid for the destination and duration of travel, and any required visa.</li>
            <li>Meeting any health, vaccination or entry requirements set by the destination country.</li>
            <li>Arriving at the airport and any meeting points at the times we confirm with you.</li>
            <li>Behaving appropriately during religious rites and at sacred sites on Umrah and Hajj packages.</li>
          </ul>
          <p className={P}>
            Visa consultation is advisory: final visa decisions are always made by the relevant
            government or embassy, not by us.
          </p>
        </ServiceSection>

        <ServiceSection title="Intellectual property">
          <p className={P}>
            The text, images and design on this site belong to {site_title} or its licensors and
            can't be reused without permission, other than for your own personal, non-commercial use
            of the site.
          </p>
        </ServiceSection>

        <ServiceSection title="Liability">
          <p className={P}>
            We arrange packages with reputable hotels, transport and service providers, but we're
            not liable for matters outside our reasonable control — including provider failures,
            travel disruption, natural events, or changes in government or airline policy. Nothing
            in these terms limits liability that can't be excluded by law.
          </p>
        </ServiceSection>

        <ServiceSection title="Governing law">
          <p className={P}>
            These terms are governed by the law of England and Wales, and any dispute is subject to
            the exclusive jurisdiction of the courts of England and Wales.
          </p>
        </ServiceSection>

        <ServiceSection title="Changes to these terms">
          <p className={P}>
            We may update these terms from time to time. The "last updated" date at the top of this
            page will always reflect the most recent version. Continuing to use the site after a
            change means you accept the updated terms.
          </p>
        </ServiceSection>

        <ServiceSection title="Contact us">
          <p className={P}>
            Questions about these terms can be sent through{" "}
            <Link href="/help" className="text-rust-700 hover:text-rust-600">Help</Link>.
          </p>
        </ServiceSection>
      </div>
    </PageContainer>
  );
}
