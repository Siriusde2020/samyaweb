'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/lib/store/builder-store';
import { cn } from '@/lib/utils';

interface BlockDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail?: string;
}

const BLOCK_CATEGORIES = [
  { id: 'all', label: 'All Blocks', icon: '🧩' },
  { id: 'hero', label: 'Hero', icon: '🦸' },
  { id: 'features', label: 'Features', icon: '⭐' },
  { id: 'testimonials', label: 'Testimonials', icon: '💬' },
  { id: 'cta', label: 'Call to Action', icon: '📣' },
  { id: 'pricing', label: 'Pricing', icon: '💰' },
  { id: 'faq', label: 'FAQ', icon: '❓' },
  { id: 'navbar', label: 'Navigation', icon: '🧭' },
  { id: 'footer', label: 'Footer', icon: '📄' },
  { id: 'content', label: 'Content', icon: '📰' },
  { id: 'contact', label: 'Contact', icon: '📧' },
  { id: 'ecommerce', label: 'E-Commerce', icon: '🛒' },
];

const BLOCKS: BlockDefinition[] = [
  // Hero
  { id: 'heroSplitImage', name: 'Split Hero', category: 'hero', description: 'Text left, image right with gradient heading' },
  { id: 'heroFullscreen', name: 'Fullscreen Hero', category: 'hero', description: 'Full viewport with background image overlay' },
  { id: 'heroMinimal', name: 'Minimal Hero', category: 'hero', description: 'Clean minimal with large heading' },
  { id: 'heroVideo', name: 'Video Hero', category: 'hero', description: 'Video background with overlay' },
  { id: 'heroGradient', name: 'Gradient Hero', category: 'hero', description: 'Animated gradient with email signup' },
  { id: 'heroCreative', name: 'Creative Hero', category: 'hero', description: 'Asymmetric layout with shapes' },
  // Features
  { id: 'featuresGrid3', name: '3-Column Features', category: 'features', description: '3-column grid with icons' },
  { id: 'featuresGrid4', name: '4-Column Features', category: 'features', description: '4-column with colored icons' },
  { id: 'featuresAlternating', name: 'Alternating Features', category: 'features', description: 'Left/right image + text' },
  { id: 'featuresShowcase', name: 'Feature Showcase', category: 'features', description: 'Large centered feature highlight' },
  // Testimonials
  { id: 'testimonialCards', name: 'Testimonial Cards', category: 'testimonials', description: '3-column cards with avatars' },
  { id: 'testimonialLarge', name: 'Large Quote', category: 'testimonials', description: 'Single large testimonial' },
  { id: 'testimonialGrid', name: 'Testimonial Grid', category: 'testimonials', description: '2x2 grid with ratings' },
  // CTA
  { id: 'ctaBanner', name: 'CTA Banner', category: 'cta', description: 'Full-width colored banner' },
  { id: 'ctaNewsletter', name: 'Newsletter CTA', category: 'cta', description: 'Email signup with button' },
  { id: 'ctaMinimal', name: 'Minimal CTA', category: 'cta', description: 'Simple centered call to action' },
  // Pricing
  { id: 'pricingThreeColumn', name: '3-Tier Pricing', category: 'pricing', description: 'Three pricing plans' },
  { id: 'pricingTwoColumn', name: '2-Plan Pricing', category: 'pricing', description: 'Two plans with toggle' },
  // FAQ
  { id: 'faqAccordion', name: 'FAQ Accordion', category: 'faq', description: 'Expandable FAQ items' },
  { id: 'faqTwoColumn', name: '2-Column FAQ', category: 'faq', description: 'Two-column FAQ layout' },
  // Navbar
  { id: 'navbarSimple', name: 'Simple Navbar', category: 'navbar', description: 'Logo, links, CTA button' },
  { id: 'navbarCentered', name: 'Centered Navbar', category: 'navbar', description: 'Centered logo with links' },
  { id: 'navbarDark', name: 'Dark Navbar', category: 'navbar', description: 'Dark background with glow' },
  // Footer
  { id: 'footerMultiColumn', name: 'Multi-Column Footer', category: 'footer', description: '4-column with social links' },
  { id: 'footerMinimal', name: 'Minimal Footer', category: 'footer', description: 'Simple centered footer' },
  { id: 'footerNewsletter', name: 'Newsletter Footer', category: 'footer', description: 'Footer with newsletter signup' },
  // Content
  { id: 'statsCounter', name: 'Stats Counter', category: 'content', description: '4 big number statistics' },
  { id: 'logoCloud', name: 'Logo Cloud', category: 'content', description: 'Trusted by companies logos' },
  { id: 'teamGrid', name: 'Team Grid', category: 'content', description: 'Team members with avatars' },
  { id: 'timeline', name: 'Timeline', category: 'content', description: 'Vertical timeline events' },
  // Contact
  { id: 'contactForm', name: 'Contact Form', category: 'contact', description: 'Name, email, message form' },
  { id: 'contactSplit', name: 'Split Contact', category: 'contact', description: 'Info left, form right' },
  // E-Commerce
  { id: 'productGrid', name: 'Product Grid', category: 'ecommerce', description: '3-column product cards' },
  { id: 'featuredProduct', name: 'Featured Product', category: 'ecommerce', description: 'Large featured product' },
];

// Gradient colors for block thumbnails
const CATEGORY_GRADIENTS: Record<string, string> = {
  hero: 'from-indigo-500 to-purple-600',
  features: 'from-emerald-500 to-teal-600',
  testimonials: 'from-amber-500 to-orange-600',
  cta: 'from-rose-500 to-pink-600',
  pricing: 'from-blue-500 to-cyan-600',
  faq: 'from-violet-500 to-purple-600',
  navbar: 'from-slate-600 to-zinc-700',
  footer: 'from-gray-600 to-slate-700',
  content: 'from-sky-500 to-blue-600',
  contact: 'from-teal-500 to-emerald-600',
  ecommerce: 'from-fuchsia-500 to-pink-600',
};

export function BlocksPanel() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { addElement, elements, rootElementIds } = useBuilderStore();

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

      // Merge block elements into the current canvas
      const store = useBuilderStore.getState();
      const merged = { ...store.elements, ...blockElements };
      const mergedRootIds = [...store.rootElementIds, ...rootIds];
      store.loadPage(merged, mergedRootIds);
    } catch {
      // Fallback: add a simple section
      addElement('section', undefined);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-surface-200">
        <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Pre-Built Blocks</h3>
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
        <div className="flex gap-1 flex-nowrap">
          {BLOCK_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                'px-2 py-1 text-[10px] rounded-md whitespace-nowrap transition-colors',
                activeCategory === cat.id
                  ? 'bg-brand-600 text-white'
                  : 'text-surface-500 hover:bg-surface-100'
              )}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Block Grid */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="grid grid-cols-2 gap-2">
          {filtered.map(block => {
            const gradient = CATEGORY_GRADIENTS[block.category] || 'from-gray-400 to-gray-500';
            return (
              <button
                key={block.id}
                onClick={() => handleAddBlock(block.id)}
                className="group border border-surface-200 rounded-lg overflow-hidden hover:border-brand-300 hover:shadow-md transition-all text-left"
              >
                <div className={cn('h-16 bg-gradient-to-br flex items-center justify-center', gradient)}>
                  <span className="text-white text-lg opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                    {BLOCK_CATEGORIES.find(c => c.id === block.category)?.icon || '🧩'}
                  </span>
                </div>
                <div className="p-2">
                  <h4 className="text-[11px] font-medium text-surface-800 group-hover:text-brand-600 transition-colors truncate">
                    {block.name}
                  </h4>
                  <p className="text-[9px] text-surface-400 mt-0.5 truncate">{block.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="py-8 text-center text-xs text-surface-400">
            No blocks found matching your search
          </div>
        )}
      </div>
    </div>
  );
}
