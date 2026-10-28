'use client';

import { useEffect, useState } from 'react';
import { ProductItem } from '@/data/mockData';

// Shared across components so the catalog is fetched once per page load
let catalogPromise: Promise<ProductItem[]> | null = null;

function loadCatalog(): Promise<ProductItem[]> {
  if (!catalogPromise) {
    catalogPromise = fetch('/api/catalog')
      .then(res => res.json())
      .then(data => (data.success ? (data.products as ProductItem[]) : []))
      .catch(() => {
        catalogPromise = null; // allow a retry on next mount
        return [];
      });
  }
  return catalogPromise;
}

/** Live product catalog from the database (managed in /admin/products). */
export function useCatalogProducts() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    loadCatalog().then(list => {
      if (!cancelled) {
        setProducts(list);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading };
}
