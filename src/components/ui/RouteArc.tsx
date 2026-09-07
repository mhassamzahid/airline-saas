import { cn } from "@/lib/utils";

interface RouteArcProps {
  from: string;
  to: string;
  className?: string;
  /** hero: faint, decorative-scale, no labels. inline: present, with codes. */
  variant?: "hero" | "inline";
}

/**
 * The origin and destination drawn as a great-circle arc. It is the route,
 * not decoration: `from` and `to` are the actual airport codes in play.
 */
export function RouteArc({ from, to, className, variant = "hero" }: RouteArcProps) {
  const inline = variant === "inline";
  const stroke = "var(--color-rust-500)";

  return (
    <svg
      viewBox="0 0 600 200"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      className={cn(className)}
    >
      <path
        d="M 34 172 Q 300 -6 566 96"
        stroke={stroke}
        strokeWidth={inline ? 1.6 : 1.4}
        strokeLinecap="round"
        strokeDasharray={inline ? "1.5 7" : "1.5 9"}
        opacity={inline ? 0.85 : 0.42}
      />
      <circle
        cx="34"
        cy="172"
        r={inline ? 4.5 : 3.5}
        fill="var(--color-rust-700)"
        opacity={inline ? 1 : 0.6}
      />
      <circle
        cx="566"
        cy="96"
        r={inline ? 4.5 : 3.5}
        fill="none"
        stroke="var(--color-rust-700)"
        strokeWidth="1.9"
        opacity={inline ? 1 : 0.6}
      />

      {inline && (
        <>
          <text
            x="34"
            y="196"
            textAnchor="middle"
            fill="var(--color-muted)"
            style={{ font: "500 13px var(--font-mono)" }}
          >
            {from}
          </text>
          <text
            x="566"
            y="80"
            textAnchor="middle"
            fill="var(--color-muted)"
            style={{ font: "500 13px var(--font-mono)" }}
          >
            {to}
          </text>
        </>
      )}
    </svg>
  );
}
