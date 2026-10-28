'use client';

import { useEffect, useState } from 'react';
import { CategoryItem, DEFAULT_CATEGORIES } from '@/data/categories';

// Shared across components so categories are fetched once per page load
let categoriesPromise: Promise<CategoryItem[]> | null = null;

function loadCategories(): Promise<CategoryItem[]> {
  if (!categoriesPromise) {
    categoriesPromise = fetch('/api/categories')
      .then(res => res.json())
      .then(data => (data.success && Array.isArray(data.categories) ? data.categories : DEFAULT_CATEGORIES))
      .catch(() => {
        categoriesPromise = null;
        return DEFAULT_CATEGORIES;
      });
  }
  return categoriesPromise;
}

/** Material categories managed in Admin → Categories. */
export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    let cancelled = false;
    loadCategories().then(list => {
      if (!cancelled) setCategories(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return categories;
}
