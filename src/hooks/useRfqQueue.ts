'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { ProductItem } from '@/data/mockData';

export type RfqQueueItem = ProductItem & { rfqQty?: number };

const STORAGE_KEY = 'growth_rfq_queue_v1';
const EMPTY: RfqQueueItem[] = [];

// One queue shared by every page, persisted so it survives navigation and reloads
let items: RfqQueueItem[] = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) items = parsed.filter(i => i && typeof i.id === 'string').slice(0, 50);
  } catch {
    items = EMPTY;
  }
}

function commit(next: RfqQueueItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked (private mode): queue still works for this page view
  }
  listeners.forEach(l => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    loaded = false;
    load();
    listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

function getSnapshot() {
  load();
  return items;
}

export function useRfqQueue() {
  const queue = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);

  const addItem = useCallback((product: ProductItem, qty?: number) => {
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      if (qty) commit(items.map(i => (i.id === product.id ? { ...i, rfqQty: qty } : i)));
      return;
    }
    commit([...items, { ...product, rfqQty: qty }]);
  }, []);

  const removeItem = useCallback((id: string) => {
    commit(items.filter(i => i.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, qty: number) => {
    commit(items.map(i => (i.id === id ? { ...i, rfqQty: qty } : i)));
  }, []);

  const clear = useCallback(() => commit(EMPTY), []);

  return { items: queue, addItem, removeItem, setQuantity, clear };
}
