import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { signToken, hashPassword } from '@/lib/auth';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

async function isDatabaseAvailable(): Promise<boolean> {
  if (!process.env.DATABASE_URL && !process.env.NETLIFY_DATABASE_URL) return false;
  try {
    const { prisma } = await import('@/lib/db');
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = registerSchema.parse(body);

    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable) {
      // ---- Real database registration ----
      const { prisma } = await import('@/lib/db');

      // Check for existing user
      const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'An account with this email already exists' },
          { status: 409 },
        );
      }

      const passwordHash = await hashPassword(password);

      // Create user + default subscription in a transaction
      const user = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email,
            name,
            passwordHash,
            role: 'USER',
          },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            avatar: true,
          },
        });

        await tx.subscription.create({
          data: {
            userId: newUser.id,
            plan: 'FREE',
            status: 'ACTIVE',
          },
        });

        return newUser;
      });

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
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      const response = NextResponse.json(
        {
          success: true,
          data: {
            user: {
              ...user,
              subscription: { plan: 'FREE', status: 'ACTIVE' },
            },
            token,
          },
        },
        { status: 201 },
      );

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
      });

      return response;
    }

    // ---- Demo mode (no database) ----
    const demoUser = {
      id: 'demo-new-user-' + Date.now().toString(36),
      email,
      name,
      role: 'USER' as const,
      avatar: null,
      subscription: { plan: 'FREE' as const, status: 'ACTIVE' as const },
    };

    const token = signToken({
      userId: demoUser.id,
      email: demoUser.email,
      role: demoUser.role,
    });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          user: demoUser,
          token,
        },
      },
      { status: 201 },
    );

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
    console.error('[auth/register] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
