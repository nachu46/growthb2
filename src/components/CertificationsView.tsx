'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, ArrowUp, ArrowRight } from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  issuing_org: string;
  cert_number: string;
  description?: string;
  status?: string;
}

interface Project {
  id: string;
  project_name: string;
  client: string;
  country: string;
  industry: string;
  scope: string;
  description?: string;
}

// Shown until the database responds (and if it is unreachable)
const FALLBACK_CERTS: Certification[] = [
  { id: 'cert_aramco', name: 'Saudi Aramco Vendor Registration', issuing_org: 'Saudi Arabian Oil Company', cert_number: '10114402', status: 'Active' },
  { id: 'cert_sabic', name: 'SABIC Qualification Certificate', issuing_org: 'Saudi Basic Industries Corporation', cert_number: '11047900', status: 'Active' },
  { id: 'cert_adnoc', name: 'ADNOC / TAKREER', issuing_org: 'Abu Dhabi National Oil Company', cert_number: 'Approved Supply Chain', status: 'Active' },
  { id: 'cert_iso', name: 'ISO 9001:2015 Quality Management Systems', issuing_org: 'Bureau Veritas', cert_number: 'UAE-QMS-90812', description: 'Global Quality Management Systems.', status: 'Active' },
  { id: 'cert_icv', name: 'UAE ICV Certified', issuing_org: 'UAE Ministry of Industry', cert_number: 'ICV', description: 'In-Country Value certification for UAE government tenders.', status: 'Active' },
];

const isQualityCert = (c: Certification) => /iso|icv/i.test(c.name);

const shortName = (name: string) =>
  name.replace(/\s+(vendor registration|qualification certificate|certificate|registration)$/i, '').trim();

const initials = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('aramco')) return 'AR';
  if (n.includes('sabic')) return 'SB';
  if (n.includes('adnoc')) return 'AD';
  return name.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase();
};

export const CertificationsView: React.FC = () => {
  const [certs, setCerts] = useState<Certification[]>(FALLBACK_CERTS);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/api/certifications')
      .then(res => res.json())
      .then(data => {
        if (!data.success) return;
        if (Array.isArray(data.certifications) && data.certifications.length) setCerts(data.certifications);
        if (Array.isArray(data.projects)) setProjects(data.projects);
      })
      .catch(() => {});
  }, []);

  const requestCertificateUrl = (vendorName: string) =>
    `https://wa.me/9715309555?text=${encodeURIComponent(`Hello Growth International Quality & Compliance Team, I would like to request an official copy of your ${vendorName} Approved Vendor Certificate.`)}`;

  const vendorCerts = certs.filter(c => !isQualityCert(c));
  const qualityCerts = certs.filter(isQualityCert);

  return (
    <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '1rem 1.5rem 4rem 1.5rem' }}>
      <div style={{ fontSize: '0.9rem', color: 'var(--slate-500)', margin: '0.5rem 0 1.5rem 0', fontWeight: 600 }}>
        <Link href="/" style={{ color: 'var(--slate-500)', textDecoration: 'none' }}>Home</Link> &gt; <strong style={{ color: 'var(--slate-900)' }}>Certifications &amp; Approvals</strong>
      </div>

      {/* Hero */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{
          fontSize: 'clamp(2.1rem, 4.5vw, 3.4rem)',
          fontWeight: 700,
          color: 'var(--slate-900)',
          lineHeight: 1.12,
          margin: '0.75rem 0 0.9rem 0',
          letterSpacing: '-0.025em',
          maxWidth: '620px',
        }}>
          Certified Tier-1 EPC Vendor Approvals
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--slate-600)', maxWidth: '720px', lineHeight: 1.6 }}>
          Growth International holds active vendor registrations with the Middle East&apos;s most rigorous Engineering, Procurement, and Construction (EPC) entities.
        </p>
      </div>

      {/* Vendor registration cards (Admin → Certifications) */}
      <div className="cert-grid">
        {vendorCerts.map(cert => {
          const numericId = /^\d{5,}$/.test(String(cert.cert_number).trim());
          return (
            <div key={cert.id} className="cert-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--slate-200)', marginBottom: '1rem' }}>
                <div className="cert-initials">{initials(cert.name)}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.3rem' }}>
                    {shortName(cert.name)}
                  </div>
                  <span className="cert-status">{(cert.status || 'Active').toUpperCase()}</span>
                </div>
              </div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {numericId ? 'Registered Vendor ID' : 'Registration Status'}
              </div>
              <div style={{
                fontSize: numericId ? '1.6rem' : '1.2rem',
                fontWeight: 700,
                letterSpacing: numericId ? '0.22em' : '-0.01em',
                color: 'var(--slate-900)',
                margin: '0.15rem 0 0.6rem 0',
              }}>
                {cert.cert_number}
              </div>
              <a href={requestCertificateUrl(shortName(cert.name))} target="_blank" rel="noopener noreferrer" className="cert-link">
                Request Certificate <ArrowUpRight size={14} />
              </a>
            </div>
          );
        })}
      </div>

      {/* ISO / ICV quality banner */}
      {qualityCerts.length > 0 && (
        <div className="quality-banner">
          {qualityCerts.map((cert, i) => (
            <div key={cert.id} className="quality-item">
              <div className="quality-icon">{i === 0 ? <Check size={20} /> : <ArrowUp size={20} />}</div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {cert.name.replace(/\s+Quality Management Systems$/i, '')}{/certified/i.test(cert.name) ? '' : ' Certified'}
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--slate-400)' }}>
                  {cert.description || cert.issuing_org}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project execution history (Admin → Project History) */}
      {projects.length > 0 && (
        <div className="projects-card">
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.3rem' }}>
            Project Execution History
          </h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
            A sample of recent mega-projects supplied under strict Tier-1 technical auditing.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Location</th>
                  <th>Sector</th>
                  <th>Materials Supplied</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{p.project_name}</td>
                    <td>{p.country}</td>
                    <td style={{ color: '#0EA5E9', fontWeight: 600 }}>{p.industry}</td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--slate-900)' }}>{p.scope}</div>
                      {p.client && <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Client: {p.client}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="verify-cta">
        <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--slate-900)', marginBottom: '0.4rem' }}>
          Verify our materials against your project specs.
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)', marginBottom: '1.5rem' }}>
          All documentation and ASTM testing sheets are available in the Master Catalog.
        </p>
        <Link href="/products" className="verify-btn">Browse Products <ArrowRight size={15} aria-hidden style={{ verticalAlign: '-3px', flexShrink: 0 }} /></Link>
      </div>

      <style jsx>{`
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        .cert-card {
          background: #ffffff;
          border: 1px solid var(--slate-200);
          border-radius: 18px;
          padding: 1.5rem;
        }
        .cert-initials {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          border: 1px solid var(--slate-200);
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: var(--slate-900);
          flex-shrink: 0;
        }
        .cert-status {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          color: #047857;
          background: #d1fae5;
          border-radius: 4px;
          padding: 0.15rem 0.5rem;
        }
        .cert-card :global(.cert-link) {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #0ea5e9;
          text-decoration: none;
        }
        .quality-banner {
          background: var(--slate-900);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 3rem;
        }
        .quality-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          border-radius: 10px;
          padding: 0.75rem 1.25rem 0.75rem 0.75rem;
          flex: 0 1 460px;
        }
        .quality-icon {
          width: 44px;
          height: 44px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .projects-card {
          background: #ffffff;
          border: 1px solid var(--slate-200);
          border-radius: 20px;
          padding: clamp(1.25rem, 4vw, 2.5rem);
          margin-bottom: 3rem;
        }
        .projects-table {
          width: 100%;
          min-width: 640px;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.875rem;
        }
        .projects-table th {
          background: #f1f5f9;
          padding: 0.9rem 1.25rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--slate-600);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .projects-table td {
          padding: 1.1rem 1.25rem;
          border-bottom: 1px solid var(--slate-200);
          color: var(--slate-600);
          vertical-align: top;
        }
        .verify-cta {
          background: #e0f2fe;
          border: 1.5px solid #bae6fd;
          border-radius: 20px;
          padding: clamp(1.75rem, 5vw, 3rem) 1.5rem;
          text-align: center;
        }
        .verify-cta :global(.verify-btn) {
          display: inline-block;
          background: #0ea5e9;
          color: #ffffff;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 0.85rem 3.5rem;
          border-radius: 9999px;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
};
