'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/lib/store/builder-store';
import type { ElementType } from '@/types/builder';
import { cn } from '@/lib/utils';

interface ElementDef {
  type: ElementType;
  label: string;
  icon: string;
  category: string;
}

const elements: ElementDef[] = [
  // Layout
  { type: 'section', label: 'Section', icon: '☐', category: 'Layout' },
  { type: 'container', label: 'Container', icon: '⊡', category: 'Layout' },
  { type: 'columns', label: 'Columns', icon: '▥', category: 'Layout' },
  { type: 'divider', label: 'Divider', icon: '—', category: 'Layout' },
  { type: 'spacer', label: 'Spacer', icon: '↕', category: 'Layout' },

  // Basic
  { type: 'heading', label: 'Heading', icon: 'H', category: 'Basic' },
  { type: 'text', label: 'Text', icon: 'T', category: 'Basic' },
  { type: 'image', label: 'Image', icon: '🖼', category: 'Basic' },
  { type: 'video', label: 'Video', icon: '▶', category: 'Basic' },
  { type: 'button', label: 'Button', icon: '⬛', category: 'Basic' },
  { type: 'link', label: 'Link', icon: '🔗', category: 'Basic' },
  { type: 'icon', label: 'Icon', icon: '★', category: 'Basic' },
  { type: 'shape', label: 'Shape', icon: '◆', category: 'Basic' },

  // Forms
  { type: 'form', label: 'Form', icon: '📋', category: 'Forms' },
  { type: 'input', label: 'Input', icon: '▭', category: 'Forms' },
  { type: 'textarea', label: 'Textarea', icon: '▯', category: 'Forms' },
  { type: 'select', label: 'Select', icon: '▾', category: 'Forms' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑', category: 'Forms' },

  // Sections
  { type: 'hero', label: 'Hero', icon: '🦸', category: 'Sections' },
  { type: 'navbar', label: 'Navbar', icon: '☰', category: 'Sections' },
  { type: 'footer', label: 'Footer', icon: '⊥', category: 'Sections' },
  { type: 'cta', label: 'CTA', icon: '📢', category: 'Sections' },
  { type: 'feature-grid', label: 'Features', icon: '⊞', category: 'Sections' },
  { type: 'testimonial', label: 'Testimonial', icon: '💬', category: 'Sections' },
  { type: 'pricing-table', label: 'Pricing', icon: '💰', category: 'Sections' },

  // Advanced
  { type: 'accordion', label: 'Accordion', icon: '≡', category: 'Advanced' },
  { type: 'tabs', label: 'Tabs', icon: '⊟', category: 'Advanced' },
  { type: 'slider', label: 'Slider', icon: '⟷', category: 'Advanced' },
  { type: 'gallery', label: 'Gallery', icon: '⊞', category: 'Advanced' },
  { type: 'countdown', label: 'Countdown', icon: '⏱', category: 'Advanced' },
  { type: 'map', label: 'Map', icon: '📍', category: 'Advanced' },
  { type: 'embed', label: 'Embed', icon: '<>', category: 'Advanced' },
  { type: 'code', label: 'Code', icon: '{}', category: 'Advanced' },

  // Commerce
  { type: 'product-card', label: 'Product Card', icon: '🛍', category: 'Commerce' },
  { type: 'cart-button', label: 'Cart Button', icon: '🛒', category: 'Commerce' },
  { type: 'collection-list', label: 'Collection', icon: '📑', category: 'Commerce' },

  // Social
  { type: 'social-links', label: 'Social Links', icon: '📱', category: 'Social' },
  { type: 'search', label: 'Search', icon: '🔍', category: 'Social' },
];

const categories = [...new Set(elements.map(e => e.category))];

export function ElementsPanel() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { addElement, selectedElementId } = useBuilderStore();

  const filteredElements = elements.filter(el => {
    if (search) {
      return el.label.toLowerCase().includes(search.toLowerCase());
    }
    if (activeCategory) {
      return el.category === activeCategory;
    }
    return true;
  });

  const grouped = activeCategory || search
    ? { [activeCategory || 'Results']: filteredElements }
    : categories.reduce((acc, cat) => {
        acc[cat] = elements.filter(e => e.category === cat);
        return acc;
      }, {} as Record<string, ElementDef[]>);

  const handleAdd = (type: ElementType) => {
    addElement(type, selectedElementId || undefined);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-surface-200 dark:border-surface-700">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search elements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="builder-input pl-8 text-xs"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-1 p-3 border-b border-surface-200 dark:border-surface-700">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            'px-2 py-0.5 text-xs rounded-md transition-colors',
            !activeCategory ? 'bg-brand-100 text-brand-700' : 'text-surface-500 hover:bg-surface-100'
          )}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={cn(
              'px-2 py-0.5 text-xs rounded-md transition-colors',
              activeCategory === cat ? 'bg-brand-100 text-brand-700' : 'text-surface-500 hover:bg-surface-100'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Elements Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="mb-4">
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-2">
              {category}
            </h3>
            <div className="grid grid-cols-2 gap-1.5">
              {items.map(el => (
                <button
                  key={el.type}
                  onClick={() => handleAdd(el.type)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('elementType', el.type);
                  }}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-lg border border-surface-200 dark:border-surface-700 hover:border-brand-300 hover:bg-brand-50 dark:hover:bg-brand-900/20 cursor-grab active:cursor-grabbing transition-colors group"
                >
                  <span className="text-lg group-hover:scale-110 transition-transform">{el.icon}</span>
                  <span className="text-[10px] text-surface-500 group-hover:text-brand-600 font-medium">
                    {el.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
