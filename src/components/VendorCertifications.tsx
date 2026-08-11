'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { VendorModal } from './VendorModal';

export const SaudiAramcoLogoSvg: React.FC<{ height?: number }> = ({ height = 26 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', height: `${height}px`, maxWidth: '110px' }}>
    <img
      src="https://www.aramco.com/-/jssmedia/project/aramcocom/aramco-logo--white.webp"
      alt="Saudi Aramco Official Logo"
      style={{
        height: `${height}px`,
        maxWidth: '110px',
        objectFit: 'contain',
        filter: 'brightness(0) saturate(100%) invert(44%) sepia(85%) saturate(1915%) hue-rotate(164deg) brightness(96%) contrast(101%)',
      }}
    />
  </div>
);

export const VendorCertifications: React.FC = () => {
  const [companyLogos, setCompanyLogos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);

  useEffect(() => {
    fetch('/api/company-logos')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setCompanyLogos(data.data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="certifications-section" style={{
      padding: '4rem 1.5rem',
      backgroundColor: '#F8FAFC',
      borderTop: '1px solid var(--slate-200)',
      borderBottom: '1px solid var(--slate-200)',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '3rem',
          gap: '1.5rem',
        }}>
          <div>
            <span style={{
              display: 'inline-block',
              padding: '0.35rem 0.9rem',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#FFE4E6',
              color: 'var(--primary-red)',
              fontSize: '0.725rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              marginBottom: '0.75rem',
            }}>
              Tier-1 Quality Assurance
            </span>
            <h2 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: 'var(--slate-900)',
              lineHeight: 1.15,
            }}>
              Verified Vendor Registrations & Approvals
            </h2>
          </div>

          <Link
            href="/certifications"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: '#FFFFFF',
              color: 'var(--navy-dark)',
              border: '1.5px solid var(--slate-300)',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <span>View All Registrations →</span>
          </Link>
        </div>

        {/* Vendors Grid fetching dynamically from SQLite DB */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}>
          {companyLogos.map((v, i) => (
            <div
              key={v.id || i}
              onClick={() => setSelectedVendor({ name: v.name, vendorId: v.vendor_id_code || v.vendorId || '10114402', logoText: v.name })}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid var(--slate-200)',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                overflow: 'hidden',
              }}
              className="vendor-card"
            >
              <div style={{ flex: 1, minWidth: 0, paddingRight: '0.5rem' }}>
                <div style={{ marginBottom: '0.65rem', overflow: 'hidden', height: '32px', display: 'flex', alignItems: 'center' }}>
                  <img
                    src={v.logo_url}
                    alt={v.name}
                    style={{ maxHeight: '28px', maxWidth: '110px', objectFit: 'contain' }}
                  />
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {v.name}
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                  Vendor ID: <strong style={{ color: 'var(--slate-800)', fontFamily: 'monospace' }}>{v.vendor_id_code || '10114402'}</strong>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: '#10B981',
                backgroundColor: '#ECFDF5',
                padding: '0.35rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid #A7F3D0',
                flexShrink: 0,
              }}>
                <ShieldCheck size={14} />
                <span>Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <VendorModal
        isOpen={!!selectedVendor}
        onClose={() => setSelectedVendor(null)}
        vendor={selectedVendor}
      />

      <style jsx>{`
        :global(.vendor-card:hover) {
          transform: translateY(-3px);
          border-color: var(--primary-red) !important;
        }
      `}</style>
    </section>
  );
};
