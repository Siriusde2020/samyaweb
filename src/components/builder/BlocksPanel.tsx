'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/lib/store/builder-store';
import { cn } from '@/lib/utils';

interface BlockDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
}

const BLOCK_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'hero', label: 'Hero' },
  { id: 'navbar', label: 'Navigation' },
  { id: 'features', label: 'Features' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'cta', label: 'CTA' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
  { id: 'content', label: 'Content' },
  { id: 'contact', label: 'Contact' },
  { id: 'footer', label: 'Footer' },
  { id: 'ecommerce', label: 'E-Commerce' },
];

const BLOCKS: BlockDefinition[] = [
  // Hero (6 unique)
  { id: 'heroSplitImage', name: 'Split Hero', category: 'hero', description: 'Text left, image right with gradient' },
  { id: 'heroFullscreen', name: 'Fullscreen Hero', category: 'hero', description: 'Full viewport dark overlay' },
  { id: 'heroMinimal', name: 'Minimal Hero', category: 'hero', description: 'Clean centered large heading' },
  { id: 'heroVideo', name: 'Video Hero', category: 'hero', description: 'Video background with overlay' },
  { id: 'heroGradient', name: 'Gradient Hero', category: 'hero', description: 'Gradient with email signup' },
  { id: 'heroCreative', name: 'Creative Hero', category: 'hero', description: 'Asymmetric with floating shapes' },
  // Navbar (3 unique)
  { id: 'navbarSimple', name: 'Simple Navbar', category: 'navbar', description: 'Logo, links, CTA button' },
  { id: 'navbarCentered', name: 'Centered Navbar', category: 'navbar', description: 'Centered logo with links' },
  { id: 'navbarDark', name: 'Dark Navbar', category: 'navbar', description: 'Dark background navigation' },
  // Features (4 unique)
  { id: 'featuresGrid3', name: '3-Column Features', category: 'features', description: 'Icon cards in 3-column grid' },
  { id: 'featuresGrid4', name: '4-Column Features', category: 'features', description: 'Compact 4-column layout' },
  { id: 'featuresAlternating', name: 'Alternating', category: 'features', description: 'Image + text alternating rows' },
  { id: 'featuresShowcase', name: 'Showcase', category: 'features', description: 'Large centered highlight' },
  // Testimonials (3 unique)
  { id: 'testimonialCards', name: 'Card Testimonials', category: 'testimonials', description: '3 cards with avatars & stars' },
  { id: 'testimonialLarge', name: 'Large Quote', category: 'testimonials', description: 'Single large blockquote' },
  { id: 'testimonialGrid', name: '2x2 Grid', category: 'testimonials', description: '4 testimonials in grid' },
  // CTA (3 unique)
  { id: 'ctaBanner', name: 'CTA Banner', category: 'cta', description: 'Full-width gradient banner' },
  { id: 'ctaNewsletter', name: 'Newsletter', category: 'cta', description: 'Email signup with subscribe' },
  { id: 'ctaMinimal', name: 'Minimal CTA', category: 'cta', description: 'Clean centered call to action' },
  // Pricing (2 unique)
  { id: 'pricingThreeColumn', name: '3-Tier Pricing', category: 'pricing', description: 'Starter, Pro, Enterprise' },
  { id: 'pricingTwoColumn', name: '2-Plan Pricing', category: 'pricing', description: 'Free vs Pro comparison' },
  // FAQ (2 unique)
  { id: 'faqAccordion', name: 'Accordion FAQ', category: 'faq', description: 'Expandable question items' },
  { id: 'faqTwoColumn', name: '2-Column FAQ', category: 'faq', description: 'Side-by-side Q&A layout' },
  // Content (4 unique)
  { id: 'statsCounter', name: 'Stats Counter', category: 'content', description: '4 big number statistics' },
  { id: 'logoCloud', name: 'Logo Cloud', category: 'content', description: 'Trusted by companies' },
  { id: 'teamGrid', name: 'Team Grid', category: 'content', description: 'Team members with bios' },
  { id: 'timeline', name: 'Timeline', category: 'content', description: 'Vertical timeline events' },
  // Contact (2 unique)
  { id: 'contactForm', name: 'Contact Form', category: 'contact', description: 'Info left, form right' },
  { id: 'contactSplit', name: 'Split Contact', category: 'contact', description: 'Dark info + white form' },
  // Footer (3 unique)
  { id: 'footerMultiColumn', name: 'Multi-Column', category: 'footer', description: '4 columns with social icons' },
  { id: 'footerMinimal', name: 'Minimal Footer', category: 'footer', description: 'Simple single-row footer' },
  { id: 'footerNewsletter', name: 'Newsletter Footer', category: 'footer', description: 'Footer with email signup' },
  // E-Commerce (2 unique)
  { id: 'productGrid', name: 'Product Grid', category: 'ecommerce', description: '3-column product cards' },
  { id: 'featuredProduct', name: 'Featured Product', category: 'ecommerce', description: 'Large product showcase' },
];

// Solid brand colors for category thumbnails (more polished than gradients)
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  hero: { bg: 'bg-indigo-600', text: 'text-indigo-100' },
  features: { bg: 'bg-emerald-600', text: 'text-emerald-100' },
  testimonials: { bg: 'bg-amber-600', text: 'text-amber-100' },
  cta: { bg: 'bg-rose-600', text: 'text-rose-100' },
  pricing: { bg: 'bg-blue-600', text: 'text-blue-100' },
  faq: { bg: 'bg-violet-600', text: 'text-violet-100' },
  navbar: { bg: 'bg-slate-700', text: 'text-slate-200' },
  footer: { bg: 'bg-slate-800', text: 'text-slate-300' },
  content: { bg: 'bg-sky-600', text: 'text-sky-100' },
  contact: { bg: 'bg-teal-600', text: 'text-teal-100' },
  ecommerce: { bg: 'bg-fuchsia-600', text: 'text-fuchsia-100' },
};

// Mini wireframe SVGs for block previews
const blockPreviews: Record<string, JSX.Element> = {
  heroSplitImage: <svg viewBox="0 0 80 40" fill="none"><rect x="4" y="10" width="30" height="3" rx="1" fill="currentColor" opacity="0.8" /><rect x="4" y="16" width="24" height="2" rx="1" fill="currentColor" opacity="0.4" /><rect x="4" y="22" width="14" height="4" rx="2" fill="currentColor" opacity="0.6" /><rect x="46" y="6" width="30" height="28" rx="3" fill="currentColor" opacity="0.15" /></svg>,
  heroFullscreen: <svg viewBox="0 0 80 40" fill="none"><rect x="0" y="0" width="80" height="40" fill="currentColor" opacity="0.08" /><rect x="20" y="12" width="40" height="3" rx="1" fill="currentColor" opacity="0.8" /><rect x="26" y="18" width="28" height="2" rx="1" fill="currentColor" opacity="0.4" /><rect x="30" y="24" width="20" height="4" rx="2" fill="currentColor" opacity="0.6" /></svg>,
  heroMinimal: <svg viewBox="0 0 80 40" fill="none"><rect x="14" y="12" width="52" height="4" rx="1" fill="currentColor" opacity="0.8" /><rect x="22" y="20" width="36" height="2" rx="1" fill="currentColor" opacity="0.3" /><rect x="30" y="28" width="20" height="4" rx="2" fill="currentColor" opacity="0.5" /></svg>,
  heroVideo: <svg viewBox="0 0 80 40" fill="none"><rect x="0" y="0" width="80" height="40" fill="currentColor" opacity="0.1" /><polygon points="36,14 36,26 48,20" fill="currentColor" opacity="0.4" /><rect x="24" y="30" width="32" height="3" rx="1" fill="currentColor" opacity="0.6" /></svg>,
  heroGradient: <svg viewBox="0 0 80 40" fill="none"><rect x="0" y="0" width="80" height="40" rx="2" fill="currentColor" opacity="0.12" /><rect x="20" y="10" width="40" height="3" rx="1" fill="currentColor" opacity="0.7" /><rect x="18" y="20" width="30" height="5" rx="2" fill="currentColor" opacity="0.1" /><rect x="50" y="20" width="12" height="5" rx="2" fill="currentColor" opacity="0.5" /></svg>,
  heroCreative: <svg viewBox="0 0 80 40" fill="none"><rect x="4" y="8" width="36" height="4" rx="1" fill="currentColor" opacity="0.8" /><rect x="4" y="16" width="28" height="2" rx="1" fill="currentColor" opacity="0.3" /><circle cx="62" cy="12" r="8" fill="currentColor" opacity="0.08" /><circle cx="70" cy="28" r="5" fill="currentColor" opacity="0.06" /></svg>,
  navbarSimple: <svg viewBox="0 0 80 40" fill="none"><rect x="0" y="12" width="80" height="16" fill="currentColor" opacity="0.04" /><rect x="4" y="18" width="12" height="3" rx="1" fill="currentColor" opacity="0.7" /><rect x="28" y="19" width="6" height="2" rx="1" fill="currentColor" opacity="0.3" /><rect x="38" y="19" width="6" height="2" rx="1" fill="currentColor" opacity="0.3" /><rect x="48" y="19" width="6" height="2" rx="1" fill="currentColor" opacity="0.3" /><rect x="64" y="18" width="12" height="4" rx="2" fill="currentColor" opacity="0.5" /></svg>,
};

export function BlocksPanel() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { addElement } = useBuilderStore();

  const filtered = BLOCKS.filter(b => {
    const matchesSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || b.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddBlock = async (blockId: string) => {
    try {
      const { getBlock } = await import('@/lib/blocks');
      const blockData = getBlock(blockId);
      if (!blockData) return;

      const { elements: blockElements, rootIds } = blockData;
      const store = useBuilderStore.getState();
      const merged = { ...store.elements, ...blockElements };
      const mergedRootIds = [...store.rootElementIds, ...rootIds];
      store.loadPage(merged, mergedRootIds);
    } catch {
      addElement('section', undefined);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-surface-200">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-surface-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search blocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="builder-input pl-8 text-xs"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="p-2 border-b border-surface-200 overflow-x-auto">
        <div className="flex gap-1 flex-wrap">
          {BLOCK_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'px-2 py-1 text-[10px] font-medium rounded-md whitespace-nowrap transition-colors',
                activeCategory === cat.id
                  ? 'bg-brand-600 text-white'
                  : 'text-surface-600 hover:bg-surface-100'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Block Grid */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-2">
          {filtered.map(block => {
            const colors = CATEGORY_COLORS[block.category] || { bg: 'bg-gray-500', text: 'text-gray-100' };
            const preview = blockPreviews[block.id];
            return (
              <button
                key={block.id}
                onClick={() => handleAddBlock(block.id)}
                className="group border border-surface-200 rounded-lg overflow-hidden hover:border-brand-400 hover:shadow-md transition-all text-left"
              >
                <div className={cn('h-14 flex items-center justify-center', colors.bg)}>
                  {preview ? (
                    <span className={cn('w-full h-full p-1', colors.text)}>{preview}</span>
                  ) : (
                    <span className={cn('text-[10px] font-medium uppercase tracking-wider', colors.text)}>
                      {block.category}
                    </span>
                  )}
                </div>
                <div className="p-2">
                  <h4 className="text-[11px] font-semibold text-surface-800 group-hover:text-brand-600 transition-colors truncate">
                    {block.name}
                  </h4>
                  <p className="text-[9px] text-surface-500 mt-0.5 truncate">{block.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-8 text-center text-xs text-surface-500">
            No blocks found matching your search
          </div>
        )}
      </div>
    </div>
  );
}
