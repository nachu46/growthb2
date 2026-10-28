import type { MetadataRoute } from 'next';
import db from '@/lib/db';
import { SITE_URL } from '@/lib/seo';

// Rebuilt hourly so new products appear without a redeploy
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/industries`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/certifications`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/resources`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  try {
    const products = db.prepare(`SELECT slug, updated_at FROM products WHERE is_active = 1`).all() as any[];
    for (const p of products) {
      pages.push({
        url: `${SITE_URL}/products/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  } catch {
    // Sitemap still lists the main pages if the database is unavailable
  }

  return pages;
}
