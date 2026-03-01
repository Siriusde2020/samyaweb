import { NextRequest, NextResponse } from 'next/server';

// POST /api/webhooks - Handle incoming webhooks (Stripe, GitHub, etc.)
export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature');
    const githubEvent = request.headers.get('x-github-event');
    const body = await request.text();

    // Stripe webhook
    if (signature) {
      // const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
      // switch (event.type) {
      //   case 'checkout.session.completed':
      //     // Activate subscription
      //     break;
      //   case 'invoice.payment_succeeded':
      //     // Extend subscription
      //     break;
      //   case 'customer.subscription.deleted':
      //     // Cancel subscription
      //     break;
      //   case 'payment_intent.succeeded':
      //     // Mark order as paid
      //     break;
      // }
      return NextResponse.json({ received: true });
    }

    // GitHub webhook (for git-based deployments)
    if (githubEvent) {
      // const payload = JSON.parse(body);
      // if (githubEvent === 'push') {
      //   // Trigger auto-build
      //   await triggerBuild(payload.repository.id, payload.ref);
      // }
      return NextResponse.json({ received: true });
    }

    return NextResponse.json(
      { error: 'Unknown webhook source' },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
