import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { DEFAULT_DESCRIPTION, SEO_KEYWORDS, SITE_NAME, SITE_URL, jsonLdString, organizationJsonLd } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Industrial Thermal Insulation Supplier in UAE, KSA & GCC | Growth International',
    template: '%s | Growth International',
  },
  description: DEFAULT_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_AE',
    url: SITE_URL,
    title: 'Industrial Thermal Insulation Supplier in UAE, KSA & GCC | Growth International',
    description: DEFAULT_DESCRIPTION,
    images: [{ url: '/growth-international-logo.png', alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Growth International | GCC Industrial Insulation Supplier',
    description: DEFAULT_DESCRIPTION,
    images: ['/growth-international-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  other: {
    'geo.region': 'AE-AJ',
    'geo.placename': 'Ajman, United Arab Emirates',
    'geo.position': '25.4052;55.5136',
    ICBM: '25.4052, 55.5136',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#D90B2A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Organization + GCC hub locations for Google (local business rich results) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(organizationJsonLd()) }} />
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
