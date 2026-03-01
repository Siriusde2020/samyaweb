import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// -----------------------------------------------------------------------------
// POST /api/auth/forgot-password
// Accepts an email address and initiates the password reset flow.
// In production this generates a time-limited token, persists it, and sends a
// reset link via email (e.g. using nodemailer / SendGrid / SES).
// -----------------------------------------------------------------------------

const forgotPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    // In production:
    // 1. Look up the user by email
    // const user = await prisma.user.findUnique({ where: { email } });

    // 2. If the user does not exist we still return a success response to
    //    prevent email enumeration attacks.
    // if (!user) { return success response }

    // 3. Generate a cryptographically-secure reset token with an expiry
    // const resetToken = crypto.randomBytes(32).toString('hex');
    // const resetTokenHash = await bcrypt.hash(resetToken, 10);
    // const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // 4. Persist the hashed token and expiry on the user record
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: { resetTokenHash, resetTokenExpiry },
    // });

    // 5. Send the reset email with the raw (unhashed) token in the link
    // await sendEmail({
    //   to: email,
    //   subject: 'Reset your password',
    //   template: 'password-reset',
    //   data: {
    //     name: user.name,
    //     resetLink: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}&email=${email}`,
    //   },
    // });

    // 6. Optionally log the event for audit trail
    // await prisma.auditLog.create({
    //   data: { userId: user.id, action: 'PASSWORD_RESET_REQUESTED', ip: request.ip },
    // });

    return NextResponse.json({
      success: true,
      data: {
        message:
          'If an account with that email exists, we have sent a password reset link. Please check your inbox.',
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
