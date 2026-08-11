import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Growth International | Elite GCC Industrial Thermal Insulation & Mechanical Supply',
  description: 'Founded in 2014. Regional supply network backed by 18+ years Middle East expertise. Pre-qualified Aramco (10114402) & SABIC (11047900) Vendor.',
  keywords: 'Thermal Insulation, Industrial Procurement, GCC Supply, FOAMGLAS, PSMB Jacketing, Aramco Approved Vendor, SABIC Approved',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
