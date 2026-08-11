'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

interface ServicesMegaMenuProps {
  onClose?: () => void;
  onOpenBomUpload?: () => void;
}

export const ServicesMegaMenu: React.FC<ServicesMegaMenuProps> = ({ onClose, onOpenBomUpload }) => {
  const columns = [
    {
      id: 'milling',
      title: 'Cellular Glass Milling',
      iconBg: '#E0F2FE',
      iconColor: '#0EA5E9',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      items: ['Pipe Shells & Halves', 'Curved Vessel Segments', 'Domed Tank Heads', 'Beveled Lags & Strips'],
      linkText: 'View Specs & Tolerances →',
    },
    {
      id: 'lamination',
      title: 'Metal & Foil Lamination',
      iconBg: '#FFE4E6',
      iconColor: 'var(--primary-red)',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-red)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M3 15h18" />
        </svg>
      ),
      items: ['PSMB Factory Bonding', 'ASJ Jacketing Adhesion', 'Kraft Paper Facing', 'Heat-Pressed FSK'],
      linkText: 'View Adhesion Tests →',
    },
    {
      id: 'embossing',
      title: 'Corrugation & Embossing',
      iconBg: '#D1FAE5',
      iconColor: '#10B981',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12s3-4 7-4 7 4 7 4 3-4 7-4" />
          <path d="M2 17s3-4 7-4 7 4 7 4 3-4 7-4" />
        </svg>
      ),
      items: ['3/16" Corrugated Profiles', '1-1/4" Structural Profiles', 'Stucco Embossing (Alu)', 'Smooth Flat Processing'],
      linkText: 'View Metal Gauges →',
    },
    {
      id: 'pipe-fitting',
      title: 'Pipe Fitting Fab.',
      iconBg: '#FFEDD5',
      iconColor: '#F97316',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3v6M18 3v6M6 9h12v12H6z" />
        </svg>
      ),
      items: ['90° & 45° Elbows', 'Tee Covers & Junctions', 'Industrial Valve Boxes', 'Flange & Flange Guards'],
      linkText: 'View Assembly Gallery →',
    },
    {
      id: 'acoustic-panels',
      title: 'Acoustic Panels',
      iconBg: '#F3E8FF',
      iconColor: '#9333EA',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9333EA" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5v14M7 9v6M22 11v2M2 11v2" />
        </svg>
      ),
      items: ['Multi-Layer Bonding', 'ISO 15665 Compliance', 'Compressor Mitigation', 'Custom Acoustic Enclosures'],
      linkText: 'View Decibel Testing →',
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
      <div style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
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
              Precision In-House Fabrication
            </h2>
            <p style={{ fontSize: '0.925rem', color: 'var(--slate-500)', fontWeight: 500 }}>
              CNC milling, lamination, and custom pipe-fitting delivering exact mechanical tolerances.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {/* ISO 9001 Facility Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.5rem 1.15rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#D1FAE5',
              color: '#10B981',
              fontSize: '0.8rem',
              fontWeight: 800,
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              <span>ISO 9001 Facility</span>
            </div>

            {/* Upload AutoCAD Action Button */}
            <button
              onClick={() => {
                onClose?.();
                onOpenBomUpload?.();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-red)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(225, 29, 72, 0.3)',
              }}
            >
              <span>Upload AutoCAD</span>
              <ArrowUpRight size={16} />
            </button>
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
                        href="/products/foamglas-cellular-glass"
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
                        className="services-link-item"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Link at Bottom */}
              <Link
                href="/#fabrication-section"
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
          FABRICATION TOLERANCES STRICTLY MONITORED BY IN-HOUSE QA/QC ENGINEERING TEAMS
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInMenu {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        :global(.services-link-item:hover) {
          color: var(--primary-red) !important;
          background-color: #FFE4E6 !important;
        }
      `}</style>
    </>
  );
};
