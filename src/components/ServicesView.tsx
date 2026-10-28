'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, ArrowRight, Ruler, Layers, Waves, CornerUpRight, AudioWaveform, Snowflake } from 'lucide-react';
import { BulkBomModal } from './BulkBomModal';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

const SERVICES = [
  {
    title: 'Cellular Glass Milling',
    text: 'Advanced CNC fabrication of FOAMGLAS® and rigid insulation blocks into custom pipe shells, vessel segments, and domed heads.',
    tags: ['ASTM C1639', '±2mm Tol.'],
    icon: Ruler,
    color: '#0EA5E9',
    bg: '#E0F2FE',
  },
  {
    title: 'Metal & Foil Lamination',
    text: 'Factory-applied PolySurlyn Moisture Barriers (PSMB), kraft paper, ASJ jacketing bonded under high pressure for zero-defect adhesion.',
    tags: ['ASJ / PSMB', 'PolySurlyn'],
    icon: Layers,
    color: 'var(--primary-red)',
    bg: '#FDE7EA',
  },
  {
    title: 'Corrugation & Embossing',
    text: 'Processing of aluminum and stainless steel flat sheets into 3/16" and 1-1/4" corrugated profiles or stucco embossed finishes for structural rigidity.',
    tags: ['Stucco / Smooth'],
    icon: Waves,
    color: '#10B981',
    bg: '#D1FAE5',
  },
  {
    title: 'Custom Pipe Fitting Assemblies',
    text: 'Pre-fabrication of insulation elbows, tees, valves, and flange covers. Speeds up onsite installation and guarantees vapor seal integrity.',
    tags: ['90° / 45° Elbows', 'Vapor Seal'],
    icon: CornerUpRight,
    color: '#F59E0B',
    bg: '#FEF3C7',
  },
  {
    title: 'Acoustic Panel Fabrication',
    text: 'Precision cutting and multi-layer bonding of mass-loaded vinyl (MLV) and high-density wool for industrial compressor noise mitigation.',
    tags: ['ISO 15665', 'Class A / B / C'],
    icon: AudioWaveform,
    color: '#8B5CF6',
    bg: '#EDE9FE',
  },
  {
    title: 'Cryogenic Pipe Supports',
    text: 'High-density Polyisocyanurate (PIR) and PUF machining for load-bearing cryogenic pipe shoes, vessel saddles, and structural bases.',
    tags: ['ASTM C591', '-196°C Rated'],
    icon: Snowflake,
    color: '#0EA5E9',
    bg: '#E0F2FE',
  },
];

const whatsapp = (text: string) => `https://wa.me/9715309555?text=${encodeURIComponent(text)}`;

export const ServicesView: React.FC = () => {
  const [isBomOpen, setIsBomOpen] = useState(false);

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '1rem 1.5rem 4rem 1.5rem' }}>
      <div style={{ fontSize: '0.9rem', color: 'var(--slate-500)', margin: '0.5rem 0 1.25rem 0', fontWeight: 600 }}>
        <Link href="/" style={{ color: 'var(--slate-500)', textDecoration: 'none' }}>Home</Link> &gt; <strong style={{ color: 'var(--slate-900)' }}>Services</strong>
      </div>

      {/* Hero */}
      <div className="svc-hero">
        <div style={{ flex: '1 1 480px', minWidth: 0 }}>
          <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.15, margin: '0 0 0.9rem 0', letterSpacing: '-0.02em' }}>
            Precision Engineering &amp; In-House Fabrication
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--slate-400)', lineHeight: 1.6, maxWidth: '600px' }}>
            We don&apos;t just supply materials; we engineer them. Our CNC milling, lamination, &amp; pipe-fitting facilities deliver exact mechanical tolerances required by Tier-1 GCC contractors.
          </p>
        </div>
        <div className="svc-hero-actions">
          <button onClick={() => setIsBomOpen(true)} className="svc-btn svc-btn--red">
            <Plus size={20} /> Upload AutoCAD / BOM
          </button>
          <a
            href={whatsapp('Hello Growth International Engineering Desk, I would like a free consultation for a custom fabrication requirement.')}
            target="_blank"
            rel="noopener noreferrer"
            className="svc-btn svc-btn--green"
          >
            <WhatsAppIcon size={22} /> Request for Free Consultation
          </a>
        </div>
      </div>

      {/* Capabilities */}
      <div className="svc-grid">
        {SERVICES.map(s => {
          const Icon = s.icon;
          return (
            <a
              key={s.title}
              href={whatsapp(`Hello Engineering Desk, I would like a quote for ${s.title}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="svc-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={24} />
                </div>
                <ArrowRight size={20} color="var(--slate-300)" />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>{s.title}</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', lineHeight: 1.55, marginBottom: '1rem' }}>{s.text}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {s.tags.map(t => <span key={t} className="svc-tag">{t}</span>)}
              </div>
            </a>
          );
        })}
      </div>

      {/* Quality banner */}
      <div className="svc-quality">
        <div style={{ flex: '1 1 420px' }}>
          <h2 style={{ fontSize: 'clamp(1.3rem, 3vw, 1.75rem)', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.4rem' }}>
            ISO Certified Quality Management
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
            Every fabricated segment undergoes rigorous dimension checks and density testing. Our facility operates under strictly audited ISO 9001:2015 frameworks.
          </p>
        </div>
        <button onClick={() => setIsBomOpen(true)} className="svc-btn svc-btn--red">
          <Plus size={20} /> Upload AutoCAD / BOM
        </button>
      </div>

      <BulkBomModal isOpen={isBomOpen} onClose={() => setIsBomOpen(false)} />

      <style jsx>{`
        .svc-hero {
          background: var(--slate-900);
          border-radius: 16px;
          padding: clamp(1.5rem, 4vw, 2.75rem) clamp(1.25rem, 4vw, 3.25rem);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          margin-bottom: 2.5rem;
        }
        .svc-hero-actions {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          flex: 0 1 260px;
        }
        .svc-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          color: #ffffff;
          text-decoration: none;
          border: none;
          cursor: pointer;
          text-align: left;
        }
        .svc-btn--red {
          background: var(--primary-red);
        }
        .svc-btn--green {
          background: #10b981;
        }
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr));
          gap: 1.25rem;
          margin-bottom: 2.5rem;
        }
        .svc-grid :global(.svc-card) {
          background: #ffffff;
          border: 1.5px solid var(--slate-200);
          border-radius: 12px;
          padding: 1.75rem 1.75rem 1.5rem 1.75rem;
          text-decoration: none;
          transition: border-color 0.15s ease, transform 0.15s ease;
        }
        .svc-grid :global(.svc-card:hover) {
          border-color: var(--primary-red);
          transform: translateY(-2px);
        }
        .svc-tag {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--slate-800);
          background: #f8fafc;
          border: 1px solid var(--slate-200);
          border-radius: 4px;
          padding: 0.25rem 0.6rem;
        }
        .svc-quality {
          background: #ffffff;
          border: 1px solid var(--slate-200);
          border-radius: 12px;
          padding: clamp(1.25rem, 4vw, 2rem) clamp(1.25rem, 4vw, 2.25rem);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
      `}</style>
    </div>
  );
};
