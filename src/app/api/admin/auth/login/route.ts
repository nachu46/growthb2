import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createSessionToken, SESSION_COOKIE } from '@/lib/auth';
import { logAdminAction } from '@/lib/audit';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = db.prepare(`SELECT * FROM users WHERE LOWER(email) = LOWER(?)`).get(email) as any;

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Access denied: Admin role required.' },
        { status: 403 }
      );
    }

    const passwordValid = bcrypt.compareSync(password, user.password_hash);
    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const sessionUser = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: 'ADMIN' as const,
    };

    const token = createSessionToken(sessionUser);

    logAdminAction({
      adminEmail: user.email,
      action: 'LOGIN',
      entity: 'USER',
      entityId: user.id,
      metadata: { loginTime: new Date().toISOString() },
    });

    const res = NextResponse.json({
      success: true,
      user: sessionUser,
      message: 'Admin login successful.',
    });

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return res;
  } catch (error) {
    console.error('Error during admin login:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
