'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

export function MarketingSuite() {
  const [activeTab, setActiveTab] = useState<'forms' | 'popups' | 'ab-tests' | 'tracking'>('forms');

  return (
    <div>
      <div className="flex items-center gap-1 mb-6 border-b border-surface-200">
        {(['forms', 'popups', 'ab-tests', 'tracking'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 capitalize transition-colors',
              activeTab === tab
                ? 'border-brand-600 text-brand-600'
                : 'border-transparent text-surface-500 hover:text-surface-700'
            )}
          >
            {tab.replace('-', ' ')}
          </button>
        ))}
      </div>

      {activeTab === 'forms' && <FormsManager />}
      {activeTab === 'popups' && <PopupsManager />}
      {activeTab === 'ab-tests' && <ABTestManager />}
      {activeTab === 'tracking' && <TrackingManager />}
    </div>
  );
}

function FormsManager() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Email Capture Forms</h3>
        <Button>+ Create Form</Button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { name: 'Newsletter Signup', submissions: 234, conversion: '12.3%' },
          { name: 'Contact Form', submissions: 89, conversion: '8.1%' },
          { name: 'Lead Magnet', submissions: 156, conversion: '18.7%' },
        ].map(form => (
          <div key={form.name} className="bg-white p-5 rounded-xl border border-surface-200">
            <h4 className="font-medium text-surface-900">{form.name}</h4>
            <div className="flex items-center gap-4 mt-3">
              <div>
                <p className="text-xs text-surface-400">Submissions</p>
                <p className="text-lg font-bold text-surface-900">{form.submissions}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400">Conversion</p>
                <p className="text-lg font-bold text-green-600">{form.conversion}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="ghost" size="sm">View Submissions</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">Newsletter Integration</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {['Mailchimp', 'ConvertKit', 'SendGrid'].map(provider => (
            <div key={provider} className="flex items-center justify-between p-3 bg-white border border-surface-200 rounded-lg">
              <span className="text-sm font-medium">{provider}</span>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PopupsManager() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Popups</h3>
        <Button>+ Create Popup</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { name: 'Exit Intent Offer', type: 'MODAL', trigger: 'Exit Intent', status: true, views: 1234, conversions: 89 },
          { name: 'Welcome Bar', type: 'BAR', trigger: 'Page Load', status: true, views: 4567, conversions: 234 },
          { name: 'Newsletter Slide', type: 'SLIDE_IN', trigger: '50% Scroll', status: false, views: 890, conversions: 45 },
        ].map(popup => (
          <div key={popup.name} className="bg-white p-5 rounded-xl border border-surface-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-surface-900">{popup.name}</h4>
              <Badge variant={popup.status ? 'success' : 'default'}>
                {popup.status ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <div className="flex gap-3 text-xs text-surface-500 mb-3">
              <span>Type: {popup.type}</span>
              <span>Trigger: {popup.trigger}</span>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-xs text-surface-400">Views</p>
                <p className="font-semibold">{popup.views.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400">Conversions</p>
                <p className="font-semibold">{popup.conversions}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400">Rate</p>
                <p className="font-semibold text-green-600">
                  {((popup.conversions / popup.views) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ABTestManager() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">A/B Tests</h3>
        <Button>+ Create Test</Button>
      </div>
      <div className="space-y-4">
        {[
          {
            name: 'Hero CTA Color Test',
            status: 'RUNNING' as const,
            variants: [
              { name: 'Variant A (Blue)', visitors: 1234, conversions: 89, rate: 7.2 },
              { name: 'Variant B (Green)', visitors: 1198, conversions: 112, rate: 9.3 },
            ],
          },
          {
            name: 'Pricing Page Layout',
            status: 'COMPLETED' as const,
            variants: [
              { name: 'Variant A (Cards)', visitors: 2456, conversions: 178, rate: 7.2 },
              { name: 'Variant B (Table)', visitors: 2512, conversions: 145, rate: 5.8 },
            ],
          },
        ].map(test => (
          <div key={test.name} className="bg-white p-5 rounded-xl border border-surface-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-surface-900">{test.name}</h4>
              <Badge variant={test.status === 'RUNNING' ? 'info' : 'success'}>{test.status}</Badge>
            </div>
            <div className="space-y-2">
              {test.variants.map(variant => (
                <div key={variant.name} className="flex items-center gap-4 p-3 bg-surface-50 rounded-lg">
                  <span className="text-sm font-medium text-surface-700 w-40">{variant.name}</span>
                  <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${variant.rate * 10}%` }}
                    />
                  </div>
                  <span className="text-sm font-mono w-20 text-right">{variant.rate}%</span>
                  <span className="text-xs text-surface-400 w-24">{variant.visitors} visitors</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrackingManager() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-white p-6 rounded-xl border border-surface-200">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">Tracking Codes</h3>
        <div className="space-y-4">
          <Input label="Google Analytics ID" placeholder="G-XXXXXXXXXX" />
          <Input label="Facebook Pixel ID" placeholder="1234567890" />
          <Input label="Google Tag Manager ID" placeholder="GTM-XXXXXXX" />
          <Button size="sm">Save Changes</Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-surface-200">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">Conversion Goals</h3>
        <div className="space-y-2">
          {[
            { name: 'Form Submission', event: 'form_submit', count: 234 },
            { name: 'Purchase Complete', event: 'purchase', count: 56 },
            { name: 'Newsletter Signup', event: 'newsletter_signup', count: 189 },
          ].map(goal => (
            <div key={goal.name} className="flex items-center justify-between p-3 border border-surface-200 rounded-lg">
              <div>
                <p className="text-sm font-medium">{goal.name}</p>
                <p className="text-xs text-surface-400 font-mono">{goal.event}</p>
              </div>
              <span className="text-sm font-semibold">{goal.count} conversions</span>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-3">+ Add Goal</Button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-surface-200">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">CRM Integration</h3>
        <p className="text-sm text-surface-500 mb-4">Connect your CRM to sync leads and contacts automatically.</p>
        <div className="grid grid-cols-2 gap-3">
          {['HubSpot', 'Salesforce', 'Zoho CRM', 'Pipedrive'].map(crm => (
            <div key={crm} className="flex items-center justify-between p-3 border border-surface-200 rounded-lg">
              <span className="text-sm font-medium">{crm}</span>
              <Button variant="outline" size="sm">Connect</Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
