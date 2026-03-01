'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface Plugin {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  author: string;
  rating: number;
  installs: number;
  price: number;
  installed: boolean;
}

const plugins: Plugin[] = [
  { id: 'ga', name: 'Google Analytics', description: 'Track website traffic and user behavior with Google Analytics integration', category: 'Analytics', icon: '📊', author: 'JAMStack', rating: 4.8, installs: 12450, price: 0, installed: true },
  { id: 'mailchimp', name: 'Mailchimp', description: 'Connect your email lists and automate marketing campaigns', category: 'Marketing', icon: '📧', author: 'JAMStack', rating: 4.6, installs: 8920, price: 0, installed: false },
  { id: 'hotjar', name: 'Hotjar', description: 'Heatmaps, recordings, and feedback for your website', category: 'Analytics', icon: '🔥', author: 'Community', rating: 4.5, installs: 6340, price: 0, installed: false },
  { id: 'chat', name: 'Live Chat Widget', description: 'Real-time customer support chat widget', category: 'Support', icon: '💬', author: 'JAMStack', rating: 4.7, installs: 5670, price: 9.99, installed: false },
  { id: 'seo-pro', name: 'SEO Toolkit Pro', description: 'Advanced SEO analysis, keyword tracking, and backlink monitoring', category: 'SEO', icon: '🔍', author: 'SEO Tools Inc', rating: 4.9, installs: 7890, price: 14.99, installed: true },
  { id: 'social', name: 'Social Feed', description: 'Embed Instagram, Twitter, and Facebook feeds on your site', category: 'Social', icon: '📱', author: 'Community', rating: 4.3, installs: 3450, price: 0, installed: false },
  { id: 'forms-pro', name: 'Advanced Forms', description: 'Multi-step forms, conditional logic, file uploads, and more', category: 'Forms', icon: '📋', author: 'JAMStack', rating: 4.6, installs: 4560, price: 7.99, installed: false },
  { id: 'backup', name: 'Auto Backup', description: 'Automatic daily backups with one-click restore', category: 'Tools', icon: '💾', author: 'JAMStack', rating: 4.8, installs: 6780, price: 4.99, installed: true },
  { id: 'pwa', name: 'PWA Builder', description: 'Convert your website to a Progressive Web App with push notifications', category: 'Mobile', icon: '📲', author: 'JAMStack', rating: 4.4, installs: 2340, price: 9.99, installed: false },
  { id: 'i18n', name: 'Multi-Language', description: 'Add multiple languages with auto-translation and language switcher', category: 'i18n', icon: '🌍', author: 'JAMStack', rating: 4.5, installs: 3210, price: 12.99, installed: false },
  { id: 'members', name: 'Membership Portal', description: 'Add member login, gated content, and subscription billing', category: 'Membership', icon: '🔐', author: 'JAMStack', rating: 4.7, installs: 4560, price: 19.99, installed: false },
  { id: 'course', name: 'Course Builder', description: 'Create and sell online courses with progress tracking', category: 'Education', icon: '🎓', author: 'EduTech', rating: 4.6, installs: 1890, price: 24.99, installed: false },
];

const categories = ['All', ...new Set(plugins.map(p => p.category))];

export function PluginMarketplace() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showInstalled, setShowInstalled] = useState(false);

  const filtered = plugins.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || p.category === category;
    const matchInstalled = !showInstalled || p.installed;
    return matchSearch && matchCategory && matchInstalled;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-surface-900">App Marketplace</h2>
          <p className="text-sm text-surface-500">Extend your site with plugins and integrations</p>
        </div>
        <div className="flex gap-2">
          <Button variant={showInstalled ? 'primary' : 'outline'} size="sm" onClick={() => setShowInstalled(!showInstalled)}>
            Installed ({plugins.filter(p => p.installed).length})
          </Button>
          <Button variant="outline" size="sm">Developer SDK</Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Search plugins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <div className="flex flex-wrap gap-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3 py-1.5 text-xs rounded-lg transition-colors',
                category === cat ? 'bg-brand-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Plugin Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(plugin => (
          <div key={plugin.id} className="bg-white p-5 rounded-xl border border-surface-200 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{plugin.icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-surface-900">{plugin.name}</h3>
                  {plugin.installed && <Badge variant="success">Installed</Badge>}
                </div>
                <p className="text-xs text-surface-400">by {plugin.author}</p>
              </div>
            </div>
            <p className="text-sm text-surface-500 mb-4 line-clamp-2">{plugin.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-surface-400">
                <span>★ {plugin.rating}</span>
                <span>{plugin.installs.toLocaleString()} installs</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {plugin.price === 0 ? 'Free' : `$${plugin.price}/mo`}
                </span>
                <Button
                  variant={plugin.installed ? 'outline' : 'primary'}
                  size="sm"
                >
                  {plugin.installed ? 'Settings' : 'Install'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
