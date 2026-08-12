'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

const CompanyLogoIcon: React.FC<{ name: string; logoUrl?: string }> = ({ name, logoUrl }) => {
  const [imgError, setImgError] = useState(false);

  if (logoUrl && !imgError) {
    return (
      <img
        src={logoUrl}
        alt={name}
        onError={() => setImgError(true)}
        style={{ maxHeight: '28px', maxWidth: '95px', objectFit: 'contain' }}
      />
    );
  }

  const n = (name || '').toLowerCase();

  if (n.includes('adnoc')) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 21 12 21C12 21 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#005691" />
        <circle cx="12" cy="9" r="3.5" fill="#00A3E0" />
      </svg>
    );
  }

  if (n.includes('ma\'aden') || n.includes('maaden')) {
    return (
      <svg width="28" height="22" viewBox="0 0 28 22" fill="none">
        <path d="M3 16C3 11 7 5 14 5C21 5 25 16 25 16" stroke="#B8860B" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M7 16C7 12 10 8 14 8C18 8 21 16 21 16" stroke="#DAA520" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes('aramco')) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#00A3E0" />
        <circle cx="12" cy="12" r="6" fill="#84BD00" />
      </svg>
    );
  }

  if (n.includes('sabic')) {
    return (
      <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#005691', fontFamily: 'sans-serif' }}>sabic</span>
    );
  }

  if (n.includes('totalenergies') || n.includes('total')) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M4 8C8 4 16 4 20 8" stroke="#E11D48" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M4 16C8 20 16 20 20 16" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (n.includes('sadara')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <polygon points="12,3 21,21 3,21" fill="#0EA5E9" />
      </svg>
    );
  }

  if (n.includes('knpc')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <polygon points="12,2 22,22 2,22" fill="#DC2626" />
      </svg>
    );
  }

  return (
    <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--navy-dark)' }}>
      {name?.charAt(0) || 'V'}
    </div>
  );
};

const DEFAULT_COMPANY_LOGOS = [
  { id: 'comp_aramco', name: 'Saudi Aramco', vendor_id_code: '10114402', logo_url: 'https://cdn.worldvectorlogo.com/logos/saudi-aramco.svg' },
  { id: 'comp_sabic', name: 'SABIC', vendor_id_code: '11047900', logo_url: 'https://cdn.worldvectorlogo.com/logos/sabic.svg' },
  { id: 'comp_adnoc', name: 'ADNOC', vendor_id_code: 'ADNOC-88492', logo_url: '' },
  { id: 'comp_sadara', name: 'Sadara Chemical', vendor_id_code: 'SAD-90112', logo_url: '' },
  { id: 'comp_knpc', name: 'KNPC', vendor_id_code: 'KNPC-7492', logo_url: '' },
  { id: 'comp_totalenergies', name: 'TotalEnergies', vendor_id_code: 'TOT-44021', logo_url: '' },
  { id: 'comp_maaden', name: "MA'ADEN", vendor_id_code: 'MAD-2091', logo_url: '' },
];

export const VendorCertifications: React.FC = () => {
  const [companyLogos, setCompanyLogos] = useState<any[]>(DEFAULT_COMPANY_LOGOS);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/company-logos')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          // Normalize names and logo URLs for clean display
          const cleaned = data.data.map((item: any) => {
            let name = item.name;
            if (name.includes("MA'ADEN") || name.includes("Maaden")) name = "MA'ADEN";
            if (name.includes("KNPC")) name = "KNPC";
            
            let logo_url = item.logo_url;
            if (!logo_url || logo_url.includes('oraclecloud') || logo_url.includes('adnoc.ae') || name === "MA'ADEN" || name === "ADNOC") {
              logo_url = '';
            }
            
            return {
              ...item,
              name,
              logo_url,
            };
          });
          setCompanyLogos(cleaned);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displayLogos = [...companyLogos, ...companyLogos, ...companyLogos];

  return (
    <section id="certifications-section" style={{
      padding: '4rem 0',
      backgroundColor: '#F8FAFC',
      borderTop: '1px solid var(--slate-200)',
      borderBottom: '1px solid var(--slate-200)',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Section Header */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2.5rem',
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => handleScroll('left')}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid var(--slate-300)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--slate-700)',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                }}
                aria-label="Previous Slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => handleScroll('right')}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid var(--slate-300)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--slate-700)',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                }}
                aria-label="Next Slide"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <Link
              href="/certifications"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: '#FFFFFF',
                color: 'var(--navy-dark)',
                border: '1.5px solid var(--slate-300)',
                fontWeight: 700,
                fontSize: '0.875rem',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <span>View All Registrations →</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Infinite Auto-Sliding Carousel Track */}
      <div
        className="vendor-carousel-container"
        ref={scrollRef}
        style={{
          width: '100%',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          padding: '0.75rem 0 1.25rem 0',
        }}
      >
        <div className="vendor-carousel-track">
          {displayLogos.map((v, i) => (
            <div
              key={`${v.id || i}-${i}`}
              onClick={() => setSelectedVendor({ name: v.name, vendorId: v.vendor_id_code || v.vendorId || '10114402', logoText: v.name })}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid var(--slate-200)',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
                flexShrink: 0,
                width: '270px',
              }}
              className="vendor-card"
            >
              <div style={{ overflow: 'hidden', height: '32px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <CompanyLogoIcon name={v.name} logoUrl={v.logo_url} />
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--slate-900)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>
                {v.name}
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
        .vendor-carousel-container::-webkit-scrollbar {
          display: none;
        }

        .vendor-carousel-track {
          display: flex;
          gap: 1.25rem;
          width: max-content;
          padding-left: 1.5rem;
          animation: marqueeSlide 28s linear infinite;
        }

        .vendor-carousel-container:hover .vendor-carousel-track {
          animation-play-state: paused;
        }

        @keyframes marqueeSlide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }

        :global(.vendor-card:hover) {
          transform: translateY(-4px) scale(1.02);
          border-color: var(--primary-red) !important;
          box-shadow: 0 10px 24px rgba(225, 29, 72, 0.12) !important;
        }
      `}</style>
    </section>
  );
};
