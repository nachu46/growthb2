import type { Metadata } from 'next';
import db from '@/lib/db';
import { SITE_URL, jsonLdString } from '@/lib/seo';

function findProduct(id: string): any {
  try {
    return db.prepare(`SELECT * FROM products WHERE (id = ? OR slug = ?) AND is_active = 1`).get(id, id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = findProduct(id);
  if (!p) return { title: 'Product not found', robots: { index: false } };

  const description = `${p.name} — ${p.compliance}. ${String(p.description || '').slice(0, 110)} Supplied across UAE, Saudi Arabia, Kuwait, Qatar, Bahrain & Oman.`;
  return {
    title: `${p.name} Supplier in UAE & GCC`,
    description: description.slice(0, 300),
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      type: 'website',
      title: `${p.name} | Growth International`,
      description: description.slice(0, 300),
      url: `/products/${p.slug}`,
      images: p.image_url ? [{ url: p.image_url, alt: p.name }] : undefined,
    },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = findProduct(id);

  // schema.org Product so Google can show the item with brand, spec and availability
  const jsonLd = p && {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    sku: p.slug,
    category: p.pillar,
    url: `${SITE_URL}/products/${p.slug}`,
    ...(p.image_url ? { image: p.image_url.startsWith('http') ? p.image_url : `${SITE_URL}${p.image_url}` } : {}),
    ...(p.manufacturer ? { brand: { '@type': 'Brand', name: p.manufacturer } } : {}),
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'Compliance', value: p.compliance },
      { '@type': 'PropertyValue', name: 'Operating temperature', value: p.temp_range },
    ],
    offers: {
      '@type': 'Offer',
      availability: p.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      seller: { '@id': `${SITE_URL}/#organization` },
      areaServed: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM'],
      url: `${SITE_URL}/products/${p.slug}`,
    },
  };

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />}
      {children}
    </>
  );
}
