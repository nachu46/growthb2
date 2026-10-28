'use client';

import React, { useEffect, useState } from 'react';
import { GCC_HUBS, HubLocation } from '@/data/mockData';
import { ArrowUpRight } from 'lucide-react';

export const GccLogisticsMap: React.FC = () => {
  // Hub details are managed in Admin → Locations; built-in data is shown until they load
  const [hubs, setHubs] = useState<HubLocation[]>(GCC_HUBS);
  const [selectedHub, setSelectedHub] = useState<HubLocation>(GCC_HUBS[0]);
  const [hoveredHub, setHoveredHub] = useState<HubLocation | null>(null);

  useEffect(() => {
    fetch('/api/gcc-locations')
      .then(res => res.json())
      .then(data => {
        if (!data.success || !Array.isArray(data.data) || data.data.length === 0) return;
        const mapped: HubLocation[] = data.data.map((l: any) => ({
          id: l.id,
          name: l.hub_name,
          country: l.country,
          isHq: Boolean(l.is_hq),
          status: l.status,
          phone: l.phone,
          coordinates: { x: l.coord_x, y: l.coord_y },
          lastShipment: l.last_shipment || '',
          inventoryCount: l.inventory_count || '',
        }));
        setHubs(mapped);
        setSelectedHub(mapped.find(h => h.isHq) || mapped[0]);
      })
      .catch(() => {});
  }, []);

  const activeHub = hoveredHub || selectedHub;

  // Map node positions (x%, y%)
  const nodePositions: Record<string, { x: number; y: number; label: string }> = {
    'uae-hq': { x: 62, y: 48, label: 'UAE (HQ)' },
    'ksa-dammam': { x: 25, y: 58, label: 'KSA (Dammam)' },
    'kuwait': { x: 35, y: 24, label: 'Kuwait' },
    'bahrain': { x: 45, y: 36, label: 'Bahrain' },
    'qatar': { x: 48, y: 66, label: 'Qatar' },
    'oman': { x: 67, y: 84, label: 'Oman' },
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      border: '1px solid var(--slate-200)',
      padding: '2.5rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(14, 165, 233, 0.05)',
      minHeight: '440px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      {/* SVG Connection Lines & Nodes Container */}
      <div style={{ position: 'relative', width: '100%', height: '360px' }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
          {/* Radial Pink Lines from UAE (HQ) to all Satellite Hubs */}
          {Object.entries(nodePositions).map(([id, pos]) => {
            if (id === 'uae-hq') return null;
            return (
              <line
                key={id}
                x1={`${nodePositions['uae-hq'].x}%`}
                y1={`${nodePositions['uae-hq'].y}%`}
                x2={`${pos.x}%`}
                y2={`${pos.y}%`}
                stroke="#FECDD3"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            );
          })}

          {/* Dashed Cyan Shipment Line from UAE HQ to Active Route Node */}
          <line
            x1={`${nodePositions['uae-hq'].x}%`}
            y1={`${nodePositions['uae-hq'].y}%`}
            x2="69%"
            y2="59%"
            stroke="#0EA5E9"
            strokeWidth="2.5"
            strokeDasharray="5 5"
          />

          {/* Cyan Active Route Dispatch Node */}
          <circle cx="69%" cy="59%" r="6" fill="#0EA5E9" />
        </svg>

        {/* Render Map Nodes */}
        {Object.entries(nodePositions).map(([id, pos]) => {
          const isHq = id === 'uae-hq';
          const hubData = hubs.find(h => h.id === id) || GCC_HUBS.find(h => h.id === id) || hubs[0];

          return (
            <div
              key={id}
              onClick={() => setSelectedHub(hubData)}
              onMouseEnter={() => setHoveredHub(hubData)}
              onMouseLeave={() => setHoveredHub(null)}
              style={{
                position: 'absolute',
                top: `${pos.y}%`,
                left: `${pos.x}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: isHq ? 20 : 10,
              }}
            >
              {/* Outer Pulsating Halo for UAE HQ (Matches Screenshot) */}
              {isHq && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(217, 11, 42, 0.15)',
                  animation: 'pulseGlow 2s infinite ease-in-out',
                }} />
              )}

              {/* Main Node Circle */}
              <div style={{
                width: isHq ? '16px' : '12px',
                height: isHq ? '16px' : '12px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-red)',
                boxShadow: isHq ? '0 0 12px rgba(217, 11, 42, 0.6)' : 'none',
                position: 'relative',
                zIndex: 2,
              }} />

              {/* Node Label Text */}
              <div style={{
                position: 'absolute',
                left: isHq ? '22px' : '16px',
                top: isHq ? '-8px' : '-6px',
                whiteSpace: 'nowrap',
              }}>
                <div style={{
                  fontSize: isHq ? '0.95rem' : '0.825rem',
                  fontWeight: isHq ? 900 : 700,
                  color: 'var(--slate-900)',
                  lineHeight: 1.1,
                }}>
                  {pos.label}
                </div>
                {isHq && (
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--primary-red)',
                    marginTop: '2px',
                  }}>
                    {hubData.status}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live Route Tooltip Badge (Matches Screenshot) */}
        <div className="route-badge" style={{
          position: 'absolute',
          top: '48%',
          left: '69%',
          transform: 'translate(12px, 0)',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #BAE6FD',
          padding: '0.85rem 1.15rem',
          boxShadow: '0 8px 24px rgba(14, 165, 233, 0.15)',
          maxWidth: '210px',
          zIndex: 30,
        }}>
          <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--slate-900)', lineHeight: 1.3, marginBottom: '4px' }}>
            {activeHub.lastShipment || `${activeHub.name}: ${activeHub.status}`}
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0EA5E9' }}>
            {activeHub.isHq ? <>Algorithmic Routing to UAE Hub <ArrowUpRight size={13} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} /></> : `${activeHub.name} · ${activeHub.phone}`}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .route-badge {
            top: 0 !important;
            left: 0 !important;
            right: 0;
            transform: none !important;
            max-width: none !important;
            padding: 0.6rem 0.9rem !important;
          }
        }
        @keyframes pulseGlow {
          0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.2; }
          100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};
