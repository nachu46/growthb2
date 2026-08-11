import { NextRequest, NextResponse } from 'next/server';
import db from './db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'growth_admin_session';
const SECRET_KEY = process.env.ADMIN_JWT_SECRET || 'growth-international-admin-secret-key-2026-secure';

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

    if (signature !== expectedSignature) return null;

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
