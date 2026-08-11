'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Building2, Handshake, Award, Inbox, FileSpreadsheet, MapPin, FileText } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentRfqs, setRecentRfqs] = useState<any[]>([]);
  const [recentBoms, setRecentBoms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          setRecentRfqs(data.recentRfqs || []);
          setRecentBoms(data.recentBoms || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ fontWeight: 800, color: 'var(--slate-600)' }}>Loading real-time stats from database...</div>;
  }

  const statCards = [
    { title: 'Total Products', value: stats?.totalProducts || 0, sub: `${stats?.activeProducts || 0} active`, icon: Package, href: '/admin/products', color: '#0EA5E9' },
    { title: 'Company Logos', value: stats?.totalCompanyLogos || 0, sub: `${stats?.activeCompanyLogos || 0} active`, icon: Building2, href: '/admin/company-logos', color: '#E11D48' },
    { title: 'Supply Partners', value: stats?.totalSupplyPartners || 0, sub: 'Active partners', icon: Handshake, href: '/admin/partners', color: '#10B981' },
    { title: 'Certifications', value: stats?.totalCertifications || 0, sub: 'Tier-1 approvals', icon: Award, href: '/admin/certifications', color: '#8B5CF6' },
    { title: 'Total Customer RFQs', value: stats?.totalRfqs || 0, sub: `${stats?.pendingRfqs || 0} pending`, icon: Inbox, href: '/admin/rfq', color: '#F59E0B' },
    { title: 'BOM Submissions', value: stats?.totalBoms || 0, sub: 'Uploaded files', icon: FileSpreadsheet, href: '/admin/bom', color: '#EC4899' },
    { title: 'GCC Hub Locations', value: stats?.activeGccLocations || 0, sub: 'Active regional hubs', icon: MapPin, href: '/admin/locations', color: '#06B6D4' },
    { title: 'Technical Resources', value: stats?.totalResources || 0, sub: 'TDS & SDS PDFs', icon: FileText, href: '/admin/resources', color: '#6366F1' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
          Admin Management Dashboard
        </h1>
        <p style={{ fontSize: '0.925rem', color: 'var(--slate-500)' }}>
          Real-time business performance & content management metrics directly from SQLite database.
        </p>
      </div>

      {/* Real Stat Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem',
      }}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              href={card.href}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid var(--slate-200)',
                padding: '1.35rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', marginBottom: '4px' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--slate-900)', lineHeight: 1.1 }}>
                  {card.value}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: card.color, marginTop: '4px' }}>
                  {card.sub}
                </div>
              </div>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                backgroundColor: `${card.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.color,
              }}>
                <Icon size={24} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent RFQs Table */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid var(--slate-200)',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Recent Customer RFQ Requests
          </h3>
          <Link href="/admin/rfq" style={{ fontSize: '0.825rem', fontWeight: 800, color: 'var(--primary-red)', textDecoration: 'none' }}>
            View All RFQs →
          </Link>
        </div>

        {recentRfqs.length === 0 ? (
          <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)', padding: '1rem 0' }}>No customer RFQ inquiries recorded yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', color: 'var(--slate-600)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Customer</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Company</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Pillar / Hub</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRfqs.map((rfq) => (
                  <tr key={rfq.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--slate-500)', fontSize: '0.775rem' }}>
                      {new Date(rfq.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                      {rfq.customer_name}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--slate-700)' }}>
                      {rfq.company}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--slate-600)' }}>
                      {rfq.material_pillar || 'Catalog Item'} ({rfq.delivery_hub || 'UAE'})
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span style={{
                        fontSize: '0.725rem',
                        fontWeight: 800,
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: rfq.status === 'New' ? '#FFE4E6' : '#E0F2FE',
                        color: rfq.status === 'New' ? 'var(--primary-red)' : '#0EA5E9',
                      }}>
                        {rfq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
