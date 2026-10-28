import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import db from '@/lib/db';
import { clientIp, rateLimit } from '@/lib/rateLimit';

// First-party page-view counter. No cookies and no raw IPs are stored: a visitor is an
// anonymous hash of IP + browser + date, so the same person counts once per day.
const BOT_RE = /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|lighthouse|monitor|curl|wget|python|axios|node-fetch/i;

function deviceFromUa(ua: string) {
  if (/ipad|tablet/i.test(ua)) return 'Tablet';
  if (/mobi|iphone|android/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

export async function POST(req: NextRequest) {
  const ua = req.headers.get('user-agent') || '';
  if (!ua || BOT_RE.test(ua)) return new NextResponse(null, { status: 204 });
  if (!rateLimit(req, 'track', 120, 60 * 1000)) return new NextResponse(null, { status: 204 });

  try {
    const body = await req.json().catch(() => ({}));
    const path = String(body.path || '').split('?')[0].slice(0, 200);
    if (!path.startsWith('/') || path.startsWith('/admin') || path.startsWith('/api')) {
      return new NextResponse(null, { status: 204 });
    }

    let referrer: string | null = null;
    try {
      const host = new URL(String(body.referrer || '')).hostname.replace(/^www\./, '');
      const ownHost = (req.headers.get('host') || '').split(':')[0].replace(/^www\./, '');
      if (host && host !== ownHost) referrer = host.slice(0, 100);
    } catch {
      referrer = null;
    }

    const day = new Date().toISOString().slice(0, 10);
    const visitorId = crypto.createHash('sha256').update(`${clientIp(req)}|${ua}|${day}`).digest('hex').slice(0, 16);

    db.prepare(`INSERT INTO page_views (visitor_id, path, referrer, device) VALUES (?, ?, ?, ?)`).run(
      visitorId,
      path,
      referrer,
      deviceFromUa(ua)
    );
  } catch (error) {
    console.error('track error', error);
  }
  return new NextResponse(null, { status: 204 });
}
