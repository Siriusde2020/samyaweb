'use client';

import { useEffect } from 'react';
import { useBuilderStore } from '@/lib/store/builder-store';
import { BuilderLayout } from '@/components/builder/BuilderLayout';
import type { BuilderElement } from '@/types/builder';
import { generateId } from '@/lib/utils';

// Demo page with pre-built elements
function getDemoElements(): { elements: Record<string, BuilderElement>; rootIds: string[] } {
  const ids = {
    nav: generateId(),
    hero: generateId(),
    heroContainer: generateId(),
    heroHeading: generateId(),
    heroText: generateId(),
    heroButton: generateId(),
    features: generateId(),
    featuresContainer: generateId(),
    featuresHeading: generateId(),
    featuresCols: generateId(),
    feat1: generateId(),
    feat2: generateId(),
    feat3: generateId(),
    cta: generateId(),
    ctaHeading: generateId(),
    ctaButton: generateId(),
    footer: generateId(),
  };

  const elements: Record<string, BuilderElement> = {
    [ids.nav]: {
      id: ids.nav, type: 'navbar', tag: 'nav',
      children: [], parentId: null, label: 'Navigation',
      styles: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px 40px', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
    },
    [ids.hero]: {
      id: ids.hero, type: 'hero', tag: 'section',
      children: [ids.heroContainer], parentId: null, label: 'Hero Section',
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '500px', padding: '80px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', textAlign: 'center' },
    },
    [ids.heroContainer]: {
      id: ids.heroContainer, type: 'container', tag: 'div',
      children: [ids.heroHeading, ids.heroText, ids.heroButton], parentId: ids.hero,
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '700px' },
    },
    [ids.heroHeading]: {
      id: ids.heroHeading, type: 'heading', tag: 'h1',
      content: 'Build Something Amazing', parentId: ids.heroContainer,
      styles: { fontSize: '56px', fontWeight: '800', color: '#ffffff', lineHeight: '1.1', marginBottom: '20px' },
      responsiveStyles: { mobile: { fontSize: '36px' } },
    },
    [ids.heroText]: {
      id: ids.heroText, type: 'text', tag: 'p',
      content: 'Create stunning websites with our drag-and-drop builder. No coding required. Get started in minutes.', parentId: ids.heroContainer,
      styles: { fontSize: '20px', fontWeight: '400', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', marginBottom: '32px', maxWidth: '500px' },
      responsiveStyles: { mobile: { fontSize: '16px' } },
    },
    [ids.heroButton]: {
      id: ids.heroButton, type: 'button', tag: 'a',
      content: 'Get Started Free', href: '#', parentId: ids.heroContainer,
      styles: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '16px 32px', backgroundColor: '#ffffff', color: '#6366f1', fontSize: '18px', fontWeight: '700', borderRadius: '12px', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s ease', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' },
      hoverStyles: { transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' },
    },
    [ids.features]: {
      id: ids.features, type: 'section', tag: 'section',
      children: [ids.featuresContainer], parentId: null, label: 'Features',
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '80px 20px', backgroundColor: '#ffffff' },
    },
    [ids.featuresContainer]: {
      id: ids.featuresContainer, type: 'container', tag: 'div',
      children: [ids.featuresHeading, ids.featuresCols], parentId: ids.features,
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1100px' },
    },
    [ids.featuresHeading]: {
      id: ids.featuresHeading, type: 'heading', tag: 'h2',
      content: 'Why Choose Us', parentId: ids.featuresContainer,
      styles: { fontSize: '36px', fontWeight: '700', color: '#1a1a1a', textAlign: 'center', marginBottom: '48px' },
    },
    [ids.featuresCols]: {
      id: ids.featuresCols, type: 'columns', tag: 'div',
      children: [ids.feat1, ids.feat2, ids.feat3], parentId: ids.featuresContainer,
      styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', width: '100%' },
      responsiveStyles: { mobile: { gridTemplateColumns: '1fr' } },
    },
    [ids.feat1]: {
      id: ids.feat1, type: 'column', tag: 'div',
      children: [], parentId: ids.featuresCols,
      content: 'Lightning Fast - Built on JAMStack for incredible speed',
      styles: { padding: '32px', backgroundColor: '#f8f9fa', borderRadius: '16px', textAlign: 'center', fontSize: '16px', lineHeight: '1.6', color: '#4a4a4a' },
    },
    [ids.feat2]: {
      id: ids.feat2, type: 'column', tag: 'div',
      children: [], parentId: ids.featuresCols,
      content: 'Drag & Drop - Visual editor with no coding required',
      styles: { padding: '32px', backgroundColor: '#f8f9fa', borderRadius: '16px', textAlign: 'center', fontSize: '16px', lineHeight: '1.6', color: '#4a4a4a' },
    },
    [ids.feat3]: {
      id: ids.feat3, type: 'column', tag: 'div',
      children: [], parentId: ids.featuresCols,
      content: 'AI Powered - Generate content and layouts with AI',
      styles: { padding: '32px', backgroundColor: '#f8f9fa', borderRadius: '16px', textAlign: 'center', fontSize: '16px', lineHeight: '1.6', color: '#4a4a4a' },
    },
    [ids.cta]: {
      id: ids.cta, type: 'cta', tag: 'section',
      children: [ids.ctaHeading, ids.ctaButton], parentId: null, label: 'CTA Section',
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '80px 20px', backgroundColor: '#1a1a2e', textAlign: 'center' },
    },
    [ids.ctaHeading]: {
      id: ids.ctaHeading, type: 'heading', tag: 'h2',
      content: 'Ready to Get Started?', parentId: ids.cta,
      styles: { fontSize: '40px', fontWeight: '700', color: '#ffffff', marginBottom: '24px' },
    },
    [ids.ctaButton]: {
      id: ids.ctaButton, type: 'button', tag: 'a',
      content: 'Start Building', href: '#', parentId: ids.cta,
      styles: { display: 'inline-flex', padding: '14px 28px', backgroundColor: '#6366f1', color: '#ffffff', fontSize: '16px', fontWeight: '600', borderRadius: '10px', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s ease' },
    },
    [ids.footer]: {
      id: ids.footer, type: 'footer', tag: 'footer',
      children: [], parentId: null, label: 'Footer',
      content: '© 2026 Built with JAMStack Builder',
      styles: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '24px', backgroundColor: '#111827', color: '#9ca3af', fontSize: '14px' },
    },
  };

  const rootIds = [ids.nav, ids.hero, ids.features, ids.cta, ids.footer];
  return { elements, rootIds };
}

export default function BuilderDemoPage() {
  const { loadPage } = useBuilderStore();

  useEffect(() => {
    const { elements, rootIds } = getDemoElements();
    loadPage(elements, rootIds);
  }, [loadPage]);

  return <BuilderLayout />;
}
