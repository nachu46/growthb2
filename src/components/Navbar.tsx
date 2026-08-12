'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X } from 'lucide-react';
import { ProductsMegaMenu } from './ProductsMegaMenu';
import { IndustriesMegaMenu } from './IndustriesMegaMenu';
import { ServicesMegaMenu } from './ServicesMegaMenu';
import { BulkBomModal } from './BulkBomModal';

interface NavbarProps {
  rfqCount: number;
  onOpenRfqQueue: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ rfqCount, onOpenRfqQueue, onOpenProfile }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const [industriesDropdownOpen, setIndustriesDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [isBomModalOpen, setIsBomModalOpen] = useState(false);

  const pathname = usePathname();

  const isProductsActive = pathname.startsWith('/products');
  const isIndustriesActive = pathname.startsWith('/industries');
  const isCertificationsActive = pathname.startsWith('/certifications');

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(255, 255, 255, 0.96)',
      backdropFilter: 'blur(14px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
          <img
            src="/emblem.png"
            alt="Growth International L.L.C emblem"
            style={{
              height: '38px',
              width: '38px',
              objectFit: 'contain',
            }}
          />
          <span style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ color: 'var(--primary-red)' }}>Growth</span>{' '}
            <span style={{ color: 'var(--slate-900)', fontWeight: 700 }} className="desktop-logo-subtext">International L.L.C</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav style={{ display: 'none', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          {/* Products Mega Menu */}
          <div
            style={{ position: 'static' }}
            onMouseEnter={() => setProductsDropdownOpen(true)}
            onMouseLeave={() => setProductsDropdownOpen(false)}
          >
            <Link
              href="/products"
              style={{
                fontWeight: 700,
                fontSize: '0.925rem',
                color: isProductsActive || productsDropdownOpen ? 'var(--primary-red)' : 'var(--slate-800)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0.5rem 0',
                textDecoration: 'none',
              }}
            >
              <span>Products</span>
              <ChevronDown size={14} color={isProductsActive || productsDropdownOpen ? 'var(--primary-red)' : 'var(--slate-400)'} />
            </Link>

            {productsDropdownOpen && (
              <ProductsMegaMenu onClose={() => setProductsDropdownOpen(false)} />
            )}
          </div>

          {/* Industries Mega Menu */}
          <div
            style={{ position: 'static' }}
            onMouseEnter={() => setIndustriesDropdownOpen(true)}
            onMouseLeave={() => setIndustriesDropdownOpen(false)}
          >
            <Link
              href="/industries"
              style={{
                fontWeight: 700,
                fontSize: '0.925rem',
                color: isIndustriesActive || industriesDropdownOpen ? 'var(--primary-red)' : 'var(--slate-800)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0.5rem 0',
                textDecoration: 'none',
              }}
            >
              <span>Industries</span>
              <ChevronDown size={14} color={isIndustriesActive || industriesDropdownOpen ? 'var(--primary-red)' : 'var(--slate-400)'} />
            </Link>

            {industriesDropdownOpen && (
              <IndustriesMegaMenu onClose={() => setIndustriesDropdownOpen(false)} />
            )}
          </div>

          <Link href="/#resources-section" style={{ fontWeight: 600, fontSize: '0.925rem', color: 'var(--slate-800)', textDecoration: 'none' }}>
            Tech Resources
          </Link>

          {/* Services Mega Menu */}
          <div
            style={{ position: 'static' }}
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <Link
              href="/#fabrication-section"
              style={{
                fontWeight: 600,
                fontSize: '0.925rem',
                color: servicesDropdownOpen ? 'var(--primary-red)' : 'var(--slate-800)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '0.5rem 0',
                textDecoration: 'none',
              }}
            >
              <span>Services</span>
              <ChevronDown size={14} color={servicesDropdownOpen ? 'var(--primary-red)' : 'var(--slate-400)'} />
            </Link>

            {servicesDropdownOpen && (
              <ServicesMegaMenu
                onClose={() => setServicesDropdownOpen(false)}
                onOpenBomUpload={() => setIsBomModalOpen(true)}
              />
            )}
          </div>

          <Link
            href="/certifications"
            style={{
              fontWeight: 700,
              fontSize: '0.925rem',
              color: isCertificationsActive ? 'var(--primary-red)' : 'var(--slate-800)',
              textDecoration: 'none',
            }}
          >
            Certifications & Approvals
          </Link>
        </nav>

        {/* Action Button & Hamburger Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={onOpenRfqQueue}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              border: '1.5px solid var(--primary-red)',
              backgroundColor: '#FFFFFF',
              color: 'var(--slate-900)',
              fontWeight: 700,
              fontSize: '0.825rem',
              boxShadow: '0 2px 8px rgba(225, 29, 72, 0.08)',
              cursor: 'pointer',
            }}
          >
            <span>View RFQ</span>
            {rfqCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-red)',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(225, 29, 72, 0.4)',
              }}>
                {rfqCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle (Matches Screenshot 1) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '0.35rem', color: 'var(--slate-900)', background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Toggle menu"
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--slate-200)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        }}>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 800, color: 'var(--slate-900)', textDecoration: 'none', fontSize: '1rem' }}>
            Products Catalog →
          </Link>
          <Link href="/industries" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 800, color: 'var(--slate-900)', textDecoration: 'none', fontSize: '1rem' }}>
            Industries Applications →
          </Link>
          <Link href="/certifications" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 800, color: 'var(--primary-red)', textDecoration: 'none', fontSize: '1rem' }}>
            Certifications & Approvals →
          </Link>
          <Link href="/#resources-section" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--slate-700)', textDecoration: 'none' }}>
            Tech Resources
          </Link>
          <Link href="/#fabrication-section" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--slate-700)', textDecoration: 'none' }}>
            Services & Fabrication
          </Link>
        </div>
      )}

      {/* Modals */}
      <BulkBomModal
        isOpen={isBomModalOpen}
        onClose={() => setIsBomModalOpen(false)}
      />

      <style jsx>{`
        @media (max-width: 640px) {
          :global(.desktop-logo-subtext) {
            display: none !important;
          }
        }
        @media (min-width: 1024px) {
          :global(.desktop-nav) {
            display: flex !important;
          }
          :global(.mobile-toggle) {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
