'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ProductsCatalogView } from '@/components/ProductsCatalogView';
import { FabricationBanner } from '@/components/FabricationBanner';
import { Footer } from '@/components/Footer';
import { RfqQueueDrawer } from '@/components/RfqQueueDrawer';
import { CorporateProfileModal } from '@/components/CorporateProfileModal';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { ProductItem } from '@/data/mockData';
import { useRfqQueue } from '@/hooks/useRfqQueue';

export default function ProductsPage() {
  const { items: rfqItems, addItem, removeItem, clear } = useRfqQueue();
  const [isRfqDrawerOpen, setIsRfqDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleAddRfqItem = (product: ProductItem) => {
    addItem(product);
    setIsRfqDrawerOpen(true);
  };

  const handleRemoveRfqItem = (id: string) => {
    removeItem(id);
  };

  const handleClearQueue = () => {
    clear();
  };

  return (
    <div style={{ minHeight: '100vh', color: 'var(--slate-900)' }}>
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
