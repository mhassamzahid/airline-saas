import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[520px] flex-col items-start px-5 py-24 sm:py-32">
      <p data-numeric className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">
        404
      </p>
      <h1 className="mt-3 text-[30px] font-semibold text-ink">This gate has moved</h1>
      <p className="mt-3 text-[15px] text-body">
        The page you were after is not here. It may have been renamed, or the link
        was mistyped.
      </p>
      <Link
        href="/"
        className="mt-7 inline-flex h-11 items-center gap-2 rounded-[10px] bg-rust-700 px-5 text-[15px] font-medium text-on-rust transition-colors hover:bg-rust-600"
      >
        Back to home
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
