'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Award, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { CorporateProfileModal } from './CorporateProfileModal';

export const CertificationsView: React.FC = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleRequestCertificate = (vendorName: string) => {
    const text = encodeURIComponent(`Hello Growth International Quality & Compliance Team, I would like to request an official copy of your ${vendorName} Approved Vendor Certificate.`);
    window.open(`https://wa.me/9715309555?text=${text}`, '_blank');
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem 1.5rem' }}>
      {/* Top Ticker Header */}
      <div style={{
        backgroundColor: '#F8FAFC',
        border: '1px solid var(--slate-200)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.5rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.725rem',
        fontWeight: 800,
        color: 'var(--slate-700)',
        marginBottom: '2rem',
        letterSpacing: '0.04em',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
          <span>VERIFIED GCC VENDOR: ARAMCO 10114402 • SABIC 11047900 • ICV CERTIFIED</span>
        </div>
        <div>HQ: +971-6-530-9555 | SALES@GROWTHME.COM</div>
      </div>

      {/* Breadcrumb Navigation */}
      <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '1.25rem', fontWeight: 600 }}>
        Home &gt; <strong style={{ color: 'var(--slate-900)' }}>Certifications & Approvals</strong>
      </div>

      {/* Hero Section (Matches Screenshot) */}
      <div style={{ marginBottom: '3rem' }}>
        <span style={{
          display: 'inline-block',
          padding: '0.3rem 0.8rem',
          borderRadius: 'var(--radius-full)',
          backgroundColor: '#FFE4E6',
          color: 'var(--primary-red)',
          fontSize: '0.7rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '1rem',
        }}>
          CORPORATE DOSSIER
        </span>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
          fontWeight: 800,
          color: 'var(--slate-900)',
          lineHeight: 1.1,
          marginBottom: '1rem',
          letterSpacing: '-0.03em',
        }}>
          Certified Tier-1 EPC Vendor Approvals
        </h1>

        <p style={{ fontSize: '1.05rem', color: 'var(--slate-600)', maxWidth: '750px', lineHeight: 1.6 }}>
          Growth International holds active vendor registrations with the Middle East's most rigorous Engineering, Procurement, and Construction (EPC) entities.
        </p>
      </div>

      {/* 3 Tier-1 EPC Vendor Registration Cards Grid (Matches Screenshot) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.75rem',
        marginBottom: '2.5rem',
      }}>
        {/* Card 1: Saudi Aramco */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid var(--slate-200)',
          padding: '2rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--slate-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem',
                color: 'var(--slate-900)',
              }}>
                AR
              </div>
              <div style={{
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#DCFCE7',
                color: '#166534',
                fontSize: '0.7rem',
                fontWeight: 800,
              }}>
                ACTIVE
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>
              Saudi Aramco
            </h3>

            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              REGISTERED VENDOR ID
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--slate-900)', letterSpacing: '0.25em', marginBottom: '1.5rem' }}>
              1 0 1 1 4 4 0 2
            </div>
          </div>

          <button
            onClick={() => handleRequestCertificate('Saudi Aramco')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: '#0EA5E9',
              fontSize: '0.85rem',
              fontWeight: 800,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <span>Request Certificate</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* Card 2: SABIC */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid var(--slate-200)',
          padding: '2rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--slate-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem',
                color: 'var(--slate-900)',
              }}>
                SB
              </div>
              <div style={{
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#DCFCE7',
                color: '#166534',
                fontSize: '0.7rem',
                fontWeight: 800,
              }}>
                ACTIVE
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>
              SABIC
            </h3>

            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              REGISTERED VENDOR ID
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--slate-900)', letterSpacing: '0.25em', marginBottom: '1.5rem' }}>
              1 1 0 4 7 9 0 0
            </div>
          </div>

          <button
            onClick={() => handleRequestCertificate('SABIC')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: '#0EA5E9',
              fontSize: '0.85rem',
              fontWeight: 800,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <span>Request Certificate</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* Card 3: ADNOC / TAKREER */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid var(--slate-200)',
          padding: '2rem 1.75rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--slate-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem',
                color: 'var(--slate-900)',
              }}>
                AD
              </div>
              <div style={{
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#DCFCE7',
                color: '#166534',
                fontSize: '0.7rem',
                fontWeight: 800,
              }}>
                ACTIVE
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>
              ADNOC / TAKREER
            </h3>

            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              REGISTRATION STATUS
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1.5rem' }}>
              Approved Supply Chain
            </div>
          </div>

          <button
            onClick={() => handleRequestCertificate('ADNOC / TAKREER')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: '#0EA5E9',
              fontSize: '0.85rem',
              fontWeight: 800,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <span>Request Certificate</span>
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* ISO 9001 & ICV Quality Banner (Matches Screenshot) */}
      <div style={{
        backgroundColor: 'var(--navy-dark)',
        borderRadius: '20px',
        padding: '2rem 2.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        color: '#FFFFFF',
        marginBottom: '3.5rem',
        boxShadow: '0 12px 30px rgba(11, 19, 43, 0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Award size={24} color="#FFFFFF" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '2px' }}>
              ISO 9001:2015 Certified
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--slate-300)' }}>
              Global Quality Management Systems.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <ArrowUpRight size={24} color="#FFFFFF" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '2px' }}>
              UAE ICV Certified
            </h4>
            <p style={{ fontSize: '0.825rem', color: 'var(--slate-300)' }}>
              In-Country Value certification for UAE government tenders.
            </p>
          </div>
        </div>
      </div>

      {/* Project Execution History Table (Matches Screenshot) */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid var(--slate-200)',
        padding: '2.5rem',
        marginBottom: '3.5rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
      }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
            Project Execution History
          </h2>
          <p style={{ fontSize: '0.925rem', color: 'var(--slate-600)' }}>
            A sample of recent mega-projects supplied under strict Tier-1 technical auditing.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--slate-200)' }}>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.725rem', fontWeight: 800, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  PROJECT NAME
                </th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.725rem', fontWeight: 800, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  LOCATION
                </th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.725rem', fontWeight: 800, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  SECTOR
                </th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.725rem', fontWeight: 800, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  MATERIALS SUPPLIED
                </th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
                <td style={{ padding: '1.1rem 1.25rem', fontWeight: 800, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
                  Jafurah Petrochemical Complex
                </td>
                <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                  Jubail, KSA
                </td>
                <td style={{ padding: '1.1rem 1.25rem', fontWeight: 700, fontSize: '0.85rem', color: '#0EA5E9' }}>
                  Oil & Gas (Downstream)
                </td>
                <td style={{ padding: '1.1rem 1.25rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--slate-900)' }}>Cellular Glass, SS Jacketing</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Volume: 12,000+ SQM</div>
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
                <td style={{ padding: '1.1rem 1.25rem', fontWeight: 800, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
                  Al Taweelah Alumina Refinery
                </td>
                <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                  Abu Dhabi, UAE
                </td>
                <td style={{ padding: '1.1rem 1.25rem', fontWeight: 700, fontSize: '0.85rem', color: '#0EA5E9' }}>
                  Industrial Processing
                </td>
                <td style={{ padding: '1.1rem 1.25rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--slate-900)' }}>PIR Foam, Mastics, Toggle Clips</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Volume: 8,500+ SQM</div>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '1.1rem 1.25rem', fontWeight: 800, fontSize: '0.9rem', color: 'var(--slate-900)' }}>
                  Clean Fuels Project (CFP)
                </td>
                <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                  Mina Abdullah, Kuwait
                </td>
                <td style={{ padding: '1.1rem 1.25rem', fontWeight: 700, fontSize: '0.85rem', color: '#0EA5E9' }}>
                  Petrochemical Refinery
                </td>
                <td style={{ padding: '1.1rem 1.25rem' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--slate-900)' }}>Aerogel Blankets, Acoustic Cloth</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Volume: Critical High-Temp Segments</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Callout Banner (Matches Screenshot) */}
      <div style={{
        backgroundColor: '#E0F2FE',
        borderRadius: '24px',
        padding: '3rem 2.5rem',
        textAlign: 'center',
        color: 'var(--slate-900)',
      }}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
          Verify our materials against your project specs.
        </h2>
        <p style={{ fontSize: '0.975rem', color: 'var(--slate-600)', maxWidth: '600px', margin: '0 auto 1.75rem auto' }}>
          All documentation and ASTM testing sheets are available in the Master Catalog.
        </p>

        <Link
          href="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 2rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: '#0EA5E9',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.925rem',
            textDecoration: 'none',
            boxShadow: '0 8px 20px -4px rgba(14, 165, 233, 0.4)',
          }}
        >
          <span>Browse Products →</span>
        </Link>
      </div>

      {/* Profile Modal */}
      <CorporateProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};
