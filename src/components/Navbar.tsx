'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, ChevronDown } from 'lucide-react';
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

  const prodTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const indTimeout = React.useRef<NodeJS.Timeout | null>(null);
  const servTimeout = React.useRef<NodeJS.Timeout | null>(null);

  // Only one menu open at a time: entering one closes the others immediately
  const closeAllMenus = () => {
    [prodTimeout, indTimeout, servTimeout].forEach(t => t.current && clearTimeout(t.current));
    setProductsDropdownOpen(false);
    setIndustriesDropdownOpen(false);
    setServicesDropdownOpen(false);
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeAllMenus();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleProductsEnter = () => {
    if (prodTimeout.current) clearTimeout(prodTimeout.current);
    setIndustriesDropdownOpen(false);
    setServicesDropdownOpen(false);
    setProductsDropdownOpen(true);
  };
  const handleProductsLeave = () => {
    prodTimeout.current = setTimeout(() => setProductsDropdownOpen(false), 200);
  };

  const handleIndustriesEnter = () => {
    if (indTimeout.current) clearTimeout(indTimeout.current);
    setProductsDropdownOpen(false);
    setServicesDropdownOpen(false);
    setIndustriesDropdownOpen(true);
  };
  const handleIndustriesLeave = () => {
    indTimeout.current = setTimeout(() => setIndustriesDropdownOpen(false), 200);
  };

  const handleServicesEnter = () => {
    if (servTimeout.current) clearTimeout(servTimeout.current);
    setProductsDropdownOpen(false);
    setIndustriesDropdownOpen(false);
    setServicesDropdownOpen(true);
  };
  const handleServicesLeave = () => {
    servTimeout.current = setTimeout(() => setServicesDropdownOpen(false), 200);
  };

  const pathname = usePathname();
  React.useEffect(() => {
    closeAllMenus();
    setMobileMenuOpen(false);
  }, [pathname]);

  const isProductsActive = pathname.startsWith('/products');
  const isIndustriesActive = pathname.startsWith('/industries');
  const isCertificationsActive = pathname.startsWith('/certifications');
  const isResourcesActive = pathname.startsWith('/resources');
  const isServicesActive = pathname.startsWith('/services');

  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    fontWeight: 600,
    fontSize: '0.9rem',
    color: active ? 'var(--primary-red)' : 'var(--slate-700)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '0.25rem 0',
    cursor: 'pointer',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  });

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(248, 250, 252, 0.92)',
      backdropFilter: 'blur(14px)',
      padding: '0.75rem 1.25rem',
    }}>
      {/* Vendor Verification Strip */}
      <div className="vendor-strip" style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto 0.6rem auto',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--slate-200)',
        borderRadius: '10px',
        padding: '0.5rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        fontSize: '0.7rem',
        fontWeight: 700,
        color: 'var(--slate-700)',
        letterSpacing: '0.01em',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: 'var(--accent-green)', flexShrink: 0 }} />
          <span className="strip-long">VERIFIED GCC VENDOR: ARAMCO ID 10114402 • SABIC ID 11047900 • ICV CERTIFIED</span>
          <span className="strip-short">VERIFIED VENDOR: ARAMCO &amp; SABIC</span>
        </span>
        <span className="strip-contact" style={{ whiteSpace: 'nowrap' }}>
          HQ: <a href="tel:+97165309555">+971-6-530-9555</a> | <a href="mailto:sales@growthme.com">SALES@GROWTHME.COM</a>
        </span>
      </div>

      <div style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        padding: '0.7rem 1.25rem',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--slate-200)',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        position: 'relative',
      }}>
        {/* Brand Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', textDecoration: 'none' }}>
          <img
            src="/emblem.png"
            alt="Growth International L.L.C emblem"
            style={{
              height: '34px',
              width: '34px',
              objectFit: 'contain',
            }}
          />
          <span style={{
            fontWeight: 700,
            fontSize: '1.2rem',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ color: 'var(--primary-red)' }}>Growth</span>{' '}
            <span style={{ color: 'var(--slate-900)' }} className="logo-full">International</span>
            <span style={{ color: 'var(--slate-900)' }} className="logo-short">Int.</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav style={{ display: 'none', gap: '2.25rem', alignItems: 'center' }} className="desktop-nav">
          {/* Products Mega Menu */}
          <div
            style={{ position: 'static', paddingBottom: '0.5rem', paddingTop: '0.5rem' }}
            onMouseEnter={handleProductsEnter}
            onMouseLeave={handleProductsLeave}
          >
            <Link href="/products" style={navLinkStyle(isProductsActive || productsDropdownOpen)}>
              <span>Products</span>
              <ChevronDown size={14} aria-hidden style={{ flexShrink: 0, transition: 'transform 0.2s ease', transform: productsDropdownOpen ? 'rotate(180deg)' : 'none' }} />
            </Link>

            {productsDropdownOpen && (
              <ProductsMegaMenu
                onClose={() => setProductsDropdownOpen(false)}
                onMouseEnter={handleProductsEnter}
                onMouseLeave={handleProductsLeave}
              />
            )}
          </div>

          {/* Industries Mega Menu */}
          <div
            style={{ position: 'static', paddingBottom: '0.5rem', paddingTop: '0.5rem' }}
            onMouseEnter={handleIndustriesEnter}
            onMouseLeave={handleIndustriesLeave}
          >
            <Link href="/industries" style={navLinkStyle(isIndustriesActive || industriesDropdownOpen)}>
              <span>Industries</span>
              <ChevronDown size={14} aria-hidden style={{ flexShrink: 0, transition: 'transform 0.2s ease', transform: industriesDropdownOpen ? 'rotate(180deg)' : 'none' }} />
            </Link>

            {industriesDropdownOpen && (
              <IndustriesMegaMenu
                onClose={() => setIndustriesDropdownOpen(false)}
                onMouseEnter={handleIndustriesEnter}
                onMouseLeave={handleIndustriesLeave}
              />
            )}
          </div>

          <Link href="/resources" style={navLinkStyle(isResourcesActive)}>
            Tech Resources
          </Link>

          {/* Services Mega Menu */}
          <div
            style={{ position: 'static', paddingBottom: '0.5rem', paddingTop: '0.5rem' }}
            onMouseEnter={handleServicesEnter}
            onMouseLeave={handleServicesLeave}
          >
            <Link href="/services" style={navLinkStyle(isServicesActive || servicesDropdownOpen)}>
              <span>Services</span>
              <ChevronDown size={14} aria-hidden style={{ flexShrink: 0, transition: 'transform 0.2s ease', transform: servicesDropdownOpen ? 'rotate(180deg)' : 'none' }} />
            </Link>

            {servicesDropdownOpen && (
              <ServicesMegaMenu
                onClose={() => setServicesDropdownOpen(false)}
                onOpenBomUpload={() => setIsBomModalOpen(true)}
                onMouseEnter={handleServicesEnter}
                onMouseLeave={handleServicesLeave}
              />
            )}
          </div>

          <Link href="/certifications" style={navLinkStyle(isCertificationsActive)}>
            Certifications &amp; Approvals
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
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              border: '1.5px solid var(--primary-red)',
              backgroundColor: '#FFFFFF',
              color: 'var(--slate-900)',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <span className="rfq-label-full">View RFQ Queue</span>
            <span className="rfq-label-short">RFQ</span>
            {rfqCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-9px',
                right: '-9px',
                minWidth: '20px',
                height: '20px',
                padding: '0 5px',
                borderRadius: '10px',
                backgroundColor: 'var(--primary-red)',
                color: '#FFFFFF',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
              }}>
                {rfqCount}
              </span>
            )}
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ padding: '0.35rem', color: 'var(--slate-900)', background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div style={{
          maxWidth: 'var(--container-max)',
          margin: '0.5rem auto 0 auto',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--slate-200)',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        }}>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700, color: 'var(--slate-900)', textDecoration: 'none', fontSize: '1rem' }}>
            Products Catalog <ArrowRight size={15} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} />
          </Link>
          <Link href="/industries" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700, color: 'var(--slate-900)', textDecoration: 'none', fontSize: '1rem' }}>
            Industries Applications <ArrowRight size={15} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} />
          </Link>
          <Link href="/certifications" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700, color: 'var(--slate-900)', textDecoration: 'none', fontSize: '1rem' }}>
            Certifications & Approvals <ArrowRight size={15} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} />
          </Link>
          <Link href="/resources" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700, color: 'var(--slate-900)', textDecoration: 'none', fontSize: '1rem' }}>
            Tech Resources <ArrowRight size={15} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} />
          </Link>
          <Link href="/services" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 700, color: 'var(--slate-900)', textDecoration: 'none', fontSize: '1rem' }}>
            Services &amp; Fabrication <ArrowRight size={15} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} />
          </Link>
        </div>
      )}

      {/* Modals */}
      <BulkBomModal
        isOpen={isBomModalOpen}
        onClose={() => setIsBomModalOpen(false)}
      />

      <style jsx>{`
        .vendor-strip a {
          color: inherit;
        }
        .strip-short,
        .logo-short,
        .rfq-label-short {
          display: none;
        }
        @media (max-width: 900px) {
          .strip-contact {
            display: none;
          }
        }
        @media (max-width: 640px) {
          .strip-long,
          .logo-full,
          .rfq-label-full {
            display: none;
          }
          .strip-short,
          .logo-short,
          .rfq-label-short {
            display: inline;
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
