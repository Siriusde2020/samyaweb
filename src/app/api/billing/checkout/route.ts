import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const checkoutSchema = z.object({
  planId: z.enum(['starter', 'professional', 'business']),
  priceId: z.string().min(1),
  billingCycle: z.enum(['monthly', 'annual']),
});

/**
 * POST /api/billing/checkout
 * Creates a Stripe checkout session for subscription upgrade or new subscription.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, priceId, billingCycle } = checkoutSchema.parse(body);

    // Check if Stripe is configured
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Stripe is not configured. Set the STRIPE_SECRET_KEY environment variable to enable billing. This is a demo environment.',
        },
        { status: 503 }
      );
    }

    // Dynamic import so the module is only loaded when Stripe is actually configured
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' as any });

    // In production: look up the authenticated user and their Stripe customer ID
    // const user = await getAuthUser(request);
    // if (!user) {
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    // }
    //
    // let customerId = user.stripeCustomerId;
    // if (!customerId) {
    //   const customer = await stripe.customers.create({ email: user.email, name: user.name });
    //   customerId = customer.id;
    //   await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customer.id } });
    // }

    // Build the origin for redirect URLs
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Check if the user already has an active subscription (plan upgrade path)
    // const existingSubscription = await prisma.subscription.findFirst({
    //   where: { userId: user.id, status: 'ACTIVE' },
    // });
    //
    // if (existingSubscription?.stripeSubscriptionId) {
    //   // For upgrades, use the Stripe billing portal instead of a new checkout session
    //   const portalSession = await stripe.billingPortal.sessions.create({
    //     customer: customerId,
    //     return_url: `${origin}/dashboard/settings?tab=billing`,
    //   });
    //   return NextResponse.json({
    //     success: true,
    //     data: { url: portalSession.url, type: 'portal' },
    //   });
    // }

    // Create a new Checkout Session for first-time subscribers
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // customer: customerId,
      success_url: `${origin}/dashboard/settings?tab=billing&checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/dashboard/settings?tab=billing&checkout=cancelled`,
      metadata: {
        planId,
        billingCycle,
        // userId: user.id,
      },
      subscription_data: {
        metadata: {
          planId,
          billingCycle,
        },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({
      success: true,
      data: {
        url: session.url,
        sessionId: session.id,
        type: 'checkout',
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Billing checkout error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create checkout session. Please try again.',
      },
      { status: 500 }
    );
  }
}
