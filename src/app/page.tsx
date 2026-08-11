'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { InventoryBrowser } from '@/components/InventoryBrowser';
import { OrderingWidget } from '@/components/OrderingWidget';
import { VendorCertifications } from '@/components/VendorCertifications';
import { SupplyPartners } from '@/components/SupplyPartners';
import { EngineeringResourceHub } from '@/components/EngineeringResourceHub';
import { FabricationBanner } from '@/components/FabricationBanner';
import { Footer } from '@/components/Footer';
import { RfqQueueDrawer } from '@/components/RfqQueueDrawer';
import { CorporateProfileModal } from '@/components/CorporateProfileModal';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { ProductItem, PRODUCTS_CATALOG } from '@/data/mockData';

export default function Home() {
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
      {/* Top Navbar Header */}
      <Navbar
        rfqCount={rfqItems.length}
        onOpenRfqQueue={() => setIsRfqDrawerOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Page Layout */}
      <main>
        <HeroSection
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        <InventoryBrowser
          onAddRfqItem={handleAddRfqItem}
        />

        <OrderingWidget />

        <VendorCertifications />

        <SupplyPartners />

        <EngineeringResourceHub
          onOpenProfile={() => setIsProfileModalOpen(true)}
        />

        <FabricationBanner />
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
