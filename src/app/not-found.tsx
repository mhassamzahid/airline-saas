import Link from "next/link";
import { ArrowRight, Signpost } from "@phosphor-icons/react/dist/ssr";

const QUICK_LINKS = [
  { href: "/umrah", label: "Build an Umrah package" },
  { href: "/hajj", label: "Hajj packages" },
  { href: "/tours", label: "International tours" },
  { href: "/help", label: "Help" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100dvh-64px)] items-center sm:min-h-[calc(100dvh-96px)]">
      <div className="mx-auto flex w-full max-w-[560px] flex-col items-start px-5 py-16 sm:px-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rust-100">
          <Signpost size={26} weight="fill" className="text-rust-700" />
        </div>

        <p data-numeric className="mt-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">
          404
        </p>
        <h1 className="mt-3 text-[34px] leading-[1.1] text-ink sm:text-[38px]">This gate has moved</h1>
        <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-body">
          The page you were after is not here. It may have been renamed, or the link was
          mistyped. Here is how to get back on route.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-[10px] bg-rust-700 px-5 text-[15px] font-medium text-on-rust transition-colors hover:bg-rust-600"
        >
          Back to home
          <ArrowRight size={16} />
        </Link>

        <div className="mt-10 w-full border-t border-hairline pt-6">
          <p className="overline mb-3">Or try one of these</p>
          <ul className="divide-y divide-hairline">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group flex items-center justify-between gap-3 py-3 text-[14px] font-medium text-ink transition-colors hover:text-rust-700"
                >
                  {l.label}
                  <ArrowRight size={14} className="shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-rust-700" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
