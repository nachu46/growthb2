// Admin-side helpers for product categories
export const CATEGORY_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export function itemsFromText(value: FormDataEntryValue | null): string {
  const list = String(value ?? '')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
    .slice(0, 12)
    .map(s => s.slice(0, 80));
  return JSON.stringify(list);
}
