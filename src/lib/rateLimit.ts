import { NextRequest } from 'next/server';

// Fixed-window in-memory limiter for public form endpoints. One Node process
// (PM2 single instance) is assumed; counters reset on restart, which is acceptable.
const buckets = new Map<string, { count: number; resetAt: number }>();

export function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'local';
}

/** Returns true when the caller is still within `limit` requests per `windowMs`. */
export function rateLimit(req: NextRequest, key: string, limit: number, windowMs: number): boolean {
  const id = `${key}:${clientIp(req)}`;
  const now = Date.now();
  const bucket = buckets.get(id);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(id, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 10000) {
      for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
    }
    return true;
  }

  bucket.count += 1;
  return bucket.count <= limit;
}
