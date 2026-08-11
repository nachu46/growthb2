'use client';

import React, { useState } from 'react';
import { RESOURCE_DOCUMENTS, ResourceDocument } from '@/data/mockData';
import { Download, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

interface EngineeringResourceHubProps {
  onOpenProfile: () => void;
}

export const EngineeringResourceHub: React.FC<EngineeringResourceHubProps> = ({ onOpenProfile }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (doc: ResourceDocument) => {
    if (doc.category === 'Company Profile') {
      onOpenProfile();
      return;
    }

    setDownloadingId(doc.id);
    try {
      const res = await fetch(`/api/resources?id=${doc.id}`);
      const data = await res.json();
      if (data.success) {
        // Trigger simulated blob download
        const dummyBlob = new Blob([`Growth International Document: ${doc.title}\nCode: ${doc.pdfCode}\nCategory: ${doc.category}`], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(dummyBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${doc.id}-Growth-International.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error('Download error', e);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  return (
    <section id="resources-section" style={{
      padding: '3rem 1.5rem',
      maxWidth: '1280px',
      margin: '0 auto',
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          fontWeight: 800,
          color: 'var(--slate-900)',
          marginBottom: '0.5rem',
        }}>
          Engineering Resource Hub
        </h2>
        <p style={{ fontSize: '1.05rem', color: 'var(--slate-600)' }}>
          Direct access to critical IA documentation, compliance forms, and technical specifications.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
      }}>
        {RESOURCE_DOCUMENTS.map((doc, idx) => (
          <div
            key={doc.id}
            onClick={() => handleDownload(doc)}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              border: '1px solid var(--slate-200)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
            }}
          >
            {/* Icon Circle */}
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              backgroundColor: idx === 0 ? '#E0F2FE' : idx === 1 ? '#F1F5F9' : '#FFE4E6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {idx === 0 ? (
                <span style={{ color: '#0EA5E9', fontWeight: 800, fontSize: '1.2rem' }}>✕</span>
              ) : idx === 1 ? (
                <span style={{ color: 'var(--slate-600)', fontWeight: 800, fontSize: '1.2rem' }}>◯</span>
              ) : (
                <span style={{ color: 'var(--primary-red)', fontWeight: 800, fontSize: '1.2rem' }}>Δ</span>
              )}
            </div>

            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
                {doc.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{downloadingId === doc.id ? 'Downloading PDF...' : doc.subtitle}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
