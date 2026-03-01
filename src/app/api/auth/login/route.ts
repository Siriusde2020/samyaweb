import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  twoFactorCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, twoFactorCode } = loginSchema.parse(body);

    // In production: validate against database with bcrypt
    // const user = await prisma.user.findUnique({ where: { email } });
    // if (!user) return error
    // const valid = await bcrypt.compare(password, user.passwordHash);

    // Check 2FA if enabled
    // if (user.twoFactorEnabled && !twoFactorCode) {
    //   return NextResponse.json({ requires2FA: true });
    // }

    // Generate JWT token
    // const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);

    // Create session
    // await prisma.session.create({ ... });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: 'demo-user',
          email,
          name: 'Demo User',
          role: 'USER',
        },
        token: 'demo-jwt-token',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
