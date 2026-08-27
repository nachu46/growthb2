'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface IndustriesMegaMenuProps {
  onClose?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const IndustriesMegaMenu: React.FC<IndustriesMegaMenuProps> = ({ onClose, onMouseEnter, onMouseLeave }) => {
  const columns = [
    {
      id: 'oil-gas',
      title: 'Oil & Gas',
      iconBg: '#FFE4E6',
      iconColor: 'var(--primary-red)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 22V10M18 22V10M12 2v20M6 10h12M9 16h6" />
        </svg>
      ),
      items: ['Cellular Glass (Hot/Cold)', 'SS 316L Jacketing', 'Aerogel (Pyrogel XTE)', 'High-Temp Sealants'],
      linkText: 'Explore 18+ Materials →',
    },
    {
      id: 'hvac',
      title: 'Commercial HVAC',
      iconBg: '#E0F2FE',
      iconColor: '#0EA5E9',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18" />
        </svg>
      ),
      items: ['Elastomeric Nitrile', 'PIR / PUF Rigid Foam', 'Aluminum Jacketing', 'Industrial Duct Tapes'],
      linkText: 'Explore 24+ Materials →',
    },
    {
      id: 'marine',
      title: 'Marine & Offshore',
      iconBg: '#D1FAE5',
      iconColor: '#10B981',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12c4 0 4-3 8-3s4 3 8 3 4-3 8-3M2 17c4 0 4-3 8-3s4 3 8 3 4-3 8-3" />
        </svg>
      ),
      items: ['Galvanized Steel (GI)', 'Rock Wool (High Temp)', 'PSMB Moisture Barrier', 'Anti-Corrosion Coatings'],
      linkText: 'Explore 15+ Materials →',
    },
    {
      id: 'mep',
      title: 'Electro-Mechanical',
      iconBg: '#FEF3C7',
      iconColor: '#F59E0B',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v4M12 19v4M1 12h4M19 12h4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M4.2 19.8l2.8-2.8M17 7l2.8-2.8" />
        </svg>
      ),
      items: ['Mass Loaded Vinyl (MLV)', 'Acoustic Lead Sheets', 'Vibration Isolation Pads', 'Silica Coated Cloth'],
      linkText: 'Explore 22+ Materials →',
    },
    {
      id: 'cryo',
      title: 'Cryogenic & LNG',
      iconBg: '#E0F2FE',
      iconColor: '#0EA5E9',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
        </svg>
      ),
      items: ['Aerogel (Cryogel Z)', 'Cryogenic Pipe Shoes', 'PUF High-Density Foam', 'Primary Vapor Stops'],
      linkText: 'Explore 12+ Materials →',
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
              Industrial Application
            </h2>
            <p style={{ fontSize: '0.925rem', color: 'var(--slate-500)', fontWeight: 500 }}>
              Pre-vetted material assemblies mapped directly to extreme environmental EPC conditions.
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

            {/* View Full Matrix Button */}
            <Link
              href="/industries"
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

        {/* 5 Columns Breakdown */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '2rem',
          marginBottom: '2.25rem',
        }}>
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
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {col.title}
                  </h3>
                </div>

                {/* Items List */}
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                  {col.items.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        href="/industries"
                        onClick={onClose}
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: 'var(--slate-700)',
                          textDecoration: 'none',
                          display: 'block',
                          padding: '0.2rem 0.4rem',
                          borderRadius: '4px',
                        }}
                        className="industries-link-item"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Link at Bottom */}
              <Link
                href="/industries"
                onClick={onClose}
                style={{
                  fontSize: '0.825rem',
                  fontWeight: 800,
                  color: 'var(--primary-red)',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
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
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        :global(.industries-link-item:hover) {
          color: var(--primary-red) !important;
          background-color: #FFE4E6 !important;
        }
      `}</style>
    </>
  );
};
