import { cn } from "@/lib/utils";

/**
 * Halcyon wordmark. The mark is a single geometric glyph: a kingfisher's dive
 * abstracted to a downward chevron inside a ring (the only hand-drawn SVG on the
 * site, per the design contract).
 */
export function Wordmark({
  className,
  showText = true,
  tone = "ink",
  text = "Halcyon",
  logoUrl,
}: {
  className?: string;
  showText?: boolean;
  tone?: "ink" | "light";
  text?: string;
  /** An uploaded logo from the CMS. When set, it replaces the built-in mark. */
  logoUrl?: string | null;
}) {
  if (logoUrl) {
    // eslint-disable-next-line @next/next/no-img-element -- CMS-hosted, arbitrary remote origin
    return (
      <img
        src={logoUrl}
        alt={text}
        className={cn("h-[26px] w-auto max-w-[180px] object-contain", className)}
      />
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle
          cx="11"
          cy="11"
          r="9.25"
          stroke={tone === "light" ? "var(--color-on-dark)" : "var(--color-rust-700)"}
          strokeWidth="1.5"
        />
        <path
          d="M6.5 8.25L11 14.5L15.5 8.25"
          stroke={tone === "light" ? "var(--color-on-dark)" : "var(--color-rust-700)"}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span
          className={cn(
            "text-[17px] font-semibold tracking-[-0.02em]",
            tone === "light" ? "text-on-dark" : "text-ink",
          )}
        >
          {text}
        </span>
      )}
    </span>
  );
}
