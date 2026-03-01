import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { signToken, comparePassword } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

/** Check whether the database is reachable. */
async function isDatabaseAvailable(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    const { prisma } = await import('@/lib/db');
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

// ---------- Demo / fallback credentials ----------
const DEMO_EMAIL = 'demo@samyaweb.com';
const DEMO_PASSWORD = 'password123';
const DEMO_USER = {
  id: 'demo-user-id',
  email: DEMO_EMAIL,
  name: 'Demo User',
  role: 'USER' as const,
  avatar: null,
  subscription: { plan: 'FREE' as const, status: 'ACTIVE' as const },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable) {
      // ---- Real database authentication ----
      const { prisma } = await import('@/lib/db');

      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          passwordHash: true,
          subscription: { select: { plan: true, status: true } },
        },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 },
        );
      }

      const validPassword = await comparePassword(password, user.passwordHash);
      if (!validPassword) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 },
        );
      }

      // Create JWT
      const token = signToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      // Persist session
      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      const response = NextResponse.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar,
            subscription: user.subscription,
          },
          token,
        },
      });

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        path: '/',
      });

      return response;
    }

    // ---- Demo mode (no database) ----
    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password. In demo mode use demo@samyaweb.com / password123' },
        { status: 401 },
      );
    }

    const token = signToken({
      userId: DEMO_USER.id,
      email: DEMO_USER.email,
      role: DEMO_USER.role,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        user: DEMO_USER,
        token,
      },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 },
      );
    }
    console.error('[auth/login] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
