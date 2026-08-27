'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ProductsMegaMenuProps {
  onClose?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const ProductsMegaMenu: React.FC<ProductsMegaMenuProps> = ({ onClose, onMouseEnter, onMouseLeave }) => {
  const columns = [
    {
      id: 'insulation',
      title: 'Insulation',
      pillar: 'Insulation',
      iconBg: '#FFE4E6',
      iconColor: 'var(--primary-red)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 22h20L12 2z" />
        </svg>
      ),
      items: [
        { name: 'Cellular Glass (Hot/Cold)', slug: 'foamglas-cellular-glass' },
        { name: 'PUR / PIR Rigid Foam', slug: 'foamglas-cellular-glass' },
        { name: 'Rock Wool (Hot)', slug: 'mineral-wool-pipe-section' },
        { name: 'Aerogel (Pyrogel)', slug: 'foamglas-cellular-glass' },
      ],
      linkText: 'Explore 12+ Materials →',
    },
    {
      id: 'jacketing',
      title: 'Metal Jacketing',
      pillar: 'Jacketing',
      iconBg: '#E0F2FE',
      iconColor: '#0EA5E9',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M2 12h20" />
        </svg>
      ),
      items: [
        { name: 'Aluminum (ASTM B209)', slug: 'psmb-polysurlyn-jacketing' },
        { name: 'Stainless Steel', slug: 'psmb-polysurlyn-jacketing' },
        { name: 'Galvanized Steel (GI)', slug: 'psmb-polysurlyn-jacketing' },
        { name: 'PSMB Moisture Barrier Aluzinc Coil', slug: 'psmb-polysurlyn-jacketing' },
      ],
      linkText: 'Explore 13+ Materials →',
    },
    {
      id: 'accessories',
      title: 'Accessories',
      pillar: 'Accessories',
      iconBg: '#D1FAE5',
      iconColor: '#10B981',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      items: [
        { name: 'Pipeline Marking', slug: 'foamglas-cellular-glass' },
        { name: 'Insulation Cement', slug: 'foamglas-cellular-glass' },
        { name: 'Industrial Duct Tape', slug: 'foamglas-cellular-glass' },
        { name: 'Toggle Clips & Springs Mastic & Sealants', slug: 'foamglas-cellular-glass' },
      ],
      linkText: 'Explore 24+ Items →',
    },
    {
      id: 'acoustic',
      title: 'Acoustic & Vapor',
      pillar: 'Acoustic',
      iconBg: '#F3E8FF',
      iconColor: '#9333EA',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5v14M7 9v6M22 11v2M2 11v2" />
        </svg>
      ),
      items: [
        { name: 'Mass Loaded Vinyl', slug: 'mineral-wool-pipe-section' },
        { name: 'Lead Sheet Barrier', slug: 'mineral-wool-pipe-section' },
        { name: 'FG Silica Coated Cloth', slug: 'mineral-wool-pipe-section' },
        { name: 'High Temp Vermiculite Teflon Cloth', slug: 'mineral-wool-pipe-section' },
      ],
      linkText: 'Explore 11+ Materials →',
    },
    {
      id: 'valves',
      title: 'Valves & Refractory',
      pillar: 'Valves',
      iconBg: '#FFEDD5',
      iconColor: '#F97316',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3v6M18 3v6M6 9h12v12H6z" />
        </svg>
      ),
      items: [
        { name: 'Industrial Valves', slug: 'foamglas-cellular-glass' },
        { name: 'Refractory Castable', slug: 'foamglas-cellular-glass' },
        { name: 'Refractory Bricks', slug: 'foamglas-cellular-glass' },
        { name: 'Refractory Anchors Inspection Plugs', slug: 'foamglas-cellular-glass' },
      ],
      linkText: 'Explore 8+ Items →',
    },
  ];

  return (
    <>
      {/* Dimmed Soft Overlay Behind Popup */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '72px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.25)',
          backdropFilter: 'blur(3px)',
          zIndex: 80,
        }}
      />

      {/* Main Full-Container Mega Menu Card */}
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
        width: 'min(1280px, 98vw)',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(226, 232, 240, 0.95)',
        padding: '2.5rem 3rem 1.75rem 3rem',
        zIndex: 90,
        color: 'var(--slate-900)',
        cursor: 'default',
        animation: 'fadeInMenu 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* Top Header Bar inside Mega-Menu */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '1.75rem',
          borderBottom: '1px solid var(--slate-200)',
          marginBottom: '2rem',
          gap: '1rem',
        }}>
          <div>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em', marginBottom: '4px' }}>
              Complete Materials
            </h2>
            <p style={{ fontSize: '0.925rem', color: 'var(--slate-500)', fontWeight: 500 }}>
              Cross-referenced against GCC EPC engineering specifications and live warehouse stock.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* Live Sync Active Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.5rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#E0F2FE',
              color: '#0EA5E9',
              fontSize: '0.8rem',
              fontWeight: 800,
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0EA5E9' }} />
              <span>Live Sync Active</span>
            </div>

            {/* View Full Matrix Action Button */}
            <Link
              href="/products"
              onClick={onClose}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--navy-dark)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.9rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(11, 19, 43, 0.25)',
              }}
            >
              <span>View Full Matrix</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* 5 Columns Material Breakdown */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '2rem',
          marginBottom: '2.25rem',
        }} className="megamenu-grid">
          {columns.map(col => (
            <div key={col.id} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Column Title with Icon Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: col.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {col.icon}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {col.title}
                  </h3>
                </div>

                {/* Items List - Each item links directly to Product Detail Page */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                  {col.items.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={onClose}
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: 'var(--slate-700)',
                          textDecoration: 'none',
                          display: 'block',
                          padding: '0.2rem 0.4rem',
                          borderRadius: '4px',
                          transition: 'all 0.15s ease',
                        }}
                        className="megamenu-link-item"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Explore Link at Bottom of Column */}
              <Link
                href={`/products/foamglas-cellular-glass`}
                onClick={onClose}
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 800,
                  color: 'var(--primary-red)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '0.2rem 0',
                }}
              >
                <span>{col.linkText}</span>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom Footer Notice */}
        <div style={{
          textAlign: 'center',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--slate-100)',
          fontSize: '0.7rem',
          fontWeight: 800,
          color: 'var(--slate-400)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          ALL MATERIALS ARE SUBJECT TO RIGOROUS TIER-1 GCC QUALITY ASSURANCE PROTOCOLS
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInMenu {
          from {
            opacity: 0;
            transform: translate(-50%, 8px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        :global(.megamenu-link-item:hover) {
          color: var(--primary-red) !important;
          background-color: #FFE4E6 !important;
        }
        @media (max-width: 1024px) {
          :global(.megamenu-grid) {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  );
};
