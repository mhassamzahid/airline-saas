import Link from "next/link";
import { SignInForm } from "@/components/site/SignInForm";
import { getSiteSettings } from "@/lib/cms";

export async function generateMetadata() {
  const { site_title } = await getSiteSettings();
  return {
    title: "Sign in",
    description: `Sign in to your ${site_title} account to manage trips and spend miles.`,
  };
}

export default async function SignInPage() {
  const { site_title } = await getSiteSettings();

  return (
    <div className="mx-auto max-w-[420px] px-5 py-20 sm:py-28">
      <h1 className="text-[26px] font-semibold text-ink">Sign in to {site_title}</h1>
      <p className="mt-2 text-[14px] text-body">
        Manage your trips, keep your travel documents on file, and spend miles with
        no blackout dates.
      </p>

      <div className="mt-8">
        <SignInForm />
      </div>

      <p className="mt-6 text-center text-[13px] text-muted">
        New here?{" "}
        <Link href="/" className="font-medium text-rust-700 hover:text-rust-600">
          Create an account
        </Link>{" "}
        or just{" "}
        <Link href="/umrah" className="font-medium text-rust-700 hover:text-rust-600">
          book as a guest
        </Link>
        .
      </p>
    </div>
  );
}
