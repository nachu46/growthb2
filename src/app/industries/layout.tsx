import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Insulation for Oil & Gas, HVAC, LNG & Desalination Projects in the GCC',
  description:
    'Pre-vetted insulation assemblies for oil & gas refineries, district cooling, LNG terminals, petrochemical plants and desalination across Saudi Arabia, UAE, Kuwait, Qatar, Bahrain and Oman.',
  alternates: { canonical: '/industries' },
  openGraph: {
    title: 'Industry Insulation Assemblies | Growth International',
    description: 'EPC-approved material assemblies for GCC oil & gas, HVAC, marine and power projects.',
    url: '/industries',
  },
};

export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
