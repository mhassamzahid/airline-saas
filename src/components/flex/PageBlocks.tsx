import Link from "next/link";
import { marked } from "marked";
import { ArrowRight, CaretDown, Quotes } from "@phosphor-icons/react/dist/ssr";
import { Photo } from "@/components/ui/Photo";
import { resolveIcon } from "@/lib/icons";
import { cmsImageUrl, type FlexBlock, type CmsLink } from "@/lib/cms";
import { sanitizeRichText, sanitizeMarkdown } from "@/lib/sanitize";

/** Long-form prose styling shared by the rich-text and markdown blocks. */
const PROSE_CLASS =
  "prose-halcyon max-w-[68ch] text-[16px] leading-relaxed text-body [&_a]:font-medium [&_a]:text-rust-700 [&_a:hover]:text-rust-600 [&_h1]:mb-3 [&_h1]:mt-8 [&_h1]:text-[28px] [&_h1]:font-semibold [&_h1]:text-ink [&_h2]:mb-2 [&_h2]:mt-8 [&_h2]:text-[24px] [&_h2]:text-ink [&_h3]:mb-1.5 [&_h3]:mt-6 [&_h3]:text-[18px] [&_h3]:font-semibold [&_h3]:text-ink [&_h4]:mb-1 [&_h4]:mt-5 [&_h4]:text-[16px] [&_h4]:font-semibold [&_h4]:text-ink [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-rust-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-canvas-soft [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[13px] [&_table]:my-4 [&_table]:w-full [&_table]:text-[14px] [&_th]:border-b [&_th]:border-hairline-firm [&_th]:py-2 [&_th]:text-left [&_td]:border-b [&_td]:border-hairline [&_td]:py-2";

function CtaButton({ cta, tone = "solid" }: { cta: CmsLink; tone?: "solid" | "on-dark" }) {
  return (
    <Link
      href={cta.href}
      className={
        tone === "on-dark"
          ? "inline-flex h-11 items-center gap-2 rounded-[10px] bg-on-dark px-5 text-[15px] font-medium text-dark transition-opacity hover:opacity-90"
          : "inline-flex h-11 items-center gap-2 rounded-[10px] bg-rust-700 px-5 text-[15px] font-medium text-on-rust transition-colors hover:bg-rust-600"
      }
    >
      {cta.label}
      <ArrowRight size={16} />
    </Link>
  );
}

const Container = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto max-w-[1180px] px-5 sm:px-8">{children}</div>
);

function HeroBlock({ value }: Extract<FlexBlock, { type: "hero" }>) {
  const img = cmsImageUrl(value.image);
  const cta = value.cta?.label ? value.cta : null;
  return (
    <section className="relative overflow-hidden border-b border-hairline">
      {img && (
        <Photo src={img} alt="" priority className="absolute inset-0 h-full w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/30 to-transparent" />
        </Photo>
      )}
      <Container>
        <div
          className={`relative py-16 sm:py-24 ${img ? "text-on-dark" : ""}`}
        >
          {value.eyebrow && (
            <p className={`overline mb-3 ${img ? "text-on-dark/70" : ""}`}>{value.eyebrow}</p>
          )}
          <h1 className="max-w-[20ch] text-[38px] leading-[1.05] sm:text-[54px]">
            {value.heading}
          </h1>
          {value.subheading && (
            <p className={`mt-4 max-w-[56ch] text-[16px] leading-relaxed ${img ? "text-on-dark/85" : "text-body"}`}>
              {value.subheading}
            </p>
          )}
          {cta && (
            <div className="mt-7">
              <CtaButton cta={cta} tone={img ? "on-dark" : "solid"} />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

function RichTextBlock({ value }: Extract<FlexBlock, { type: "rich_text" }>) {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div
          className={PROSE_CLASS}
          dangerouslySetInnerHTML={{ __html: sanitizeRichText(value.text) }}
        />
      </Container>
    </section>
  );
}

function MarkdownBlock({ value }: Extract<FlexBlock, { type: "markdown" }>) {
  const html = sanitizeMarkdown(marked.parse(value.body, { async: false }));
  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className={PROSE_CLASS} dangerouslySetInnerHTML={{ __html: html }} />
      </Container>
    </section>
  );
}

function ImageBlock({ value }: Extract<FlexBlock, { type: "image" }>) {
  const img = cmsImageUrl(value.image);
  if (!img) return null;
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <figure>
          <Photo src={img} alt={value.caption || ""} className="aspect-[16/9] w-full rounded-[10px] border border-hairline" />
          {value.caption && (
            <figcaption className="mt-2 text-[13px] text-muted">{value.caption}</figcaption>
          )}
        </figure>
      </Container>
    </section>
  );
}

function FeatureGridBlock({ value }: Extract<FlexBlock, { type: "feature_grid" }>) {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        {value.heading && <h2 className="text-[22px] text-ink">{value.heading}</h2>}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {value.items.map((item, i) => {
            const Icon = resolveIcon(item.icon_name);
            return (
              <div key={i} className="rounded-[10px] border border-hairline bg-canvas p-5">
                {Icon && <Icon size={20} weight="fill" className="text-rust-700" />}
                <h3 className="mt-3 text-[16px] font-semibold text-ink">{item.label}</h3>
                <p className="mt-1.5 text-[13px] text-body">{item.body}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function CtaBandBlock({ value }: Extract<FlexBlock, { type: "cta_band" }>) {
  return (
    <section className="bg-dark text-on-dark">
      <Container>
        <div className="flex flex-col items-start gap-5 py-14 sm:flex-row sm:items-center sm:justify-between sm:py-16">
          <div>
            <h2 className="text-[24px] font-semibold">{value.heading}</h2>
            {value.body && <p className="mt-1.5 text-[14px] text-on-dark-mut">{value.body}</p>}
          </div>
          {value.cta?.label && <CtaButton cta={value.cta} tone="on-dark" />}
        </div>
      </Container>
    </section>
  );
}

function FaqBlock({ value }: Extract<FlexBlock, { type: "faq" }>) {
  return (
    <section className="py-12 sm:py-16">
      <Container>
        {value.heading && <h2 className="text-[22px] text-ink">{value.heading}</h2>}
        <div className="mt-6 divide-y divide-hairline border-y border-hairline">
          {value.items.map((f, i) => (
            <details key={i} className="group py-1">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                {f.question}
                <CaretDown size={16} className="shrink-0 text-muted transition-transform group-open:rotate-180" />
              </summary>
              <p className="max-w-[68ch] pb-4 text-[14px] leading-relaxed text-body">{f.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

function StatsBlock({ value }: Extract<FlexBlock, { type: "stats" }>) {
  return (
    <section className="border-y border-hairline bg-canvas-soft py-8">
      <Container>
        {value.heading && <h2 className="mb-4 text-[22px] text-ink">{value.heading}</h2>}
        <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
          {value.items.map((s, i) => (
            <div key={i}>
              <dt className="text-[12px] text-muted">{s.label}</dt>
              <dd data-numeric className="mt-1 text-[24px] font-semibold text-ink">{s.figure}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

function TestimonialsBlock({ value }: Extract<FlexBlock, { type: "testimonials" }>) {
  return (
    <section className="border-t border-hairline bg-canvas-soft py-12 sm:py-16">
      <Container>
        {value.heading && <h2 className="text-[22px] text-ink">{value.heading}</h2>}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {value.items.map((t, i) => (
            <figure key={i} className="flex flex-col rounded-[10px] border border-hairline bg-canvas p-5">
              <Quotes size={20} weight="fill" className="text-rust-500" />
              <blockquote className="mt-3 flex-1 text-[14px] leading-relaxed text-body">{t.quote}</blockquote>
              <figcaption className="mt-4 border-t border-hairline-firm pt-3">
                <p className="text-[13px] font-medium text-ink">{t.name}</p>
                <p className="text-[12px] text-muted">{t.detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function PageBlocks({ blocks }: { blocks: FlexBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "hero":
            return <HeroBlock key={i} {...block} />;
          case "rich_text":
            return <RichTextBlock key={i} {...block} />;
          case "markdown":
            return <MarkdownBlock key={i} {...block} />;
          case "image":
            return <ImageBlock key={i} {...block} />;
          case "feature_grid":
            return <FeatureGridBlock key={i} {...block} />;
          case "cta_band":
            return <CtaBandBlock key={i} {...block} />;
          case "faq":
            return <FaqBlock key={i} {...block} />;
          case "stats":
            return <StatsBlock key={i} {...block} />;
          case "testimonials":
            return <TestimonialsBlock key={i} {...block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
