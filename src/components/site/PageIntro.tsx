import { cn } from "@/lib/utils";
import { Photo } from "@/components/ui/Photo";

interface PageIntroProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  /** Optional hero photo, split-screen with the text. Shown at every breakpoint (stacked above the text on mobile) so a page never loses its imagery on small screens. */
  image?: { src: string; alt: string };
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
    <div className={cn("grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14", className)}>
      <Photo
        src={image.src}
        alt={image.alt}
        priority
        sizes="(min-width: 1024px) 38vw, 100vw"
        className="order-first aspect-[16/10] rounded-[12px] border border-hairline lg:order-last lg:aspect-[4/5]"
      />
      {header}
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
