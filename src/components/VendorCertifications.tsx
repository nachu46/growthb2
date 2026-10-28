'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { VendorModal } from './VendorModal';
import { Marquee } from './Marquee';
import { ArrowRight } from 'lucide-react';

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
  const [imgError, setImgError] = useState(false);

  // If custom logo URL is uploaded via Admin Panel or saved in DB, display it!
  if (logoUrl && !imgError) {
    const isAramcoWhite = logoUrl.includes('aramco-logo--white') || logoUrl.includes('aramco.webp');
    return (
      <img
        src={logoUrl}
        alt={name}
        onError={() => setImgError(true)}
        style={{
          height: '30px',
          width: 'auto',
          maxWidth: '110px',
          objectFit: 'contain',
          filter: isAramcoWhite ? 'brightness(0) saturate(100%) invert(44%) sepia(85%) saturate(1915%) hue-rotate(164deg) brightness(96%) contrast(101%)' : 'none',
        }}
      />
    );
  }

  // Fallback defaults if no custom admin URL is set or if URL load fails
  const n = (name || '').toLowerCase();
  let src = '/logos/aramco.webp';
  let filter = 'none';

  if (n.includes('aramco')) {
    src = '/logos/aramco.webp';
    filter = 'brightness(0) saturate(100%) invert(44%) sepia(85%) saturate(1915%) hue-rotate(164deg) brightness(96%) contrast(101%)';
  } else if (n.includes('sabic')) {
    src = '/logos/sabic.svg';
  } else if (n.includes('adnoc')) {
    src = '/logos/adnoc-logo.svg';
  } else if (n.includes('sadara')) {
    src = '/logos/sadara-logo.svg';
  } else if (n.includes('knpc')) {
    src = '/logos/knpc.svg';
  } else if (n.includes('total')) {
    src = '/logos/totalenergies.png';
  } else if (n.includes('maaden') || n.includes("ma'aden")) {
    src = '/logos/maaden.svg';
  }

  return (
    <img
      src={src}
      alt={name}
      style={{
        height: '30px',
        width: 'auto',
        maxWidth: '110px',
        objectFit: 'contain',
        filter,
      }}
    />
  );
};

const DEFAULT_COMPANY_LOGOS = [
  { id: 'comp_aramco', name: 'Saudi Aramco', vendor_id_code: '10114402', logo_url: '/logos/aramco.webp' },
  { id: 'comp_sabic', name: 'SABIC', vendor_id_code: '11047900', logo_url: '/logos/sabic.svg' },
  { id: 'comp_adnoc', name: 'ADNOC', vendor_id_code: 'ADNOC-88492', logo_url: '/logos/adnoc-logo.svg' },
  { id: 'comp_sadara', name: 'Sadara Chemical', vendor_id_code: 'SAD-90112', logo_url: '/logos/sadara-logo.svg' },
  { id: 'comp_knpc', name: 'KNPC', vendor_id_code: 'KNPC-7492', logo_url: '/logos/knpc.svg' },
  { id: 'comp_totalenergies', name: 'TotalEnergies', vendor_id_code: 'TOT-44021', logo_url: '/logos/totalenergies.png' },
  { id: 'comp_maaden', name: "MA'ADEN", vendor_id_code: 'MAD-2091', logo_url: '/logos/maaden.svg' },
];

export const VendorCertifications: React.FC = () => {
  const [companyLogos, setCompanyLogos] = useState<any[]>(DEFAULT_COMPANY_LOGOS);
  const [selectedVendor, setSelectedVendor] = useState<any | null>(null);

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
      })
      .catch(() => {});
  }, []);

  return (
    <section id="certifications-section" style={{ padding: '2.5rem 1.5rem 1.5rem 1.5rem' }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <h2 style={{
          fontSize: 'clamp(1.4rem, 3vw, 1.75rem)',
          fontWeight: 700,
          color: 'var(--slate-900)',
          lineHeight: 1.25,
          maxWidth: '640px',
          marginBottom: '0.4rem',
        }}>
          Fully registered and cleared for tier-1 vendor projects across the GCC
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', maxWidth: '640px', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Delivering structural thermal reliability to the most rigorous projects in the Middle East, fully approved for deployment across regional mega-projects.
        </p>

        <div className="vendor-head">
          <span />
          <Link href="/certifications" className="vendor-more">
            View All Registrations <ArrowRight size={15} aria-hidden style={{ verticalAlign: '-3px', color: 'var(--primary-red)' }} />
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <Marquee label="Tier-1 vendor registrations" seconds={32}>
          {companyLogos.map((v, i) => (
            <button
              key={v.id || i}
              type="button"
              onClick={() => setSelectedVendor({ name: v.name, vendorId: v.vendor_id_code || v.vendorId || '10114402', logoText: v.name })}
              className="vendor-chip"
              aria-label={`${v.name} vendor registration`}
            >
              <span style={{ height: '32px', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <CompanyLogoIcon name={v.name} logoUrl={v.logo_url} />
              </span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-900)', whiteSpace: 'nowrap' }}>
                {v.name}
              </span>
            </button>
          ))}
        </Marquee>
      </div>

      <VendorModal
        isOpen={!!selectedVendor}
        onClose={() => setSelectedVendor(null)}
        vendor={selectedVendor}
      />

      <style jsx>{`
        .vendor-head {
          display: flex;
          justify-content: space-between;
          margin-top: -0.5rem;
          margin-bottom: 0.75rem;
        }
        .vendor-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: #ffffff;
          border: 1px solid var(--slate-200);
          border-radius: 12px;
          padding: 0.75rem 1.25rem;
          cursor: pointer;
          flex-shrink: 0;
          transition: border-color 0.15s ease;
        }
        .vendor-chip:hover {
          border-color: var(--primary-red);
        }
        .vendor-head :global(.vendor-more) {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--slate-900);
          padding: 0.6rem 0.5rem;
          text-decoration: none;
        }
      `}</style>
    </section>
  );
};
