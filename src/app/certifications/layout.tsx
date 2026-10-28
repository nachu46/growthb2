import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saudi Aramco, SABIC & ADNOC Approved Insulation Vendor',
  description:
    'Growth International is a registered Saudi Aramco (10114402) and SABIC (11047900) vendor, ADNOC / TAKREER approved supply chain partner, ISO 9001:2015 and UAE ICV certified.',
  alternates: { canonical: '/certifications' },
  openGraph: {
    title: 'Tier-1 EPC Vendor Approvals | Growth International',
    description: 'Aramco, SABIC and ADNOC approved insulation supplier with ISO 9001 and ICV certification.',
    url: '/certifications',
  },
};

export default function CertificationsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
