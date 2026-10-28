import { NextRequest, NextResponse } from 'next/server';
import db from './db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const SESSION_COOKIE_NAME = 'growth_admin_session';
const SECRET_KEY = process.env.ADMIN_JWT_SECRET || loadOrCreateSecret();

// Without ADMIN_JWT_SECRET, generate a random secret once and persist it in data/ so sessions survive restarts
function loadOrCreateSecret(): string {
  const secretFile = path.join(process.cwd(), 'data', '.session-secret');
  try {
    if (fs.existsSync(secretFile)) return fs.readFileSync(secretFile, 'utf8').trim();
    const secret = crypto.randomBytes(32).toString('hex');
    fs.mkdirSync(path.dirname(secretFile), { recursive: true });
    fs.writeFileSync(secretFile, secret, { mode: 0o600 });
    return secret;
  } catch {
    // Read-only filesystem: fall back to a per-process secret (sessions reset on restart)
    return crypto.randomBytes(32).toString('hex');
  }
}

export interface AdminUserSession {
  userId: string;
  email: string;
  name: string;
  role: 'ADMIN';
}

// Generate simple signed session token
export function createSessionToken(user: AdminUserSession): string {
  const payload = JSON.stringify({ ...user, exp: Date.now() + 24 * 60 * 60 * 1000 });
  const signature = crypto.createHmac('sha256', SECRET_KEY).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + signature;
}

// Verify signed session token
export function verifySessionToken(token: string): AdminUserSession | null {
  try {
    if (!token || !token.includes('.')) return null;
    const [base64Payload, signature] = token.split('.');
    const payloadStr = Buffer.from(base64Payload, 'base64').toString('utf8');
    const expectedSignature = crypto.createHmac('sha256', SECRET_KEY).update(payloadStr).digest('hex');

    if (
      !signature ||
      signature.length !== expectedSignature.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    ) return null;

    const payload = JSON.parse(payloadStr);
    if (payload.exp && payload.exp < Date.now()) return null;
    if (payload.role !== 'ADMIN') return null;

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: 'ADMIN',
    };
  } catch (err) {
    return null;
  }
}

// Verify request cookie session for NextRequest
export function getAdminUserFromRequest(req: NextRequest): AdminUserSession | null {
  const cookieToken = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!cookieToken) return null;
  return verifySessionToken(cookieToken);
}

// Server-side Admin route authorization protection
export function requireAdminApi(req: NextRequest): { user: AdminUserSession } | NextResponse {
  const user = getAdminUserFromRequest(req);
  if (!user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }
  if (user.role !== 'ADMIN') {
    return NextResponse.json(
      { success: false, error: 'Forbidden: ADMIN role required.' },
      { status: 403 }
    );
  }
  return { user };
}

export const SESSION_COOKIE = SESSION_COOKIE_NAME;
