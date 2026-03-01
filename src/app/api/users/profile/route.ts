import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// -----------------------------------------------------------------------------
// /api/users/profile
// GET    – Retrieve the authenticated user's profile
// PUT    – Update profile fields (name, email, phone, bio, company, etc.)
// PATCH  – Change password (requires current password + new password confirmation)
// -----------------------------------------------------------------------------

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  bio: z.string().max(500, 'Bio must be 500 characters or fewer').optional(),
  company: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  avatar: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

// GET /api/users/profile – Return the authenticated user's profile
export async function GET(request: NextRequest) {
  try {
    // In production: extract user ID from JWT / session
    // const userId = await getUserFromToken(request);
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    //   select: {
    //     id: true, name: true, email: true, phone: true, bio: true,
    //     company: true, website: true, avatar: true, role: true,
    //     createdAt: true, updatedAt: true,
    //     subscription: { select: { plan: true, status: true } },
    //   },
    // });
    // if (!user) return 401

    return NextResponse.json({
      success: true,
      data: {
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@samyaweb.com',
        phone: '+1 555-0100',
        bio: 'Full-stack developer building awesome websites with Samya.',
        company: 'Samya Inc.',
        website: 'https://samyaweb.com',
        avatar: '',
        role: 'USER',
        subscription: { plan: 'PRO', status: 'ACTIVE' },
        createdAt: '2024-01-15T10:00:00.000Z',
        updatedAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users/profile – Update profile fields
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = updateProfileSchema.parse(body);

    // In production:
    // 1. Authenticate the user
    // const userId = await getUserFromToken(request);

    // 2. If the email is changing, verify it is not already taken
    // if (data.email) {
    //   const existing = await prisma.user.findUnique({ where: { email: data.email } });
    //   if (existing && existing.id !== userId) {
    //     return NextResponse.json(
    //       { success: false, error: 'Email is already in use' },
    //       { status: 409 }
    //     );
    //   }
    // }

    // 3. If a new avatar URL is provided, optionally validate / resize the image
    // if (data.avatar) { await validateImageUrl(data.avatar); }

    // 4. Update the user record
    // const updatedUser = await prisma.user.update({
    //   where: { id: userId },
    //   data: { ...data, updatedAt: new Date() },
    // });

    // 5. If the email changed, send a verification email to the new address
    // if (data.email) {
    //   await sendEmailVerification(data.email);
    // }

    return NextResponse.json({
      success: true,
      data: {
        id: 'demo-user',
        ...data,
        updatedAt: new Date().toISOString(),
        message: 'Profile updated successfully',
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

// PATCH /api/users/profile – Change password
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword } = changePasswordSchema.parse(body);

    // In production:
    // 1. Authenticate the user
    // const userId = await getUserFromToken(request);
    // const user = await prisma.user.findUnique({ where: { id: userId } });

    // 2. Verify the current password
    // const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    // if (!isValid) {
    //   return NextResponse.json(
    //     { success: false, error: 'Current password is incorrect' },
    //     { status: 401 }
    //   );
    // }

    // 3. Hash the new password
    // const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // 4. Update the password and invalidate other sessions
    // await prisma.user.update({
    //   where: { id: userId },
    //   data: { passwordHash: newPasswordHash, updatedAt: new Date() },
    // });

    // 5. Invalidate all other active sessions for security
    // await prisma.session.deleteMany({
    //   where: { userId, id: { not: currentSessionId } },
    // });

    // 6. Send a confirmation email
    // await sendEmail({
    //   to: user.email,
    //   subject: 'Your password has been changed',
    //   template: 'password-changed',
    // });

    // 7. Audit log
    // await prisma.auditLog.create({
    //   data: { userId, action: 'PASSWORD_CHANGED', ip: request.ip },
    // });

    // Suppress unused variable warning — currentPassword is used in production path above
    void currentPassword;

    return NextResponse.json({
      success: true,
      data: {
        message: 'Password changed successfully',
        updatedAt: new Date().toISOString(),
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
