import type { Metadata } from 'next';

export const metadata: Metadata = {
  // Keep the site-wide " | Growth International" suffix for product pages nested below
  title: {
    default: 'Insulation, Jacketing & Refractory Products in UAE, KSA & GCC',
    template: '%s | Growth International',
  },
  description:
    'Browse certified industrial insulation (FOAMGLAS cellular glass, rockwool, aerogel, Armaflex), PSMB aluminium jacketing, acoustic barriers and refractory materials. Stocked in Ajman, Dubai, Dammam, Kuwait, Doha, Manama and Muscat.',
  alternates: { canonical: '/products' },
  openGraph: {
    title: 'Industrial Insulation & Jacketing Catalog | Growth International',
    description: 'Aramco & SABIC approved insulation materials with stock across the GCC.',
    url: '/products',
  },
};

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
