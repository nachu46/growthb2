import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const totalProducts = (db.prepare(`SELECT count(*) as c FROM products`).get() as any).c;
    const activeProducts = (db.prepare(`SELECT count(*) as c FROM products WHERE is_active = 1`).get() as any).c;

    const totalRfqs = (db.prepare(`SELECT count(*) as c FROM rfq_requests`).get() as any).c;
    const pendingRfqs = (db.prepare(`SELECT count(*) as c FROM rfq_requests WHERE status = 'New' OR status = 'Pending'`).get() as any).c;

    const totalBoms = (db.prepare(`SELECT count(*) as c FROM bom_submissions`).get() as any).c;

    const totalCompanyLogos = (db.prepare(`SELECT count(*) as c FROM company_logos`).get() as any).c;
    const activeCompanyLogos = (db.prepare(`SELECT count(*) as c FROM company_logos WHERE is_active = 1`).get() as any).c;

    const totalSupplyPartners = (db.prepare(`SELECT count(*) as c FROM supply_partners`).get() as any).c;

    const totalCertifications = (db.prepare(`SELECT count(*) as c FROM certifications`).get() as any).c;

    const activeGccLocations = (db.prepare(`SELECT count(*) as c FROM gcc_locations WHERE is_active = 1`).get() as any).c;

    const totalResources = (db.prepare(`SELECT count(*) as c FROM resources`).get() as any).c;

    const recentRfqs = db.prepare(`SELECT * FROM rfq_requests ORDER BY created_at DESC LIMIT 5`).all();
    const recentBoms = db.prepare(`SELECT * FROM bom_submissions ORDER BY created_at DESC LIMIT 5`).all();

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        totalRfqs,
        pendingRfqs,
        totalBoms,
        totalCompanyLogos,
        activeCompanyLogos,
        totalSupplyPartners,
        totalCertifications,
        activeGccLocations,
        totalResources,
      },
      recentRfqs,
      recentBoms,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
