import { cn } from "@/lib/utils";

interface PageIntroProps {
  eyebrow?: string;
  title: string;
  lede?: string;
  className?: string;
  children?: React.ReactNode;
}

export function PageIntro({ eyebrow, title, lede, className, children }: PageIntroProps) {
  return (
    <header className={cn("max-w-[52ch]", className)}>
      {eyebrow && <p className="overline mb-4">{eyebrow}</p>}
      <h1 className="text-[34px] leading-[1.1] text-ink sm:text-[42px]">{title}</h1>
      {lede && <p className="mt-4 text-[16px] leading-relaxed text-body">{lede}</p>}
      {children}
    </header>
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
