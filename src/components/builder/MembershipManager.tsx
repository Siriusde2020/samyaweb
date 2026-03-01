'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { cn } from '@/lib/utils';

export function MembershipManager() {
  const [activeTab, setActiveTab] = useState<'plans' | 'members' | 'content' | 'community'>('plans');

  return (
    <div>
      <div className="flex items-center gap-1 mb-6 border-b border-surface-200">
        {(['plans', 'members', 'content', 'community'] as const).map(tab => (
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
            {tab === 'content' ? 'Gated Content' : tab}
          </button>
        ))}
      </div>

      {activeTab === 'plans' && <MembershipPlans />}
      {activeTab === 'members' && <MembersList />}
      {activeTab === 'content' && <GatedContent />}
      {activeTab === 'community' && <CommunitySpaces />}
    </div>
  );
}

function MembershipPlans() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Membership Plans</h3>
        <Button>+ Create Plan</Button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { name: 'Free Member', type: 'FREE', price: 0, members: 234, features: ['Community access', 'Basic content', 'Newsletter'] },
          { name: 'Pro Member', type: 'PAID', price: 9.99, members: 89, features: ['All free features', 'Premium content', 'Course access', 'Direct support'] },
          { name: 'VIP Subscription', type: 'SUBSCRIPTION', price: 29.99, members: 34, features: ['Everything in Pro', '1-on-1 coaching', 'Private community', 'Exclusive events', 'Early access'] },
        ].map(plan => (
          <div key={plan.name} className="bg-white p-6 rounded-xl border border-surface-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-surface-900">{plan.name}</h4>
              <Badge>{plan.type}</Badge>
            </div>
            <div className="mb-4">
              <span className="text-3xl font-bold text-surface-900">
                {plan.price === 0 ? 'Free' : `$${plan.price}`}
              </span>
              {plan.price > 0 && <span className="text-sm text-surface-500">/month</span>}
            </div>
            <ul className="space-y-2 mb-4">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-surface-600">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between pt-3 border-t border-surface-100">
              <span className="text-sm text-surface-500">{plan.members} members</span>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MembersList() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Input placeholder="Search members..." className="w-64" />
        <Button>+ Invite Member</Button>
      </div>
      <div className="bg-white rounded-xl border border-surface-200">
        <div className="px-4 py-3 border-b border-surface-200 grid grid-cols-12 text-xs font-medium text-surface-500 uppercase">
          <span className="col-span-3">Member</span>
          <span className="col-span-2">Plan</span>
          <span className="col-span-2">Joined</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-2">Revenue</span>
          <span className="col-span-1">Actions</span>
        </div>
        {[
          { name: 'Sarah Chen', email: 'sarah@example.com', plan: 'VIP', joined: '2026-01-15', status: 'Active', revenue: '$89.97' },
          { name: 'Mike Johnson', email: 'mike@example.com', plan: 'Pro', joined: '2026-02-01', status: 'Active', revenue: '$29.97' },
          { name: 'Emma Wilson', email: 'emma@example.com', plan: 'Free', joined: '2026-02-14', status: 'Active', revenue: '$0' },
          { name: 'James Lee', email: 'james@example.com', plan: 'Pro', joined: '2025-12-01', status: 'Inactive', revenue: '$19.98' },
        ].map(member => (
          <div key={member.email} className="px-4 py-3 border-b border-surface-100 last:border-0 grid grid-cols-12 items-center text-sm">
            <div className="col-span-3">
              <p className="font-medium text-surface-900">{member.name}</p>
              <p className="text-xs text-surface-400">{member.email}</p>
            </div>
            <div className="col-span-2"><Badge>{member.plan}</Badge></div>
            <div className="col-span-2 text-surface-500">{member.joined}</div>
            <div className="col-span-2">
              <Badge variant={member.status === 'Active' ? 'success' : 'default'}>{member.status}</Badge>
            </div>
            <div className="col-span-2 font-medium">{member.revenue}</div>
            <div className="col-span-1">
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GatedContent() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Gated Content</h3>
        <Button>+ Add Rule</Button>
      </div>
      <p className="text-sm text-surface-500 mb-6">
        Control which pages and content require membership to access.
      </p>
      <div className="space-y-3">
        {[
          { page: '/courses', plan: 'Pro+', type: 'Page', description: 'Entire courses section requires Pro or VIP membership' },
          { page: '/resources/templates', plan: 'VIP', type: 'Page', description: 'Premium template downloads for VIP members only' },
          { page: '/blog (premium posts)', plan: 'Pro+', type: 'Content', description: 'Blog posts tagged as "premium" require Pro membership' },
          { page: '/community/private', plan: 'VIP', type: 'Page', description: 'Private community forum for VIP members' },
        ].map((rule, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-white border border-surface-200 rounded-xl">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-surface-900">{rule.page}</span>
                <Badge>{rule.type}</Badge>
              </div>
              <p className="text-xs text-surface-400 mt-0.5">{rule.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="info">Requires: {rule.plan}</Badge>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-xl border border-surface-200">
        <h3 className="text-sm font-semibold text-surface-900 mb-3">Login Page Customization</h3>
        <p className="text-sm text-surface-500 mb-4">Customize the member login and signup pages.</p>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Login Page Title" defaultValue="Member Login" />
          <Input label="Signup Page Title" defaultValue="Join Our Community" />
          <Input label="Redirect After Login" defaultValue="/dashboard" />
          <Select
            label="Login Style"
            options={[
              { value: 'modal', label: 'Modal Popup' },
              { value: 'page', label: 'Full Page' },
              { value: 'sidebar', label: 'Sidebar' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

function CommunitySpaces() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Community Spaces</h3>
        <Button>+ Create Space</Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { name: 'General Discussion', members: 234, posts: 1456, access: 'All Members', icon: '💬' },
          { name: 'Pro Lounge', members: 89, posts: 567, access: 'Pro+ Only', icon: '⭐' },
          { name: 'VIP Private', members: 34, posts: 234, access: 'VIP Only', icon: '👑' },
          { name: 'Announcements', members: 234, posts: 45, access: 'Admin Only (Post)', icon: '📢' },
        ].map(space => (
          <div key={space.name} className="bg-white p-5 rounded-xl border border-surface-200">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{space.icon}</span>
              <div>
                <h4 className="font-semibold text-surface-900">{space.name}</h4>
                <p className="text-xs text-surface-400">{space.access}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-surface-500">
              <span>{space.members} members</span>
              <span>{space.posts} posts</span>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm">Settings</Button>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
