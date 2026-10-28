'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  onOpenProfile: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenProfile }) => {
  return (
    <footer style={{
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid var(--slate-200)',
      padding: '4rem 1.5rem 2.5rem 1.5rem',
      color: 'var(--slate-900)',
    }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        {/* Main Columns Stack on Mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Column 1: Brand Info (Matches Mobile Screenshot 5) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
              <img
                src="/emblem.png"
                alt="Growth International L.L.C emblem"
                style={{
                  height: '42px',
                  width: '42px',
                  objectFit: 'contain',
                }}
              />
              <span style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
                whiteSpace: 'nowrap',
              }}>
                <span style={{ color: 'var(--primary-red)' }}>Growth</span>{' '}
                <span style={{ color: 'var(--slate-900)', fontWeight: 700 }}>International</span>
              </span>
            </Link>

            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6, maxWidth: '300px' }}>
              Your Trusted Partner in Industrial & Commercial Thermal Insulation.
            </p>

            <div style={{ fontSize: '0.85rem', color: 'var(--slate-800)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div><strong>HQ Support: +971-6-530-9555</strong></div>
              <div><strong>Sales: sales@growthme.com</strong></div>
            </div>
          </div>

          {/* Column 2: Material Catalogue */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1rem' }}>
              Material Catalogue
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
              <li><Link href="/products/foamglas-cellular-glass" style={{ color: 'var(--slate-600)', textDecoration: 'none' }}>Industrial Insulation</Link></li>
              <li><Link href="/products/psmb-polysurlyn-jacketing" style={{ color: 'var(--slate-600)', textDecoration: 'none' }}>Metal Jacketing & Cladding</Link></li>
              <li><Link href="/products" style={{ color: 'var(--slate-600)', textDecoration: 'none' }}>Accessories & Adhesives</Link></li>
              <li><Link href="/products/mineral-wool-pipe-section" style={{ color: 'var(--slate-600)', textDecoration: 'none' }}>Acoustic & Vapor Barrier</Link></li>
              <li><Link href="/products" style={{ color: 'var(--slate-600)', textDecoration: 'none' }}>Valves / Refractory / HVAC</Link></li>
            </ul>
          </div>

          {/* Column 3: Industries & Trust (Matches Mobile Screenshot 6) */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1rem' }}>
              Industries & Trust
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
              <li><Link href="/industries" style={{ color: 'var(--slate-600)', textDecoration: 'none' }}>Oil & Gas Specifications</Link></li>
              <li><Link href="/industries" style={{ color: 'var(--slate-600)', textDecoration: 'none' }}>HVAC Applications</Link></li>
              <li><Link href="/certifications" style={{ color: 'var(--slate-600)', textDecoration: 'none' }}>Partner Ecosystem</Link></li>
              <li><Link href="/certifications" style={{ color: 'var(--slate-600)', textDecoration: 'none' }}>Project References</Link></li>
              <li>
                <button onClick={onOpenProfile} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--slate-600)', cursor: 'pointer', fontSize: '0.875rem' }}>
                  Download Company Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: GCC Logistics Hubs (Matches Mobile Screenshot 6) */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '1rem' }}>
              GCC Logistics Hubs
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.875rem', color: 'var(--slate-600)' }}>
              <li>UAE (Ajman, Dubai, Abu Dhabi)</li>
              <li>KSA (+966-50-218-8681)</li>
              <li>Kuwait (+965-31347699)</li>
              <li>Qatar (+974-31347699)</li>
              <li>Bahrain & Oman Operations</li>
            </ul>
          </div>
        </div>

        {/* Bottom Horizontal Divider Line */}
        <div style={{ height: '1px', backgroundColor: 'var(--slate-200)', marginBottom: '1.5rem' }} />

        {/* Copyright left, vendor registrations right; stacks into a centred box on phones */}
        <div className="footer-bottom">
          <div style={{ fontSize: '0.775rem', color: 'var(--slate-400)' }}>
            © {new Date().getFullYear()} Growth International L.L.C. All rights reserved.
          </div>
          <div className="footer-vendor">
            <span>ARAMCO VENDOR: 10114402</span>
            <span className="footer-sep"> | </span>
            <span>SABIC VENDOR: 11047900 | ICV CERTIFIED</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .footer-vendor {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--slate-900);
        }
        @media (max-width: 640px) {
          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }
          .footer-vendor {
            background: #F8FAFC;
            border: 1px solid var(--slate-200);
            border-radius: 16px;
            padding: 1rem 1.5rem;
            width: 100%;
            display: flex;
            flex-direction: column;
          }
          .footer-sep {
            display: none;
          }
        }
      `}</style>
    </footer>
  );
};
