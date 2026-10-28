'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductDetailView } from '@/components/ProductDetailView';
import { Footer } from '@/components/Footer';
import { RfqQueueDrawer } from '@/components/RfqQueueDrawer';
import { CorporateProfileModal } from '@/components/CorporateProfileModal';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import Link from 'next/link';
import { ProductItem } from '@/data/mockData';
import { useRfqQueue } from '@/hooks/useRfqQueue';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { items: rfqItems, addItem, removeItem, clear } = useRfqQueue();
  const [isRfqDrawerOpen, setIsRfqDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    Promise.resolve(params).then(p => {
      fetch(`/api/products/${p.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.product) {
            setProduct(data.product);
          } else {
            setNotFound(true);
          }
        })
        .catch(() => setNotFound(true));
    });
  }, [params]);

  const handleAddRfqItem = (p: ProductItem, qty: number, form: string, thickness: string) => {
    addItem(p, qty);
    setIsRfqDrawerOpen(true);
  };

  const handleRemoveRfqItem = (id: string) => {
    removeItem(id);
  };

  const handleClearQueue = () => {
    clear();
  };

  if (notFound) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <p style={{ fontWeight: 700, marginBottom: '1rem' }}>This product could not be found.</p>
        <Link href="/products" style={{ color: 'var(--primary-red)', fontWeight: 700 }}>Back to product catalog</Link>
      </div>
    );
  }

  if (!product) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading product specification data...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', color: 'var(--slate-900)' }}>
      {/* Navbar Header */}
      <Navbar
        rfqCount={rfqItems.length}
        onOpenRfqQueue={() => setIsRfqDrawerOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Product Detail View */}
      <main>
        <ProductDetailView
          product={product}
          onAddRfqItem={handleAddRfqItem}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Drawers & Modals */}
      <RfqQueueDrawer
        isOpen={isRfqDrawerOpen}
        onClose={() => setIsRfqDrawerOpen(false)}
        items={rfqItems}
        onRemoveItem={handleRemoveRfqItem}
        onClearQueue={handleClearQueue}
      />

      <CorporateProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <FloatingWhatsApp />
    </div>
  );
}
