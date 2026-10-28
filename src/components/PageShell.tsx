'use client';

import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { RfqQueueDrawer } from './RfqQueueDrawer';
import { CorporateProfileModal } from './CorporateProfileModal';
import { FloatingWhatsApp } from './FloatingWhatsApp';
import { useRfqQueue } from '@/hooks/useRfqQueue';

/** Header, footer, shared RFQ drawer and profile modal around a public page. */
export const PageShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { items, removeItem, clear } = useRfqQueue();
  const [isRfqDrawerOpen, setIsRfqDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', color: 'var(--slate-900)' }}>
      <Navbar
        rfqCount={items.length}
        onOpenRfqQueue={() => setIsRfqDrawerOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />
      <main>{children}</main>
      <Footer onOpenProfile={() => setIsProfileModalOpen(true)} />
      <RfqQueueDrawer
        isOpen={isRfqDrawerOpen}
        onClose={() => setIsRfqDrawerOpen(false)}
        items={items}
        onRemoveItem={removeItem}
        onClearQueue={clear}
      />
      <CorporateProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <FloatingWhatsApp />
    </div>
  );
};
