import type { Metadata } from 'next';
import { Space_Grotesk, Syne } from 'next/font/google';
import './globals.css';
import { brand, siteUrl } from '@/lib/brand';
import { DevelopmentBanner } from '@/components/development-banner';

const bodyFont = Space_Grotesk({ variable: '--font-body', subsets: ['latin'] });
const displayFont = Syne({ variable: '--font-display', subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${brand.name} | Free-Roam VR Arena bei Steyr`, template: `%s | ${brand.name}` },
  description: brand.description,
  keywords: ['Virtual Reality Steyr', 'VR Arena Oberösterreich', 'Free-Roam VR', 'VR Kleinraming', 'Firmenevent Steyr', 'Geburtstag Steyr', 'Schlechtwetterprogramm Steyr'],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'de_AT', url: '/', siteName: brand.name, title: `${brand.name} | Free-Roam VR Arena bei Steyr`, description: brand.description, images: [{ url: '/og.png', width: 1200, height: 630, alt: `${brand.name} – ${brand.tagline}` }] },
  twitter: { card: 'summary_large_image', title: `${brand.name} | Free-Roam VR Arena bei Steyr`, description: brand.description, images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const showDevelopmentBanner = process.env.SITE_ACCESS_MODE !== 'public' || process.env.BOOKING_MODE !== 'live';
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        {showDevelopmentBanner && <DevelopmentBanner />}
        <div className="development-site">{children}</div>
      </body>
    </html>
  );
}
