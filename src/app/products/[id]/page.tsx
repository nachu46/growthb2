'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductDetailView } from '@/components/ProductDetailView';
import { Footer } from '@/components/Footer';
import { RfqQueueDrawer } from '@/components/RfqQueueDrawer';
import { CorporateProfileModal } from '@/components/CorporateProfileModal';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { ProductItem, PRODUCTS_CATALOG } from '@/data/mockData';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [rfqItems, setRfqItems] = useState<ProductItem[]>([
    PRODUCTS_CATALOG[0],
    PRODUCTS_CATALOG[2],
  ]);
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
            setProduct(PRODUCTS_CATALOG[0]);
          }
        })
        .catch(() => setProduct(PRODUCTS_CATALOG[0]));
    });
  }, [params]);

  const handleAddRfqItem = (p: ProductItem, qty: number, form: string, thickness: string) => {
    if (!rfqItems.some(i => i.id === p.id)) {
      setRfqItems(prev => [...prev, p]);
    }
    setIsRfqDrawerOpen(true);
  };

  const handleRemoveRfqItem = (id: string) => {
    setRfqItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearQueue = () => {
    setRfqItems([]);
  };

  if (!product) {
    return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading product specification data...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: 'var(--slate-900)' }}>
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
