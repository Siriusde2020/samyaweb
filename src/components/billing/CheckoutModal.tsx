'use client';

import { useState, useCallback } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type BillingCycle = 'monthly' | 'annual';

interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
  stripePriceIdMonthly: string;
  stripePriceIdAnnual: string;
}

// --------------------------------------------------------
// Icons
// --------------------------------------------------------

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
    </svg>
  );
}

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 20h20M4 16l2-12 4 5 2-3 2 3 4-5 2 12H4z" />
    </svg>
  );
}

// --------------------------------------------------------
// Plan data
// --------------------------------------------------------

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'For personal projects and trying things out.',
    features: [
      '1 published site',
      '100 MB storage',
      'Community support',
      'Jamstack.app subdomain',
      'Basic analytics',
    ],
    highlighted: false,
    cta: 'Current Plan',
    stripePriceIdMonthly: '',
    stripePriceIdAnnual: '',
  },
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 12,
    annualPrice: 10,
    description: 'For freelancers and small personal brands.',
    features: [
      '5 published sites',
      '5 GB storage',
      'Custom domain',
      'Remove branding',
      'Priority email support',
      'Form submissions (1,000/mo)',
      'Basic SEO tools',
    ],
    highlighted: false,
    cta: 'Upgrade',
    stripePriceIdMonthly: 'price_starter_monthly',
    stripePriceIdAnnual: 'price_starter_annual',
  },
  {
    id: 'professional',
    name: 'Professional',
    monthlyPrice: 29,
    annualPrice: 23,
    description: 'For growing businesses and agencies.',
    features: [
      '25 published sites',
      '50 GB storage',
      'Custom domains',
      'CMS collections (unlimited)',
      'E-commerce (2% fee)',
      'Advanced SEO & analytics',
      'AI content generation',
      'Team collaboration (3 seats)',
      'Priority support',
    ],
    highlighted: true,
    cta: 'Upgrade',
    stripePriceIdMonthly: 'price_pro_monthly',
    stripePriceIdAnnual: 'price_pro_annual',
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: 79,
    annualPrice: 63,
    description: 'For serious businesses and large teams.',
    features: [
      'Unlimited sites',
      '200 GB storage',
      'Custom domains (unlimited)',
      'CMS collections (unlimited)',
      'E-commerce (0% fee)',
      'White-label builder',
      'Advanced analytics & A/B testing',
      'AI generation (unlimited)',
      'Team collaboration (10 seats)',
      'Dedicated account manager',
      'SLA & uptime guarantee',
    ],
    highlighted: false,
    cta: 'Upgrade',
    stripePriceIdMonthly: 'price_biz_monthly',
    stripePriceIdAnnual: 'price_biz_annual',
  },
];

// --------------------------------------------------------
// Component
// --------------------------------------------------------

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPrice = (plan: Plan) =>
    billingCycle === 'annual' ? plan.annualPrice : plan.monthlyPrice;

  const getSavings = (plan: Plan) => {
    if (plan.monthlyPrice === 0) return 0;
    return Math.round(((plan.monthlyPrice - plan.annualPrice) / plan.monthlyPrice) * 100);
  };

  const handleUpgrade = useCallback(async (plan: Plan) => {
    if (plan.id === 'free') return;

    setLoadingPlan(plan.id);
    setError(null);

    try {
      const priceId = billingCycle === 'annual'
        ? plan.stripePriceIdAnnual
        : plan.stripePriceIdMonthly;

      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          priceId,
          billingCycle,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        setError(result.error || 'Failed to start checkout. Please try again.');
        return;
      }

      // Redirect to Stripe Checkout
      if (result.data?.url) {
        window.location.href = result.data.url;
      } else {
        // Demo mode fallback
        setError(
          'Stripe is not configured. In production, you would be redirected to Stripe Checkout to complete your subscription.'
        );
      }
    } catch {
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoadingPlan(null);
    }
  }, [billingCycle]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upgrade Your Plan" size="xl">
      {/* Billing cycle toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <span
          className={cn(
            'text-sm font-medium transition-colors',
            billingCycle === 'monthly' ? 'text-surface-900 dark:text-white' : 'text-surface-400'
          )}
        >
          Monthly
        </span>

        <button
          onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
          className={cn(
            'relative w-12 h-6 rounded-full transition-colors',
            billingCycle === 'annual'
              ? 'bg-brand-600'
              : 'bg-surface-300 dark:bg-surface-600'
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform',
              billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0.5'
            )}
          />
        </button>

        <span
          className={cn(
            'text-sm font-medium transition-colors',
            billingCycle === 'annual' ? 'text-surface-900 dark:text-white' : 'text-surface-400'
          )}
        >
          Annual
        </span>

        {billingCycle === 'annual' && (
          <Badge variant="success" size="sm">Save 20%</Badge>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Plans grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              'relative flex flex-col rounded-2xl border-2 p-5 transition-all',
              plan.highlighted
                ? 'border-brand-500 bg-brand-50/30 dark:bg-brand-900/10 shadow-lg shadow-brand-500/10'
                : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
            )}
          >
            {/* Recommended badge */}
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-brand-500 to-brand-600 rounded-full shadow-md">
                  <SparkleIcon className="w-3 h-3" />
                  Recommended
                </span>
              </div>
            )}

            {/* Plan header */}
            <div className="mb-4">
              <h3 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-1.5">
                {plan.id === 'business' && <CrownIcon className="w-4 h-4 text-yellow-500" />}
                {plan.name}
              </h3>
              <p className="text-[11px] text-surface-400 mt-0.5">{plan.description}</p>
            </div>

            {/* Price */}
            <div className="mb-4">
              {plan.monthlyPrice === 0 ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-surface-900 dark:text-white">Free</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-surface-900 dark:text-white">
                    ${getPrice(plan)}
                  </span>
                  <span className="text-sm text-surface-400">/mo</span>
                </div>
              )}
              {billingCycle === 'annual' && plan.monthlyPrice > 0 && (
                <p className="text-[11px] text-green-600 dark:text-green-400 font-medium mt-0.5">
                  Save {getSavings(plan)}% vs monthly (${plan.annualPrice * 12}/year)
                </p>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <CheckIcon className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-xs text-surface-600 dark:text-surface-400">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              variant={plan.highlighted ? 'primary' : plan.id === 'free' ? 'ghost' : 'outline'}
              size="sm"
              className="w-full"
              disabled={plan.id === 'free' || loadingPlan === plan.id}
              loading={loadingPlan === plan.id}
              onClick={() => handleUpgrade(plan)}
            >
              {plan.id === 'free' ? 'Current Plan' : loadingPlan === plan.id ? 'Redirecting...' : plan.cta}
            </Button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-surface-200 dark:border-surface-700">
        <p className="text-[11px] text-surface-400 text-center">
          All plans include free SSL, global CDN, and 99.9% uptime. Cancel anytime.
          Prices shown in USD. Annual plans are billed yearly.
        </p>
      </div>
    </Modal>
  );
}
