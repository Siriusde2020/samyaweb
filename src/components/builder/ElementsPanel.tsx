'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/lib/store/builder-store';
import type { ElementType } from '@/types/builder';
import { cn } from '@/lib/utils';

// SVG icon components for clean, professional look
const icons: Record<string, JSX.Element> = {
  section: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /></svg>,
  container: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2" /></svg>,
  columns: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><line x1="9" y1="4" x2="9" y2="20" /><line x1="15" y1="4" x2="15" y2="20" /></svg>,
  column: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="3" width="12" height="18" rx="2" /></svg>,
  divider: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12" /></svg>,
  spacer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19" /><polyline points="8 8 12 5 16 8" /><polyline points="8 16 12 19 16 16" /></svg>,
  heading: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 5v14M20 5v14M4 12h16" /></svg>,
  text: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 7V4h16v3M9 20h6M12 4v16" /></svg>,
  image: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>,
  video: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><polygon points="10 8 16 12 10 16" fill="currentColor" opacity="0.3" /></svg>,
  button: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="7" width="18" height="10" rx="5" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
  link: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>,
  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  shape: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><path d="M12 3l9 15H3z" strokeOpacity="0.3" /></svg>,
  form: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="7" y1="8" x2="17" y2="8" /><line x1="7" y1="12" x2="17" y2="12" /><rect x="7" y="16" width="4" height="2" rx="1" fill="currentColor" opacity="0.3" /></svg>,
  input: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="7" width="18" height="10" rx="2" /><line x1="7" y1="12" x2="7" y2="12" strokeLinecap="round" strokeWidth="2" /></svg>,
  textarea: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="7" y1="8" x2="14" y2="8" /><line x1="7" y1="12" x2="17" y2="12" /><line x1="7" y1="16" x2="12" y2="16" /></svg>,
  select: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="7" width="18" height="10" rx="2" /><polyline points="15 10 17 12 15 14" /></svg>,
  checkbox: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><polyline points="9 11 12 14 22 4" strokeWidth="2" /></svg>,
  radio: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3" /></svg>,
  label: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 7h16M4 12h10M4 17h12" /></svg>,
  embed: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  code: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" /></svg>,
  map: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  list: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="4" cy="6" r="1" fill="currentColor" /><circle cx="4" cy="12" r="1" fill="currentColor" /><circle cx="4" cy="18" r="1" fill="currentColor" /></svg>,
  accordion: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="5" rx="1" /><rect x="3" y="10" width="18" height="5" rx="1" /><rect x="3" y="17" width="18" height="5" rx="1" /><line x1="18" y1="5.5" x2="18" y2="5.5" strokeLinecap="round" strokeWidth="2" /></svg>,
  tabs: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M2 9h20" /><rect x="3" y="4" width="5" height="5" rx="1" fill="currentColor" opacity="0.15" /><rect x="9" y="5" width="5" height="4" rx="1" /></svg>,
  slider: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="7 12 3 12" /><polyline points="21 12 17 12" /><circle cx="12" cy="18" r="1" fill="currentColor" /><circle cx="9" cy="18" r="1" /><circle cx="15" cy="18" r="1" /></svg>,
  gallery: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="9" height="9" rx="1" /><rect x="13" y="2" width="9" height="9" rx="1" /><rect x="2" y="13" width="9" height="9" rx="1" /><rect x="13" y="13" width="9" height="9" rx="1" /></svg>,
  table: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" /></svg>,
  navbar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="6" rx="2" /><circle cx="6" cy="7" r="1.5" fill="currentColor" opacity="0.3" /><line x1="11" y1="7" x2="14" y2="7" /><line x1="16" y1="7" x2="19" y2="7" /></svg>,
  footer: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="14" width="20" height="6" rx="2" /><line x1="6" y1="17" x2="18" y2="17" /><rect x="2" y="4" width="20" height="8" rx="2" strokeOpacity="0.3" /></svg>,
  sidebar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" /><line x1="4" y1="8" x2="7" y2="8" /><line x1="4" y1="12" x2="7" y2="12" /><line x1="4" y1="16" x2="7" y2="16" /></svg>,
  modal: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="1" width="22" height="22" rx="2" opacity="0.2" /><rect x="4" y="5" width="16" height="14" rx="2" /><line x1="17" y1="7" x2="19" y2="7" /></svg>,
  hero: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="18" rx="2" /><line x1="6" y1="9" x2="18" y2="9" strokeWidth="2" /><line x1="8" y1="13" x2="16" y2="13" /><rect x="9" y="16" width="6" height="2" rx="1" fill="currentColor" opacity="0.3" /></svg>,
  cta: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="2" fill="currentColor" opacity="0.08" /><line x1="7" y1="10" x2="17" y2="10" /><rect x="9" y="13" width="6" height="2.5" rx="1" /></svg>,
  'feature-grid': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="6" height="6" rx="1" /><rect x="9" y="2" width="6" height="6" rx="1" /><rect x="16" y="2" width="6" height="6" rx="1" /><line x1="3" y1="12" x2="7" y2="12" /><line x1="10" y1="12" x2="14" y2="12" /><line x1="17" y1="12" x2="21" y2="12" /></svg>,
  testimonial: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21c3-3 3-6 3-9 0-4 2-6 6-6M21 21c-3-3-3-6-3-9 0-4-2-6-6-6" strokeWidth="2" opacity="0.4" /><circle cx="12" cy="16" r="3" /><line x1="7" y1="8" x2="17" y2="8" /></svg>,
  'pricing-table': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="7" y1="8" x2="17" y2="8" strokeWidth="2" /><line x1="7" y1="12" x2="14" y2="12" /><line x1="7" y1="15" x2="14" y2="15" /><rect x="7" y="18" width="10" height="2" rx="1" fill="currentColor" opacity="0.2" /></svg>,
  'collection-list': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="6" height="8" rx="1" /><rect x="9" y="3" width="6" height="8" rx="1" /><rect x="16" y="3" width="6" height="8" rx="1" /><line x1="2" y1="14" x2="8" y2="14" /><line x1="9" y1="14" x2="15" y2="14" /><line x1="16" y1="14" x2="22" y2="14" /></svg>,
  'product-card': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="2" width="18" height="20" rx="2" /><rect x="3" y="2" width="18" height="10" rx="2" fill="currentColor" opacity="0.08" /><line x1="7" y1="15" x2="14" y2="15" /><line x1="7" y1="18" x2="10" y2="18" /></svg>,
  'cart-button': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
  'social-links': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="6" cy="12" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><line x1="8.59" y1="10.76" x2="15.42" y2="7.24" /><line x1="8.59" y1="13.24" x2="15.42" y2="16.76" /></svg>,
  countdown: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  progress: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="10" width="20" height="4" rx="2" /><rect x="2" y="10" width="14" height="4" rx="2" fill="currentColor" opacity="0.2" /></svg>,
  rating: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" fill="currentColor" opacity="0.15" /></svg>,
  badge: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="5" y="8" width="14" height="8" rx="4" fill="currentColor" opacity="0.1" /><line x1="9" y1="12" x2="15" y2="12" /></svg>,
  alert: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
  breadcrumb: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12h4l3-3 3 3h8" /><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></svg>,
  pagination: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="8" width="5" height="8" rx="1" /><rect x="9" y="8" width="5" height="8" rx="1" fill="currentColor" opacity="0.1" /><rect x="16" y="8" width="5" height="8" rx="1" /></svg>,
  figure: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="2" width="18" height="14" rx="2" /><circle cx="8" cy="8" r="2" /><path d="M21 12l-4-4-9 9" /><line x1="6" y1="20" x2="18" y2="20" /></svg>,
  blockquote: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21c3-3 3-6 3-9 0-4 2-6 6-6" strokeWidth="2.5" /><path d="M15 21c3-3 3-6 3-9 0-4-2-6-6-6" strokeWidth="2.5" /></svg>,
  audio: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>,
  'flip-box': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M12 4v16" strokeDasharray="3 3" /><path d="M7 10l-2 2 2 2" /><path d="M17 10l2 2-2 2" /></svg>,
  counter: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="6" width="20" height="12" rx="2" /><text x="12" y="15" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">99</text></svg>,
  'image-compare': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="18" rx="2" /><line x1="12" y1="3" x2="12" y2="21" strokeWidth="2" /><circle cx="12" cy="12" r="2" fill="currentColor" /><path d="M9 12l-2 0M15 12l2 0" /></svg>,
  lottie: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="2" /><path d="M8 16c0-4 2-6 4-8s4-4 4-4" strokeWidth="2" /><circle cx="8" cy="16" r="2" fill="currentColor" opacity="0.3" /></svg>,
  custom: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" strokeDasharray="4 2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
};

interface ElementDef {
  type: ElementType;
  label: string;
  category: string;
}

const elements: ElementDef[] = [
  // Layout
  { type: 'section', label: 'Section', category: 'Layout' },
  { type: 'container', label: 'Container', category: 'Layout' },
  { type: 'columns', label: 'Columns', category: 'Layout' },
  { type: 'divider', label: 'Divider', category: 'Layout' },
  { type: 'spacer', label: 'Spacer', category: 'Layout' },

  // Basic
  { type: 'heading', label: 'Heading', category: 'Basic' },
  { type: 'text', label: 'Text', category: 'Basic' },
  { type: 'image', label: 'Image', category: 'Basic' },
  { type: 'video', label: 'Video', category: 'Basic' },
  { type: 'button', label: 'Button', category: 'Basic' },
  { type: 'link', label: 'Link', category: 'Basic' },
  { type: 'icon', label: 'Icon', category: 'Basic' },
  { type: 'shape', label: 'Shape', category: 'Basic' },
  { type: 'badge', label: 'Badge', category: 'Basic' },
  { type: 'blockquote', label: 'Blockquote', category: 'Basic' },
  { type: 'figure', label: 'Figure', category: 'Basic' },

  // Forms
  { type: 'form', label: 'Form', category: 'Forms' },
  { type: 'input', label: 'Input', category: 'Forms' },
  { type: 'textarea', label: 'Textarea', category: 'Forms' },
  { type: 'select', label: 'Select', category: 'Forms' },
  { type: 'checkbox', label: 'Checkbox', category: 'Forms' },
  { type: 'radio', label: 'Radio', category: 'Forms' },
  { type: 'label', label: 'Label', category: 'Forms' },

  // Sections
  { type: 'hero', label: 'Hero', category: 'Sections' },
  { type: 'navbar', label: 'Navbar', category: 'Sections' },
  { type: 'footer', label: 'Footer', category: 'Sections' },
  { type: 'sidebar', label: 'Sidebar', category: 'Sections' },
  { type: 'cta', label: 'CTA', category: 'Sections' },
  { type: 'feature-grid', label: 'Features', category: 'Sections' },
  { type: 'testimonial', label: 'Testimonial', category: 'Sections' },
  { type: 'pricing-table', label: 'Pricing', category: 'Sections' },

  // Interactive
  { type: 'accordion', label: 'Accordion', category: 'Interactive' },
  { type: 'tabs', label: 'Tabs', category: 'Interactive' },
  { type: 'slider', label: 'Slider', category: 'Interactive' },
  { type: 'gallery', label: 'Gallery', category: 'Interactive' },
  { type: 'modal', label: 'Modal', category: 'Interactive' },
  { type: 'flip-box', label: 'Flip Box', category: 'Interactive' },
  { type: 'image-compare', label: 'Img Compare', category: 'Interactive' },

  // Data & Media
  { type: 'list', label: 'List', category: 'Media' },
  { type: 'table', label: 'Table', category: 'Media' },
  { type: 'code', label: 'Code', category: 'Media' },
  { type: 'map', label: 'Map', category: 'Media' },
  { type: 'embed', label: 'Embed', category: 'Media' },
  { type: 'audio', label: 'Audio', category: 'Media' },
  { type: 'lottie', label: 'Lottie', category: 'Media' },

  // Commerce
  { type: 'product-card', label: 'Product Card', category: 'Commerce' },
  { type: 'cart-button', label: 'Cart Button', category: 'Commerce' },
  { type: 'collection-list', label: 'Collection', category: 'Commerce' },

  // Widgets
  { type: 'search', label: 'Search', category: 'Widgets' },
  { type: 'social-links', label: 'Social Links', category: 'Widgets' },
  { type: 'countdown', label: 'Countdown', category: 'Widgets' },
  { type: 'progress', label: 'Progress Bar', category: 'Widgets' },
  { type: 'rating', label: 'Rating', category: 'Widgets' },
  { type: 'counter', label: 'Counter', category: 'Widgets' },
  { type: 'alert', label: 'Alert', category: 'Widgets' },
  { type: 'breadcrumb', label: 'Breadcrumb', category: 'Widgets' },
  { type: 'pagination', label: 'Pagination', category: 'Widgets' },
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
      <div className="flex flex-wrap gap-1 p-2 border-b border-surface-200 dark:border-surface-700">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            'px-2 py-0.5 text-[10px] rounded-md transition-colors font-medium',
            !activeCategory ? 'bg-brand-600 text-white' : 'text-surface-600 hover:bg-surface-100'
          )}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            className={cn(
              'px-2 py-0.5 text-[10px] rounded-md transition-colors font-medium',
              activeCategory === cat ? 'bg-brand-600 text-white' : 'text-surface-600 hover:bg-surface-100'
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
            <h3 className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-2">
              {category}
            </h3>
            <div className="grid grid-cols-3 gap-1">
              {items.map(el => (
                <button
                  key={el.type}
                  onClick={() => handleAdd(el.type)}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('elementType', el.type);
                  }}
                  className="flex flex-col items-center gap-1 p-2 rounded-lg border border-transparent hover:border-brand-200 hover:bg-brand-50 dark:hover:bg-brand-900/20 cursor-grab active:cursor-grabbing transition-all group"
                >
                  <span className="w-5 h-5 text-surface-500 group-hover:text-brand-600 transition-colors">
                    {icons[el.type] || icons.custom}
                  </span>
                  <span className="text-[9px] text-surface-600 group-hover:text-brand-700 font-medium leading-tight text-center">
                    {el.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
        {filteredElements.length === 0 && (
          <div className="py-8 text-center text-xs text-surface-400">
            No elements found
          </div>
        )}
      </div>
    </div>
  );
}
