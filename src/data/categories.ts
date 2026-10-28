// Material categories ("pillars"). Managed in Admin → Categories; these defaults are shown
// until the API responds. `slug` is the key stored on each product (products.pillar).
export interface CategoryItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  items: string[];
  imageUrl: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'cat_insulation', slug: 'insulation', name: 'Industrial Insulation', description: 'Thermal, cryogenic & acoustic insulation', items: ['FOAMGLAS Blocks', 'Pyrogel Aerogel', 'PIR / PUR Rigid Foam', 'Elastomeric Nitrile'], imageUrl: '' },
  { id: 'cat_jacketing', slug: 'jacketing', name: 'Metal Jacketing', description: 'Metal jacketing, PolySurlyn & aluminium cladding', items: ['Aluminium (Stucco/Smooth)', 'Stainless Steel 316L', 'Galvanized Iron (GI)', 'PolySurlyn™ Barrier'], imageUrl: '' },
  { id: 'cat_acoustic', slug: 'acoustic', name: 'Acoustic & Vapor', description: 'Vapor barriers & acoustic dampening barriers', items: ['Acoustic Lead Sheets', 'Mass Loaded Vinyl (MLV)', 'Bitumen Membranes', 'Poly-Scrim Kraft (PSK)'], imageUrl: '' },
  { id: 'cat_accessories', slug: 'accessories', name: 'Accessories & Tapes', description: 'Bandings, fasteners, tapes & adhesives', items: ['Fiber Glass Mesh', 'Pastes & Mastics', 'Aluminium Foil Tapes', 'Toggle Clips & Banding'], imageUrl: '' },
  { id: 'cat_fits', slug: 'fits', name: 'Pre-Fabricated Fits', description: 'Factory-made elbows, tees and fitting covers', items: ['Mitered 90° & 45° Elbows', 'Tee & Valve Covers', 'Pressed Barrel Heads', 'Cryogenic Pipe Supports'], imageUrl: '' },
  { id: 'cat_valves', slug: 'valves', name: 'Valves & Refractory', description: 'Refractory insulation & removable valve blankets', items: ['Removable Insulation Blankets', 'Ceramic Fiber Gaskets', 'Calcium Silicate Boards', 'High-Temp Refractory'], imageUrl: '' },
];

/** products.pillar → category (case-insensitive, so legacy values like "Insulation" still match). */
export function categoryForPillar(categories: CategoryItem[], pillar: string): CategoryItem | undefined {
  const key = (pillar || '').toLowerCase();
  return categories.find(c => c.slug.toLowerCase() === key);
}

export function formatCategoryRow(row: any): CategoryItem {
  let items: string[] = [];
  try {
    const parsed = row.items ? JSON.parse(row.items) : [];
    if (Array.isArray(parsed)) items = parsed.map(String);
  } catch {
    items = [];
  }
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description || '',
    items,
    imageUrl: row.image_url || '',
  };
}
