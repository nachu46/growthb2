'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VendorModal } from './VendorModal';

export const SaudiAramcoLogoSvg: React.FC<{ height?: number }> = ({ height = 26 }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', height: `${height}px`, maxWidth: '110px' }}>
    <img
      src="/logos/aramco.webp"
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
  const n = (name || '').toLowerCase();

  let logoConfig = { src: '', filter: undefined as string | undefined };

  if (n.includes('aramco')) {
    logoConfig = { src: '/logos/aramco.webp', filter: 'brightness(0) saturate(100%) invert(44%) sepia(85%) saturate(1915%) hue-rotate(164deg) brightness(96%) contrast(101%)' };
  } else if (n.includes('sabic')) {
    logoConfig = { src: '/logos/sabic.svg', filter: undefined };
  } else if (n.includes('adnoc')) {
    logoConfig = { src: '/logos/adnoc.png', filter: undefined };
  } else if (n.includes('sadara')) {
    logoConfig = { src: '/logos/sadara.png', filter: undefined };
  } else if (n.includes('knpc')) {
    logoConfig = { src: '/logos/knpc.svg', filter: undefined };
  } else if (n.includes('total')) {
    logoConfig = { src: '/logos/totalenergies.png', filter: undefined };
  } else if (n.includes('maaden') || n.includes("ma'aden")) {
    logoConfig = { src: '/logos/maaden.svg', filter: undefined };
  } else {
    logoConfig = { src: logoUrl || '/logos/aramco.webp', filter: undefined };
  }

  return (
    <img
      src={logoConfig.src}
      alt={name}
      style={{
        maxHeight: '30px',
        maxWidth: '110px',
        objectFit: 'contain',
        filter: logoConfig.filter || 'none',
      }}
    />
  );
};

const DEFAULT_COMPANY_LOGOS = [
  { id: 'comp_aramco', name: 'Saudi Aramco', vendor_id_code: '10114402', logo_url: '/logos/aramco.webp' },
  { id: 'comp_sabic', name: 'SABIC', vendor_id_code: '11047900', logo_url: '/logos/sabic.svg' },
  { id: 'comp_adnoc', name: 'ADNOC', vendor_id_code: 'ADNOC-88492', logo_url: '/logos/adnoc.png' },
  { id: 'comp_sadara', name: 'Sadara Chemical', vendor_id_code: 'SAD-90112', logo_url: '/logos/sadara.png' },
  { id: 'comp_knpc', name: 'KNPC', vendor_id_code: 'KNPC-7492', logo_url: '/logos/knpc.svg' },
  { id: 'comp_totalenergies', name: 'TotalEnergies', vendor_id_code: 'TOT-44021', logo_url: '/logos/totalenergies.png' },
  { id: 'comp_maaden', name: "MA'ADEN", vendor_id_code: 'MAD-2091', logo_url: '/logos/maaden.svg' },
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
          const cleaned = data.data.map((item: any) => {
            let name = item.name;
            if (name.includes("MA'ADEN") || name.includes("Maaden")) name = "MA'ADEN";
            if (name.includes("KNPC")) name = "KNPC";
            return {
              ...item,
              name,
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
