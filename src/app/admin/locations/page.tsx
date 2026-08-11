'use client';

import React, { useEffect, useState } from 'react';
import { MapPin, Edit, CheckCircle, XCircle } from 'lucide-react';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/admin/locations');
      const data = await res.json();
      if (data.success) setLocations(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--slate-900)', marginBottom: '0.25rem' }}>
          GCC Logistics Locations & Regional Hubs
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)' }}>
          Manage regional warehousing hubs in UAE HQ, Saudi Arabia, Kuwait, Qatar, Bahrain, and Oman.
        </p>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid var(--slate-200)',
        padding: '1.25rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
      }}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', fontWeight: 700, color: 'var(--slate-500)' }}>Loading GCC locations...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', textAlign: 'left', color: 'var(--slate-600)' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Hub Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Country</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1rem' }}>Phone</th>
                <th style={{ padding: '0.85rem 1rem' }}>Stock Inventory</th>
                <th style={{ padding: '0.85rem 1rem' }}>Last Dispatch Activity</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={16} color={item.is_hq ? 'var(--primary-red)' : '#0EA5E9'} />
                      <span>{item.hub_name}</span>
                      {item.is_hq ? <span style={{ fontSize: '0.675rem', fontWeight: 900, color: '#FFFFFF', backgroundColor: 'var(--primary-red)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>HQ</span> : null}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-700)', fontWeight: 600 }}>
                    {item.country}
                  </td>
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', backgroundColor: '#E0F2FE', color: '#0EA5E9' }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--slate-700)' }}>
                    {item.phone}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {item.inventory_count}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--slate-500)', fontSize: '0.8rem' }}>
                    {item.last_shipment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
