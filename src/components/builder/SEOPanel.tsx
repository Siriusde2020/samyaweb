'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

export function SEOPanel() {
  const [meta, setMeta] = useState({
    title: 'My Website - Build Something Amazing',
    description: 'Create stunning websites with our drag-and-drop builder. No coding required.',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonical: '',
    slug: '/about',
  });

  const [showSchemaBuilder, setShowSchemaBuilder] = useState(false);

  const titleScore = meta.title.length >= 50 && meta.title.length <= 60 ? 'good' : meta.title.length < 30 ? 'bad' : 'warning';
  const descScore = meta.description.length >= 150 && meta.description.length <= 160 ? 'good' : meta.description.length < 120 ? 'bad' : 'warning';

  return (
    <div className="space-y-6">
      {/* SEO Score */}
      <div className="bg-white p-6 rounded-xl border border-surface-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-surface-900">SEO Score</h3>
          <div className={cn(
            'text-2xl font-bold',
            'text-green-600'
          )}>
            82/100
          </div>
        </div>
        <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full" style={{ width: '82%' }} />
        </div>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center">
            <p className="text-xs text-surface-400">Errors</p>
            <p className="text-lg font-bold text-red-500">1</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-surface-400">Warnings</p>
            <p className="text-lg font-bold text-yellow-500">3</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-surface-400">Passed</p>
            <p className="text-lg font-bold text-green-500">12</p>
          </div>
        </div>
      </div>

      {/* Meta Tags */}
      <div className="bg-white p-6 rounded-xl border border-surface-200">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">Meta Tags</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-surface-500">Meta Title</label>
              <span className={cn(
                'text-xs font-medium',
                titleScore === 'good' ? 'text-green-600' : titleScore === 'warning' ? 'text-yellow-600' : 'text-red-600'
              )}>
                {meta.title.length}/60
              </span>
            </div>
            <Input
              value={meta.title}
              onChange={(e) => setMeta({ ...meta, title: e.target.value })}
              placeholder="Page title for search engines"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-surface-500">Meta Description</label>
              <span className={cn(
                'text-xs font-medium',
                descScore === 'good' ? 'text-green-600' : descScore === 'warning' ? 'text-yellow-600' : 'text-red-600'
              )}>
                {meta.description.length}/160
              </span>
            </div>
            <textarea
              value={meta.description}
              onChange={(e) => setMeta({ ...meta, description: e.target.value })}
              className="builder-input h-20 resize-none"
              placeholder="Brief description for search results"
            />
          </div>

          <Input
            label="Custom Slug"
            value={meta.slug}
            onChange={(e) => setMeta({ ...meta, slug: e.target.value })}
            placeholder="/page-url"
          />

          <Input
            label="Canonical URL"
            value={meta.canonical}
            onChange={(e) => setMeta({ ...meta, canonical: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Google Preview */}
      <div className="bg-white p-6 rounded-xl border border-surface-200">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">Google Preview</h3>
        <div className="p-4 bg-white border border-surface-200 rounded-lg">
          <p className="text-lg text-blue-700 hover:underline cursor-pointer truncate">
            {meta.title || 'Page Title'}
          </p>
          <p className="text-sm text-green-700 mt-0.5">
            https://example.com{meta.slug}
          </p>
          <p className="text-sm text-surface-600 mt-1 line-clamp-2">
            {meta.description || 'Add a meta description to see how it appears in search results.'}
          </p>
        </div>
      </div>

      {/* Open Graph */}
      <div className="bg-white p-6 rounded-xl border border-surface-200">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">Social Sharing</h3>
        <div className="space-y-3">
          <Input
            label="OG Title"
            value={meta.ogTitle}
            onChange={(e) => setMeta({ ...meta, ogTitle: e.target.value })}
            placeholder="Title for social media (defaults to meta title)"
          />
          <Input
            label="OG Description"
            value={meta.ogDescription}
            onChange={(e) => setMeta({ ...meta, ogDescription: e.target.value })}
            placeholder="Description for social media"
          />
          <Input
            label="OG Image URL"
            value={meta.ogImage}
            onChange={(e) => setMeta({ ...meta, ogImage: e.target.value })}
            placeholder="https://... (1200x630px recommended)"
          />
        </div>

        {/* Social Preview */}
        <div className="mt-4 border border-surface-200 rounded-lg overflow-hidden">
          <div className="h-32 bg-surface-100 flex items-center justify-center text-surface-400 text-sm">
            {meta.ogImage ? 'OG Image Preview' : 'No image set'}
          </div>
          <div className="p-3 bg-surface-50">
            <p className="text-xs text-surface-400 uppercase">example.com</p>
            <p className="text-sm font-semibold text-surface-900 mt-0.5">
              {meta.ogTitle || meta.title || 'Page Title'}
            </p>
            <p className="text-xs text-surface-500 mt-0.5 line-clamp-2">
              {meta.ogDescription || meta.description || 'Page description'}
            </p>
          </div>
        </div>
      </div>

      {/* Schema Markup */}
      <div className="bg-white p-6 rounded-xl border border-surface-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-surface-900">Schema Markup</h3>
          <Button variant="outline" size="sm" onClick={() => setShowSchemaBuilder(!showSchemaBuilder)}>
            {showSchemaBuilder ? 'Close' : 'Add Schema'}
          </Button>
        </div>
        {showSchemaBuilder && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {['Organization', 'Article', 'Product', 'FAQ', 'Breadcrumb', 'LocalBusiness'].map(type => (
                <button
                  key={type}
                  className="p-3 text-left border border-surface-200 rounded-lg hover:border-brand-300 hover:bg-brand-50 transition-colors"
                >
                  <p className="text-sm font-medium text-surface-700">{type}</p>
                  <p className="text-[10px] text-surface-400">Add {type} structured data</p>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="success">Active</Badge>
            <span className="text-surface-600">Organization schema</span>
          </div>
        </div>
      </div>

      {/* Redirects */}
      <div className="bg-white p-6 rounded-xl border border-surface-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-surface-900">301 Redirects</h3>
          <Button variant="outline" size="sm">+ Add Redirect</Button>
        </div>
        <div className="space-y-2">
          {[
            { from: '/old-page', to: '/new-page' },
            { from: '/blog/old-post', to: '/blog/updated-post' },
          ].map(r => (
            <div key={r.from} className="flex items-center gap-2 p-2 bg-surface-50 rounded-lg text-sm">
              <span className="text-surface-600 font-mono text-xs">{r.from}</span>
              <span className="text-surface-400">→</span>
              <span className="text-brand-600 font-mono text-xs">{r.to}</span>
              <Badge>301</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Sitemap & Robots */}
      <div className="bg-white p-6 rounded-xl border border-surface-200">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">Sitemap & Robots</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
            <div>
              <p className="text-sm font-medium">Auto Sitemap</p>
              <p className="text-xs text-surface-400">Automatically generated at /sitemap.xml</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div>
            <label className="text-xs font-medium text-surface-500 mb-1 block">Robots.txt</label>
            <textarea
              className="builder-input font-mono text-xs h-24 resize-none"
              defaultValue={`User-agent: *\nAllow: /\n\nSitemap: /sitemap.xml`}
            />
          </div>
        </div>
      </div>

      {/* Core Web Vitals */}
      <div className="bg-white p-6 rounded-xl border border-surface-200">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">Core Web Vitals</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: 'LCP', value: '1.2s', status: 'good', target: '< 2.5s' },
            { name: 'FID', value: '45ms', status: 'good', target: '< 100ms' },
            { name: 'CLS', value: '0.05', status: 'good', target: '< 0.1' },
          ].map(metric => (
            <div key={metric.name} className="text-center p-3 bg-surface-50 rounded-lg">
              <p className="text-xs text-surface-400">{metric.name}</p>
              <p className={cn(
                'text-xl font-bold mt-1',
                metric.status === 'good' ? 'text-green-600' : 'text-yellow-600'
              )}>
                {metric.value}
              </p>
              <p className="text-[10px] text-surface-400 mt-0.5">Target: {metric.target}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lighthouse Preview */}
      <div className="bg-white p-6 rounded-xl border border-surface-200">
        <h3 className="text-sm font-semibold text-surface-900 mb-4">Lighthouse Score Preview</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { name: 'Performance', score: 98 },
            { name: 'Accessibility', score: 95 },
            { name: 'Best Practices', score: 100 },
            { name: 'SEO', score: 92 },
          ].map(item => (
            <div key={item.name} className="text-center">
              <div className={cn(
                'w-14 h-14 mx-auto rounded-full border-4 flex items-center justify-center font-bold text-lg',
                item.score >= 90 ? 'border-green-500 text-green-600' :
                item.score >= 50 ? 'border-yellow-500 text-yellow-600' :
                'border-red-500 text-red-600'
              )}>
                {item.score}
              </div>
              <p className="text-xs text-surface-500 mt-2">{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
