import Link from "next/link";
import { PageContainer, PageIntro } from "@/components/site/PageIntro";
import { ServiceSection } from "@/components/site/ServicePage";
import { getSiteSettings } from "@/lib/cms";

export async function generateMetadata() {
  const { site_title } = await getSiteSettings();
  return {
    title: "Privacy Policy",
    description: `How ${site_title} collects, uses and protects your information.`,
  };
}

const LAST_UPDATED = "17 September 2026";

const P = "mt-3 max-w-[68ch] text-[15px] leading-relaxed text-body";
const UL = "mt-3 max-w-[68ch] list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-body";

export default async function PrivacyPolicyPage() {
  const { site_title } = await getSiteSettings();

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Legal"
        title="Privacy Policy"
        lede={`Last updated ${LAST_UPDATED}. This explains what information ${site_title} collects when you use this site, and how it's used.`}
        className="mb-4"
      />
      <p className="mb-12 max-w-[68ch] text-[13px] italic text-muted">
        {site_title} is a design prototype, not a real travel agency or travel agency. This page is sample
        legal content written for demonstration purposes and should not be relied on as an actual
        privacy notice.
      </p>

      <div className="space-y-12">
        <ServiceSection title="Who we are">
          <p className={P}>
            {site_title} ("we", "us", "our") operates this site to let travellers browse and enquire
            about Umrah, Hajj, international tour and Pakistan tour packages, and related services
            such as visa consultation and air ticketing. This policy covers the information we
            collect through the site and how we handle it.
          </p>
        </ServiceSection>

        <ServiceSection title="Information we collect">
          <p className={P}>We collect information in three ways:</p>
          <ul className={UL}>
            <li>
              <strong>Information you give us</strong> — your name, email, phone number, and travel
              details when you make a booking enquiry, request a visa consultation, or contact us
              through Manage your trip or Help.
            </li>
            <li>
              <strong>Booking and travel information</strong> — passenger details, passport
              information, and package or itinerary preferences, collected to process the specific
              enquiry or booking you make.
            </li>
            <li>
              <strong>Usage information</strong> — collected automatically as you browse, such as
              pages visited and general device/browser information, to keep the site working
              reliably and to understand how it's used.
            </li>
          </ul>
        </ServiceSection>

        <ServiceSection title="How we use your information">
          <ul className={UL}>
            <li>To respond to enquiries and process bookings, visa consultations and add-ons</li>
            <li>To send booking confirmations, itinerary updates and service messages</li>
            <li>To provide customer support through Manage your trip and Help</li>
            <li>To keep the site secure and working correctly</li>
            <li>To meet legal and regulatory obligations, including for travel and visa processing</li>
          </ul>
          <p className={P}>
            We don't use your information for automated decision-making, and we don't sell your
            personal information to third parties.
          </p>
        </ServiceSection>

        <ServiceSection title="Cookies">
          <div id="cookies" className="scroll-mt-24">
            <p className={P}>
              We use a small number of cookies to keep the site working — remembering your chosen
              theme and light/dark mode, and keeping you signed in where relevant. We don't use
              third-party advertising or tracking cookies. You can control or clear cookies through
              your browser settings at any time; the site will still work, though some preferences
              may reset.
            </p>
          </div>
        </ServiceSection>

        <ServiceSection title="Sharing your information">
          <p className={P}>
            We share information only where it's needed to deliver the service you've asked for —
            for example, with hotels, transport providers, or visa-processing partners named in a
            package you book, or with a payment processor to handle a transaction. We don't share
            your information with third parties for their own marketing purposes.
          </p>
        </ServiceSection>

        <ServiceSection title="How long we keep it">
          <p className={P}>
            We keep booking and enquiry records for as long as needed to deliver the service, meet
            legal and tax obligations, and resolve any disputes — after which it's deleted or
            anonymised.
          </p>
        </ServiceSection>

        <ServiceSection title="Your rights">
          <p className={P}>
            Subject to applicable data protection law, you can ask us to: give you a copy of the
            information we hold about you; correct it if it's inaccurate; delete it; restrict or
            object to certain uses; or move it to another provider. To exercise any of these, get in
            touch through <Link href="/help" className="text-rust-700 hover:text-rust-600">Help</Link>.
          </p>
        </ServiceSection>

        <ServiceSection title="Children">
          <p className={P}>
            This site is not directed at children, and we don't knowingly collect information from
            anyone under 16 without a parent or guardian arranging the booking.
          </p>
        </ServiceSection>

        <ServiceSection title="Changes to this policy">
          <p className={P}>
            We may update this policy from time to time. The "last updated" date at the top of this
            page will always reflect the most recent version.
          </p>
        </ServiceSection>

        <ServiceSection title="Contact us">
          <p className={P}>
            Questions about this policy or your information can be sent through{" "}
            <Link href="/help" className="text-rust-700 hover:text-rust-600">Help</Link>.
          </p>
        </ServiceSection>
      </div>
    </PageContainer>
  );
}
