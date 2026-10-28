// Shapes a products-table row into the ProductItem the storefront renders.
// JSON columns are optional: products created before they existed fall back to values
// derived from the row itself, never to another product's data.

function parseJsonArray<T>(value: unknown): T[] | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function formatProduct(p: any) {
  const badges =
    parseJsonArray<string>(p.compliance_badges) ||
    String(p.compliance || '')
      .split('/')
      .map((b) => b.trim())
      .filter(Boolean);

  const properties =
    parseJsonArray<any>(p.physical_properties) ||
    [
      p.density && { property: 'Density / Thickness', testMethod: 'Manufacturer Data', performanceValue: p.density },
      p.temp_range && { property: 'Operating Temperature', testMethod: 'Manufacturer Data', performanceValue: p.temp_range },
    ].filter(Boolean);

  return {
    ...p,
    inStock: Boolean(p.in_stock),
    aramcoApproved: Boolean(p.aramco_approved),
    pricePerUnitEstimate: p.price_estimate,
    leadTime: p.lead_time,
    tempRange: p.temp_range,
    manufacturer: p.manufacturer || '',
    stockLevel: p.stock_level || (p.in_stock ? 'High' : 'On Order'),
    stockHub: p.stock_hub || '',
    imageUrl: p.image_url || '',
    complianceBadges: badges,
    fabricationForms: parseJsonArray<string>(p.fabrication_forms) || [],
    thicknesses: parseJsonArray<string>(p.thicknesses) || [],
    physicalProperties: properties,
  };
}

/** Comma/newline separated admin input → JSON array string (or null when empty). */
export function listToJson(value: unknown): string | null {
  if (Array.isArray(value)) {
    const list = value.map((v) => String(v).trim()).filter(Boolean).slice(0, 30);
    return list.length ? JSON.stringify(list) : null;
  }
  if (typeof value !== 'string') return null;
  const list = value.split(/[,\n]/).map((v) => v.trim()).filter(Boolean).slice(0, 30);
  return list.length ? JSON.stringify(list) : null;
}

/** Admin textarea "Property | Test method | Value" per line (prefix value with ! to highlight red). */
export function propertiesToJson(value: unknown): string | null {
  if (Array.isArray(value)) return value.length ? JSON.stringify(value.slice(0, 30)) : null;
  if (typeof value !== 'string') return null;
  const rows = value
    .split('\n')
    .map((line) => line.split('|').map((c) => c.trim()))
    .filter((cells) => cells.length >= 3 && cells[0])
    .slice(0, 30)
    .map(([property, testMethod, raw]) => ({
      property,
      testMethod,
      performanceValue: raw.replace(/^!/, '').trim(),
      ...(raw.startsWith('!') ? { isRedHighlight: true } : {}),
    }));
  return rows.length ? JSON.stringify(rows) : null;
}

export const STOCK_LEVELS = ['High', 'Medium', 'Low', 'On Order'] as const;

/** Accepts site-relative paths or http(s) URLs only; anything else (e.g. javascript:) becomes empty. */
export function sanitizeUrl(value: unknown): string {
  if (typeof value !== 'string') return '';
  const v = value.trim();
  if (v.startsWith('/') && !v.startsWith('//')) return v.slice(0, 500);
  if (/^https?:\/\//i.test(v)) return v.slice(0, 500);
  return '';
}

export function normalizeStockLevel(value: unknown): string {
  return (STOCK_LEVELS as readonly string[]).includes(String(value)) ? String(value) : 'High';
}
