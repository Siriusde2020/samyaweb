'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CreateSiteModal } from '@/components/dashboard/CreateSiteModal';
import { TemplateGallery } from '@/components/templates/TemplateGallery';
import { cn } from '@/lib/utils';

interface SitePreview {
  id: string;
  name: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  domain?: string;
  thumbnail: string;
  updatedAt: string;
  pageCount: number;
}

const mockSites: SitePreview[] = [
  { id: '1', name: 'My Portfolio', slug: 'my-portfolio', status: 'PUBLISHED', domain: 'portfolio.me', thumbnail: '', updatedAt: '2026-02-28', pageCount: 5 },
  { id: '2', name: 'Business Site', slug: 'business-site', status: 'DRAFT', thumbnail: '', updatedAt: '2026-02-25', pageCount: 8 },
  { id: '3', name: 'Online Store', slug: 'online-store', status: 'PUBLISHED', domain: 'mystore.com', thumbnail: '', updatedAt: '2026-02-20', pageCount: 12 },
];

const navItems = [
  { id: 'sites', label: 'My Sites', icon: '🌐' },
  { id: 'templates', label: 'Templates', icon: '📋' },
  { id: 'analytics', label: 'Analytics', icon: '📊' },
  { id: 'domains', label: 'Domains', icon: '🔗' },
  { id: 'team', label: 'Team', icon: '👥' },
  { id: 'billing', label: 'Billing', icon: '💳' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('sites');
  const [showNewSite, setShowNewSite] = useState(false);
  const [sites, setSites] = useState(mockSites);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sites')
      .then(res => res.json())
      .then(data => {
        if (data.data?.items && data.data.items.length > 0) {
          setSites(data.data.items.map((s: Record<string, unknown>) => ({
            id: s.id,
            name: s.name,
            slug: s.slug,
            status: s.status,
            domain: s.domain,
            thumbnail: '',
            updatedAt: s.updatedAt,
            pageCount: ((s as Record<string, Record<string, number>>)?._count?.pages) ?? 0,
          })));
        }
      })
      .catch(() => { /* Use mock data on failure */ })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Top Bar */}
      <header className="h-14 bg-white border-b border-surface-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">JS</div>
            <span className="font-semibold text-surface-900">JAMStack Builder</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="primary" size="sm" onClick={() => setShowNewSite(true)}>
            + New Site
          </Button>
          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-semibold text-sm">
            U
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-[calc(100vh-56px)] bg-white border-r border-surface-200 p-4">
          <nav className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  activeNav === item.id
                    ? 'bg-brand-50 text-brand-700 font-medium'
                    : 'text-surface-600 hover:bg-surface-50'
                )}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-brand-50 rounded-xl">
            <h3 className="text-sm font-semibold text-brand-700">Free Plan</h3>
            <p className="text-xs text-brand-600 mt-1">1 of 1 sites used</p>
            <Button variant="primary" size="sm" className="w-full mt-3">
              Upgrade Plan
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeNav === 'sites' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-surface-900">My Sites</h1>
                  <p className="text-sm text-surface-500 mt-1">Manage your websites</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* New Site Card */}
                <button
                  onClick={() => setShowNewSite(true)}
                  className="border-2 border-dashed border-surface-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-brand-400 hover:bg-brand-50 transition-colors min-h-[200px] group"
                >
                  <div className="w-12 h-12 rounded-xl bg-surface-100 group-hover:bg-brand-100 flex items-center justify-center text-2xl mb-3">+</div>
                  <span className="font-medium text-surface-700 group-hover:text-brand-600">Create New Site</span>
                </button>

                {/* Site Cards */}
                {sites.map(site => (
                  <div key={site.id} className="bg-white rounded-2xl border border-surface-200 overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="h-36 bg-gradient-to-br from-surface-100 to-surface-200 relative">
                      <div className="absolute top-3 right-3">
                        <span className={cn(
                          'px-2 py-1 text-[10px] font-medium rounded-full',
                          site.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                          site.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-surface-100 text-surface-600'
                        )}>
                          {site.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-surface-900">{site.name}</h3>
                      <p className="text-xs text-surface-400 mt-0.5">
                        {site.domain || `${site.slug}.jamstack.app`}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-surface-400">{site.pageCount} pages</span>
                        <div className="flex gap-2">
                          <Link
                            href={`/builder/${site.id}/home`}
                            className="px-3 py-1.5 text-xs font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                          >
                            Edit
                          </Link>
                          <Link
                            href={`/dashboard/sites/${site.id}`}
                            className="px-3 py-1.5 text-xs font-medium bg-surface-100 text-surface-600 rounded-lg hover:bg-surface-200 transition-colors"
                          >
                            Settings
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeNav === 'analytics' && <DashboardAnalytics />}
          {activeNav === 'team' && <DashboardTeam />}
          {activeNav === 'billing' && <DashboardBilling />}
          {activeNav === 'domains' && <DashboardDomains />}
          {activeNav === 'templates' && (
            <div>
              <h1 className="text-2xl font-bold text-surface-900 mb-2">Template Marketplace</h1>
              <p className="text-sm text-surface-500 mb-8">Choose from our collection of professionally designed templates</p>
              <TemplateGallery onSelect={() => setShowNewSite(true)} />
            </div>
          )}
          {activeNav === 'settings' && <DashboardSettings />}
        </main>
      </div>

      {/* New Site Modal */}
      <CreateSiteModal isOpen={showNewSite} onClose={() => setShowNewSite(false)} />
    </div>
  );
}

function DashboardAnalytics() {
  const stats = [
    { label: 'Total Page Views', value: '24,532', change: '+12%' },
    { label: 'Unique Visitors', value: '8,341', change: '+8%' },
    { label: 'Bounce Rate', value: '34.2%', change: '-3%' },
    { label: 'Avg Session', value: '2m 45s', change: '+15%' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 mb-2">Analytics</h1>
      <p className="text-sm text-surface-500 mb-8">Track your website performance</p>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-surface-200">
            <p className="text-xs text-surface-500">{stat.label}</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-surface-900">{stat.value}</span>
              <span className={cn(
                'text-xs font-medium mb-1',
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              )}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart placeholder */}
      <div className="bg-white p-6 rounded-xl border border-surface-200 h-64 flex items-center justify-center text-surface-400">
        Chart visualization area - Integrates with Recharts for full analytics
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl border border-surface-200">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Top Pages</h3>
          {[
            { path: '/', views: 8432 },
            { path: '/about', views: 3521 },
            { path: '/products', views: 2874 },
            { path: '/blog', views: 1932 },
            { path: '/contact', views: 1245 },
          ].map(page => (
            <div key={page.path} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0">
              <span className="text-sm text-surface-700">{page.path}</span>
              <span className="text-sm font-medium text-surface-500">{page.views.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl border border-surface-200">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Top Referrers</h3>
          {[
            { source: 'Google', visits: 4521 },
            { source: 'Twitter', visits: 1832 },
            { source: 'Direct', visits: 1543 },
            { source: 'Facebook', visits: 987 },
            { source: 'LinkedIn', visits: 654 },
          ].map(ref => (
            <div key={ref.source} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0">
              <span className="text-sm text-surface-700">{ref.source}</span>
              <span className="text-sm font-medium text-surface-500">{ref.visits.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardTeam() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 mb-2">Team</h1>
      <p className="text-sm text-surface-500 mb-8">Manage team members and permissions</p>

      <div className="bg-white rounded-xl border border-surface-200">
        <div className="p-4 border-b border-surface-200 flex items-center justify-between">
          <span className="text-sm font-medium text-surface-700">Team Members (3)</span>
          <Button size="sm">Invite Member</Button>
        </div>
        {[
          { name: 'You', email: 'owner@example.com', role: 'Owner', avatar: 'O' },
          { name: 'Jane Designer', email: 'jane@example.com', role: 'Editor', avatar: 'J' },
          { name: 'Bob Client', email: 'bob@client.com', role: 'Viewer', avatar: 'B' },
        ].map(member => (
          <div key={member.email} className="flex items-center justify-between p-4 border-b border-surface-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-semibold text-sm">
                {member.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-surface-900">{member.name}</p>
                <p className="text-xs text-surface-400">{member.email}</p>
              </div>
            </div>
            <span className="text-xs px-2 py-1 bg-surface-100 text-surface-600 rounded-full">{member.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardBilling() {
  const plans = [
    { name: 'Free', price: '$0', features: ['1 Site', '1GB Storage', 'Jamstack.app domain', 'Community support'] },
    { name: 'Starter', price: '$12', features: ['3 Sites', '10GB Storage', 'Custom domain', 'Email support', 'Basic analytics'] },
    { name: 'Professional', price: '$29', features: ['10 Sites', '50GB Storage', 'Custom domains', 'Priority support', 'Full analytics', 'E-commerce', 'CMS'] },
    { name: 'Business', price: '$79', features: ['Unlimited Sites', '200GB Storage', 'White label', 'Dedicated support', 'Team collaboration', 'API access', 'SSO'] },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 mb-2">Billing & Plans</h1>
      <p className="text-sm text-surface-500 mb-8">Manage your subscription and billing</p>

      <div className="grid md:grid-cols-4 gap-4">
        {plans.map((plan, i) => (
          <div key={plan.name} className={cn(
            'p-6 rounded-2xl border',
            i === 2 ? 'border-brand-300 bg-brand-50 ring-2 ring-brand-200' : 'border-surface-200 bg-white'
          )}>
            {i === 2 && <span className="text-[10px] font-medium text-brand-600 uppercase">Most Popular</span>}
            <h3 className="text-lg font-bold text-surface-900 mt-1">{plan.name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-extrabold text-surface-900">{plan.price}</span>
              <span className="text-sm text-surface-500">/month</span>
            </div>
            <ul className="mt-4 space-y-2">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-surface-600">
                  <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={i === 2 ? 'primary' : 'outline'}
              size="sm"
              className="w-full mt-6"
            >
              {i === 0 ? 'Current Plan' : 'Upgrade'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardDomains() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 mb-2">Domains</h1>
      <p className="text-sm text-surface-500 mb-8">Connect custom domains to your sites</p>

      <div className="bg-white rounded-xl border border-surface-200">
        <div className="p-4 border-b border-surface-200 flex items-center justify-between">
          <span className="text-sm font-medium text-surface-700">Connected Domains</span>
          <Button size="sm">Add Domain</Button>
        </div>
        {[
          { domain: 'portfolio.me', site: 'My Portfolio', ssl: true, status: 'Active' },
          { domain: 'mystore.com', site: 'Online Store', ssl: true, status: 'Active' },
        ].map(d => (
          <div key={d.domain} className="flex items-center justify-between p-4 border-b border-surface-100 last:border-0">
            <div>
              <p className="text-sm font-medium text-surface-900">{d.domain}</p>
              <p className="text-xs text-surface-400">Connected to: {d.site}</p>
            </div>
            <div className="flex items-center gap-3">
              {d.ssl && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  SSL Active
                </span>
              )}
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">{d.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardSettings() {
  const [profile, setProfile] = useState({ name: 'User', email: 'user@example.com', timezone: 'UTC' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 mb-2">Account Settings</h1>
      <p className="text-sm text-surface-500 mb-8">Manage your account preferences</p>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-surface-200 p-6">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Profile</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1">Name</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                className="builder-input"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1">Email</label>
              <input
                value={profile.email}
                onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                className="builder-input"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-600 mb-1">Timezone</label>
              <select
                value={profile.timezone}
                onChange={(e) => setProfile(p => ({ ...p, timezone: e.target.value }))}
                className="builder-input"
              >
                <option value="UTC">UTC</option>
                <option value="US/Eastern">US Eastern</option>
                <option value="US/Pacific">US Pacific</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <Button onClick={handleSave}>Save Profile</Button>
            {saved && <span className="text-sm text-green-600">Saved!</span>}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-200 p-6">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-surface-700">
              <input type="checkbox" defaultChecked className="rounded" />
              Send email notifications for deployments
            </label>
            <label className="flex items-center gap-3 text-sm text-surface-700">
              <input type="checkbox" defaultChecked className="rounded" />
              Auto-save changes in builder
            </label>
            <label className="flex items-center gap-3 text-sm text-surface-700">
              <input type="checkbox" className="rounded" />
              Enable dark mode in builder
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-surface-200 p-6">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">API & Integrations</h3>
          <div className="p-4 bg-surface-50 rounded-lg">
            <p className="text-xs text-surface-500 mb-1">API Key</p>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono text-surface-700 bg-surface-100 px-3 py-1.5 rounded flex-1">
                sk-demo-xxxx-xxxx-xxxx
              </code>
              <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
