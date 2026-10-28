'use client';

import React, { useEffect, useState } from 'react';
import { Award, XCircle } from 'lucide-react';
import { Marquee } from './Marquee';

const DEFAULT_PARTNERS = [
  { name: 'Owens Corning' },
  { name: 'Johns Manville' },
  { name: 'Armacell' },
  { name: 'Aspen Aerogels' },
  { name: 'FOAMGLAS' },
];

// Only http(s) links from the admin panel are rendered as clickable
const safeUrl = (url?: string) => (url && /^https?:\/\//i.test(url) ? url : undefined);

export const SupplyPartners: React.FC = () => {
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/partners')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setPartners(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const displayedList = partners.length > 0 ? partners : DEFAULT_PARTNERS;

  return (
    <section style={{
      padding: '1.5rem 1.25rem',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
    }}>
      {/* Phone layout only (per mobile design): warranty cards + tier-1 EPC list */}
      <div className="sp-mobile-only">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
          {[
            { icon: <Award size={20} />, bg: '#E0F2FE', color: '#0EA5E9', title: 'Mechanical Warranty', sub: 'Standardized up to 10 years.' },
            { icon: <XCircle size={20} />, bg: '#FDE7EA', color: 'var(--primary-red)', title: 'Zero Chatbots', sub: 'Direct access to regional sales.' },
          ].map(card => (
            <div key={card.title} style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--slate-200)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: card.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color,
                flexShrink: 0,
              }}>
                {card.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)' }}>{card.title}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.3rem' }}>
          Trusted by Tier 1 EPCs
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', lineHeight: 1.5, marginBottom: '1rem' }}>
          Delivering structural thermal reliability to the most rigorous GCC projects.
        </p>
        <div className="sp-grid" style={{ marginBottom: '2rem' }}>
          {['ADNOC', 'SABIC', 'TAKREER', 'Saudi Aramco'].map(name => (
            <div key={name} className="sp-tile">{name}</div>
          ))}
        </div>
      </div>

      {/* Featured Supply Partners (managed in Admin → Partners) */}
      <h2 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.4rem)', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.3rem' }}>
        Featured Supply Partners
      </h2>
      <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
        Procurement backed by ISO 9001:2015 global manufacturing standards.
      </p>

      <Marquee label="Featured supply partners" seconds={26} gap="0.85rem">
        {displayedList.map((partner, i) => {
          const href = safeUrl(partner.website_url);
          return href ? (
            <a key={partner.id || i} href={href} target="_blank" rel="noopener noreferrer" className="sp-chip">
              {partner.name}
            </a>
          ) : (
            <span key={partner.id || i} className="sp-chip">{partner.name}</span>
          );
        })}
      </Marquee>

      <style jsx>{`
        .sp-mobile-only {
          display: none;
        }
        .sp-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0.75rem;
        }
        .sp-tile {
          background: #ffffff;
          border: 1px solid var(--slate-200);
          border-radius: 12px;
          padding: 1rem 0.75rem;
          text-align: center;
          font-weight: 700;
          font-size: 0.85rem;
          color: var(--slate-900);
        }
        .sp-chip {
          background: #f1f5f9;
          border: 1px solid var(--slate-200);
          border-radius: 8px;
          padding: 0.7rem 1.5rem;
          white-space: nowrap;
          font-weight: 600;
          font-size: 0.8rem;
          color: var(--slate-800);
          text-decoration: none;
        }
        a.sp-chip:hover {
          border-color: var(--slate-400);
        }
        @media (max-width: 640px) {
          .sp-mobile-only {
            display: block;
          }
        }
      `}</style>
    </section>
  );
};
