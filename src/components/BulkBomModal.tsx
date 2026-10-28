'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CustomSelect } from './CustomSelect';
import { X, Plus, Upload, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface BulkBomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ACCEPT = '.xlsx,.xls,.csv,.pdf,.dwg';
const MAX_BYTES = 25 * 1024 * 1024;

// Current quarter plus the next five, e.g. "Q3 2026"
function upcomingQuarters(): string[] {
  const now = new Date();
  let q = Math.floor(now.getMonth() / 3) + 1;
  let y = now.getFullYear();
  const out: string[] = [];
  for (let i = 0; i < 6; i++) {
    out.push(`Q${q} ${y}`);
    q += 1;
    if (q > 4) {
      q = 1;
      y += 1;
    }
  }
  return out;
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export const BulkBomModal: React.FC<BulkBomModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [quarters] = useState(upcomingQuarters);
  const [quarter, setQuarter] = useState(() => upcomingQuarters()[1]);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ bomId: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const pickFile = (f: File | undefined | null) => {
    setError('');
    if (!f) return;
    const ext = f.name.slice(f.name.lastIndexOf('.')).toLowerCase();
    if (!ACCEPT.split(',').includes(ext)) {
      setError('Please upload an .xlsx, .xls, .csv, .pdf or .dwg file.');
      return;
    }
    if (f.size > MAX_BYTES) {
      setError('File is larger than 25 MB. Please compress it or send it via WhatsApp.');
      return;
    }
    setFile(f);
  };

  const handleClose = () => {
    if (result) {
      setFile(null);
      setResult(null);
    }
    setError('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please attach your BOM file first.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('email', email.trim());
      fd.append('targetQuarter', quarter);
      const res = await fetch('/api/bom', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setResult({ bomId: data.bomId });
      } else {
        setError(data.error || 'Upload failed. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'grid',
        placeItems: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="bom-title" className="bom-panel">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="bom-plus"><Plus size={24} /></div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h3 id="bom-title" style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--slate-900)' }}>Enterprise BOM Upload</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>Secure ERP Gateway for Tier-1 bulk material processing.</p>
          </div>
          <button onClick={handleClose} className="bom-close" aria-label="Close">
            <X size={22} />
          </button>
        </div>

        {result ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0.5rem' }}>
            <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.5rem' }}>BOM received</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '0.5rem' }}>
              Our engineering desk will review <strong>{file?.name}</strong> and reply to <strong>{email}</strong> within 2-4 hours.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '1.5rem' }}>Reference: {result.bomId}</p>
            <button onClick={handleClose} className="bom-submit">Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Drop zone */}
            <div
              className={`bom-drop${dragging ? ' bom-drop--active' : ''}`}
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                pickFile(e.dataTransfer.files?.[0]);
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
            >
              <Upload size={40} color="var(--slate-400)" style={{ margin: '0 auto 0.75rem auto' }} />
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>Drag &amp; Drop your BOM file here</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)', margin: '0.25rem 0 0.85rem 0' }}>
                or <span style={{ color: '#0EA5E9', fontWeight: 700 }}>Browse Files</span> from your computer
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="bom-ext">.XLSX</span>
                <span className="bom-ext">.CSV</span>
                <span className="bom-ext bom-ext--red">.PDF (CAD)</span>
              </div>
              <input ref={inputRef} type="file" accept={ACCEPT} hidden onChange={(e) => pickFile(e.target.files?.[0])} />
            </div>

            {/* Selected file */}
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-900)', margin: '1.5rem 0 0.75rem 0' }}>Upload Status</h4>
            {file ? (
              <div className="bom-status">
                <CheckCircle2 size={24} color="#10B981" style={{ flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, color: 'var(--slate-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857' }}>File ready. Submit to send it to our engineering desk.</div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)' }}>{formatSize(file.size)}</span>
              </div>
            ) : (
              <div className="bom-status bom-status--empty">No file selected yet.</div>
            )}

            {/* Contact + delivery */}
            <div className="bom-fields">
              <div>
                <label htmlFor="bom-email" className="bom-label">Procurement Officer Email *</label>
                <input
                  id="bom-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@company.com"
                  className="bom-input"
                  maxLength={200}
                />
              </div>
              <div>
                <label htmlFor="bom-quarter" className="bom-label">Target Delivery Quarter *</label>
                <CustomSelect
                  id="bom-quarter"
                  options={quarters}
                  value={quarter}
                  onChange={setQuarter}
                  ariaLabel="Target delivery quarter"
                  borderColor="var(--slate-300)"
                />
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-red)', fontSize: '0.85rem', fontWeight: 600, marginTop: '1rem' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="bom-footer">
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Standard processing time for bulk BOMs is 2-4 hours.</span>
              <button type="submit" disabled={submitting} className="bom-submit">
                {submitting ? 'Uploading…' : <>Submit to Secure Gateway <ArrowRight size={15} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} /></>}
              </button>
            </div>
          </form>
        )}

        <style jsx>{`
          .bom-panel {
            background: #ffffff;
            border-radius: 24px;
            padding: clamp(1.25rem, 4vw, 2.25rem);
            max-width: 860px;
            width: 100%;
            max-height: 92vh;
            overflow-y: auto;
          }
          .bom-plus {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: #fde7ea;
            color: var(--primary-red);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .bom-close {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            border: 1.5px solid var(--primary-red);
            background: #fff5f6;
            color: var(--primary-red);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            flex-shrink: 0;
          }
          .bom-drop {
            border: 2px dashed var(--slate-300);
            border-radius: 16px;
            background: #f8fafc;
            padding: 2rem 1rem;
            text-align: center;
            cursor: pointer;
          }
          .bom-drop--active {
            border-color: #0ea5e9;
            background: #f0f9ff;
          }
          .bom-ext {
            font-size: 0.7rem;
            font-weight: 700;
            background: #e2e8f0;
            color: var(--slate-600);
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
          }
          .bom-ext--red {
            background: #fde7ea;
            color: var(--primary-red);
          }
          .bom-status {
            display: flex;
            align-items: center;
            gap: 1rem;
            background: #d1fae5;
            border: 1.5px solid #a7f3d0;
            border-radius: 12px;
            padding: 1rem 1.25rem;
          }
          .bom-status--empty {
            background: #f8fafc;
            border-color: var(--slate-200);
            color: var(--slate-500);
            font-size: 0.875rem;
          }
          .bom-fields {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
            gap: 1rem 2rem;
            margin-top: 1.5rem;
          }
          .bom-label {
            display: block;
            font-size: 0.7rem;
            font-weight: 700;
            color: var(--slate-600);
            text-transform: uppercase;
            margin-bottom: 0.4rem;
          }
          .bom-input {
            width: 100%;
            padding: 0.8rem 0.9rem;
            border: 1.5px solid var(--slate-300);
            border-radius: 8px;
            font-size: 0.95rem;
            font-family: inherit;
            background: #ffffff;
          }
          .bom-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
            border-top: 1px solid var(--slate-200);
            margin-top: 1.75rem;
            padding-top: 1.25rem;
          }
          .bom-submit {
            background: var(--primary-red);
            color: #ffffff;
            font-weight: 700;
            font-size: 0.95rem;
            padding: 0.85rem 1.25rem;
            border-radius: 8px;
            border: none;
            cursor: pointer;
          }
          .bom-submit:disabled {
            opacity: 0.7;
            cursor: wait;
          }
        `}</style>
      </div>
    </div>,
    document.body
  );
};
