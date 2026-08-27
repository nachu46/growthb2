'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, FileSpreadsheet, Award, MessageCircle } from 'lucide-react';

interface BulkBomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkBomModal: React.FC<BulkBomModalProps> = ({ isOpen, onClose }) => {
  const [bomText, setBomText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bomResult, setBomResult] = useState<any | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProcessBom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bomText.trim()) return;

    setIsProcessing(true);
    try {
      const res = await fetch('/api/bom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bomText }),
      });
      const data = await res.json();
      if (data.success) {
        setBomResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        setBomText(text || `1. FOAMGLAS ONE Cellular Glass Block 500 SqM\n2. PolySurlyn PSMB Aluminium Jacketing 0.5mm 1200 SqM\n3. Mineral Wool Pipe Section 200 Meters\n4. Heavy Duty SS Lacing Hooks 5 Boxes`);
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'grid',
        placeItems: 'center',
        padding: '1.5rem',
        overflowY: 'auto',
      }}
    >
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '2rem 2.25rem',
        maxWidth: '680px',
        width: '100%',
        maxHeight: 'min(85vh, 650px)',
        overflowY: 'auto',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(226, 232, 240, 0.9)',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <FileSpreadsheet size={22} color="var(--primary-red)" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Bulk Upload Bill of Materials (BOM)
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
              Paste your line items or upload Excel/CSV/PDF schedule for automated SKU matching & bulk pricing.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Modal"
            style={{
              padding: '0.6rem',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              color: '#334155',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {bomResult ? (
          <div style={{ backgroundColor: '#ECFDF5', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #10B981' }}>
            <Award size={40} color="#10B981" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#065F46', textAlign: 'center', marginBottom: '0.5rem' }}>
              BOM Successfully Matched! ({bomResult.bomId})
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#047857', textAlign: 'center', marginBottom: '1.25rem' }}>
              Matched <strong>{bomResult.processedLines} line items</strong>. Estimated Project Value: <strong>~${bomResult.totalEstimateUSD.toLocaleString()} USD</strong> (includes 15% bulk BOM discount).
            </p>

            <div style={{ maxHeight: '200px', overflowY: 'auto', backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #A7F3D0', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              {bomResult.matchedProducts.map((item: any, idx: number) => (
                <div key={idx} style={{ borderBottom: '1px solid var(--slate-100)', padding: '0.5rem 0', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.line}</span>
                  <strong style={{ color: 'var(--navy-dark)' }}>{item.matchedItem.name.split(' ')[0]} ({item.estimatedQty} pcs)</strong>
                </div>
              ))}
            </div>

            <button
              onClick={() => window.open(bomResult.whatsappUrl, '_blank')}
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-red)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
              }}
            >
              <MessageCircle size={18} fill="#FFFFFF" color="var(--primary-red)" />
              <span>Route BOM to Regional Sales Desk via WhatsApp →</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleProcessBom} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* File Dropzone */}
            <div style={{
              border: '2px dashed var(--slate-300)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--slate-50)',
              cursor: 'pointer',
              position: 'relative',
            }}>
              <input
                type="file"
                accept=".csv, .xlsx, .pdf, .txt"
                onChange={handleFileUpload}
                style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
              />
              <Upload size={32} color="var(--slate-400)" style={{ margin: '0 auto 0.75rem auto' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--slate-800)' }}>
                Click or drag & drop BOM File (.xlsx, .csv, .pdf)
              </div>
              <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                Maximum file size: 25MB
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--slate-400)', fontWeight: 700 }}>
              — OR PASTE LINE ITEMS BELOW —
            </div>

            <div>
              <textarea
                rows={5}
                placeholder={`1. FOAMGLAS ONE Cellular Glass Insulation 500 SqM\n2. PSMB Aluminium Jacketing 0.5mm 1200 SqM\n3. Mineral Wool Pipe Section 300 Meters\n4. Stainless Steel Lacing Hooks 1000 Pcs`}
                value={bomText}
                onChange={(e) => setBomText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--slate-300)',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing || !bomText.trim()}
              style={{
                padding: '0.9rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--navy-dark)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              {isProcessing ? 'Processing BOM SKU Matching...' : 'Process BOM & Calculate Bulk Pricing →'}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
