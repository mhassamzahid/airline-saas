import { cn } from "@/lib/utils";
import { Photo } from "@/components/ui/Photo";

interface PageIntroProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  /**
   * Optional hero photo, split-screen with the text. When present, `PageIntro`
   * becomes a full-screen hero band (fills the viewport below the navbar, on
   * every device) -- render it as a direct sibling of `PageContainer`, not
   * inside it, since `PageContainer`'s own vertical padding would push the
   * total past one screen. Shown at every breakpoint (stacked above the text
   * on mobile) so a page never loses its imagery on small screens.
   */
  image?: { src: string; alt: string; unoptimized?: boolean };
  className?: string;
  children?: React.ReactNode;
}

export function PageIntro({ eyebrow, title, lede, image, className, children }: PageIntroProps) {
  const header = (
    <header className={image ? undefined : "max-w-[52ch]"}>
      {eyebrow && <p className="overline mb-4">{eyebrow}</p>}
      <h1 className="text-[34px] leading-[1.1] text-ink sm:text-[42px]">{title}</h1>
      {lede && <p className="mt-4 text-[16px] leading-relaxed text-body">{lede}</p>}
      {children}
    </header>
  );

  if (!image) {
    return <div className={cn("max-w-[52ch]", className)}>{header}</div>;
  }

  return (
    <div
      className={cn(
        "flex min-h-[calc(100dvh-64px)] items-center sm:min-h-[calc(100dvh-96px)]",
        className,
      )}
    >
      <div className="mx-auto grid w-full max-w-[1180px] items-center gap-8 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <Photo
          src={image.src}
          alt={image.alt}
          priority
          unoptimized={image.unoptimized}
          sizes="(min-width: 1024px) 38vw, 100vw"
          className="order-first aspect-[16/10] rounded-[12px] border border-hairline lg:order-last lg:aspect-[4/5]"
        />
        {header}
      </div>
    </div>
  );
}

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20", className)}>
      {children}
    </div>
  );
}
