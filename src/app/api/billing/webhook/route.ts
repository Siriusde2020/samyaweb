import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/billing/webhook
 * Stripe webhook handler.
 * Verifies the webhook signature, then dispatches events to their respective handlers.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET
 */
export async function POST(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // -------------------------------------------------------
  // Guard: if Stripe is not configured, log and return 200
  // (so Stripe doesn't keep retrying in non-production envs)
  // -------------------------------------------------------
  if (!stripeSecretKey || !webhookSecret) {
    const body = await request.text();
    console.log('[Stripe Webhook] Stripe is not configured. Received event body (first 200 chars):', body.slice(0, 200));
    return NextResponse.json(
      { received: true, message: 'Stripe not configured - event logged but not processed.' },
      { status: 200 }
    );
  }

  // -------------------------------------------------------
  // Verify webhook signature
  // -------------------------------------------------------
  let event: any;

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' as any });

    const rawBody = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Stripe Webhook] Signature verification failed:', message);
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, { status: 400 });
  }

  // -------------------------------------------------------
  // Handle events
  // -------------------------------------------------------
  try {
    switch (event.type) {
      // ---- Checkout completed (new subscription) ----
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { planId, billingCycle } = session.metadata || {};

        console.log('[Stripe Webhook] checkout.session.completed', {
          sessionId: session.id,
          customerId: session.customer,
          subscriptionId: session.subscription,
          planId,
          billingCycle,
        });

        // In production with database:
        // const userId = session.metadata?.userId;
        // if (userId) {
        //   await prisma.subscription.upsert({
        //     where: { userId },
        //     create: {
        //       userId,
        //       plan: planId?.toUpperCase() || 'STARTER',
        //       status: 'ACTIVE',
        //       stripeCustomerId: session.customer,
        //       stripeSubscriptionId: session.subscription,
        //       billingCycle: billingCycle || 'monthly',
        //       currentPeriodStart: new Date(),
        //       currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        //     },
        //     update: {
        //       plan: planId?.toUpperCase() || 'STARTER',
        //       status: 'ACTIVE',
        //       stripeSubscriptionId: session.subscription,
        //       billingCycle: billingCycle || 'monthly',
        //     },
        //   });
        // }

        break;
      }

      // ---- Subscription updated (plan change, renewal) ----
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const { planId } = subscription.metadata || {};

        console.log('[Stripe Webhook] customer.subscription.updated', {
          subscriptionId: subscription.id,
          status: subscription.status,
          planId,
          currentPeriodEnd: subscription.current_period_end,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        });

        // In production with database:
        // await prisma.subscription.updateMany({
        //   where: { stripeSubscriptionId: subscription.id },
        //   data: {
        //     plan: planId?.toUpperCase() || undefined,
        //     status: subscription.status === 'active'
        //       ? 'ACTIVE'
        //       : subscription.status === 'past_due'
        //         ? 'PAST_DUE'
        //         : subscription.status === 'canceled'
        //           ? 'CANCELLED'
        //           : 'ACTIVE',
        //     currentPeriodStart: new Date(subscription.current_period_start * 1000),
        //     currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        //     cancelAtPeriodEnd: subscription.cancel_at_period_end,
        //   },
        // });

        break;
      }

      // ---- Subscription deleted (cancelled) ----
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        console.log('[Stripe Webhook] customer.subscription.deleted', {
          subscriptionId: subscription.id,
          customerId: subscription.customer,
        });

        // In production with database:
        // await prisma.subscription.updateMany({
        //   where: { stripeSubscriptionId: subscription.id },
        //   data: {
        //     status: 'CANCELLED',
        //     plan: 'FREE',
        //     cancelledAt: new Date(),
        //   },
        // });

        break;
      }

      // ---- Invoice payment failed ----
      case 'invoice.payment_failed': {
        const invoice = event.data.object;

        console.log('[Stripe Webhook] invoice.payment_failed', {
          invoiceId: invoice.id,
          customerId: invoice.customer,
          subscriptionId: invoice.subscription,
          attemptCount: invoice.attempt_count,
          amountDue: invoice.amount_due,
        });

        // In production with database:
        // if (invoice.subscription) {
        //   await prisma.subscription.updateMany({
        //     where: { stripeSubscriptionId: invoice.subscription as string },
        //     data: {
        //       status: 'PAST_DUE',
        //     },
        //   });
        //
        //   // Optionally send notification email to the user
        //   // const sub = await prisma.subscription.findFirst({
        //   //   where: { stripeSubscriptionId: invoice.subscription as string },
        //   //   include: { user: true },
        //   // });
        //   // if (sub?.user?.email) {
        //   //   await sendPaymentFailedEmail(sub.user.email, invoice.attempt_count);
        //   // }
        // }

        break;
      }

      // ---- Unhandled event types (log for debugging) ----
      default: {
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Error processing event:', error);
    // Return 200 anyway to prevent Stripe from retrying on application errors
    // (only signature failures should return 4xx)
    return NextResponse.json({ received: true, error: 'Processing error logged' }, { status: 200 });
  }
}
