import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = registerSchema.parse(body);

    // In production:
    // 1. Check if user exists
    // const existing = await prisma.user.findUnique({ where: { email } });
    // if (existing) return error

    // 2. Hash password
    // const passwordHash = await bcrypt.hash(password, 12);

    // 3. Create user
    // const user = await prisma.user.create({
    //   data: { email, name, passwordHash, role: 'USER' }
    // });

    // 4. Create default subscription
    // await prisma.subscription.create({
    //   data: { userId: user.id, plan: 'FREE', status: 'ACTIVE' }
    // });

    // 5. Generate JWT and session
    // const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    // 6. Send welcome email
    // await sendEmail({ to: email, template: 'welcome', data: { name } });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: 'new-user-id',
          email,
          name,
          role: 'USER',
        },
        token: 'new-jwt-token',
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
