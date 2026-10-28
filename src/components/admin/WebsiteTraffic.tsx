'use client';

import React, { useEffect, useState } from 'react';
import { Users, Eye, Inbox, TrendingUp, TrendingDown, Monitor, Smartphone, Tablet, Globe, FileText } from 'lucide-react';

interface Analytics {
  days: number;
  today: { views: number; visitors: number };
  period: { views: number; visitors: number };
  previous: { views: number; visitors: number };
  daily: { day: string; views: number; visitors: number }[];
  topPages: { path: string; views: number; visitors: number }[];
  referrers: { source: string; visitors: number }[];
  devices: { device: string; visitors: number }[];
  leads: { rfqs: number; boms: number; conversionRate: number };
}

const PAGE_NAMES: Record<string, string> = {
  '/': 'Home',
  '/products': 'Products',
  '/industries': 'Industries',
  '/certifications': 'Certifications',
  '/services': 'Services',
  '/resources': 'Tech Resources',
};

const pageName = (path: string) => PAGE_NAMES[path] || (path.startsWith('/products/') ? `Product: ${path.slice(10)}` : path);

const change = (now: number, before: number) => {
  if (!before) return null;
  return Math.round(((now - before) / before) * 100);
};

const card: React.CSSProperties = { backgroundColor: '#FFFFFF', border: '1px solid var(--slate-200)', borderRadius: '18px', padding: '1.25rem 1.4rem' };

export function WebsiteTraffic() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<Analytics | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    fetch(`/api/admin/analytics?days=${days}`)
      .then(res => res.json())
      .then(d => (d.success ? setData(d) : setError(true)))
      .catch(() => setError(true));
  }, [days]);

  const visitorsChange = data ? change(data.period.visitors, data.previous.visitors) : null;
  const maxDaily = data ? Math.max(1, ...data.daily.map(d => d.visitors)) : 1;
  const deviceTotal = data ? data.devices.reduce((s, d) => s + d.visitors, 0) || 1 : 1;
  const DeviceIcon = (name: string) => (name === 'Mobile' ? Smartphone : name === 'Tablet' ? Tablet : Monitor);

  const stats = data
    ? [
        { label: 'Visitors Today', value: data.today.visitors, sub: `${data.today.views} page views`, icon: Users },
        { label: `Visitors (${days} days)`, value: data.period.visitors, sub: `${data.period.views} page views`, icon: Eye, trend: visitorsChange },
        { label: `Enquiries (${days} days)`, value: data.leads.rfqs + data.leads.boms, sub: `${data.leads.rfqs} RFQs · ${data.leads.boms} BOMs`, icon: Inbox },
        { label: 'Enquiry Rate', value: `${data.leads.conversionRate.toFixed(1)}%`, sub: 'Visitors who sent an RFQ or BOM', icon: TrendingUp },
      ]
    : [];

  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>Website Traffic</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>Counted on your own server. No cookies, no third-party trackers.</p>
        </div>
        <div role="tablist" aria-label="Date range" style={{ display: 'flex', background: '#F1F5F9', borderRadius: '10px', padding: '3px' }}>
          {[7, 30, 90].map(d => (
            <button
              key={d}
              role="tab"
              aria-selected={days === d}
              onClick={() => setDays(d)}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: days === d ? '#FFFFFF' : 'transparent',
                color: days === d ? 'var(--slate-900)' : 'var(--slate-500)',
                border: days === d ? '1px solid var(--slate-200)' : '1px solid transparent',
                cursor: 'pointer',
              }}
            >
              {d} days
            </button>
          ))}
        </div>
      </div>

      {error && <div style={{ ...card, color: 'var(--slate-500)' }}>Traffic data could not be loaded.</div>}
      {!data && !error && <div style={{ ...card, color: 'var(--slate-500)' }}>Loading traffic…</div>}

      {data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {stats.map(s => {
              const Icon = s.icon;
              return (
                <div key={s.label} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', marginBottom: '0.35rem' }}>{s.label}</div>
                    <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--slate-900)', lineHeight: 1.1 }}>{s.value}</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--slate-500)', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {s.sub}
                      {'trend' in s && s.trend !== null && s.trend !== undefined && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontWeight: 800, color: s.trend >= 0 ? '#059669' : 'var(--primary-red)' }}>
                          {s.trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {Math.abs(s.trend)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid var(--slate-200)', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--slate-700)', flexShrink: 0 }}>
                    <Icon size={18} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily visitors */}
          <div style={{ ...card, marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)' }}>Daily Visitors</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: 600 }}>Peak: {maxDaily}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: days > 30 ? '2px' : '4px', height: '140px' }}>
              {data.daily.map(d => (
                <div
                  key={d.day}
                  title={`${new Date(d.day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}: ${d.visitors} visitors, ${d.views} views`}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}
                >
                  <div style={{
                    height: `${Math.max(d.visitors ? 4 : 1, (d.visitors / maxDaily) * 100)}%`,
                    background: d.visitors ? 'var(--primary-red)' : 'var(--slate-200)',
                    borderRadius: '4px 4px 0 0',
                    opacity: d.visitors ? 0.85 : 1,
                  }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--slate-400)', marginTop: '0.4rem', fontWeight: 600 }}>
              <span>{new Date(data.daily[0].day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
              <span>Today</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
            {/* Top pages */}
            <div style={card}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={16} /> Top Pages
              </h3>
              {data.topPages.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>No visits yet.</p>}
              {data.topPages.map(p => (
                <div key={p.path} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', padding: '0.45rem 0', borderBottom: '1px solid var(--slate-100)', fontSize: '0.825rem' }}>
                  <span style={{ color: 'var(--slate-800)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pageName(p.path)}</span>
                  <span style={{ color: 'var(--slate-500)', fontWeight: 700, whiteSpace: 'nowrap' }}>{p.views} {p.views === 1 ? 'view' : 'views'}</span>
                </div>
              ))}
            </div>

            {/* Sources */}
            <div style={card}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Globe size={16} /> Traffic Sources
              </h3>
              {data.referrers.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>No visits yet.</p>}
              {data.referrers.map(r => (
                <div key={r.source} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', padding: '0.45rem 0', borderBottom: '1px solid var(--slate-100)', fontSize: '0.825rem' }}>
                  <span style={{ color: 'var(--slate-800)', fontWeight: 600 }}>{r.source}</span>
                  <span style={{ color: 'var(--slate-500)', fontWeight: 700 }}>{r.visitors} {r.visitors === 1 ? 'visitor' : 'visitors'}</span>
                </div>
              ))}
            </div>

            {/* Devices */}
            <div style={card}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.75rem' }}>Devices</h3>
              {data.devices.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>No visits yet.</p>}
              {data.devices.map(d => {
                const Icon = DeviceIcon(d.device);
                const pct = Math.round((d.visitors / deviceTotal) * 100);
                return (
                  <div key={d.device} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', fontWeight: 600, color: 'var(--slate-800)', marginBottom: '0.3rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Icon size={15} /> {d.device}</span>
                      <span style={{ color: 'var(--slate-500)' }}>{pct}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'var(--slate-100)', borderRadius: '4px' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'var(--slate-900)', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
