// Site-wide SEO settings. Set NEXT_PUBLIC_SITE_URL on the server if the domain differs.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.growthme.com').replace(/\/$/, '');
export const SITE_NAME = 'Growth International L.L.C';

export const GCC_CITIES = ['Ajman', 'Dubai', 'Abu Dhabi', 'Riyadh', 'Dammam', 'Jubail', 'Kuwait City', 'Doha', 'Manama', 'Muscat'];

export const DEFAULT_DESCRIPTION =
  'Industrial thermal insulation, metal jacketing, acoustic and refractory supplier for the GCC. HQ in Ajman, UAE with stock hubs in Dammam (KSA), Kuwait, Qatar, Bahrain and Oman. Aramco (10114402) & SABIC (11047900) approved vendor.';

export const SEO_KEYWORDS = [
  'thermal insulation supplier UAE',
  'industrial insulation Dubai',
  'insulation supplier Abu Dhabi',
  'insulation material Ajman',
  'insulation supplier Saudi Arabia',
  'Aramco approved insulation vendor',
  'insulation supplier Dammam',
  'insulation supplier Kuwait',
  'insulation supplier Qatar',
  'insulation supplier Bahrain',
  'insulation supplier Oman',
  'FOAMGLAS cellular glass GCC',
  'PSMB aluminium jacketing',
  'Polysurlyn jacketing UAE',
  'rockwool pipe section supplier',
  'aerogel insulation GCC',
  'Armaflex supplier UAE',
  'cryogenic insulation LNG',
  'acoustic insulation supplier',
  'refractory supplier GCC',
  'SABIC approved vendor',
  'ICV certified supplier UAE',
];

// Regional hubs (Admin → Locations holds live stock details; these feed Google's business data)
export const HUBS = [
  { name: 'Growth International — UAE Headquarters', city: 'Ajman', region: 'Ajman', country: 'AE', phone: '+971-6-530-9555', lat: 25.4052, lng: 55.5136 },
  { name: 'Growth International — Saudi Arabia', city: 'Dammam', region: 'Eastern Province', country: 'SA', phone: '+966-50-218-8681', lat: 26.4207, lng: 50.0888 },
  { name: 'Growth International — Kuwait', city: 'Kuwait City', region: 'Al Asimah', country: 'KW', phone: '+965-31347699', lat: 29.3759, lng: 47.9774 },
  { name: 'Growth International — Qatar', city: 'Doha', region: 'Doha', country: 'QA', phone: '+974-31347699', lat: 25.2854, lng: 51.531 },
  { name: 'Growth International — Bahrain', city: 'Manama', region: 'Capital Governorate', country: 'BH', phone: '+973-17004455', lat: 26.2235, lng: 50.5876 },
  { name: 'Growth International — Oman', city: 'Muscat', region: 'Muscat', country: 'OM', phone: '+968-24501122', lat: 23.588, lng: 58.3829 },
];

/** schema.org Organization + one LocalBusiness per GCC hub (Google rich results / local SEO). */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/emblem.png`,
        email: 'sales@growthme.com',
        telephone: '+971-6-530-9555',
        foundingDate: '2014',
        description: DEFAULT_DESCRIPTION,
        areaServed: ['AE', 'SA', 'KW', 'QA', 'BH', 'OM'].map(c => ({ '@type': 'Country', name: c })),
        sameAs: [`https://wa.me/9715309555`],
      },
      ...HUBS.map((h, i) => ({
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#hub-${i}`,
        name: h.name,
        parentOrganization: { '@id': `${SITE_URL}/#organization` },
        url: SITE_URL,
        image: `${SITE_URL}/emblem.png`,
        telephone: h.phone,
        email: 'sales@growthme.com',
        address: { '@type': 'PostalAddress', addressLocality: h.city, addressRegion: h.region, addressCountry: h.country },
        geo: { '@type': 'GeoCoordinates', latitude: h.lat, longitude: h.lng },
        areaServed: { '@type': 'Country', name: h.country },
      })),
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
      },
    ],
  };
}

/** Safe <script type="application/ld+json"> payload (escapes "<" so data can't close the tag). */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
