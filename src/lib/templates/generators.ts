import type { BuilderElement } from '@/types/builder';
import { generateId } from '@/lib/utils';

/**
 * Template generators that produce actual BuilderElement structures
 * for each template category.
 */

function el(
  overrides: Partial<BuilderElement> & { type: BuilderElement['type'] }
): BuilderElement {
  return {
    id: generateId(),
    tag: 'div',
    styles: {},
    parentId: null,
    ...overrides,
  };
}

interface GeneratedPage {
  elements: Record<string, BuilderElement>;
  rootIds: string[];
}

function buildPage(builders: Array<(parentId: string | null) => BuilderElement[]>): GeneratedPage {
  const elements: Record<string, BuilderElement> = {};
  const rootIds: string[] = [];

  for (const builder of builders) {
    const builtElements = builder(null);
    for (const element of builtElements) {
      elements[element.id] = element;
      if (!element.parentId) rootIds.push(element.id);
      // Recursively add children
      if (element.children) {
        for (const childId of element.children) {
          const child = builtElements.find(e => e.id === childId);
          if (child) elements[child.id] = child;
        }
      }
    }
  }

  return { elements, rootIds };
}

function createNav(brandName: string): BuilderElement[] {
  const nav = el({ type: 'navbar', tag: 'nav', label: 'Navigation',
    children: [],
    styles: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px 40px', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', position: 'sticky', top: '0', zIndex: 50 },
  });
  return [nav];
}

function createHero(headline: string, subtext: string, ctaText: string, gradient: string): BuilderElement[] {
  const heroId = generateId();
  const containerId = generateId();
  const headingId = generateId();
  const textId = generateId();
  const buttonId = generateId();

  const hero = el({ id: heroId, type: 'hero', tag: 'section', label: 'Hero', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '600px', padding: '100px 24px', background: gradient, textAlign: 'center' },
  });
  const container = el({ id: containerId, type: 'container', tag: 'div', parentId: heroId, children: [headingId, textId, buttonId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '800px' },
  });
  const heading = el({ id: headingId, type: 'heading', tag: 'h1', parentId: containerId, content: headline,
    styles: { fontSize: '60px', fontWeight: '800', color: '#ffffff', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-0.02em' },
    responsiveStyles: { tablet: { fontSize: '44px' }, mobile: { fontSize: '36px' } },
  });
  const text = el({ id: textId, type: 'text', tag: 'p', parentId: containerId, content: subtext,
    styles: { fontSize: '20px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', marginBottom: '36px', maxWidth: '600px' },
    responsiveStyles: { mobile: { fontSize: '16px' } },
  });
  const button = el({ id: buttonId, type: 'button', tag: 'a', parentId: containerId, content: ctaText, href: '#',
    styles: { display: 'inline-flex', padding: '16px 36px', backgroundColor: '#ffffff', color: '#4c6ef5', fontSize: '18px', fontWeight: '700', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s ease', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' },
    hoverStyles: { transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' },
  });

  return [hero, container, heading, text, button];
}

function createFeatures(features: Array<{ title: string; desc: string; icon: string }>): BuilderElement[] {
  const sectionId = generateId();
  const containerId = generateId();
  const headingId = generateId();
  const gridId = generateId();

  const allElements: BuilderElement[] = [];
  const cardIds: string[] = [];

  for (const feat of features) {
    const cardId = generateId();
    const iconId = generateId();
    const titleId = generateId();
    const descId = generateId();

    cardIds.push(cardId);

    allElements.push(
      el({ id: cardId, type: 'column', tag: 'div', parentId: gridId, children: [iconId, titleId, descId],
        styles: { padding: '32px', backgroundColor: '#f8f9fa', borderRadius: '16px', textAlign: 'center', transition: 'all 0.2s ease' },
        hoverStyles: { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.1)' },
      }),
      el({ id: iconId, type: 'text', tag: 'span', parentId: cardId, content: feat.icon,
        styles: { fontSize: '36px', marginBottom: '16px', display: 'block' },
      }),
      el({ id: titleId, type: 'heading', tag: 'h3', parentId: cardId, content: feat.title,
        styles: { fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' },
      }),
      el({ id: descId, type: 'text', tag: 'p', parentId: cardId, content: feat.desc,
        styles: { fontSize: '15px', color: '#6b7280', lineHeight: '1.6' },
      }),
    );
  }

  const section = el({ id: sectionId, type: 'section', tag: 'section', label: 'Features', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#ffffff' },
  });
  const container = el({ id: containerId, type: 'container', tag: 'div', parentId: sectionId, children: [headingId, gridId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1100px', width: '100%' },
  });
  const heading = el({ id: headingId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Why Choose Us',
    styles: { fontSize: '40px', fontWeight: '800', color: '#1a1a1a', textAlign: 'center', marginBottom: '56px' },
  });
  const grid = el({ id: gridId, type: 'columns', tag: 'div', parentId: containerId, children: cardIds,
    styles: { display: 'grid', gridTemplateColumns: `repeat(${features.length}, 1fr)`, gap: '24px', width: '100%' },
    responsiveStyles: { tablet: { gridTemplateColumns: 'repeat(2, 1fr)' }, mobile: { gridTemplateColumns: '1fr' } },
  });

  return [section, container, heading, grid, ...allElements];
}

function createCTA(headline: string, subtext: string, ctaText: string): BuilderElement[] {
  const sectionId = generateId();
  const headingId = generateId();
  const textId = generateId();
  const buttonId = generateId();

  return [
    el({ id: sectionId, type: 'cta', tag: 'section', label: 'CTA', children: [headingId, textId, buttonId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#1a1a2e', textAlign: 'center' },
    }),
    el({ id: headingId, type: 'heading', tag: 'h2', parentId: sectionId, content: headline,
      styles: { fontSize: '44px', fontWeight: '800', color: '#ffffff', marginBottom: '16px' },
      responsiveStyles: { mobile: { fontSize: '32px' } },
    }),
    el({ id: textId, type: 'text', tag: 'p', parentId: sectionId, content: subtext,
      styles: { fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginBottom: '32px', maxWidth: '500px' },
    }),
    el({ id: buttonId, type: 'button', tag: 'a', parentId: sectionId, content: ctaText, href: '#',
      styles: { display: 'inline-flex', padding: '16px 32px', backgroundColor: '#4c6ef5', color: '#ffffff', fontSize: '16px', fontWeight: '700', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s ease' },
      hoverStyles: { backgroundColor: '#3b5bdb' },
    }),
  ];
}

function createFooter(brandName: string): BuilderElement[] {
  const footer = el({ type: 'footer', tag: 'footer', label: 'Footer', children: [],
    content: `© 2026 ${brandName}. All rights reserved.`,
    styles: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '32px 24px', backgroundColor: '#111827', color: '#9ca3af', fontSize: '14px' },
  });
  return [footer];
}

// =================================================================
// TEMPLATE GENERATORS
// =================================================================

export function generateSaaSTemplate(): GeneratedPage {
  const all: BuilderElement[] = [
    ...createNav('SaaS Pro'),
    ...createHero(
      'Ship Your Product 10x Faster',
      'The all-in-one platform for modern SaaS teams. Build, launch, and scale with confidence.',
      'Start Free Trial',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    ),
    ...createFeatures([
      { title: 'Lightning Fast', icon: '⚡', desc: 'Sub-second load times with edge-first architecture.' },
      { title: 'Auto Scaling', icon: '📈', desc: 'Handles millions of requests without breaking a sweat.' },
      { title: 'Enterprise Security', icon: '🔒', desc: 'SOC2 compliant with end-to-end encryption.' },
    ]),
    ...createCTA('Ready to Scale?', 'Join 10,000+ teams already using our platform.', 'Get Started Free'),
    ...createFooter('SaaS Pro'),
  ];

  const elements: Record<string, BuilderElement> = {};
  const rootIds: string[] = [];
  for (const element of all) {
    elements[element.id] = element;
    if (!element.parentId) rootIds.push(element.id);
  }
  return { elements, rootIds };
}

export function generatePortfolioTemplate(): GeneratedPage {
  const all: BuilderElement[] = [
    ...createNav('Portfolio'),
    ...createHero(
      'Hi, I\'m a Creative Designer',
      'I craft digital experiences that delight users and drive business results.',
      'View My Work',
      'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
    ),
    ...createFeatures([
      { title: 'UI/UX Design', icon: '🎨', desc: 'Beautiful interfaces backed by user research and testing.' },
      { title: 'Brand Identity', icon: '✨', desc: 'Memorable brands with cohesive visual systems.' },
      { title: 'Web Development', icon: '💻', desc: 'Modern, responsive websites built with clean code.' },
    ]),
    ...createCTA('Let\'s Work Together', 'Have a project in mind? I\'d love to hear about it.', 'Get in Touch'),
    ...createFooter('Creative Studio'),
  ];

  const elements: Record<string, BuilderElement> = {};
  const rootIds: string[] = [];
  for (const element of all) {
    elements[element.id] = element;
    if (!element.parentId) rootIds.push(element.id);
  }
  return { elements, rootIds };
}

export function generateEcommerceTemplate(): GeneratedPage {
  const all: BuilderElement[] = [
    ...createNav('Shop Modern'),
    ...createHero(
      'New Season Collection',
      'Discover our latest arrivals. Handcrafted with love, designed for modern living.',
      'Shop Now',
      'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    ),
    ...createFeatures([
      { title: 'Free Shipping', icon: '🚚', desc: 'Free delivery on all orders over $50.' },
      { title: 'Easy Returns', icon: '↩️', desc: '30-day hassle-free return policy.' },
      { title: 'Secure Checkout', icon: '🔐', desc: 'Your payment information is always protected.' },
      { title: '24/7 Support', icon: '💬', desc: 'We\'re here to help anytime you need us.' },
    ]),
    ...createCTA('Join Our Newsletter', 'Get 15% off your first order when you sign up.', 'Subscribe'),
    ...createFooter('Shop Modern'),
  ];

  const elements: Record<string, BuilderElement> = {};
  const rootIds: string[] = [];
  for (const element of all) {
    elements[element.id] = element;
    if (!element.parentId) rootIds.push(element.id);
  }
  return { elements, rootIds };
}

export function generateStartupTemplate(): GeneratedPage {
  const all: BuilderElement[] = [
    ...createNav('LaunchPad'),
    ...createHero(
      'The Future of Work Starts Here',
      'Revolutionize how your team collaborates. AI-powered tools for the next generation.',
      'Join the Waitlist',
      'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)'
    ),
    ...createFeatures([
      { title: 'AI-Powered', icon: '🤖', desc: 'Smart automation that learns from your workflow.' },
      { title: 'Real-time Collab', icon: '👥', desc: 'Work together seamlessly, no matter where you are.' },
      { title: 'Deep Integrations', icon: '🔗', desc: 'Connect with 200+ tools you already use.' },
    ]),
    ...createCTA('Be an Early Adopter', 'Limited beta spots available. Get exclusive founder pricing.', 'Request Access'),
    ...createFooter('LaunchPad Inc.'),
  ];

  const elements: Record<string, BuilderElement> = {};
  const rootIds: string[] = [];
  for (const element of all) {
    elements[element.id] = element;
    if (!element.parentId) rootIds.push(element.id);
  }
  return { elements, rootIds };
}

export function generateAgencyTemplate(): GeneratedPage {
  const all: BuilderElement[] = [
    ...createNav('Agency Bold'),
    ...createHero(
      'We Build Brands That Matter',
      'Full-service digital agency helping ambitious brands grow through strategy, design, and technology.',
      'View Our Work',
      'linear-gradient(135deg, #000000 0%, #1a1a2e 100%)'
    ),
    ...createFeatures([
      { title: 'Strategy', icon: '🎯', desc: 'Data-driven insights that inform every decision we make.' },
      { title: 'Design', icon: '🎨', desc: 'Award-winning designs that captivate and convert.' },
      { title: 'Development', icon: '⚙️', desc: 'Cutting-edge tech stacks built for scale.' },
    ]),
    ...createCTA('Start a Project', 'Tell us about your vision and we\'ll bring it to life.', 'Let\'s Talk'),
    ...createFooter('Agency Bold'),
  ];

  const elements: Record<string, BuilderElement> = {};
  const rootIds: string[] = [];
  for (const element of all) {
    elements[element.id] = element;
    if (!element.parentId) rootIds.push(element.id);
  }
  return { elements, rootIds };
}

export function generateBlankTemplate(): GeneratedPage {
  const sectionId = generateId();
  const section = el({ id: sectionId, type: 'section', tag: 'section', label: 'Section 1', children: [],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minHeight: '400px', padding: '60px 24px' },
  });
  return {
    elements: { [section.id]: section },
    rootIds: [section.id],
  };
}

// AI-based template generation from a prompt
export function generateFromPrompt(prompt: string): GeneratedPage {
  const lowerPrompt = prompt.toLowerCase();

  // Determine type and generate appropriate template
  if (lowerPrompt.includes('saas') || lowerPrompt.includes('software') || lowerPrompt.includes('app')) {
    return generateSaaSTemplate();
  }
  if (lowerPrompt.includes('portfolio') || lowerPrompt.includes('photographer') || lowerPrompt.includes('designer')) {
    return generatePortfolioTemplate();
  }
  if (lowerPrompt.includes('store') || lowerPrompt.includes('shop') || lowerPrompt.includes('ecommerce') || lowerPrompt.includes('product')) {
    return generateEcommerceTemplate();
  }
  if (lowerPrompt.includes('startup') || lowerPrompt.includes('launch') || lowerPrompt.includes('waitlist')) {
    return generateStartupTemplate();
  }
  if (lowerPrompt.includes('agency') || lowerPrompt.includes('studio') || lowerPrompt.includes('firm')) {
    return generateAgencyTemplate();
  }

  // Default: SaaS template
  return generateSaaSTemplate();
}

export const TEMPLATE_GENERATORS: Record<string, () => GeneratedPage> = {
  'blank': generateBlankTemplate,
  'saas-1': generateSaaSTemplate,
  'portfolio-1': generatePortfolioTemplate,
  'ecom-1': generateEcommerceTemplate,
  'startup-1': generateStartupTemplate,
  'agency-1': generateAgencyTemplate,
  'blog-1': generateSaaSTemplate,
  'corp-1': generateAgencyTemplate,
  'rest-1': generateEcommerceTemplate,
  'travel-1': generatePortfolioTemplate,
  'law-1': generateAgencyTemplate,
  'medical-1': generateSaaSTemplate,
  'edu-1': generateStartupTemplate,
  'landing-1': generateSaaSTemplate,
  'onepage-1': generatePortfolioTemplate,
  'nonprofit-1': generateAgencyTemplate,
  'personal-1': generatePortfolioTemplate,
};
