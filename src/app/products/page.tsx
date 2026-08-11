'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductsCatalogView } from '@/components/ProductsCatalogView';
import { FabricationBanner } from '@/components/FabricationBanner';
import { Footer } from '@/components/Footer';
import { RfqQueueDrawer } from '@/components/RfqQueueDrawer';
import { CorporateProfileModal } from '@/components/CorporateProfileModal';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { ProductItem, PRODUCTS_CATALOG } from '@/data/mockData';

export default function ProductsPage() {
  const [rfqItems, setRfqItems] = useState<ProductItem[]>([
    PRODUCTS_CATALOG[0],
    PRODUCTS_CATALOG[2],
  ]);
  const [isRfqDrawerOpen, setIsRfqDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleAddRfqItem = (product: ProductItem) => {
    if (!rfqItems.some(i => i.id === product.id)) {
      setRfqItems(prev => [...prev, product]);
    }
    setIsRfqDrawerOpen(true);
  };

  const handleRemoveRfqItem = (id: string) => {
    setRfqItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearQueue = () => {
    setRfqItems([]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: 'var(--slate-900)' }}>
      {/* Navbar Header */}
      <Navbar
        rfqCount={rfqItems.length}
        onOpenRfqQueue={() => setIsRfqDrawerOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Products Catalog Content matching Screenshot 6 */}
      <main>
        <ProductsCatalogView
          onAddRfqItem={handleAddRfqItem}
        />

        {/* Fabrication Banner */}
        <FabricationBanner />
      </main>

      {/* Footer */}
      <Footer
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Modals & Drawers */}
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
