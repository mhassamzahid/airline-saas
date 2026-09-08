import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/cms";

const LIGHT_BG = "#f7f6f3";
const DARK_BG = "#1e2123";

export async function generateMetadata(): Promise<Metadata> {
  const { site_title, favicon_url } = await getSiteSettings();
  return {
    title: {
      default: site_title,
      template: `%s · ${site_title}`,
    },
    description:
      "An independent long-haul airline flying from London Gatwick, Manchester and Edinburgh. Plan a trip step by step, with the price in view the whole way.",
    ...(favicon_url ? { icons: { icon: favicon_url } } : {}),
  };
}

export async function generateViewport(): Promise<Viewport> {
  const { color_mode } = await getSiteSettings();
  const themeColor =
    color_mode === "dark"
      ? DARK_BG
      : color_mode === "light"
        ? LIGHT_BG
        : [
            { media: "(prefers-color-scheme: light)", color: LIGHT_BG },
            { media: "(prefers-color-scheme: dark)", color: DARK_BG },
          ];
  return { themeColor, width: "device-width", initialScale: 1 };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { site_title, theme, color_mode, logo_url } = await getSiteSettings();

  // "system" -> no data-mode attribute, so globals.css falls through to the
  // prefers-color-scheme media query.
  const dataMode = color_mode === "system" ? undefined : color_mode;

  return (
    <html
      lang="en-GB"
      data-theme={theme}
      data-mode={dataMode}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body>
        <div className="flex min-h-[100dvh] flex-col">
          <Navbar siteTitle={site_title} logoUrl={logo_url} />
          <main className="flex-1">{children}</main>
          <Footer siteTitle={site_title} logoUrl={logo_url} />
        </div>
      </body>
    </html>
  );
}
