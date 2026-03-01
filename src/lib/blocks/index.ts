/**
 * Pre-built blocks library for the website builder.
 * Each block is a function that returns a set of BuilderElements.
 * The full library will be populated by the agent - this is the stub with core blocks.
 */

import type { BuilderElement } from '@/types/builder';
import { generateId } from '@/lib/utils';

type BlockResult = { elements: Record<string, BuilderElement>; rootIds: string[] };
type BlockGenerator = () => BlockResult;

function el(overrides: Partial<BuilderElement> & { type: BuilderElement['type'] }): BuilderElement {
  return { id: generateId(), tag: 'div', styles: {}, parentId: null, ...overrides };
}

// ========================================
// HERO BLOCKS
// ========================================

function heroSplitImage(): BlockResult {
  const sectionId = generateId(); const leftId = generateId(); const rightId = generateId();
  const headingId = generateId(); const textId = generateId(); const btn1Id = generateId(); const btn2Id = generateId();
  const imgId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'hero', tag: 'section', label: 'Split Hero', children: [leftId, rightId],
      styles: { display: 'flex', alignItems: 'center', width: '100%', minHeight: '600px', padding: '80px 60px', backgroundColor: '#ffffff', gap: '60px' },
      responsiveStyles: { mobile: { flexDirection: 'column', padding: '40px 20px', minHeight: 'auto' } },
    }),
    [leftId]: el({ id: leftId, type: 'container', parentId: sectionId, children: [headingId, textId, btn1Id, btn2Id],
      styles: { display: 'flex', flexDirection: 'column', flex: '1', gap: '24px' },
    }),
    [headingId]: el({ id: headingId, type: 'heading', tag: 'h1', parentId: leftId, content: 'Build Something Extraordinary Today',
      styles: { fontSize: '52px', fontWeight: '800', color: '#111827', lineHeight: '1.1', letterSpacing: '-0.02em' },
      responsiveStyles: { mobile: { fontSize: '36px' } },
    }),
    [textId]: el({ id: textId, type: 'text', tag: 'p', parentId: leftId, content: 'Empower your team with tools designed for the modern web. Fast, reliable, and beautifully crafted.',
      styles: { fontSize: '18px', color: '#6b7280', lineHeight: '1.7', maxWidth: '480px' },
    }),
    [btn1Id]: el({ id: btn1Id, type: 'button', tag: 'a', parentId: leftId, content: 'Get Started Free', href: '#',
      styles: { display: 'inline-flex', padding: '14px 28px', backgroundColor: '#4c6ef5', color: '#ffffff', fontSize: '16px', fontWeight: '600', borderRadius: '10px', textDecoration: 'none', transition: 'all 0.2s', width: 'fit-content' },
      hoverStyles: { backgroundColor: '#3b5bdb', transform: 'translateY(-1px)' },
    }),
    [btn2Id]: el({ id: btn2Id, type: 'button', tag: 'a', parentId: leftId, content: 'Watch Demo →', href: '#',
      styles: { display: 'inline-flex', padding: '14px 28px', backgroundColor: 'transparent', color: '#4c6ef5', fontSize: '16px', fontWeight: '600', borderRadius: '10px', textDecoration: 'none', border: '2px solid #4c6ef5', width: 'fit-content', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#4c6ef5', color: '#ffffff' },
    }),
    [rightId]: el({ id: rightId, type: 'container', parentId: sectionId, children: [imgId],
      styles: { flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    }),
    [imgId]: el({ id: imgId, type: 'image', tag: 'div', parentId: rightId,
      styles: { width: '100%', height: '400px', backgroundColor: '#e5e7eb', borderRadius: '20px', backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

function heroFullscreen(): BlockResult {
  const sectionId = generateId(); const overlayId = generateId();
  const headingId = generateId(); const textId = generateId(); const btnId = generateId();
  const scrollId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'hero', tag: 'section', label: 'Fullscreen Hero', children: [overlayId, scrollId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100vh', padding: '80px 24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)', textAlign: 'center', position: 'relative' },
    }),
    [overlayId]: el({ id: overlayId, type: 'container', parentId: sectionId, children: [headingId, textId, btnId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '800px', zIndex: 1 },
    }),
    [headingId]: el({ id: headingId, type: 'heading', tag: 'h1', parentId: overlayId, content: 'The Future is Already Here',
      styles: { fontSize: '72px', fontWeight: '900', color: '#ffffff', lineHeight: '1.05', marginBottom: '24px', letterSpacing: '-0.03em' },
      responsiveStyles: { mobile: { fontSize: '40px' } },
    }),
    [textId]: el({ id: textId, type: 'text', tag: 'p', parentId: overlayId, content: 'Join millions who are already building the next generation of products with our AI-powered platform.',
      styles: { fontSize: '22px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', marginBottom: '40px', maxWidth: '600px' },
      responsiveStyles: { mobile: { fontSize: '16px' } },
    }),
    [btnId]: el({ id: btnId, type: 'button', tag: 'a', parentId: overlayId, content: 'Start Building', href: '#',
      styles: { display: 'inline-flex', padding: '18px 40px', backgroundColor: '#6366f1', color: '#ffffff', fontSize: '18px', fontWeight: '700', borderRadius: '14px', textDecoration: 'none', boxShadow: '0 0 30px rgba(99,102,241,0.4)', transition: 'all 0.3s' },
      hoverStyles: { boxShadow: '0 0 50px rgba(99,102,241,0.6)', transform: 'translateY(-2px)' },
    }),
    [scrollId]: el({ id: scrollId, type: 'text', tag: 'div', parentId: sectionId, content: '↓',
      styles: { position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.4)', fontSize: '24px', animation: 'bounce 2s infinite' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

function heroMinimal(): BlockResult {
  const sectionId = generateId();
  const headingId = generateId(); const textId = generateId(); const btnId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'hero', tag: 'section', label: 'Minimal Hero', children: [headingId, textId, btnId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '500px', padding: '100px 24px', backgroundColor: '#ffffff', textAlign: 'center' },
    }),
    [headingId]: el({ id: headingId, type: 'heading', tag: 'h1', parentId: sectionId, content: 'Less Is More.',
      styles: { fontSize: '64px', fontWeight: '800', color: '#111827', lineHeight: '1.1', marginBottom: '20px' },
      responsiveStyles: { mobile: { fontSize: '40px' } },
    }),
    [textId]: el({ id: textId, type: 'text', tag: 'p', parentId: sectionId, content: 'Simple tools for complex problems. Start building today.',
      styles: { fontSize: '20px', color: '#9ca3af', lineHeight: '1.6', marginBottom: '36px' },
    }),
    [btnId]: el({ id: btnId, type: 'button', tag: 'a', parentId: sectionId, content: 'Get Started', href: '#',
      styles: { display: 'inline-flex', padding: '14px 32px', backgroundColor: '#111827', color: '#ffffff', fontSize: '16px', fontWeight: '600', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#374151' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

function heroGradient(): BlockResult {
  const sectionId = generateId();
  const headingId = generateId(); const textId = generateId();
  const formId = generateId(); const inputId = generateId(); const btnId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'hero', tag: 'section', label: 'Gradient Hero', children: [headingId, textId, formId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '600px', padding: '100px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', textAlign: 'center' },
    }),
    [headingId]: el({ id: headingId, type: 'heading', tag: 'h1', parentId: sectionId, content: 'Your Next Big Thing Starts Here',
      styles: { fontSize: '56px', fontWeight: '800', color: '#ffffff', lineHeight: '1.1', marginBottom: '20px' },
      responsiveStyles: { mobile: { fontSize: '36px' } },
    }),
    [textId]: el({ id: textId, type: 'text', tag: 'p', parentId: sectionId, content: 'Be the first to know when we launch. Sign up for early access.',
      styles: { fontSize: '20px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', marginBottom: '36px', maxWidth: '500px' },
    }),
    [formId]: el({ id: formId, type: 'container', parentId: sectionId, children: [inputId, btnId],
      styles: { display: 'flex', gap: '12px', maxWidth: '440px', width: '100%' },
      responsiveStyles: { mobile: { flexDirection: 'column' } },
    }),
    [inputId]: el({ id: inputId, type: 'input', tag: 'input', parentId: formId,
      styles: { flex: '1', padding: '14px 20px', borderRadius: '10px', border: 'none', fontSize: '16px', backgroundColor: 'rgba(255,255,255,0.95)' },
    }),
    [btnId]: el({ id: btnId, type: 'button', tag: 'button', parentId: formId, content: 'Join Waitlist',
      styles: { padding: '14px 24px', backgroundColor: '#111827', color: '#ffffff', fontSize: '16px', fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#1f2937' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

// ========================================
// FEATURE BLOCKS
// ========================================

function featuresGrid3(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const gridId = generateId();
  const features = [
    { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized for speed with edge-first architecture and smart caching.' },
    { icon: '🔒', title: 'Secure by Default', desc: 'Enterprise-grade security with automatic SSL and DDoS protection.' },
    { icon: '📊', title: 'Built-in Analytics', desc: 'Track visitors, conversions, and engagement without third-party tools.' },
  ];
  const cardIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};

  for (const feat of features) {
    const cId = generateId(); const iId = generateId(); const tId = generateId(); const dId = generateId();
    cardIds.push(cId);
    allEls[cId] = el({ id: cId, type: 'column', parentId: gridId, children: [iId, tId, dId],
      styles: { padding: '40px 32px', backgroundColor: '#f9fafb', borderRadius: '16px', textAlign: 'center', transition: 'all 0.3s' },
      hoverStyles: { backgroundColor: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', transform: 'translateY(-4px)' },
    });
    allEls[iId] = el({ id: iId, type: 'text', tag: 'span', parentId: cId, content: feat.icon,
      styles: { fontSize: '40px', display: 'block', marginBottom: '20px' },
    });
    allEls[tId] = el({ id: tId, type: 'heading', tag: 'h3', parentId: cId, content: feat.title,
      styles: { fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '12px' },
    });
    allEls[dId] = el({ id: dId, type: 'text', tag: 'p', parentId: cId, content: feat.desc,
      styles: { fontSize: '15px', color: '#6b7280', lineHeight: '1.7' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: '3-Col Features', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#ffffff' },
  });
  allEls[containerId] = el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, gridId],
    styles: { maxWidth: '1100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  });
  allEls[titleId] = el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Everything You Need',
    styles: { fontSize: '40px', fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: '56px' },
  });
  allEls[gridId] = el({ id: gridId, type: 'columns', parentId: containerId, children: cardIds,
    styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', width: '100%' },
    responsiveStyles: { mobile: { gridTemplateColumns: '1fr' } },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

// ========================================
// TESTIMONIAL BLOCKS
// ========================================

function testimonialCards(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const gridId = generateId();
  const testimonials = [
    { name: 'Sarah Chen', role: 'CEO, TechFlow', quote: 'This platform transformed our entire workflow. We shipped 3x faster within the first month.' },
    { name: 'Marcus Johnson', role: 'CTO, Innovate Labs', quote: 'The best tool we have ever used. The AI features alone save us hours every week.' },
    { name: 'Emily Rodriguez', role: 'Designer, Creative Co', quote: 'Beautiful, intuitive, and incredibly powerful. I recommend it to every designer I know.' },
  ];
  const cardIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};

  for (const t of testimonials) {
    const cId = generateId(); const qId = generateId(); const nId = generateId(); const rId = generateId();
    cardIds.push(cId);
    allEls[cId] = el({ id: cId, type: 'column', parentId: gridId, children: [qId, nId, rId],
      styles: { padding: '32px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb' },
    });
    allEls[qId] = el({ id: qId, type: 'text', tag: 'p', parentId: cId, content: `"${t.quote}"`,
      styles: { fontSize: '16px', color: '#374151', lineHeight: '1.7', marginBottom: '20px', fontStyle: 'italic' },
    });
    allEls[nId] = el({ id: nId, type: 'text', tag: 'span', parentId: cId, content: t.name,
      styles: { fontSize: '15px', fontWeight: '700', color: '#111827', display: 'block' },
    });
    allEls[rId] = el({ id: rId, type: 'text', tag: 'span', parentId: cId, content: t.role,
      styles: { fontSize: '13px', color: '#9ca3af', display: 'block', marginTop: '4px' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: 'Testimonials', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#f9fafb' },
  });
  allEls[containerId] = el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, gridId],
    styles: { maxWidth: '1100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  });
  allEls[titleId] = el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Loved by Thousands',
    styles: { fontSize: '40px', fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: '56px' },
  });
  allEls[gridId] = el({ id: gridId, type: 'columns', parentId: containerId, children: cardIds,
    styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', width: '100%' },
    responsiveStyles: { mobile: { gridTemplateColumns: '1fr' } },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

// ========================================
// CTA BLOCKS
// ========================================

function ctaBanner(): BlockResult {
  const sectionId = generateId();
  const headingId = generateId(); const textId = generateId();
  const btnGroupId = generateId(); const btn1Id = generateId(); const btn2Id = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'cta', tag: 'section', label: 'CTA Banner', children: [headingId, textId, btnGroupId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '80px 24px', background: 'linear-gradient(135deg, #4c6ef5 0%, #7c3aed 100%)', textAlign: 'center' },
    }),
    [headingId]: el({ id: headingId, type: 'heading', tag: 'h2', parentId: sectionId, content: 'Ready to Get Started?',
      styles: { fontSize: '44px', fontWeight: '800', color: '#ffffff', marginBottom: '16px' },
      responsiveStyles: { mobile: { fontSize: '32px' } },
    }),
    [textId]: el({ id: textId, type: 'text', tag: 'p', parentId: sectionId, content: 'Start your free trial today. No credit card required.',
      styles: { fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px' },
    }),
    [btnGroupId]: el({ id: btnGroupId, type: 'container', parentId: sectionId, children: [btn1Id, btn2Id],
      styles: { display: 'flex', gap: '16px' },
      responsiveStyles: { mobile: { flexDirection: 'column' } },
    }),
    [btn1Id]: el({ id: btn1Id, type: 'button', tag: 'a', parentId: btnGroupId, content: 'Start Free Trial', href: '#',
      styles: { padding: '16px 32px', backgroundColor: '#ffffff', color: '#4c6ef5', fontSize: '16px', fontWeight: '700', borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s' },
      hoverStyles: { transform: 'translateY(-2px)', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' },
    }),
    [btn2Id]: el({ id: btn2Id, type: 'button', tag: 'a', parentId: btnGroupId, content: 'Talk to Sales', href: '#',
      styles: { padding: '16px 32px', backgroundColor: 'transparent', color: '#ffffff', fontSize: '16px', fontWeight: '600', borderRadius: '12px', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.3)', transition: 'all 0.2s' },
      hoverStyles: { borderColor: '#ffffff', backgroundColor: 'rgba(255,255,255,0.1)' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

// ========================================
// PRICING BLOCK
// ========================================

function pricingThreeColumn(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const subtitleId = generateId(); const gridId = generateId();
  const plans = [
    { name: 'Starter', price: '$12', period: '/month', features: ['3 websites', '10GB storage', 'Custom domain', 'Email support'], highlighted: false },
    { name: 'Professional', price: '$29', period: '/month', features: ['10 websites', '50GB storage', 'Priority support', 'Advanced analytics', 'E-commerce', 'CMS'], highlighted: true },
    { name: 'Business', price: '$79', period: '/month', features: ['Unlimited websites', '200GB storage', 'White label', 'API access', 'Team features', 'SSO', 'Dedicated support'], highlighted: false },
  ];
  const cardIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};

  for (const plan of plans) {
    const cId = generateId(); const nId = generateId(); const pId = generateId();
    const perIdEl = generateId(); const fListId = generateId(); const btnId = generateId();
    cardIds.push(cId);

    const featureIds: string[] = [];
    for (const feat of plan.features) {
      const fId = generateId();
      featureIds.push(fId);
      allEls[fId] = el({ id: fId, type: 'text', tag: 'li', parentId: fListId, content: `✓ ${feat}`,
        styles: { fontSize: '14px', color: '#4b5563', padding: '8px 0', borderBottom: '1px solid #f3f4f6' },
      });
    }

    allEls[cId] = el({ id: cId, type: 'column', parentId: gridId, children: [nId, pId, perIdEl, fListId, btnId],
      styles: {
        padding: '40px 32px', borderRadius: '20px', textAlign: 'center', transition: 'all 0.3s',
        backgroundColor: plan.highlighted ? '#4c6ef5' : '#ffffff',
        border: plan.highlighted ? 'none' : '1px solid #e5e7eb',
        transform: plan.highlighted ? 'scale(1.05)' : 'none',
        boxShadow: plan.highlighted ? '0 20px 60px rgba(76,110,245,0.3)' : 'none',
      },
    });
    allEls[nId] = el({ id: nId, type: 'text', tag: 'span', parentId: cId, content: plan.name,
      styles: { fontSize: '14px', fontWeight: '600', color: plan.highlighted ? 'rgba(255,255,255,0.8)' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' },
    });
    allEls[pId] = el({ id: pId, type: 'heading', tag: 'h3', parentId: cId, content: plan.price,
      styles: { fontSize: '48px', fontWeight: '800', color: plan.highlighted ? '#ffffff' : '#111827', display: 'inline' },
    });
    allEls[perIdEl] = el({ id: perIdEl, type: 'text', tag: 'span', parentId: cId, content: plan.period,
      styles: { fontSize: '16px', color: plan.highlighted ? 'rgba(255,255,255,0.6)' : '#9ca3af', display: 'block', marginBottom: '32px' },
    });
    allEls[fListId] = el({ id: fListId, type: 'list', tag: 'ul', parentId: cId, children: featureIds,
      styles: { listStyle: 'none', padding: '0', marginBottom: '32px', textAlign: 'left' },
    });
    allEls[btnId] = el({ id: btnId, type: 'button', tag: 'a', parentId: cId, content: 'Get Started', href: '#',
      styles: {
        display: 'block', padding: '14px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '15px', textAlign: 'center', transition: 'all 0.2s',
        backgroundColor: plan.highlighted ? '#ffffff' : '#4c6ef5',
        color: plan.highlighted ? '#4c6ef5' : '#ffffff',
      },
      hoverStyles: { transform: 'translateY(-1px)' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: 'Pricing', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#f9fafb' },
  });
  allEls[containerId] = el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, subtitleId, gridId],
    styles: { maxWidth: '1100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  });
  allEls[titleId] = el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Simple, Transparent Pricing',
    styles: { fontSize: '40px', fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: '12px' },
  });
  allEls[subtitleId] = el({ id: subtitleId, type: 'text', tag: 'p', parentId: containerId, content: 'No hidden fees. Cancel anytime.',
    styles: { fontSize: '18px', color: '#6b7280', textAlign: 'center', marginBottom: '56px' },
  });
  allEls[gridId] = el({ id: gridId, type: 'columns', parentId: containerId, children: cardIds,
    styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', width: '100%', alignItems: 'center' },
    responsiveStyles: { mobile: { gridTemplateColumns: '1fr' } },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

// ========================================
// STATS BLOCK
// ========================================

function statsCounter(): BlockResult {
  const sectionId = generateId(); const gridId = generateId();
  const stats = [
    { value: '10M+', label: 'Websites Built' },
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '200+', label: 'Countries' },
    { value: '50ms', label: 'Avg Load Time' },
  ];
  const cardIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};

  for (const s of stats) {
    const cId = generateId(); const vId = generateId(); const lId = generateId();
    cardIds.push(cId);
    allEls[cId] = el({ id: cId, type: 'column', parentId: gridId, children: [vId, lId],
      styles: { textAlign: 'center', padding: '24px' },
    });
    allEls[vId] = el({ id: vId, type: 'heading', tag: 'h3', parentId: cId, content: s.value,
      styles: { fontSize: '48px', fontWeight: '800', color: '#4c6ef5', marginBottom: '8px' },
    });
    allEls[lId] = el({ id: lId, type: 'text', tag: 'p', parentId: cId, content: s.label,
      styles: { fontSize: '15px', color: '#6b7280' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: 'Stats', children: [gridId],
    styles: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '80px 24px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' },
  });
  allEls[gridId] = el({ id: gridId, type: 'columns', parentId: sectionId, children: cardIds,
    styles: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', maxWidth: '1000px', width: '100%' },
    responsiveStyles: { mobile: { gridTemplateColumns: 'repeat(2, 1fr)' } },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

// ========================================
// FOOTER BLOCK
// ========================================

function footerMultiColumn(): BlockResult {
  const sectionId = generateId();
  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'footer', tag: 'footer', label: 'Multi-Column Footer', children: [],
      content: '© 2026 Your Company. All rights reserved. | Privacy Policy | Terms of Service',
      styles: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '48px 24px', backgroundColor: '#111827', color: '#9ca3af', fontSize: '14px', textAlign: 'center' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

// ========================================
// CONTACT BLOCK
// ========================================

function contactForm(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const formId = generateId();
  const nameId = generateId(); const emailId = generateId(); const msgId = generateId(); const btnId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'section', tag: 'section', label: 'Contact Form', children: [containerId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#ffffff' },
    }),
    [containerId]: el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, formId],
      styles: { maxWidth: '600px', width: '100%' },
    }),
    [titleId]: el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Get in Touch',
      styles: { fontSize: '36px', fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: '40px' },
    }),
    [formId]: el({ id: formId, type: 'form', tag: 'form', parentId: containerId, children: [nameId, emailId, msgId, btnId],
      styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
    }),
    [nameId]: el({ id: nameId, type: 'input', tag: 'input', parentId: formId,
      styles: { padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px' },
    }),
    [emailId]: el({ id: emailId, type: 'input', tag: 'input', parentId: formId,
      styles: { padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px' },
    }),
    [msgId]: el({ id: msgId, type: 'textarea', tag: 'textarea', parentId: formId,
      styles: { padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', minHeight: '120px', resize: 'vertical' },
    }),
    [btnId]: el({ id: btnId, type: 'button', tag: 'button', parentId: formId, content: 'Send Message',
      styles: { padding: '16px 32px', backgroundColor: '#4c6ef5', color: '#ffffff', fontSize: '16px', fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#3b5bdb' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

// ========================================
// BLOCK REGISTRY
// ========================================

const BLOCK_REGISTRY: Record<string, BlockGenerator> = {
  // Hero
  heroSplitImage, heroFullscreen, heroMinimal, heroGradient,
  heroVideo: heroFullscreen, heroCreative: heroSplitImage,
  // Features
  featuresGrid3, featuresGrid4: featuresGrid3, featuresAlternating: featuresGrid3, featuresShowcase: featuresGrid3,
  // Testimonials
  testimonialCards, testimonialLarge: testimonialCards, testimonialGrid: testimonialCards,
  // CTA
  ctaBanner, ctaNewsletter: heroGradient, ctaMinimal: ctaBanner,
  // Pricing
  pricingThreeColumn, pricingTwoColumn: pricingThreeColumn,
  // FAQ
  faqAccordion: featuresGrid3, faqTwoColumn: featuresGrid3,
  // Navbar
  navbarSimple: heroMinimal, navbarCentered: heroMinimal, navbarDark: heroMinimal,
  // Footer
  footerMultiColumn, footerMinimal: footerMultiColumn, footerNewsletter: footerMultiColumn,
  // Content
  statsCounter, logoCloud: statsCounter, teamGrid: testimonialCards, timeline: featuresGrid3,
  // Contact
  contactForm, contactSplit: contactForm,
  // E-Commerce
  productGrid: featuresGrid3, featuredProduct: heroSplitImage,
};

export function getBlock(blockId: string): BlockResult | null {
  const generator = BLOCK_REGISTRY[blockId];
  if (!generator) return null;
  return generator();
}

export function getBlocksByCategory(categoryId: string): string[] {
  const categoryMap: Record<string, string[]> = {
    hero: ['heroSplitImage', 'heroFullscreen', 'heroMinimal', 'heroGradient', 'heroVideo', 'heroCreative'],
    features: ['featuresGrid3', 'featuresGrid4', 'featuresAlternating', 'featuresShowcase'],
    testimonials: ['testimonialCards', 'testimonialLarge', 'testimonialGrid'],
    cta: ['ctaBanner', 'ctaNewsletter', 'ctaMinimal'],
    pricing: ['pricingThreeColumn', 'pricingTwoColumn'],
    faq: ['faqAccordion', 'faqTwoColumn'],
    navbar: ['navbarSimple', 'navbarCentered', 'navbarDark'],
    footer: ['footerMultiColumn', 'footerMinimal', 'footerNewsletter'],
    content: ['statsCounter', 'logoCloud', 'teamGrid', 'timeline'],
    contact: ['contactForm', 'contactSplit'],
    ecommerce: ['productGrid', 'featuredProduct'],
  };
  return categoryMap[categoryId] || [];
}
