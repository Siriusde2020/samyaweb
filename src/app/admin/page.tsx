'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type AdminTab = 'overview' | 'users' | 'sites' | 'templates' | 'plugins' | 'billing' | 'security';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const tabs: Array<{ id: AdminTab; label: string; icon: string }> = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'sites', label: 'Sites', icon: '🌐' },
    { id: 'templates', label: 'Templates', icon: '📋' },
    { id: 'plugins', label: 'Marketplace', icon: '🧩' },
    { id: 'billing', label: 'Billing', icon: '💰' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Admin Header */}
      <header className="h-14 bg-surface-900 text-white flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-surface-400 hover:text-white">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </Link>
          <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">A</div>
          <span className="font-semibold">Admin Panel</span>
          <Badge variant="danger">Super Admin</Badge>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-surface-400">System Status: <span className="text-green-400">Healthy</span></span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 min-h-[calc(100vh-56px)] bg-surface-900 p-4">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  activeTab === tab.id
                    ? 'bg-surface-800 text-white font-medium'
                    : 'text-surface-400 hover:text-white hover:bg-surface-800'
                )}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === 'overview' && <AdminOverview />}
          {activeTab === 'users' && <AdminUsers />}
          {activeTab === 'sites' && <AdminSites />}
          {activeTab === 'templates' && <AdminTemplates />}
          {activeTab === 'plugins' && <AdminPlugins />}
          {activeTab === 'billing' && <AdminBilling />}
          {activeTab === 'security' && <AdminSecurity />}
        </main>
      </div>
    </div>
  );
}

function AdminOverview() {
  const stats = [
    { label: 'Total Users', value: '12,456', change: '+342 this month', color: 'text-blue-600' },
    { label: 'Active Sites', value: '8,923', change: '+128 this month', color: 'text-green-600' },
    { label: 'Monthly Revenue', value: '$45,678', change: '+12% MoM', color: 'text-brand-600' },
    { label: 'Server Load', value: '23%', change: 'Healthy', color: 'text-green-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Platform Overview</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-5 rounded-xl border border-surface-200">
            <p className="text-xs text-surface-500">{stat.label}</p>
            <p className={cn('text-2xl font-bold mt-1', stat.color)}>{stat.value}</p>
            <p className="text-xs text-surface-400 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-surface-200">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Recent Signups</h3>
          {[
            { name: 'Alice Johnson', email: 'alice@example.com', plan: 'Pro', time: '2m ago' },
            { name: 'Bob Smith', email: 'bob@example.com', plan: 'Free', time: '15m ago' },
            { name: 'Carol Davis', email: 'carol@example.com', plan: 'Starter', time: '1h ago' },
            { name: 'Dan Wilson', email: 'dan@example.com', plan: 'Business', time: '3h ago' },
          ].map(user => (
            <div key={user.email} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-xs font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-surface-400">{user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <Badge>{user.plan}</Badge>
                <p className="text-xs text-surface-400 mt-0.5">{user.time}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl border border-surface-200">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">System Health</h3>
          {[
            { name: 'API Response Time', value: '45ms', status: 'good' },
            { name: 'CDN Uptime', value: '99.99%', status: 'good' },
            { name: 'Database Load', value: '18%', status: 'good' },
            { name: 'Build Queue', value: '3 pending', status: 'warning' },
            { name: 'Storage Used', value: '45.2 TB / 100 TB', status: 'good' },
            { name: 'SSL Certificates', value: 'All valid', status: 'good' },
          ].map(item => (
            <div key={item.name} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-0">
              <span className="text-sm text-surface-600">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{item.value}</span>
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  item.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'
                )} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminUsers() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">User Management</h1>
        <div className="flex gap-3">
          <Input placeholder="Search users..." className="w-64" />
          <Button>Export CSV</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-surface-200">
        <div className="px-4 py-3 border-b border-surface-200 grid grid-cols-12 text-xs font-medium text-surface-500 uppercase">
          <span className="col-span-3">User</span>
          <span className="col-span-2">Plan</span>
          <span className="col-span-2">Sites</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-1">2FA</span>
          <span className="col-span-2">Actions</span>
        </div>
        {[
          { name: 'Alice Johnson', email: 'alice@example.com', plan: 'Professional', sites: 5, status: 'Active', twoFa: true },
          { name: 'Bob Smith', email: 'bob@example.com', plan: 'Free', sites: 1, status: 'Active', twoFa: false },
          { name: 'Carol Davis', email: 'carol@example.com', plan: 'Business', sites: 12, status: 'Active', twoFa: true },
          { name: 'Dan Wilson', email: 'dan@example.com', plan: 'Starter', sites: 3, status: 'Suspended', twoFa: false },
        ].map(user => (
          <div key={user.email} className="px-4 py-3 border-b border-surface-100 last:border-0 grid grid-cols-12 items-center text-sm">
            <div className="col-span-3">
              <p className="font-medium text-surface-900">{user.name}</p>
              <p className="text-xs text-surface-400">{user.email}</p>
            </div>
            <div className="col-span-2"><Badge>{user.plan}</Badge></div>
            <div className="col-span-2 text-surface-600">{user.sites}</div>
            <div className="col-span-2">
              <Badge variant={user.status === 'Active' ? 'success' : 'danger'}>{user.status}</Badge>
            </div>
            <div className="col-span-1">
              {user.twoFa ? <Badge variant="success">On</Badge> : <Badge>Off</Badge>}
            </div>
            <div className="col-span-2 flex gap-1">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSites() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Site Monitoring</h1>
      <div className="bg-white rounded-xl border border-surface-200">
        {[
          { name: 'TechStartup.io', owner: 'Alice Johnson', status: 'Published', traffic: '15.2K/mo', storage: '2.3 GB' },
          { name: 'Portfolio Pro', owner: 'Bob Smith', status: 'Published', traffic: '3.1K/mo', storage: '456 MB' },
          { name: 'ShopOnline', owner: 'Carol Davis', status: 'Published', traffic: '45.6K/mo', storage: '8.7 GB' },
          { name: 'Blog Draft', owner: 'Dan Wilson', status: 'Draft', traffic: '0', storage: '123 MB' },
        ].map(site => (
          <div key={site.name} className="flex items-center justify-between p-4 border-b border-surface-100 last:border-0">
            <div>
              <p className="text-sm font-medium text-surface-900">{site.name}</p>
              <p className="text-xs text-surface-400">Owner: {site.owner}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-surface-400">Traffic</p>
                <p className="text-sm font-medium">{site.traffic}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-surface-400">Storage</p>
                <p className="text-sm font-medium">{site.storage}</p>
              </div>
              <Badge variant={site.status === 'Published' ? 'success' : 'warning'}>{site.status}</Badge>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminTemplates() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Template Approval</h1>
        <Badge variant="warning">3 Pending Review</Badge>
      </div>
      <div className="space-y-3">
        {[
          { name: 'Modern SaaS Landing', author: 'Design Studio', status: 'Pending', downloads: 0 },
          { name: 'Restaurant Starter', author: 'Template Co', status: 'Approved', downloads: 245 },
          { name: 'Fitness Coach', author: 'WebDesigns', status: 'Pending', downloads: 0 },
        ].map(t => (
          <div key={t.name} className="flex items-center justify-between p-4 bg-white border border-surface-200 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-20 h-14 bg-surface-100 rounded-lg" />
              <div>
                <p className="text-sm font-medium text-surface-900">{t.name}</p>
                <p className="text-xs text-surface-400">By {t.author} | {t.downloads} downloads</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={t.status === 'Approved' ? 'success' : 'warning'}>{t.status}</Badge>
              {t.status === 'Pending' && (
                <>
                  <Button variant="primary" size="sm">Approve</Button>
                  <Button variant="danger" size="sm">Reject</Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPlugins() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-surface-900">App Marketplace</h1>
        <Button>+ Add Plugin</Button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { name: 'Google Analytics', category: 'Analytics', installs: 4567, revenue: '$2,340', status: 'Active' },
          { name: 'Mailchimp Integration', category: 'Marketing', installs: 3210, revenue: '$1,890', status: 'Active' },
          { name: 'Live Chat Widget', category: 'Support', installs: 2134, revenue: '$3,450', status: 'Active' },
          { name: 'SEO Toolkit Pro', category: 'SEO', installs: 1890, revenue: '$4,560', status: 'Active' },
          { name: 'Social Feed', category: 'Social', installs: 987, revenue: '$890', status: 'Pending' },
          { name: 'Custom Forms Pro', category: 'Forms', installs: 1456, revenue: '$2,100', status: 'Active' },
        ].map(plugin => (
          <div key={plugin.name} className="bg-white p-5 rounded-xl border border-surface-200">
            <div className="flex items-center justify-between mb-3">
              <Badge>{plugin.category}</Badge>
              <Badge variant={plugin.status === 'Active' ? 'success' : 'warning'}>{plugin.status}</Badge>
            </div>
            <h3 className="font-medium text-surface-900">{plugin.name}</h3>
            <div className="flex gap-4 mt-3 text-xs text-surface-500">
              <span>{plugin.installs.toLocaleString()} installs</span>
              <span>Revenue: {plugin.revenue}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminBilling() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Billing & Revenue</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'MRR', value: '$45,678' },
          { label: 'ARR', value: '$548,136' },
          { label: 'Churn Rate', value: '2.1%' },
          { label: 'LTV', value: '$234' },
        ].map(s => (
          <div key={s.label} className="bg-white p-5 rounded-xl border border-surface-200">
            <p className="text-xs text-surface-500">{s.label}</p>
            <p className="text-2xl font-bold text-surface-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-surface-200">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">Subscription Distribution</h3>
        {[
          { plan: 'Free', users: 8456, percentage: 68 },
          { plan: 'Starter', users: 2134, percentage: 17 },
          { plan: 'Professional', users: 1234, percentage: 10 },
          { plan: 'Business', users: 456, percentage: 4 },
          { plan: 'Enterprise', users: 176, percentage: 1 },
        ].map(plan => (
          <div key={plan.plan} className="flex items-center gap-4 py-2">
            <span className="text-sm w-24 text-surface-600">{plan.plan}</span>
            <div className="flex-1 h-3 bg-surface-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full" style={{ width: `${plan.percentage}%` }} />
            </div>
            <span className="text-sm font-medium w-20 text-right">{plan.users.toLocaleString()}</span>
            <span className="text-xs text-surface-400 w-10 text-right">{plan.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSecurity() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 mb-6">Security & Compliance</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-surface-200">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Security Settings</h3>
          <div className="space-y-3">
            {[
              { name: 'SSL by Default', enabled: true, description: 'Auto-provision SSL for all sites' },
              { name: 'DDoS Protection', enabled: true, description: 'Edge-level DDoS mitigation' },
              { name: 'Rate Limiting', enabled: true, description: 'API rate limits: 100 req/min' },
              { name: '2FA Enforcement', enabled: false, description: 'Require 2FA for all admin users' },
              { name: 'IP Allowlist', enabled: false, description: 'Restrict admin access by IP' },
              { name: 'Audit Logging', enabled: true, description: 'Log all admin actions' },
            ].map(setting => (
              <div key={setting.name} className="flex items-center justify-between p-3 border border-surface-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{setting.name}</p>
                  <p className="text-xs text-surface-400">{setting.description}</p>
                </div>
                <div className={cn(
                  'w-10 h-6 rounded-full p-0.5 cursor-pointer transition-colors',
                  setting.enabled ? 'bg-green-500' : 'bg-surface-300'
                )}>
                  <div className={cn(
                    'w-5 h-5 bg-white rounded-full shadow-sm transition-transform',
                    setting.enabled ? 'translate-x-4' : 'translate-x-0'
                  )} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-surface-200">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Compliance Tools</h3>
          <div className="space-y-3">
            <div className="p-4 bg-surface-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇪🇺</span>
                  <div>
                    <p className="text-sm font-medium">GDPR Tools</p>
                    <p className="text-xs text-surface-400">EU data protection compliance</p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
            <div className="p-4 bg-surface-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🍪</span>
                  <div>
                    <p className="text-sm font-medium">Cookie Consent Banner</p>
                    <p className="text-xs text-surface-400">Customizable cookie consent</p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
            <div className="p-4 bg-surface-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📜</span>
                  <div>
                    <p className="text-sm font-medium">Privacy Policy Generator</p>
                    <p className="text-xs text-surface-400">Auto-generate privacy policies</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Generate</Button>
              </div>
            </div>
            <div className="p-4 bg-surface-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚖️</span>
                  <div>
                    <p className="text-sm font-medium">Terms of Service Generator</p>
                    <p className="text-xs text-surface-400">Auto-generate terms pages</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Generate</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-surface-200 md:col-span-2">
          <h3 className="text-sm font-semibold text-surface-900 mb-4">Recent Security Events</h3>
          <div className="space-y-2">
            {[
              { event: 'Failed login attempt (5x)', ip: '192.168.1.100', time: '2 min ago', severity: 'warning' },
              { event: 'New admin user added', ip: '10.0.0.1', time: '1 hour ago', severity: 'info' },
              { event: 'SSL certificate renewed', ip: 'System', time: '3 hours ago', severity: 'success' },
              { event: 'Rate limit triggered', ip: '203.0.113.50', time: '5 hours ago', severity: 'warning' },
              { event: 'Successful 2FA setup', ip: '10.0.0.5', time: '1 day ago', severity: 'success' },
            ].map((event, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-surface-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    event.severity === 'warning' ? 'bg-yellow-500' :
                    event.severity === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  )} />
                  <span className="text-sm text-surface-700">{event.event}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-surface-400 font-mono">{event.ip}</span>
                  <span className="text-xs text-surface-400">{event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
