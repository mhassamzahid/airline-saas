import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import '@fontsource-variable/playfair-display';
import './globals.css';

export const metadata: Metadata = {
  title: 'Travocom — Build Your Dream Travel Package',
  description: "Pakistan's most premium travel package builder. Customize every aspect of your trip to Turkey, Dubai, Maldives, Hunza, Hajj, Umrah and more.",
  keywords: 'travel packages Pakistan, Hajj packages, Umrah packages, Turkey tour, Dubai tour, Hunza tour, Skardu tour',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
