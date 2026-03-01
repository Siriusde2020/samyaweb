'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TemplatePreview {
  id: string;
  name: string;
  category: string;
  industry: string;
  thumbnail: string;
  description: string;
  featured: boolean;
}

const templates: TemplatePreview[] = [
  { id: 'saas-1', name: 'SaaS Pro', category: 'saas', industry: 'Technology', thumbnail: '', description: 'Modern SaaS landing page with pricing and features', featured: true },
  { id: 'portfolio-1', name: 'Creative Portfolio', category: 'portfolio', industry: 'Design', thumbnail: '', description: 'Minimal portfolio for designers and creators', featured: true },
  { id: 'ecom-1', name: 'Shop Modern', category: 'ecommerce', industry: 'Retail', thumbnail: '', description: 'Full e-commerce store with product catalog', featured: true },
  { id: 'blog-1', name: 'Blog Standard', category: 'blog', industry: 'Media', thumbnail: '', description: 'Clean blog layout with CMS integration', featured: false },
  { id: 'agency-1', name: 'Agency Bold', category: 'agency', industry: 'Marketing', thumbnail: '', description: 'Bold agency website with case studies', featured: true },
  { id: 'corp-1', name: 'Corporate Plus', category: 'corporate', industry: 'Finance', thumbnail: '', description: 'Professional corporate website template', featured: false },
  { id: 'startup-1', name: 'Launch Pad', category: 'startup', industry: 'Technology', thumbnail: '', description: 'Startup landing page with waitlist', featured: true },
  { id: 'rest-1', name: 'Bistro', category: 'restaurant', industry: 'Food', thumbnail: '', description: 'Restaurant website with menu and reservations', featured: false },
  { id: 'travel-1', name: 'Wanderlust', category: 'travel', industry: 'Travel', thumbnail: '', description: 'Travel blog and booking site', featured: false },
  { id: 'law-1', name: 'Legal Pro', category: 'law', industry: 'Legal', thumbnail: '', description: 'Law firm website with practice areas', featured: false },
  { id: 'medical-1', name: 'MediCare', category: 'medical', industry: 'Healthcare', thumbnail: '', description: 'Medical practice website with appointment booking', featured: false },
  { id: 'edu-1', name: 'EduPlatform', category: 'education', industry: 'Education', thumbnail: '', description: 'Online course platform template', featured: false },
  { id: 'landing-1', name: 'ConvertMax', category: 'landing', industry: 'Marketing', thumbnail: '', description: 'High-converting landing page', featured: true },
  { id: 'onepage-1', name: 'OneScroll', category: 'onepage', industry: 'General', thumbnail: '', description: 'Single-page scrolling website', featured: false },
  { id: 'nonprofit-1', name: 'CauseForward', category: 'nonprofit', industry: 'Nonprofit', thumbnail: '', description: 'Nonprofit organization website', featured: false },
  { id: 'personal-1', name: 'PersonalBrand', category: 'personal', industry: 'Personal', thumbnail: '', description: 'Personal branding website', featured: false },
];

const categories = [
  { id: 'all', label: 'All Templates' },
  { id: 'featured', label: 'Featured' },
  { id: 'saas', label: 'SaaS' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'ecommerce', label: 'E-Commerce' },
  { id: 'blog', label: 'Blog' },
  { id: 'landing', label: 'Landing Page' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'startup', label: 'Startup' },
  { id: 'agency', label: 'Agency' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'travel', label: 'Travel' },
  { id: 'law', label: 'Law' },
  { id: 'medical', label: 'Medical' },
  { id: 'education', label: 'Education' },
];

export function TemplateGallery({ onSelect }: { onSelect: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = templates.filter(t => {
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.industry.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || (activeCategory === 'featured' ? t.featured : t.category === activeCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Search & Filter */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="builder-input pl-9"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              'px-3 py-1.5 text-sm rounded-lg transition-colors',
              activeCategory === cat.id
                ? 'bg-brand-600 text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Blank Template */}
        <button
          onClick={() => onSelect('blank')}
          className="group border-2 border-dashed border-surface-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-brand-400 hover:bg-brand-50 transition-colors min-h-[240px]"
        >
          <div className="w-12 h-12 rounded-xl bg-surface-100 group-hover:bg-brand-100 flex items-center justify-center text-2xl mb-3 transition-colors">
            +
          </div>
          <span className="font-medium text-surface-700 group-hover:text-brand-600">Blank Site</span>
          <span className="text-xs text-surface-400 mt-1">Start from scratch</span>
        </button>

        {filtered.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="group border border-surface-200 rounded-xl overflow-hidden hover:border-brand-300 hover:shadow-lg transition-all text-left"
          >
            <div className="h-40 bg-gradient-to-br from-surface-100 to-surface-200 relative">
              {template.featured && (
                <span className="absolute top-2 right-2 px-2 py-0.5 bg-brand-600 text-white text-[10px] font-medium rounded-full">
                  Featured
                </span>
              )}
              <div className="absolute inset-0 bg-brand-600/0 group-hover:bg-brand-600/10 flex items-center justify-center transition-colors">
                <span className="opacity-0 group-hover:opacity-100 px-4 py-2 bg-white text-brand-600 text-sm font-medium rounded-lg shadow-lg transition-opacity">
                  Use Template
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-surface-900 group-hover:text-brand-600 transition-colors">
                {template.name}
              </h3>
              <p className="text-xs text-surface-500 mt-1">{template.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 bg-surface-100 rounded-full text-surface-500">
                  {template.industry}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
