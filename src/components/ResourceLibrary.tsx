'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { RESOURCE_FOLDERS } from '@/lib/resources';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';

interface ResourceRow {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  folder?: string;
  subfolder?: string;
  file_type?: string;
  revision_date?: string;
  file_url?: string;
  file_size?: string;
  pdf_code?: string;
}

const PAGE_SIZE = 8;

// Home-page hub cards link here with ?category=<card name>
const CATEGORY_TO_FOLDER: Record<string, string> = {
  'ASTM Compliance Sheets': 'ASTM Compliance Audits',
  'Installation Guides': 'Installation Guides',
  'Company Profile': 'EPC Registration Certificates',
};

const isNew = (date?: string) => {
  if (!date) return false;
  const t = Date.parse(date);
  return !Number.isNaN(t) && Date.now() - t < 1000 * 60 * 60 * 24 * 60;
};

const formatDate = (date?: string) => {
  if (!date) return '—';
  const t = Date.parse(date);
  return Number.isNaN(t) ? date : new Date(t).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

export const ResourceLibrary: React.FC = () => {
  const [rows, setRows] = useState<ResourceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState<string>('');
  const [subfolder, setSubfolder] = useState<string>('');
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);

  useEffect(() => {
    const cat = new URLSearchParams(window.location.search).get('category');
    if (cat) setFolder(CATEGORY_TO_FOLDER[cat] || cat);

    fetch('/api/resources')
      .then(res => res.json())
      .then(data => data.success && setRows(data.resources || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const subfolders = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const r of rows) {
      const f = r.folder || 'Other';
      if (r.subfolder && !(map[f] || []).includes(r.subfolder)) (map[f] = map[f] || []).push(r.subfolder);
    }
    return map;
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(r => {
      if (q) {
        return [r.title, r.subtitle, r.pdf_code, r.folder, r.subfolder, r.category].some(v => (v || '').toLowerCase().includes(q));
      }
      if (folder && r.folder !== folder) return false;
      if (subfolder && r.subfolder !== subfolder) return false;
      return true;
    });
  }, [rows, folder, subfolder, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const downloadable = pageRows.filter(r => r.file_url);

  const chooseFolder = (f: string, sub = '') => {
    setFolder(f);
    setSubfolder(sub);
    setQuery('');
    setSearchInput('');
    setPage(1);
    setSelected(new Set());
  };

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const downloadSelected = () => {
    const files = rows.filter(r => selected.has(r.id) && r.file_url);
    files.forEach((r, i) => {
      // Stagger clicks so browsers don't drop multiple downloads
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = r.file_url!;
        a.download = r.title;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, i * 400);
    });
  };

  const requestUrl = (r: ResourceRow) =>
    `https://wa.me/9715309555?text=${encodeURIComponent(`Hello Technical Desk, please send the document "${r.title}"${r.pdf_code ? ` (${r.pdf_code})` : ''}.`)}`;

  const heading = query
    ? `Search results for “${query}”`
    : folder
      ? `${folder}${subfolder ? ` > ${subfolder}` : ''}`
      : 'All Documents';

  return (
    <section style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '1.5rem 1.25rem' }}>
      <div className="lib-outer">
        <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', fontWeight: 700, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
          Made For Engineering
        </h1>
        <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)', maxWidth: '560px', margin: '0.25rem 0 1.25rem 0' }}>
          Direct access to master specification sheets, SDS protocols, and ASTM compliance audits.
        </p>

        <form
          className="lib-search"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(searchInput);
            setPage(1);
            setSelected(new Set());
          }}
        >
          <Search size={20} color="var(--slate-500)" style={{ flexShrink: 0 }} />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by Document ID, ASTM Code, or Material Name (e.g. C552, SDS, Foamglas)..."
            aria-label="Search library"
          />
          <button type="submit">Search Library</button>
        </form>

        <div className="lib-body">
          {/* Directory */}
          <nav className="lib-tree" aria-label="Library directory">
            <div className="lib-tree-title">Library Directory</div>
            <button className={`lib-folder${!folder && !query ? ' is-active' : ''}`} onClick={() => chooseFolder('')}>
              All Documents
            </button>
            {RESOURCE_FOLDERS.map(f => {
              const open = folder === f;
              return (
                <div key={f}>
                  <button className={`lib-folder${open && !subfolder ? ' is-active' : ''}`} onClick={() => chooseFolder(f)}>
                    <span className="lib-caret">{open ? <ChevronDown size={13} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} /> : <ChevronRight size={13} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} />}</span> {f}
                  </button>
                  {open && (subfolders[f] || []).map(sub => (
                    <button key={sub} className={`lib-sub${subfolder === sub ? ' is-active' : ''}`} onClick={() => chooseFolder(f, sub)}>
                      ↳ {sub}
                    </button>
                  ))}
                </div>
              );
            })}
          </nav>

          {/* Files */}
          <div className="lib-files">
            <div className="lib-files-head">
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--slate-900)' }}>{heading}</h2>
              <button className="lib-dl-selected" disabled={selected.size === 0} onClick={downloadSelected}>
                <Download size={15} /> Download Selected ({selected.size})
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="lib-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>
                      <input
                        type="checkbox"
                        aria-label="Select all on this page"
                        checked={downloadable.length > 0 && downloadable.every(r => selected.has(r.id))}
                        onChange={(e) =>
                          setSelected(prev => {
                            const next = new Set(prev);
                            downloadable.forEach(r => (e.target.checked ? next.add(r.id) : next.delete(r.id)));
                            return next;
                          })
                        }
                      />
                    </th>
                    <th>Document Name / ID</th>
                    <th>Type</th>
                    <th>Rev. Date</th>
                    <th>Size</th>
                    <th style={{ width: '48px' }} />
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--slate-500)', padding: '2rem' }}>Loading library…</td></tr>
                  )}
                  {!loading && pageRows.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--slate-500)', padding: '2rem' }}>No documents found.</td></tr>
                  )}
                  {pageRows.map(r => {
                    const fresh = isNew(r.revision_date);
                    return (
                      <tr key={r.id} className={selected.has(r.id) ? 'is-selected' : ''}>
                        <td>
                          <input
                            type="checkbox"
                            aria-label={`Select ${r.title}`}
                            disabled={!r.file_url}
                            checked={selected.has(r.id)}
                            onChange={() => toggle(r.id)}
                          />
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: 'var(--slate-900)', wordBreak: 'break-all' }}>{r.title}</div>
                          {r.subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{r.subtitle.replace(/\s*[→➔➜]+\s*$/, '')}</div>}
                        </td>
                        <td><span className={`lib-type${(r.file_type || 'PDF') === 'PDF' ? ' lib-type--pdf' : ''}`}>{r.file_type || 'PDF'}</span></td>
                        <td style={{ color: fresh ? 'var(--primary-red)' : undefined, fontWeight: fresh ? 700 : 400, whiteSpace: 'nowrap' }}>
                          {formatDate(r.revision_date)}{fresh ? ' (New)' : ''}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>{r.file_size || '—'}</td>
                        <td>
                          {r.file_url ? (
                            <a href={r.file_url} download={r.title} aria-label={`Download ${r.title}`} style={{ color: '#0EA5E9' }}>
                              <Download size={18} />
                            </a>
                          ) : (
                            <a href={requestUrl(r)} target="_blank" rel="noopener noreferrer" aria-label={`Request ${r.title}`} title="Request via WhatsApp" style={{ color: 'var(--slate-500)' }}>
                              <WhatsAppIcon size={18} color="#25D366" />
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="lib-pager">
              <span>
                {filtered.length === 0
                  ? 'No documents'
                  : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}-${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length} documents`}
              </span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(n => (
                  <button key={n} className={n === currentPage ? 'is-active' : ''} onClick={() => setPage(n)}>{n}</button>
                ))}
                <button disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .lib-outer {
          background: #ffffff;
          border: 1px solid var(--slate-200);
          border-radius: 18px;
          padding: clamp(1.25rem, 4vw, 2.5rem) clamp(1rem, 4vw, 3.25rem);
        }
        .lib-search {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f8fafc;
          border: 1.5px solid var(--slate-200);
          border-radius: 12px;
          padding: 0.5rem 0.5rem 0.5rem 1rem;
          margin-bottom: 1.25rem;
        }
        .lib-search input {
          flex: 1;
          min-width: 0;
          border: none;
          background: transparent;
          font-size: 0.9rem;
          font-family: inherit;
          outline: none;
        }
        .lib-search button {
          background: var(--slate-900);
          color: #ffffff;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.7rem 2rem;
          border-radius: 8px;
          white-space: nowrap;
        }
        .lib-body {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        .lib-tree,
        .lib-files {
          border: 1px solid var(--slate-200);
          border-radius: 12px;
          padding: 1rem;
          min-width: 0;
        }
        .lib-tree-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--slate-900);
          text-transform: uppercase;
          padding-bottom: 0.75rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid var(--slate-200);
        }
        .lib-folder,
        .lib-sub {
          display: block;
          width: 100%;
          text-align: left;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--slate-700);
          padding: 0.45rem 0.5rem;
          border-radius: 6px;
        }
        .lib-sub {
          font-size: 0.8rem;
          padding-left: 1.6rem;
        }
        .lib-folder.is-active,
        .lib-sub.is-active {
          color: var(--primary-red);
          background: #fde7ea;
        }
        .lib-caret {
          font-size: 0.6rem;
          display: inline-block;
          width: 1rem;
        }
        .lib-files-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        .lib-dl-selected {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border: 1.5px solid #0ea5e9;
          color: #0ea5e9;
          background: #f0f9ff;
          font-weight: 700;
          font-size: 0.8rem;
          padding: 0.45rem 0.9rem;
          border-radius: 8px;
        }
        .lib-dl-selected:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .lib-table {
          width: 100%;
          min-width: 560px;
          border-collapse: collapse;
          font-size: 0.8rem;
          text-align: left;
        }
        .lib-table th {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--slate-900);
          text-transform: uppercase;
          padding: 0.7rem 0.5rem;
          border-bottom: 1px solid var(--slate-200);
        }
        .lib-table td {
          padding: 0.85rem 0.5rem;
          border-bottom: 1px solid var(--slate-200);
          color: var(--slate-600);
          vertical-align: middle;
        }
        .lib-table tr.is-selected td {
          background: #f0f9ff;
        }
        .lib-type {
          font-size: 0.65rem;
          font-weight: 700;
          background: #f1f5f9;
          color: var(--slate-600);
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }
        .lib-type--pdf {
          background: #fde7ea;
          color: var(--primary-red);
        }
        .lib-pager {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 1rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--slate-600);
        }
        .lib-pager button {
          min-width: 28px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid var(--slate-200);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.75rem;
          color: var(--slate-700);
        }
        .lib-pager button.is-active {
          background: var(--slate-900);
          border-color: var(--slate-900);
          color: #ffffff;
        }
        .lib-pager button:disabled {
          opacity: 0.4;
        }
        @media (min-width: 900px) {
          .lib-body {
            grid-template-columns: 240px 1fr;
          }
        }
        @media (max-width: 640px) {
          .lib-search {
            flex-wrap: wrap;
          }
          .lib-search button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};
