'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface PageInfo {
  id: string;
  title: string;
  slug: string;
  path: string;
  isHome: boolean;
  status: string;
}

const settingsTabs = [
  { id: 'general', label: 'General' },
  { id: 'pages', label: 'Pages' },
  { id: 'seo', label: 'SEO' },
  { id: 'domain', label: 'Domain' },
  { id: 'danger', label: 'Danger Zone' },
];

export default function SiteSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.siteId as string;
  const [activeTab, setActiveTab] = useState('general');
  const [site, setSite] = useState({
    name: 'My Site',
    slug: 'my-site',
    description: '',
    domain: '',
    favicon: '',
    status: 'DRAFT' as string,
    metaTitle: '',
    metaDescription: '',
  });
  const [pages, setPages] = useState<PageInfo[]>([
    { id: 'home', title: 'Home', slug: 'home', path: '/', isHome: true, status: 'DRAFT' },
  ]);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/sites?id=${siteId}`)
      .then(r => r.json())
      .then(data => {
        if (data.data) {
          const s = data.data;
          setSite(prev => ({ ...prev, ...s }));
        }
      })
      .catch(() => {});

    fetch(`/api/pages?siteId=${siteId}`)
      .then(r => r.json())
      .then(data => {
        if (data.pages) setPages(data.pages);
        else if (data.data) setPages(Array.isArray(data.data) ? data.data : [data.data]);
      })
      .catch(() => {});
  }, [siteId]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddPage = () => {
    if (!newPageTitle.trim()) return;
    const slug = newPageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setPages(prev => [...prev, {
      id: `page-${Date.now()}`,
      title: newPageTitle,
      slug,
      path: `/${slug}`,
      isHome: false,
      status: 'DRAFT',
    }]);
    setNewPageTitle('');
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="h-14 bg-white border-b border-surface-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-surface-500 hover:text-surface-700 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <span className="font-semibold text-surface-900">Site Settings</span>
          <span className="text-sm text-surface-400">/ {site.name}</span>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-green-600">Saved!</span>}
          <Link
            href={`/builder/${siteId}/home`}
            className="px-3 py-1.5 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            Open Builder
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-surface-200">
          {settingsTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                activeTab === tab.id
                  ? 'border-brand-600 text-brand-600'
                  : 'border-transparent text-surface-500 hover:text-surface-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-surface-200 p-6">
              <h2 className="text-lg font-semibold text-surface-900 mb-4">General</h2>
              <div className="space-y-4">
                <Input
                  label="Site Name"
                  value={site.name}
                  onChange={(e) => setSite(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input
                  label="Site Slug"
                  value={site.slug}
                  onChange={(e) => setSite(prev => ({ ...prev, slug: e.target.value }))}
                />
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Description</label>
                  <textarea
                    value={site.description}
                    onChange={(e) => setSite(prev => ({ ...prev, description: e.target.value }))}
                    className="builder-input h-24 resize-none"
                    placeholder="Brief description of your site"
                  />
                </div>
                <Input
                  label="Favicon URL"
                  value={site.favicon}
                  onChange={(e) => setSite(prev => ({ ...prev, favicon: e.target.value }))}
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
              <Button className="mt-4" onClick={handleSave}>Save Changes</Button>
            </div>

            <div className="bg-white rounded-xl border border-surface-200 p-6">
              <h2 className="text-lg font-semibold text-surface-900 mb-4">Site Status</h2>
              <div className="flex items-center gap-3">
                {['DRAFT', 'PUBLISHED', 'ARCHIVED'].map(status => (
                  <button
                    key={status}
                    onClick={() => setSite(prev => ({ ...prev, status }))}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                      site.status === status
                        ? status === 'PUBLISHED' ? 'bg-green-100 text-green-700 ring-2 ring-green-300'
                        : status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-300'
                        : 'bg-surface-100 text-surface-600 ring-2 ring-surface-300'
                        : 'bg-surface-50 text-surface-500 hover:bg-surface-100'
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Pages */}
        {activeTab === 'pages' && (
          <div className="bg-white rounded-xl border border-surface-200">
            <div className="p-4 border-b border-surface-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-surface-900">Pages</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="New page title"
                  className="builder-input text-sm w-48"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddPage()}
                />
                <Button size="sm" onClick={handleAddPage}>Add Page</Button>
              </div>
            </div>
            {pages.map(page => (
              <div key={page.id} className="flex items-center justify-between p-4 border-b border-surface-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-100 flex items-center justify-center text-sm">
                    {page.isHome ? '🏠' : '📄'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">{page.title}</p>
                    <p className="text-xs text-surface-400">{page.path}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full font-medium',
                    page.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  )}>
                    {page.status}
                  </span>
                  <Link
                    href={`/builder/${siteId}/${page.slug}`}
                    className="px-3 py-1 text-xs font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEO */}
        {activeTab === 'seo' && (
          <div className="bg-white rounded-xl border border-surface-200 p-6">
            <h2 className="text-lg font-semibold text-surface-900 mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <Input
                label="Meta Title"
                value={site.metaTitle}
                onChange={(e) => setSite(prev => ({ ...prev, metaTitle: e.target.value }))}
                placeholder="My Awesome Website"
              />
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Meta Description</label>
                <textarea
                  value={site.metaDescription}
                  onChange={(e) => setSite(prev => ({ ...prev, metaDescription: e.target.value }))}
                  className="builder-input h-20 resize-none"
                  placeholder="A brief description for search engines"
                />
              </div>

              {/* Google Preview */}
              <div className="p-4 bg-surface-50 rounded-lg">
                <p className="text-xs text-surface-400 mb-2">Search Preview</p>
                <p className="text-blue-700 text-base font-medium truncate">
                  {site.metaTitle || site.name || 'Your Site Title'}
                </p>
                <p className="text-green-700 text-xs truncate">
                  {site.domain || `${site.slug}.jamstack.app`}
                </p>
                <p className="text-sm text-surface-600 line-clamp-2 mt-0.5">
                  {site.metaDescription || 'No description set. Add a meta description to improve SEO.'}
                </p>
              </div>
            </div>
            <Button className="mt-4" onClick={handleSave}>Save SEO Settings</Button>
          </div>
        )}

        {/* Domain */}
        {activeTab === 'domain' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-surface-200 p-6">
              <h2 className="text-lg font-semibold text-surface-900 mb-4">Custom Domain</h2>
              <Input
                label="Domain"
                value={site.domain}
                onChange={(e) => setSite(prev => ({ ...prev, domain: e.target.value }))}
                placeholder="www.example.com"
              />
              <Button className="mt-4" onClick={handleSave}>Connect Domain</Button>
            </div>

            <div className="bg-white rounded-xl border border-surface-200 p-6">
              <h2 className="text-lg font-semibold text-surface-900 mb-2">Free Subdomain</h2>
              <p className="text-sm text-surface-500 mb-4">Your site is available at:</p>
              <div className="flex items-center gap-2 p-3 bg-surface-50 rounded-lg">
                <span className="text-sm font-mono text-surface-700">{site.slug}.jamstack.app</span>
                <button
                  onClick={() => navigator.clipboard.writeText(`${site.slug}.jamstack.app`)}
                  className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        {activeTab === 'danger' && (
          <div className="bg-white rounded-xl border border-red-200 p-6">
            <h2 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h2>
            <p className="text-sm text-surface-500 mb-4">
              These actions are irreversible. Please be certain before proceeding.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-surface-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-surface-900">Archive Site</p>
                  <p className="text-xs text-surface-400">Unpublish and archive this site</p>
                </div>
                <Button variant="outline" size="sm">Archive</Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <p className="text-sm font-medium text-red-700">Delete Site</p>
                  <p className="text-xs text-red-500">Permanently delete this site and all its pages</p>
                </div>
                <button className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Delete Site
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
