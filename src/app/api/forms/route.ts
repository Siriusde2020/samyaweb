import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const submissionSchema = z.object({
  formId: z.string(),
  data: z.record(z.any()),
});

// POST /api/forms - Handle form submissions from published sites
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formId, data } = submissionSchema.parse(body);

    // Rate limiting check
    // const ip = request.headers.get('x-forwarded-for') || 'unknown';
    // if (await isRateLimited(ip, formId)) {
    //   return NextResponse.json({ error: 'Too many submissions' }, { status: 429 });
    // }

    // Validate form exists
    // const form = await prisma.form.findUnique({ where: { id: formId } });
    // if (!form) return 404

    // Sanitize input data
    // const sanitizedData = sanitizeFormData(data, form.fields);

    // Save submission
    // await prisma.formSubmission.create({
    //   data: {
    //     formId,
    //     data: sanitizedData,
    //     ip,
    //     userAgent: request.headers.get('user-agent'),
    //   },
    // });

    // Send notification email if configured
    // if (form.settings?.notifyEmail) {
    //   await sendEmail({ to: form.settings.notifyEmail, ... });
    // }

    // Send to webhook if configured
    // if (form.settings?.webhookUrl) {
    //   await fetch(form.settings.webhookUrl, { method: 'POST', body: ... });
    // }

    // Newsletter integration
    // if (form.settings?.newsletter && data.email) {
    //   await subscribeToNewsletter(data.email, form.settings.listId);
    // }

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Submission failed' },
      { status: 500 }
    );
  }
}
