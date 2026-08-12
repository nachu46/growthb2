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
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Main Columns Stack on Mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '3rem',
        }}>
          {/* Column 1: Brand Info (Matches Mobile Screenshot 5) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
              <img
                src="/growth-international-logo.png"
                alt="Growth International L.L.C"
                style={{
                  height: '46px',
                  maxWidth: '200px',
                  objectFit: 'contain',
                }}
              />
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
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>
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
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>
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
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>
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

        {/* Copyright & Centered Vendor Box (Matches Mobile Screenshot 6) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)' }}>
            © 2026 Growth International L.L.C. All rights reserved.
          </div>

          {/* Centered Vendor Registration Box (Matches Mobile Screenshot 6) */}
          <div style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '16px',
            border: '1px solid var(--slate-200)',
            padding: '1rem 1.75rem',
            width: '100%',
            maxWidth: '420px',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'var(--slate-900)',
            lineHeight: 1.5,
            letterSpacing: '0.04em',
          }}>
            <div>ARAMCO VENDOR: 10114402</div>
            <div>SABIC: 11047900 | ICV CERTIFIED</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
