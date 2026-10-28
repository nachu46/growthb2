import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { requireAdminApi } from '@/lib/auth';

const one = (sql: string, ...params: any[]) => db.prepare(sql).get(...params) as any;
const all = (sql: string, ...params: any[]) => db.prepare(sql).all(...params) as any[];

export async function GET(req: NextRequest) {
  const auth = requireAdminApi(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const requested = Number(new URL(req.url).searchParams.get('days'));
    const days = [7, 30, 90].includes(requested) ? requested : 30;
    const since = `-${days} days`;
    const prevSince = `-${days * 2} days`;

    const today = one(`
      SELECT count(*) AS views, count(DISTINCT visitor_id) AS visitors
      FROM page_views WHERE date(created_at) = date('now')
    `);
    const period = one(`
      SELECT count(*) AS views, count(DISTINCT visitor_id || date(created_at)) AS visitors
      FROM page_views WHERE created_at >= datetime('now', ?)
    `, since);
    const previous = one(`
      SELECT count(*) AS views, count(DISTINCT visitor_id || date(created_at)) AS visitors
      FROM page_views WHERE created_at >= datetime('now', ?) AND created_at < datetime('now', ?)
    `, prevSince, since);

    // One row per day, including days without traffic
    const dailyRows = all(`
      SELECT date(created_at) AS day, count(*) AS views, count(DISTINCT visitor_id) AS visitors
      FROM page_views WHERE created_at >= datetime('now', ?)
      GROUP BY day
    `, since);
    const byDay = new Map(dailyRows.map(r => [r.day, r]));
    const daily: { day: string; views: number; visitors: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
      const row = byDay.get(d);
      daily.push({ day: d, views: row?.views || 0, visitors: row?.visitors || 0 });
    }

    const topPages = all(`
      SELECT path, count(*) AS views, count(DISTINCT visitor_id || date(created_at)) AS visitors
      FROM page_views WHERE created_at >= datetime('now', ?)
      GROUP BY path ORDER BY views DESC LIMIT 8
    `, since);
    const referrers = all(`
      SELECT coalesce(referrer, 'Direct / typed') AS source, count(DISTINCT visitor_id || date(created_at)) AS visitors
      FROM page_views WHERE created_at >= datetime('now', ?)
      GROUP BY source ORDER BY visitors DESC LIMIT 6
    `, since);
    const devices = all(`
      SELECT device, count(DISTINCT visitor_id || date(created_at)) AS visitors
      FROM page_views WHERE created_at >= datetime('now', ?)
      GROUP BY device ORDER BY visitors DESC
    `, since);

    const rfqs = one(`SELECT count(*) AS n FROM rfq_requests WHERE created_at >= datetime('now', ?)`, since).n;
    const boms = one(`SELECT count(*) AS n FROM bom_submissions WHERE created_at >= datetime('now', ?)`, since).n;

    return NextResponse.json({
      success: true,
      days,
      today,
      period,
      previous,
      daily,
      topPages,
      referrers,
      devices,
      leads: { rfqs, boms, conversionRate: period.visitors ? ((rfqs + boms) / period.visitors) * 100 : 0 },
    });
  } catch (error) {
    console.error('analytics error', error);
    return NextResponse.json({ success: false, error: 'Failed to load analytics' }, { status: 500 });
  }
}
