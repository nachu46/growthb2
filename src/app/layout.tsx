import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Growth International L.L.C | Elite GCC Industrial Thermal Insulation & Mechanical Supply',
  description: 'Founded in 2014. Regional supply network backed by 18+ years Middle East expertise. Pre-qualified Aramco (10114402) & SABIC (11047900) Vendor.',
  keywords: 'Thermal Insulation, Industrial Procurement, GCC Supply, FOAMGLAS, PSMB Jacketing, Aramco Approved Vendor, SABIC Approved',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
