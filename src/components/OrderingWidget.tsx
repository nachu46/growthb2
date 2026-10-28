'use client';

import React, { useState } from 'react';
import { MATERIAL_PILLARS, GCC_HUBS } from '@/data/mockData';
import { CustomSelect } from './CustomSelect';
import { Check, ArrowRight } from 'lucide-react';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

export const OrderingWidget: React.FC = () => {
  const [selectedPillar, setSelectedPillar] = useState('Select Material...');
  const [pillarError, setPillarError] = useState(false);
  const [selectedVolume, setSelectedVolume] = useState('5,000+ Sq. Meters');
  const [selectedHub, setSelectedHub] = useState('uae-hq');

  const handleCalculateQuote = () => {
    if (selectedPillar === 'Select Material...') {
      setPillarError(true);
      return;
    }
    const hubObj = GCC_HUBS.find(h => h.id === selectedHub) || GCC_HUBS[0];
    const message = `Hello Growth International Sales Desk,\n\nI would like a direct volume quote for:\n- Material Pillar: ${selectedPillar}\n- Estimated Volume: ${selectedVolume}\n- Delivery Hub: ${hubObj.name} (${hubObj.status})\n\nPlease send custom pricing matrix and dispatch lead time.`;

    fetch('/api/rfq', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        materialPillar: selectedPillar,
        quantity: selectedVolume,
        deliveryHub: hubObj.name,
        message: 'Submitted via website volume quote widget (WhatsApp).',
      }),
    }).catch(() => {});

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/9715309555?text=${encoded}`, '_blank');
  };

  const trustPoints = [
    {
      title: 'Direct Engineering Alignment',
      subtitle: 'Live product data mapped to rigorous EPC standards.',
    },
    {
      title: 'Zero Automated Chatbots',
      subtitle: 'Complex commercial negotiations require humans.',
    },
    {
      title: 'Transparent Mechanical Warranty',
      subtitle: 'Standardized warranty periods clearly displayed.',
    },
    {
      title: 'Whatsapp Support',
      subtitle: 'Connect instantly with regional management.',
    },
    {
      title: 'Direct Sales Management Bypass',
      subtitle: 'Connect instantly with regional management.',
    },
  ];

  return (
    <section style={{
      padding: '1.5rem 1.25rem',
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
    }}>
      {/* Outer Card Container (Matches Desktop Screenshot) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--slate-200)',
        padding: 'clamp(1.25rem, 4vw, 2rem) clamp(1rem, 4vw, 2.5rem)',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: 'clamp(1.4rem, 3vw, 1.75rem)',
            fontWeight: 700,
            color: 'var(--slate-900)',
            marginBottom: '0.4rem',
            letterSpacing: '-0.02em',
          }}>
            <span className="ow-title-desktop">Streamline Your Ordering</span>
            <span className="ow-title-mobile">Bulk Estimator</span>
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--slate-500)', lineHeight: 1.5 }}>
            Calculate bulk affordability and bypass automated gates to access regional sales management directly.
          </p>
        </div>

        {/* 4-Step Action Grid (Matches Screenshot Layout) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.25rem',
          alignItems: 'center',
          marginBottom: '2.5rem',
        }}>
          {/* Input 1: Material Pillar with Red Border */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: pillarError ? '2px solid var(--primary-red)' : '1px solid var(--slate-300)',
            padding: '0.75rem 1.15rem',
          }}>
            <label style={{ display: 'block', fontSize: '0.675rem', fontWeight: 700, color: pillarError ? 'var(--primary-red)' : 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
              {pillarError ? 'MATERIAL PILLAR (REQUIRED)' : 'MATERIAL PILLAR'}
            </label>
            <CustomSelect
              variant="hero"
              options={[
                { value: 'Select Material...', label: 'Select Material...' },
                ...MATERIAL_PILLARS.map(p => ({ value: p.id, label: p.label }))
              ]}
              value={selectedPillar}
              onChange={(val) => {
                setSelectedPillar(val);
                setPillarError(false);
              }}
              accentColor="var(--primary-red)"
            />
          </div>

          {/* Input 2: Estimated Volume */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--slate-300)',
            padding: '0.75rem 1.15rem',
          }}>
            <label style={{ display: 'block', fontSize: '0.675rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
              ESTIMATED VOLUME
            </label>
            <CustomSelect
              variant="hero"
              options={[
                { value: '5,000+ Sq. Meters', label: '5,000+ Sq. Meters' },
                { value: '1,000+ Sq. Meters', label: '1,000+ Sq. Meters' },
                { value: '10,000+ Sq. Meters (Project Scale)', label: '10,000+ Sq. Meters (Project Scale)' }
              ]}
              value={selectedVolume}
              onChange={(val) => setSelectedVolume(val)}
              accentColor="var(--slate-700)"
            />
          </div>

          {/* Input 3: Delivery Hub */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--slate-300)',
            padding: '0.75rem 1.15rem',
          }}>
            <label style={{ display: 'block', fontSize: '0.675rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '2px' }}>
              DELIVERY HUB
            </label>
            <CustomSelect
              variant="hero"
              options={GCC_HUBS.map(hub => ({ value: hub.id, label: hub.isHq ? 'UAE HQ (Ajman)' : hub.name }))}
              value={selectedHub}
              onChange={(val) => setSelectedHub(val)}
              accentColor="var(--slate-700)"
            />
          </div>

          {/* Action Button: Whatsapp Live Quote → (Matches Screenshot) */}
          <button
            onClick={handleCalculateQuote}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              padding: '1.05rem 1.35rem',
              borderRadius: '16px',
              backgroundColor: 'var(--primary-red)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.95rem',
              border: 'none',
              boxShadow: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            <WhatsAppIcon size={20} color="#FFFFFF" />
            <span className="ow-title-desktop">Whatsapp Live Quote <ArrowRight size={15} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} /></span>
            <span className="ow-title-mobile">Calculate Quick Quote <ArrowRight size={15} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} /></span>
          </button>
        </div>

        {/* Bottom Trust Benefits Card Container (Matches Desktop Screenshot) */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '20px',
          border: '1px solid var(--slate-200)',
          padding: 'clamp(1.25rem, 4vw, 2rem)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '1.1rem 2.5rem',
          }}>
            {trustPoints.map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: '#D1FAE5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10B981',
                  flexShrink: 0,
                }}>
                  <Check size={15} strokeWidth={3} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '2px' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', lineHeight: 1.4 }}>
                    {item.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        :global(.ow-title-mobile) {
          display: none;
        }
        @media (max-width: 640px) {
          :global(.ow-title-desktop) {
            display: none !important;
          }
          :global(.ow-title-mobile) {
            display: inline;
          }
        }
      `}</style>
    </section>
  );
};
