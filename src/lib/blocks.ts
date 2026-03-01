import type { BuilderElement } from '@/types/builder';
import { generateId } from '@/lib/utils';

type BlockResult = { elements: Record<string, BuilderElement>; rootIds: string[] };
type BlockGenerator = () => BlockResult;

function el(overrides: Partial<BuilderElement> & { type: BuilderElement['type'] }): BuilderElement {
  return { id: generateId(), tag: 'div', styles: {}, parentId: null, ...overrides };
}

// ============================================================
// HERO BLOCKS
// ============================================================

function heroSplitImage(): BlockResult {
  const sectionId = generateId();
  const leftId = generateId();
  const rightId = generateId();
  const tagId = generateId();
  const headingId = generateId();
  const textId = generateId();
  const btnGroupId = generateId();
  const btn1Id = generateId();
  const btn2Id = generateId();
  const imgId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'hero', tag: 'section', label: 'Split Hero', children: [leftId, rightId],
      styles: { display: 'flex', alignItems: 'center', width: '100%', minHeight: '640px', padding: '80px 64px', backgroundColor: '#fafafa', gap: '64px' },
      responsiveStyles: { tablet: { padding: '60px 32px', gap: '40px' }, mobile: { flexDirection: 'column', padding: '40px 20px', minHeight: 'auto' } },
    }),
    [leftId]: el({ id: leftId, type: 'container', parentId: sectionId, children: [tagId, headingId, textId, btnGroupId],
      styles: { display: 'flex', flexDirection: 'column', flex: '1', gap: '20px' },
    }),
    [tagId]: el({ id: tagId, type: 'text', tag: 'span', parentId: leftId, content: 'NEW RELEASE 2026',
      styles: { fontSize: '12px', fontWeight: '700', color: '#4c6ef5', letterSpacing: '0.1em', textTransform: 'uppercase', backgroundColor: '#eef2ff', padding: '6px 14px', borderRadius: '20px', width: 'fit-content' },
    }),
    [headingId]: el({ id: headingId, type: 'heading', tag: 'h1', parentId: leftId, content: 'Build Something Extraordinary Today',
      styles: { fontSize: '54px', fontWeight: '800', color: '#111827', lineHeight: '1.08', letterSpacing: '-0.025em' },
      responsiveStyles: { tablet: { fontSize: '42px' }, mobile: { fontSize: '34px' } },
    }),
    [textId]: el({ id: textId, type: 'text', tag: 'p', parentId: leftId, content: 'Empower your team with tools designed for the modern web. Fast, reliable, and beautifully crafted for every screen.',
      styles: { fontSize: '18px', color: '#6b7280', lineHeight: '1.7', maxWidth: '480px' },
    }),
    [btnGroupId]: el({ id: btnGroupId, type: 'container', parentId: leftId, children: [btn1Id, btn2Id],
      styles: { display: 'flex', gap: '14px', marginTop: '8px' },
      responsiveStyles: { mobile: { flexDirection: 'column' } },
    }),
    [btn1Id]: el({ id: btn1Id, type: 'button', tag: 'a', parentId: btnGroupId, content: 'Get Started Free', href: '#',
      styles: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 28px', backgroundColor: '#4c6ef5', color: '#ffffff', fontSize: '15px', fontWeight: '600', borderRadius: '10px', textDecoration: 'none', transition: 'all 0.2s', width: 'fit-content' },
      hoverStyles: { backgroundColor: '#3b5bdb', transform: 'translateY(-1px)' },
    }),
    [btn2Id]: el({ id: btn2Id, type: 'button', tag: 'a', parentId: btnGroupId, content: 'Watch Demo', href: '#',
      styles: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 28px', backgroundColor: 'transparent', color: '#4c6ef5', fontSize: '15px', fontWeight: '600', borderRadius: '10px', textDecoration: 'none', border: '2px solid #4c6ef5', width: 'fit-content', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#4c6ef5', color: '#ffffff' },
    }),
    [rightId]: el({ id: rightId, type: 'container', parentId: sectionId, children: [imgId],
      styles: { flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    }),
    [imgId]: el({ id: imgId, type: 'image', tag: 'div', parentId: rightId,
      styles: { width: '100%', height: '420px', backgroundColor: '#e0e7ff', borderRadius: '24px', backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

function heroFullscreen(): BlockResult {
  const sectionId = generateId();
  const overlayId = generateId();
  const badgeId = generateId();
  const headingId = generateId();
  const textId = generateId();
  const btnId = generateId();
  const scrollId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'hero', tag: 'section', label: 'Fullscreen Hero', children: [overlayId, scrollId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100vh', padding: '80px 24px', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)', textAlign: 'center', position: 'relative' },
    }),
    [overlayId]: el({ id: overlayId, type: 'container', parentId: sectionId, children: [badgeId, headingId, textId, btnId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '820px', zIndex: 1 },
    }),
    [badgeId]: el({ id: badgeId, type: 'text', tag: 'span', parentId: overlayId, content: 'Trusted by 50,000+ teams worldwide',
      styles: { fontSize: '13px', fontWeight: '500', color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.08)', padding: '8px 20px', borderRadius: '24px', marginBottom: '28px', border: '1px solid rgba(255,255,255,0.1)' },
    }),
    [headingId]: el({ id: headingId, type: 'heading', tag: 'h1', parentId: overlayId, content: 'The Future Is Already Here',
      styles: { fontSize: '76px', fontWeight: '900', color: '#ffffff', lineHeight: '1.02', marginBottom: '24px', letterSpacing: '-0.03em' },
      responsiveStyles: { tablet: { fontSize: '56px' }, mobile: { fontSize: '40px' } },
    }),
    [textId]: el({ id: textId, type: 'text', tag: 'p', parentId: overlayId, content: 'Join millions who are already building the next generation of digital products with our AI-powered platform.',
      styles: { fontSize: '20px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.65', marginBottom: '40px', maxWidth: '600px' },
      responsiveStyles: { mobile: { fontSize: '16px' } },
    }),
    [btnId]: el({ id: btnId, type: 'button', tag: 'a', parentId: overlayId, content: 'Start Building Now', href: '#',
      styles: { display: 'inline-flex', padding: '18px 42px', backgroundColor: '#6366f1', color: '#ffffff', fontSize: '17px', fontWeight: '700', borderRadius: '14px', textDecoration: 'none', boxShadow: '0 0 40px rgba(99,102,241,0.4)', transition: 'all 0.3s' },
      hoverStyles: { boxShadow: '0 0 60px rgba(99,102,241,0.6)', transform: 'translateY(-2px)' },
    }),
    [scrollId]: el({ id: scrollId, type: 'text', tag: 'div', parentId: sectionId, content: 'Scroll to explore',
      styles: { position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

function heroMinimal(): BlockResult {
  const sectionId = generateId();
  const headingId = generateId();
  const textId = generateId();
  const btnId = generateId();
  const dividerId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'hero', tag: 'section', label: 'Minimal Hero', children: [headingId, textId, dividerId, btnId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '520px', padding: '120px 24px', backgroundColor: '#ffffff', textAlign: 'center' },
    }),
    [headingId]: el({ id: headingId, type: 'heading', tag: 'h1', parentId: sectionId, content: 'Less Is More.',
      styles: { fontSize: '72px', fontWeight: '800', color: '#111827', lineHeight: '1.05', marginBottom: '20px', letterSpacing: '-0.04em' },
      responsiveStyles: { tablet: { fontSize: '52px' }, mobile: { fontSize: '40px' } },
    }),
    [textId]: el({ id: textId, type: 'text', tag: 'p', parentId: sectionId, content: 'Simple tools for complex problems. Start building today with zero configuration.',
      styles: { fontSize: '20px', color: '#9ca3af', lineHeight: '1.6', marginBottom: '16px', maxWidth: '460px' },
    }),
    [dividerId]: el({ id: dividerId, type: 'divider', tag: 'hr', parentId: sectionId,
      styles: { width: '48px', height: '3px', backgroundColor: '#111827', border: 'none', borderRadius: '2px', margin: '20px auto' },
    }),
    [btnId]: el({ id: btnId, type: 'button', tag: 'a', parentId: sectionId, content: 'Get Started', href: '#',
      styles: { display: 'inline-flex', padding: '14px 36px', backgroundColor: '#111827', color: '#ffffff', fontSize: '15px', fontWeight: '600', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#374151' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

function heroVideo(): BlockResult {
  const sectionId = generateId();
  const overlayId = generateId();
  const contentId = generateId();
  const headingId = generateId();
  const textId = generateId();
  const playBtnId = generateId();
  const captionId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'hero', tag: 'section', label: 'Video Hero', children: [overlayId, contentId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '100vh', padding: '80px 24px', backgroundColor: '#000000', backgroundImage: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)', textAlign: 'center', position: 'relative' },
    }),
    [overlayId]: el({ id: overlayId, type: 'container', parentId: sectionId, children: [headingId, textId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '700px', zIndex: 2 },
    }),
    [headingId]: el({ id: headingId, type: 'heading', tag: 'h1', parentId: overlayId, content: 'See It In Action',
      styles: { fontSize: '64px', fontWeight: '900', color: '#ffffff', lineHeight: '1.05', marginBottom: '20px', letterSpacing: '-0.02em' },
      responsiveStyles: { mobile: { fontSize: '38px' } },
    }),
    [textId]: el({ id: textId, type: 'text', tag: 'p', parentId: overlayId, content: 'Watch how our platform transforms the way teams work together. A three-minute tour that will change everything.',
      styles: { fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.65', marginBottom: '40px', maxWidth: '520px' },
    }),
    [contentId]: el({ id: contentId, type: 'container', parentId: sectionId, children: [playBtnId, captionId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 },
    }),
    [playBtnId]: el({ id: playBtnId, type: 'button', tag: 'button', parentId: contentId, content: '▶',
      styles: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '28px', border: '3px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(10px)', transition: 'all 0.3s' },
      hoverStyles: { backgroundColor: 'rgba(255,255,255,0.25)', transform: 'scale(1.1)' },
    }),
    [captionId]: el({ id: captionId, type: 'text', tag: 'span', parentId: contentId, content: 'Play video (3:24)',
      styles: { fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '16px', letterSpacing: '0.05em' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

function heroGradient(): BlockResult {
  const sectionId = generateId();
  const headingId = generateId();
  const textId = generateId();
  const formId = generateId();
  const inputId = generateId();
  const btnId = generateId();
  const socialProofId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'hero', tag: 'section', label: 'Gradient Hero', children: [headingId, textId, formId, socialProofId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: '620px', padding: '100px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', textAlign: 'center' },
    }),
    [headingId]: el({ id: headingId, type: 'heading', tag: 'h1', parentId: sectionId, content: 'Your Next Big Thing Starts Here',
      styles: { fontSize: '56px', fontWeight: '800', color: '#ffffff', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-0.02em' },
      responsiveStyles: { tablet: { fontSize: '42px' }, mobile: { fontSize: '34px' } },
    }),
    [textId]: el({ id: textId, type: 'text', tag: 'p', parentId: sectionId, content: 'Be the first to know when we launch. Sign up for early access and exclusive updates.',
      styles: { fontSize: '19px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', marginBottom: '36px', maxWidth: '500px' },
    }),
    [formId]: el({ id: formId, type: 'container', parentId: sectionId, children: [inputId, btnId],
      styles: { display: 'flex', gap: '12px', maxWidth: '440px', width: '100%' },
      responsiveStyles: { mobile: { flexDirection: 'column' } },
    }),
    [inputId]: el({ id: inputId, type: 'input', tag: 'input', parentId: formId, placeholder: 'Enter your email',
      styles: { flex: '1', padding: '15px 20px', borderRadius: '12px', border: 'none', fontSize: '15px', backgroundColor: 'rgba(255,255,255,0.95)', color: '#333' },
    }),
    [btnId]: el({ id: btnId, type: 'button', tag: 'button', parentId: formId, content: 'Join Waitlist',
      styles: { padding: '15px 28px', backgroundColor: '#111827', color: '#ffffff', fontSize: '15px', fontWeight: '600', borderRadius: '12px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#1f2937', transform: 'translateY(-1px)' },
    }),
    [socialProofId]: el({ id: socialProofId, type: 'text', tag: 'p', parentId: sectionId, content: 'Join 12,000+ early adopters already on the list',
      styles: { fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '20px' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

function heroCreative(): BlockResult {
  const sectionId = generateId();
  const contentId = generateId();
  const headingId = generateId();
  const textId = generateId();
  const btnId = generateId();
  const shape1Id = generateId();
  const shape2Id = generateId();
  const shape3Id = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'hero', tag: 'section', label: 'Creative Hero', children: [contentId, shape1Id, shape2Id, shape3Id],
      styles: { display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', minHeight: '650px', padding: '100px 80px', backgroundColor: '#fef3c7', position: 'relative', overflow: 'hidden' },
      responsiveStyles: { mobile: { padding: '60px 24px', justifyContent: 'center' } },
    }),
    [contentId]: el({ id: contentId, type: 'container', parentId: sectionId, children: [headingId, textId, btnId],
      styles: { display: 'flex', flexDirection: 'column', maxWidth: '560px', zIndex: 2, gap: '24px' },
      responsiveStyles: { mobile: { alignItems: 'center', textAlign: 'center' } },
    }),
    [headingId]: el({ id: headingId, type: 'heading', tag: 'h1', parentId: contentId, content: 'Design Without Limits',
      styles: { fontSize: '68px', fontWeight: '900', color: '#78350f', lineHeight: '1.0', letterSpacing: '-0.03em' },
      responsiveStyles: { tablet: { fontSize: '48px' }, mobile: { fontSize: '38px' } },
    }),
    [textId]: el({ id: textId, type: 'text', tag: 'p', parentId: contentId, content: 'Unleash your creativity with an unconventional toolkit. Break the grid. Defy convention.',
      styles: { fontSize: '18px', color: '#92400e', lineHeight: '1.7', maxWidth: '440px' },
    }),
    [btnId]: el({ id: btnId, type: 'button', tag: 'a', parentId: contentId, content: 'Explore Now', href: '#',
      styles: { display: 'inline-flex', padding: '16px 36px', backgroundColor: '#92400e', color: '#fef3c7', fontSize: '16px', fontWeight: '700', borderRadius: '50px', textDecoration: 'none', transition: 'all 0.3s', width: 'fit-content' },
      hoverStyles: { backgroundColor: '#78350f', transform: 'scale(1.05)' },
    }),
    [shape1Id]: el({ id: shape1Id, type: 'shape', tag: 'div', parentId: sectionId,
      styles: { position: 'absolute', top: '-60px', right: '-40px', width: '320px', height: '320px', borderRadius: '50%', backgroundColor: '#fbbf24', opacity: 0.4 },
    }),
    [shape2Id]: el({ id: shape2Id, type: 'shape', tag: 'div', parentId: sectionId,
      styles: { position: 'absolute', bottom: '40px', right: '160px', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: '#f59e0b', opacity: 0.3 },
    }),
    [shape3Id]: el({ id: shape3Id, type: 'shape', tag: 'div', parentId: sectionId,
      styles: { position: 'absolute', top: '50%', right: '60px', width: '120px', height: '120px', borderRadius: '24px', backgroundColor: '#d97706', opacity: 0.2, transform: 'rotate(45deg)' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

// ============================================================
// NAVBAR BLOCKS
// ============================================================

function navbarSimple(): BlockResult {
  const navId = generateId();
  const logoId = generateId();
  const linksId = generateId();
  const link1Id = generateId();
  const link2Id = generateId();
  const link3Id = generateId();
  const link4Id = generateId();
  const ctaBtnId = generateId();

  const elements: Record<string, BuilderElement> = {
    [navId]: el({ id: navId, type: 'navbar', tag: 'nav', label: 'Simple Navbar', children: [logoId, linksId, ctaBtnId],
      styles: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px 48px', backgroundColor: '#ffffff', borderBottom: '1px solid #f3f4f6' },
      responsiveStyles: { mobile: { padding: '14px 20px' } },
    }),
    [logoId]: el({ id: logoId, type: 'heading', tag: 'a', parentId: navId, content: 'Acme Inc', href: '#',
      styles: { fontSize: '20px', fontWeight: '800', color: '#111827', textDecoration: 'none', letterSpacing: '-0.02em' },
    }),
    [linksId]: el({ id: linksId, type: 'container', parentId: navId, children: [link1Id, link2Id, link3Id, link4Id],
      styles: { display: 'flex', gap: '32px', alignItems: 'center' },
      responsiveStyles: { mobile: { display: 'none' } },
    }),
    [link1Id]: el({ id: link1Id, type: 'link', tag: 'a', parentId: linksId, content: 'Features', href: '#',
      styles: { fontSize: '14px', fontWeight: '500', color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' },
      hoverStyles: { color: '#111827' },
    }),
    [link2Id]: el({ id: link2Id, type: 'link', tag: 'a', parentId: linksId, content: 'Pricing', href: '#',
      styles: { fontSize: '14px', fontWeight: '500', color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' },
      hoverStyles: { color: '#111827' },
    }),
    [link3Id]: el({ id: link3Id, type: 'link', tag: 'a', parentId: linksId, content: 'About', href: '#',
      styles: { fontSize: '14px', fontWeight: '500', color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' },
      hoverStyles: { color: '#111827' },
    }),
    [link4Id]: el({ id: link4Id, type: 'link', tag: 'a', parentId: linksId, content: 'Blog', href: '#',
      styles: { fontSize: '14px', fontWeight: '500', color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' },
      hoverStyles: { color: '#111827' },
    }),
    [ctaBtnId]: el({ id: ctaBtnId, type: 'button', tag: 'a', parentId: navId, content: 'Sign Up', href: '#',
      styles: { display: 'inline-flex', padding: '10px 22px', backgroundColor: '#4c6ef5', color: '#ffffff', fontSize: '14px', fontWeight: '600', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#3b5bdb' },
    }),
  };
  return { elements, rootIds: [navId] };
}

function navbarCentered(): BlockResult {
  const navId = generateId();
  const leftLinksId = generateId();
  const l1Id = generateId();
  const l2Id = generateId();
  const logoId = generateId();
  const rightLinksId = generateId();
  const r1Id = generateId();
  const r2Id = generateId();
  const ctaId = generateId();

  const elements: Record<string, BuilderElement> = {
    [navId]: el({ id: navId, type: 'navbar', tag: 'nav', label: 'Centered Navbar', children: [leftLinksId, logoId, rightLinksId, ctaId],
      styles: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '20px 48px', backgroundColor: '#ffffff', gap: '40px', borderBottom: '1px solid #e5e7eb' },
      responsiveStyles: { mobile: { padding: '14px 20px', gap: '16px', flexWrap: 'wrap', justifyContent: 'space-between' } },
    }),
    [leftLinksId]: el({ id: leftLinksId, type: 'container', parentId: navId, children: [l1Id, l2Id],
      styles: { display: 'flex', gap: '28px' },
      responsiveStyles: { mobile: { display: 'none' } },
    }),
    [l1Id]: el({ id: l1Id, type: 'link', tag: 'a', parentId: leftLinksId, content: 'Products', href: '#',
      styles: { fontSize: '14px', fontWeight: '500', color: '#6b7280', textDecoration: 'none' },
      hoverStyles: { color: '#111827' },
    }),
    [l2Id]: el({ id: l2Id, type: 'link', tag: 'a', parentId: leftLinksId, content: 'Solutions', href: '#',
      styles: { fontSize: '14px', fontWeight: '500', color: '#6b7280', textDecoration: 'none' },
      hoverStyles: { color: '#111827' },
    }),
    [logoId]: el({ id: logoId, type: 'heading', tag: 'a', parentId: navId, content: 'BRAND', href: '#',
      styles: { fontSize: '22px', fontWeight: '900', color: '#111827', textDecoration: 'none', letterSpacing: '0.05em' },
    }),
    [rightLinksId]: el({ id: rightLinksId, type: 'container', parentId: navId, children: [r1Id, r2Id],
      styles: { display: 'flex', gap: '28px' },
      responsiveStyles: { mobile: { display: 'none' } },
    }),
    [r1Id]: el({ id: r1Id, type: 'link', tag: 'a', parentId: rightLinksId, content: 'Resources', href: '#',
      styles: { fontSize: '14px', fontWeight: '500', color: '#6b7280', textDecoration: 'none' },
      hoverStyles: { color: '#111827' },
    }),
    [r2Id]: el({ id: r2Id, type: 'link', tag: 'a', parentId: rightLinksId, content: 'Company', href: '#',
      styles: { fontSize: '14px', fontWeight: '500', color: '#6b7280', textDecoration: 'none' },
      hoverStyles: { color: '#111827' },
    }),
    [ctaId]: el({ id: ctaId, type: 'button', tag: 'a', parentId: navId, content: 'Get Access', href: '#',
      styles: { display: 'inline-flex', padding: '10px 20px', backgroundColor: '#111827', color: '#ffffff', fontSize: '13px', fontWeight: '600', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#374151' },
    }),
  };
  return { elements, rootIds: [navId] };
}

function navbarDark(): BlockResult {
  const navId = generateId();
  const logoId = generateId();
  const linksId = generateId();
  const l1 = generateId(); const l2 = generateId(); const l3 = generateId();
  const rightId = generateId();
  const loginId = generateId();
  const ctaId = generateId();

  const elements: Record<string, BuilderElement> = {
    [navId]: el({ id: navId, type: 'navbar', tag: 'nav', label: 'Dark Navbar', children: [logoId, linksId, rightId],
      styles: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '16px 48px', backgroundColor: '#0f172a' },
      responsiveStyles: { mobile: { padding: '14px 20px' } },
    }),
    [logoId]: el({ id: logoId, type: 'heading', tag: 'a', parentId: navId, content: 'NightOwl', href: '#',
      styles: { fontSize: '20px', fontWeight: '800', color: '#e2e8f0', textDecoration: 'none' },
    }),
    [linksId]: el({ id: linksId, type: 'container', parentId: navId, children: [l1, l2, l3],
      styles: { display: 'flex', gap: '32px' },
      responsiveStyles: { mobile: { display: 'none' } },
    }),
    [l1]: el({ id: l1, type: 'link', tag: 'a', parentId: linksId, content: 'Features', href: '#',
      styles: { fontSize: '14px', fontWeight: '500', color: '#94a3b8', textDecoration: 'none' },
      hoverStyles: { color: '#f1f5f9' },
    }),
    [l2]: el({ id: l2, type: 'link', tag: 'a', parentId: linksId, content: 'Pricing', href: '#',
      styles: { fontSize: '14px', fontWeight: '500', color: '#94a3b8', textDecoration: 'none' },
      hoverStyles: { color: '#f1f5f9' },
    }),
    [l3]: el({ id: l3, type: 'link', tag: 'a', parentId: linksId, content: 'Docs', href: '#',
      styles: { fontSize: '14px', fontWeight: '500', color: '#94a3b8', textDecoration: 'none' },
      hoverStyles: { color: '#f1f5f9' },
    }),
    [rightId]: el({ id: rightId, type: 'container', parentId: navId, children: [loginId, ctaId],
      styles: { display: 'flex', gap: '12px', alignItems: 'center' },
    }),
    [loginId]: el({ id: loginId, type: 'link', tag: 'a', parentId: rightId, content: 'Log In', href: '#',
      styles: { fontSize: '14px', fontWeight: '500', color: '#cbd5e1', textDecoration: 'none' },
      hoverStyles: { color: '#ffffff' },
    }),
    [ctaId]: el({ id: ctaId, type: 'button', tag: 'a', parentId: rightId, content: 'Get Started', href: '#',
      styles: { display: 'inline-flex', padding: '10px 20px', backgroundColor: '#6366f1', color: '#ffffff', fontSize: '14px', fontWeight: '600', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#818cf8' },
    }),
  };
  return { elements, rootIds: [navId] };
}

// ============================================================
// FEATURES BLOCKS
// ============================================================

function featuresGrid3(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const subtitleId = generateId(); const gridId = generateId();
  const features = [
    { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized for speed with edge-first architecture and global CDN caching.' },
    { icon: '🔒', title: 'Secure by Default', desc: 'Enterprise-grade security with automatic SSL, DDoS protection, and SOC2 compliance.' },
    { icon: '📊', title: 'Built-in Analytics', desc: 'Track visitors, conversions, and engagement metrics without third-party scripts.' },
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

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: '3-Column Features', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#ffffff' },
  });
  allEls[containerId] = el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, subtitleId, gridId],
    styles: { maxWidth: '1100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  });
  allEls[titleId] = el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Everything You Need',
    styles: { fontSize: '40px', fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: '12px' },
  });
  allEls[subtitleId] = el({ id: subtitleId, type: 'text', tag: 'p', parentId: containerId, content: 'Powerful features to help you build, ship, and grow faster.',
    styles: { fontSize: '18px', color: '#6b7280', textAlign: 'center', marginBottom: '56px', maxWidth: '500px' },
  });
  allEls[gridId] = el({ id: gridId, type: 'columns', parentId: containerId, children: cardIds,
    styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', width: '100%' },
    responsiveStyles: { tablet: { gridTemplateColumns: 'repeat(2, 1fr)' }, mobile: { gridTemplateColumns: '1fr' } },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

function featuresGrid4(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const gridId = generateId();
  const features = [
    { icon: '🎯', title: 'Precision Targeting', desc: 'Reach the right audience with AI-powered segmentation.' },
    { icon: '🔄', title: 'Auto Sync', desc: 'Keep your data in sync across all platforms in real-time.' },
    { icon: '🧩', title: 'Integrations', desc: 'Connect with 200+ tools you already use daily.' },
    { icon: '📱', title: 'Mobile First', desc: 'Responsive layouts that look great on every device.' },
  ];
  const cardIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};

  for (const feat of features) {
    const cId = generateId(); const iId = generateId(); const tId = generateId(); const dId = generateId();
    cardIds.push(cId);
    allEls[cId] = el({ id: cId, type: 'column', parentId: gridId, children: [iId, tId, dId],
      styles: { padding: '32px 24px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e5e7eb', transition: 'all 0.2s' },
      hoverStyles: { borderColor: '#6366f1', boxShadow: '0 4px 16px rgba(99,102,241,0.12)' },
    });
    allEls[iId] = el({ id: iId, type: 'text', tag: 'span', parentId: cId, content: feat.icon,
      styles: { fontSize: '32px', display: 'block', marginBottom: '16px' },
    });
    allEls[tId] = el({ id: tId, type: 'heading', tag: 'h3', parentId: cId, content: feat.title,
      styles: { fontSize: '17px', fontWeight: '700', color: '#111827', marginBottom: '8px' },
    });
    allEls[dId] = el({ id: dId, type: 'text', tag: 'p', parentId: cId, content: feat.desc,
      styles: { fontSize: '14px', color: '#6b7280', lineHeight: '1.6' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: '4-Column Features', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#f9fafb' },
  });
  allEls[containerId] = el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, gridId],
    styles: { maxWidth: '1100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  });
  allEls[titleId] = el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Built for Scale',
    styles: { fontSize: '36px', fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: '48px' },
  });
  allEls[gridId] = el({ id: gridId, type: 'columns', parentId: containerId, children: cardIds,
    styles: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', width: '100%' },
    responsiveStyles: { tablet: { gridTemplateColumns: 'repeat(2, 1fr)' }, mobile: { gridTemplateColumns: '1fr' } },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

function featuresAlternating(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId();
  const row1Id = generateId(); const row2Id = generateId();
  const r1TextId = generateId(); const r1HeadId = generateId(); const r1DescId = generateId(); const r1ImgId = generateId();
  const r2TextId = generateId(); const r2HeadId = generateId(); const r2DescId = generateId(); const r2ImgId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'section', tag: 'section', label: 'Alternating Features', children: [containerId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#ffffff' },
    }),
    [containerId]: el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, row1Id, row2Id],
      styles: { maxWidth: '1100px', width: '100%', display: 'flex', flexDirection: 'column', gap: '80px' },
    }),
    [titleId]: el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'How It Works',
      styles: { fontSize: '40px', fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: '20px' },
    }),
    // Row 1: text left, image right
    [row1Id]: el({ id: row1Id, type: 'columns', parentId: containerId, children: [r1TextId, r1ImgId],
      styles: { display: 'flex', alignItems: 'center', gap: '60px' },
      responsiveStyles: { mobile: { flexDirection: 'column', gap: '32px' } },
    }),
    [r1TextId]: el({ id: r1TextId, type: 'container', parentId: row1Id, children: [r1HeadId, r1DescId],
      styles: { flex: '1', display: 'flex', flexDirection: 'column', gap: '16px' },
    }),
    [r1HeadId]: el({ id: r1HeadId, type: 'heading', tag: 'h3', parentId: r1TextId, content: 'Design with drag & drop',
      styles: { fontSize: '28px', fontWeight: '700', color: '#111827', lineHeight: '1.2' },
    }),
    [r1DescId]: el({ id: r1DescId, type: 'text', tag: 'p', parentId: r1TextId, content: 'Build beautiful pages visually with our intuitive drag-and-drop editor. No code required, just your imagination.',
      styles: { fontSize: '16px', color: '#6b7280', lineHeight: '1.7' },
    }),
    [r1ImgId]: el({ id: r1ImgId, type: 'image', tag: 'div', parentId: row1Id,
      styles: { flex: '1', height: '300px', borderRadius: '16px', backgroundColor: '#e0e7ff', backgroundImage: 'linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%)' },
    }),
    // Row 2: image left, text right
    [row2Id]: el({ id: row2Id, type: 'columns', parentId: containerId, children: [r2ImgId, r2TextId],
      styles: { display: 'flex', alignItems: 'center', gap: '60px' },
      responsiveStyles: { mobile: { flexDirection: 'column-reverse', gap: '32px' } },
    }),
    [r2ImgId]: el({ id: r2ImgId, type: 'image', tag: 'div', parentId: row2Id,
      styles: { flex: '1', height: '300px', borderRadius: '16px', backgroundColor: '#d1fae5', backgroundImage: 'linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%)' },
    }),
    [r2TextId]: el({ id: r2TextId, type: 'container', parentId: row2Id, children: [r2HeadId, r2DescId],
      styles: { flex: '1', display: 'flex', flexDirection: 'column', gap: '16px' },
    }),
    [r2HeadId]: el({ id: r2HeadId, type: 'heading', tag: 'h3', parentId: r2TextId, content: 'Publish in one click',
      styles: { fontSize: '28px', fontWeight: '700', color: '#111827', lineHeight: '1.2' },
    }),
    [r2DescId]: el({ id: r2DescId, type: 'text', tag: 'p', parentId: r2TextId, content: 'When you are ready, publish your site to a global CDN with a single click. Instant deployment, zero downtime.',
      styles: { fontSize: '16px', color: '#6b7280', lineHeight: '1.7' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

function featuresShowcase(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const tagId = generateId(); const titleId = generateId(); const descId = generateId();
  const imgId = generateId();
  const statsRowId = generateId();
  const stat1Id = generateId(); const s1Val = generateId(); const s1Lab = generateId();
  const stat2Id = generateId(); const s2Val = generateId(); const s2Lab = generateId();
  const stat3Id = generateId(); const s3Val = generateId(); const s3Lab = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'section', tag: 'section', label: 'Feature Showcase', children: [containerId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)' },
    }),
    [containerId]: el({ id: containerId, type: 'container', parentId: sectionId, children: [tagId, titleId, descId, imgId, statsRowId],
      styles: { maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
    }),
    [tagId]: el({ id: tagId, type: 'text', tag: 'span', parentId: containerId, content: 'FEATURE SPOTLIGHT',
      styles: { fontSize: '12px', fontWeight: '700', color: '#a5b4fc', letterSpacing: '0.12em', marginBottom: '16px' },
    }),
    [titleId]: el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Visual Editor That Thinks Like You',
      styles: { fontSize: '44px', fontWeight: '800', color: '#ffffff', lineHeight: '1.1', marginBottom: '16px', letterSpacing: '-0.02em' },
      responsiveStyles: { mobile: { fontSize: '30px' } },
    }),
    [descId]: el({ id: descId, type: 'text', tag: 'p', parentId: containerId, content: 'Our AI-assisted editor anticipates your next move. Build entire layouts with natural language prompts or pixel-perfect manual controls.',
      styles: { fontSize: '18px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.65', marginBottom: '40px', maxWidth: '600px' },
    }),
    [imgId]: el({ id: imgId, type: 'image', tag: 'div', parentId: containerId,
      styles: { width: '100%', height: '380px', borderRadius: '16px', backgroundImage: 'linear-gradient(135deg, #4c6ef5 0%, #7c3aed 100%)', marginBottom: '48px', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' },
    }),
    [statsRowId]: el({ id: statsRowId, type: 'columns', parentId: containerId, children: [stat1Id, stat2Id, stat3Id],
      styles: { display: 'flex', gap: '48px', justifyContent: 'center' },
      responsiveStyles: { mobile: { flexDirection: 'column', gap: '24px' } },
    }),
    [stat1Id]: el({ id: stat1Id, type: 'container', parentId: statsRowId, children: [s1Val, s1Lab],
      styles: { textAlign: 'center' },
    }),
    [s1Val]: el({ id: s1Val, type: 'heading', tag: 'span', parentId: stat1Id, content: '10x',
      styles: { fontSize: '32px', fontWeight: '800', color: '#a5b4fc', display: 'block' },
    }),
    [s1Lab]: el({ id: s1Lab, type: 'text', tag: 'span', parentId: stat1Id, content: 'Faster Builds',
      styles: { fontSize: '14px', color: 'rgba(255,255,255,0.5)' },
    }),
    [stat2Id]: el({ id: stat2Id, type: 'container', parentId: statsRowId, children: [s2Val, s2Lab],
      styles: { textAlign: 'center' },
    }),
    [s2Val]: el({ id: s2Val, type: 'heading', tag: 'span', parentId: stat2Id, content: '50K+',
      styles: { fontSize: '32px', fontWeight: '800', color: '#a5b4fc', display: 'block' },
    }),
    [s2Lab]: el({ id: s2Lab, type: 'text', tag: 'span', parentId: stat2Id, content: 'Active Users',
      styles: { fontSize: '14px', color: 'rgba(255,255,255,0.5)' },
    }),
    [stat3Id]: el({ id: stat3Id, type: 'container', parentId: statsRowId, children: [s3Val, s3Lab],
      styles: { textAlign: 'center' },
    }),
    [s3Val]: el({ id: s3Val, type: 'heading', tag: 'span', parentId: stat3Id, content: '99.9%',
      styles: { fontSize: '32px', fontWeight: '800', color: '#a5b4fc', display: 'block' },
    }),
    [s3Lab]: el({ id: s3Lab, type: 'text', tag: 'span', parentId: stat3Id, content: 'Uptime',
      styles: { fontSize: '14px', color: 'rgba(255,255,255,0.5)' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

// ============================================================
// TESTIMONIAL BLOCKS
// ============================================================

function testimonialCards(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const subtitleId = generateId(); const gridId = generateId();
  const testimonials = [
    { name: 'Sarah Chen', role: 'CEO, TechFlow', quote: 'This platform transformed our entire workflow. We shipped 3x faster within the first month.', stars: 5 },
    { name: 'Marcus Johnson', role: 'CTO, Innovate Labs', quote: 'The best development tool we have ever used. The AI features alone save us hours every single week.', stars: 5 },
    { name: 'Emily Rodriguez', role: 'Lead Designer, Creative Co', quote: 'Beautiful, intuitive, and incredibly powerful. I recommend it to every designer I know.', stars: 5 },
  ];
  const cardIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};

  for (const t of testimonials) {
    const cId = generateId(); const starsId = generateId(); const qId = generateId();
    const avatarRowId = generateId(); const avatarId = generateId(); const infoId = generateId();
    const nId = generateId(); const rId = generateId();
    cardIds.push(cId);
    allEls[cId] = el({ id: cId, type: 'column', parentId: gridId, children: [starsId, qId, avatarRowId],
      styles: { padding: '36px 32px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '20px' },
    });
    allEls[starsId] = el({ id: starsId, type: 'text', tag: 'span', parentId: cId, content: '★★★★★',
      styles: { fontSize: '16px', color: '#f59e0b', letterSpacing: '2px' },
    });
    allEls[qId] = el({ id: qId, type: 'text', tag: 'p', parentId: cId, content: `"${t.quote}"`,
      styles: { fontSize: '15px', color: '#374151', lineHeight: '1.7', fontStyle: 'italic', flex: '1' },
    });
    allEls[avatarRowId] = el({ id: avatarRowId, type: 'container', parentId: cId, children: [avatarId, infoId],
      styles: { display: 'flex', alignItems: 'center', gap: '12px' },
    });
    allEls[avatarId] = el({ id: avatarId, type: 'shape', tag: 'div', parentId: avatarRowId,
      styles: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e5e7eb', flexShrink: '0' },
    });
    allEls[infoId] = el({ id: infoId, type: 'container', parentId: avatarRowId, children: [nId, rId],
      styles: { display: 'flex', flexDirection: 'column' },
    });
    allEls[nId] = el({ id: nId, type: 'text', tag: 'span', parentId: infoId, content: t.name,
      styles: { fontSize: '14px', fontWeight: '700', color: '#111827' },
    });
    allEls[rId] = el({ id: rId, type: 'text', tag: 'span', parentId: infoId, content: t.role,
      styles: { fontSize: '12px', color: '#9ca3af' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: 'Testimonial Cards', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#f9fafb' },
  });
  allEls[containerId] = el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, subtitleId, gridId],
    styles: { maxWidth: '1100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  });
  allEls[titleId] = el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Loved by Thousands',
    styles: { fontSize: '40px', fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: '12px' },
  });
  allEls[subtitleId] = el({ id: subtitleId, type: 'text', tag: 'p', parentId: containerId, content: 'See what our customers have to say about us.',
    styles: { fontSize: '18px', color: '#6b7280', textAlign: 'center', marginBottom: '56px' },
  });
  allEls[gridId] = el({ id: gridId, type: 'columns', parentId: containerId, children: cardIds,
    styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', width: '100%' },
    responsiveStyles: { mobile: { gridTemplateColumns: '1fr' } },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

function testimonialLarge(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const quoteMarkId = generateId(); const quoteId = generateId();
  const avatarId = generateId(); const nameId = generateId(); const roleId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'section', tag: 'section', label: 'Large Testimonial', children: [containerId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '120px 24px', backgroundColor: '#111827' },
    }),
    [containerId]: el({ id: containerId, type: 'container', parentId: sectionId, children: [quoteMarkId, quoteId, avatarId, nameId, roleId],
      styles: { maxWidth: '760px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
    }),
    [quoteMarkId]: el({ id: quoteMarkId, type: 'text', tag: 'span', parentId: containerId, content: '"',
      styles: { fontSize: '120px', fontWeight: '800', color: '#4c6ef5', lineHeight: '0.8', marginBottom: '16px', fontFamily: 'Georgia, serif' },
    }),
    [quoteId]: el({ id: quoteId, type: 'text', tag: 'blockquote', parentId: containerId,
      content: 'Switching to this platform was the single best decision we made last year. Our team productivity doubled, our deployment time dropped by 80%, and our customers noticed the difference immediately.',
      styles: { fontSize: '24px', color: '#e5e7eb', lineHeight: '1.6', marginBottom: '36px', fontStyle: 'italic' },
      responsiveStyles: { mobile: { fontSize: '18px' } },
    }),
    [avatarId]: el({ id: avatarId, type: 'shape', tag: 'div', parentId: containerId,
      styles: { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#374151', marginBottom: '16px' },
    }),
    [nameId]: el({ id: nameId, type: 'text', tag: 'span', parentId: containerId, content: 'Alexandra Rivera',
      styles: { fontSize: '16px', fontWeight: '700', color: '#ffffff', display: 'block', marginBottom: '4px' },
    }),
    [roleId]: el({ id: roleId, type: 'text', tag: 'span', parentId: containerId, content: 'VP of Engineering, Quantum Labs',
      styles: { fontSize: '14px', color: '#6b7280' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

function testimonialGrid(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const gridId = generateId();
  const testimonials = [
    { name: 'David Park', role: 'Founder, LaunchPad', quote: 'We went from idea to launch in just two weeks. The templates saved us months of development time.' },
    { name: 'Lisa Thompson', role: 'Marketing Dir, Elevate', quote: 'Our conversion rates increased by 45% after rebuilding our site with this tool. Absolutely incredible results.' },
    { name: 'James Wilson', role: 'CTO, DataFlow', quote: 'The developer experience is unmatched. Clean code output, great API, and excellent documentation.' },
    { name: 'Maria Garcia', role: 'Designer, Pixel Perfect', quote: 'Finally a builder that respects design. Precise control over every detail without writing CSS by hand.' },
  ];
  const cardIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};
  const cardColors = ['#fef3c7', '#dbeafe', '#fce7f3', '#d1fae5'];

  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i];
    const cId = generateId(); const qId = generateId();
    const nId = generateId(); const rId = generateId();
    cardIds.push(cId);
    allEls[cId] = el({ id: cId, type: 'column', parentId: gridId, children: [qId, nId, rId],
      styles: { padding: '32px', backgroundColor: cardColors[i], borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' },
    });
    allEls[qId] = el({ id: qId, type: 'text', tag: 'p', parentId: cId, content: `"${t.quote}"`,
      styles: { fontSize: '15px', color: '#374151', lineHeight: '1.7', flex: '1' },
    });
    allEls[nId] = el({ id: nId, type: 'text', tag: 'span', parentId: cId, content: t.name,
      styles: { fontSize: '14px', fontWeight: '700', color: '#111827' },
    });
    allEls[rId] = el({ id: rId, type: 'text', tag: 'span', parentId: cId, content: t.role,
      styles: { fontSize: '12px', color: '#6b7280' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: 'Testimonial Grid', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#ffffff' },
  });
  allEls[containerId] = el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, gridId],
    styles: { maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  });
  allEls[titleId] = el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'What People Are Saying',
    styles: { fontSize: '36px', fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: '48px' },
  });
  allEls[gridId] = el({ id: gridId, type: 'columns', parentId: containerId, children: cardIds,
    styles: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', width: '100%' },
    responsiveStyles: { mobile: { gridTemplateColumns: '1fr' } },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

// ============================================================
// CTA BLOCKS
// ============================================================

function ctaBanner(): BlockResult {
  const sectionId = generateId();
  const headingId = generateId(); const textId = generateId();
  const btnGroupId = generateId(); const btn1Id = generateId(); const btn2Id = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'cta', tag: 'section', label: 'CTA Banner', children: [headingId, textId, btnGroupId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '80px 24px', background: 'linear-gradient(135deg, #4c6ef5 0%, #7c3aed 100%)', textAlign: 'center' },
    }),
    [headingId]: el({ id: headingId, type: 'heading', tag: 'h2', parentId: sectionId, content: 'Ready to Get Started?',
      styles: { fontSize: '44px', fontWeight: '800', color: '#ffffff', marginBottom: '16px', letterSpacing: '-0.02em' },
      responsiveStyles: { mobile: { fontSize: '32px' } },
    }),
    [textId]: el({ id: textId, type: 'text', tag: 'p', parentId: sectionId, content: 'Start your free 14-day trial today. No credit card required.',
      styles: { fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '32px', maxWidth: '500px' },
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

function ctaNewsletter(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const iconId = generateId(); const headingId = generateId(); const textId = generateId();
  const formId = generateId(); const inputId = generateId(); const btnId = generateId();
  const disclaimerId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'cta', tag: 'section', label: 'Newsletter CTA', children: [containerId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '80px 24px', backgroundColor: '#f9fafb' },
    }),
    [containerId]: el({ id: containerId, type: 'container', parentId: sectionId, children: [iconId, headingId, textId, formId, disclaimerId],
      styles: { maxWidth: '520px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '48px 40px', backgroundColor: '#ffffff', borderRadius: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb' },
    }),
    [iconId]: el({ id: iconId, type: 'text', tag: 'span', parentId: containerId, content: '📬',
      styles: { fontSize: '40px', marginBottom: '16px' },
    }),
    [headingId]: el({ id: headingId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Stay in the Loop',
      styles: { fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '8px' },
    }),
    [textId]: el({ id: textId, type: 'text', tag: 'p', parentId: containerId, content: 'Get the latest news, tips, and product updates delivered to your inbox weekly.',
      styles: { fontSize: '15px', color: '#6b7280', lineHeight: '1.6', marginBottom: '24px' },
    }),
    [formId]: el({ id: formId, type: 'container', parentId: containerId, children: [inputId, btnId],
      styles: { display: 'flex', gap: '10px', width: '100%' },
      responsiveStyles: { mobile: { flexDirection: 'column' } },
    }),
    [inputId]: el({ id: inputId, type: 'input', tag: 'input', parentId: formId, placeholder: 'you@example.com',
      styles: { flex: '1', padding: '13px 16px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '14px' },
    }),
    [btnId]: el({ id: btnId, type: 'button', tag: 'button', parentId: formId, content: 'Subscribe',
      styles: { padding: '13px 24px', backgroundColor: '#111827', color: '#ffffff', fontSize: '14px', fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#374151' },
    }),
    [disclaimerId]: el({ id: disclaimerId, type: 'text', tag: 'p', parentId: containerId, content: 'No spam, ever. Unsubscribe anytime.',
      styles: { fontSize: '12px', color: '#9ca3af', marginTop: '12px' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

function ctaMinimal(): BlockResult {
  const sectionId = generateId();
  const headingId = generateId(); const dividerId = generateId(); const btnId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'cta', tag: 'section', label: 'Minimal CTA', children: [headingId, dividerId, btnId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#ffffff', textAlign: 'center' },
    }),
    [headingId]: el({ id: headingId, type: 'heading', tag: 'h2', parentId: sectionId, content: 'Start building something great.',
      styles: { fontSize: '48px', fontWeight: '800', color: '#111827', marginBottom: '20px', letterSpacing: '-0.03em', maxWidth: '600px' },
      responsiveStyles: { mobile: { fontSize: '32px' } },
    }),
    [dividerId]: el({ id: dividerId, type: 'divider', tag: 'hr', parentId: sectionId,
      styles: { width: '48px', height: '3px', backgroundColor: '#4c6ef5', border: 'none', borderRadius: '2px', margin: '0 auto 28px' },
    }),
    [btnId]: el({ id: btnId, type: 'button', tag: 'a', parentId: sectionId, content: 'Get Started Free', href: '#',
      styles: { display: 'inline-flex', padding: '16px 40px', backgroundColor: '#4c6ef5', color: '#ffffff', fontSize: '16px', fontWeight: '700', borderRadius: '10px', textDecoration: 'none', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#3b5bdb', transform: 'translateY(-1px)' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

// ============================================================
// PRICING BLOCKS
// ============================================================

function pricingThreeColumn(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const subtitleId = generateId(); const gridId = generateId();
  const plans = [
    { name: 'Starter', price: '$12', period: '/month', desc: 'Perfect for side projects', features: ['3 websites', '10GB storage', 'Custom domain', 'Email support'], highlighted: false, btnText: 'Start Free', bg: '#ffffff', accent: '#6b7280' },
    { name: 'Professional', price: '$29', period: '/month', desc: 'For growing businesses', features: ['10 websites', '50GB storage', 'Priority support', 'Advanced analytics', 'E-commerce', 'CMS access'], highlighted: true, btnText: 'Get Started', bg: '#4c6ef5', accent: '#ffffff' },
    { name: 'Business', price: '$79', period: '/month', desc: 'For large teams', features: ['Unlimited websites', '200GB storage', 'White label', 'API access', 'Team features', 'SSO', 'Dedicated support'], highlighted: false, btnText: 'Contact Sales', bg: '#ffffff', accent: '#6b7280' },
  ];
  const cardIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};

  for (const plan of plans) {
    const cId = generateId(); const nId = generateId(); const dscId = generateId();
    const pId = generateId(); const perIdEl = generateId();
    const fListId = generateId(); const btnId = generateId();
    cardIds.push(cId);

    const featureIds: string[] = [];
    for (const feat of plan.features) {
      const fId = generateId();
      featureIds.push(fId);
      allEls[fId] = el({ id: fId, type: 'text', tag: 'li', parentId: fListId, content: `✓  ${feat}`,
        styles: { fontSize: '14px', color: plan.highlighted ? 'rgba(255,255,255,0.85)' : '#4b5563', padding: '8px 0', borderBottom: plan.highlighted ? '1px solid rgba(255,255,255,0.1)' : '1px solid #f3f4f6' },
      });
    }

    allEls[cId] = el({ id: cId, type: 'column', parentId: gridId, children: [nId, dscId, pId, perIdEl, fListId, btnId],
      styles: {
        padding: '40px 32px', borderRadius: '20px', textAlign: 'center', transition: 'all 0.3s', display: 'flex', flexDirection: 'column',
        backgroundColor: plan.bg,
        border: plan.highlighted ? 'none' : '1px solid #e5e7eb',
        transform: plan.highlighted ? 'scale(1.05)' : 'none',
        boxShadow: plan.highlighted ? '0 20px 60px rgba(76,110,245,0.3)' : 'none',
      },
    });
    allEls[nId] = el({ id: nId, type: 'text', tag: 'span', parentId: cId, content: plan.name,
      styles: { fontSize: '13px', fontWeight: '700', color: plan.highlighted ? 'rgba(255,255,255,0.7)' : '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' },
    });
    allEls[dscId] = el({ id: dscId, type: 'text', tag: 'p', parentId: cId, content: plan.desc,
      styles: { fontSize: '13px', color: plan.highlighted ? 'rgba(255,255,255,0.6)' : '#9ca3af', marginBottom: '16px' },
    });
    allEls[pId] = el({ id: pId, type: 'heading', tag: 'h3', parentId: cId, content: plan.price,
      styles: { fontSize: '48px', fontWeight: '800', color: plan.highlighted ? '#ffffff' : '#111827', display: 'inline', lineHeight: '1' },
    });
    allEls[perIdEl] = el({ id: perIdEl, type: 'text', tag: 'span', parentId: cId, content: plan.period,
      styles: { fontSize: '16px', color: plan.highlighted ? 'rgba(255,255,255,0.5)' : '#9ca3af', display: 'block', marginBottom: '28px' },
    });
    allEls[fListId] = el({ id: fListId, type: 'list', tag: 'ul', parentId: cId, children: featureIds,
      styles: { listStyle: 'none', padding: '0', marginBottom: '28px', textAlign: 'left', flex: '1' },
    });
    allEls[btnId] = el({ id: btnId, type: 'button', tag: 'a', parentId: cId, content: plan.btnText, href: '#',
      styles: {
        display: 'block', padding: '14px 24px', borderRadius: '10px', textDecoration: 'none', fontWeight: '600', fontSize: '15px', textAlign: 'center', transition: 'all 0.2s',
        backgroundColor: plan.highlighted ? '#ffffff' : '#4c6ef5',
        color: plan.highlighted ? '#4c6ef5' : '#ffffff',
      },
      hoverStyles: { transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: '3-Tier Pricing', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#f9fafb' },
  });
  allEls[containerId] = el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, subtitleId, gridId],
    styles: { maxWidth: '1100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  });
  allEls[titleId] = el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Simple, Transparent Pricing',
    styles: { fontSize: '40px', fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: '12px' },
  });
  allEls[subtitleId] = el({ id: subtitleId, type: 'text', tag: 'p', parentId: containerId, content: 'No hidden fees. Cancel anytime. Start free.',
    styles: { fontSize: '18px', color: '#6b7280', textAlign: 'center', marginBottom: '56px' },
  });
  allEls[gridId] = el({ id: gridId, type: 'columns', parentId: containerId, children: cardIds,
    styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', width: '100%', alignItems: 'stretch' },
    responsiveStyles: { mobile: { gridTemplateColumns: '1fr' } },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

function pricingTwoColumn(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const subtitleId = generateId(); const gridId = generateId();
  const plans = [
    { name: 'Free', price: '$0', features: ['1 project', '100MB storage', 'Community support', 'Basic templates'], btnText: 'Get Started', btnBg: '#111827', btnColor: '#ffffff' },
    { name: 'Pro', price: '$19', features: ['Unlimited projects', '10GB storage', 'Priority support', 'All templates', 'Custom domains', 'Analytics dashboard', 'API access'], btnText: 'Upgrade to Pro', btnBg: '#4c6ef5', btnColor: '#ffffff' },
  ];
  const cardIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};

  for (let i = 0; i < plans.length; i++) {
    const plan = plans[i];
    const cId = generateId(); const nId = generateId();
    const pId = generateId(); const divId = generateId();
    const fListId = generateId(); const btnId = generateId();
    cardIds.push(cId);

    const featureIds: string[] = [];
    for (const feat of plan.features) {
      const fId = generateId();
      featureIds.push(fId);
      allEls[fId] = el({ id: fId, type: 'text', tag: 'li', parentId: fListId, content: `✓  ${feat}`,
        styles: { fontSize: '15px', color: '#4b5563', padding: '10px 0', borderBottom: '1px solid #f3f4f6' },
      });
    }

    allEls[cId] = el({ id: cId, type: 'column', parentId: gridId, children: [nId, pId, divId, fListId, btnId],
      styles: { padding: '48px 40px', backgroundColor: '#ffffff', borderRadius: '20px', border: i === 1 ? '2px solid #4c6ef5' : '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' },
    });
    allEls[nId] = el({ id: nId, type: 'heading', tag: 'h3', parentId: cId, content: plan.name,
      styles: { fontSize: '22px', fontWeight: '700', color: '#111827', marginBottom: '8px' },
    });
    allEls[pId] = el({ id: pId, type: 'heading', tag: 'span', parentId: cId, content: plan.price,
      styles: { fontSize: '56px', fontWeight: '800', color: '#111827', display: 'block', lineHeight: '1' },
    });
    allEls[divId] = el({ id: divId, type: 'divider', tag: 'hr', parentId: cId,
      styles: { width: '100%', height: '1px', backgroundColor: '#e5e7eb', border: 'none', margin: '24px 0' },
    });
    allEls[fListId] = el({ id: fListId, type: 'list', tag: 'ul', parentId: cId, children: featureIds,
      styles: { listStyle: 'none', padding: '0', marginBottom: '32px', flex: '1' },
    });
    allEls[btnId] = el({ id: btnId, type: 'button', tag: 'a', parentId: cId, content: plan.btnText, href: '#',
      styles: { display: 'block', padding: '16px 24px', borderRadius: '12px', textDecoration: 'none', fontWeight: '600', fontSize: '16px', textAlign: 'center', transition: 'all 0.2s', backgroundColor: plan.btnBg, color: plan.btnColor },
      hoverStyles: { transform: 'translateY(-1px)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: '2-Plan Pricing', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#ffffff' },
  });
  allEls[containerId] = el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, subtitleId, gridId],
    styles: { maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  });
  allEls[titleId] = el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Free vs Pro',
    styles: { fontSize: '36px', fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: '12px' },
  });
  allEls[subtitleId] = el({ id: subtitleId, type: 'text', tag: 'p', parentId: containerId, content: 'Start free, upgrade when you need more.',
    styles: { fontSize: '18px', color: '#6b7280', textAlign: 'center', marginBottom: '48px' },
  });
  allEls[gridId] = el({ id: gridId, type: 'columns', parentId: containerId, children: cardIds,
    styles: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', width: '100%' },
    responsiveStyles: { mobile: { gridTemplateColumns: '1fr' } },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

// ============================================================
// FAQ BLOCKS
// ============================================================

function faqAccordion(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const subtitleId = generateId(); const listId = generateId();
  const faqs = [
    { q: 'How does the free trial work?', a: 'You get full access to all Professional features for 14 days. No credit card required. At the end of your trial, choose a plan or continue with our free tier.' },
    { q: 'Can I change my plan later?', a: 'Absolutely. You can upgrade, downgrade, or cancel your plan at any time from your account settings. Changes take effect at the start of your next billing cycle.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual plans. All payments are processed securely through Stripe.' },
    { q: 'Is there a long-term contract?', a: 'No. All plans are month-to-month with no long-term commitment. You can cancel anytime. We also offer annual plans at a discounted rate.' },
    { q: 'Do you offer refunds?', a: 'Yes, we offer a 30-day money-back guarantee on all paid plans. If you are not satisfied, contact our support team for a full refund.' },
  ];
  const itemIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};

  for (const faq of faqs) {
    const itemId = generateId(); const qId = generateId(); const aId = generateId();
    itemIds.push(itemId);
    allEls[itemId] = el({ id: itemId, type: 'container', parentId: listId, children: [qId, aId],
      styles: { padding: '24px 0', borderBottom: '1px solid #e5e7eb' },
    });
    allEls[qId] = el({ id: qId, type: 'heading', tag: 'h3', parentId: itemId, content: faq.q,
      styles: { fontSize: '17px', fontWeight: '600', color: '#111827', marginBottom: '8px', cursor: 'pointer' },
    });
    allEls[aId] = el({ id: aId, type: 'text', tag: 'p', parentId: itemId, content: faq.a,
      styles: { fontSize: '15px', color: '#6b7280', lineHeight: '1.7' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: 'FAQ Accordion', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#ffffff' },
  });
  allEls[containerId] = el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, subtitleId, listId],
    styles: { maxWidth: '700px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  });
  allEls[titleId] = el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Frequently Asked Questions',
    styles: { fontSize: '36px', fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: '12px' },
  });
  allEls[subtitleId] = el({ id: subtitleId, type: 'text', tag: 'p', parentId: containerId, content: 'Everything you need to know about our platform.',
    styles: { fontSize: '18px', color: '#6b7280', textAlign: 'center', marginBottom: '40px' },
  });
  allEls[listId] = el({ id: listId, type: 'container', parentId: containerId, children: itemIds,
    styles: { width: '100%' },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

function faqTwoColumn(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const leftId = generateId(); const rightId = generateId();
  const titleId = generateId(); const descId = generateId(); const contactBtnId = generateId();
  const faqs = [
    { q: 'What is included in the free plan?', a: 'The free plan includes 1 project, basic templates, community support, and 100MB of storage.' },
    { q: 'How do I cancel my subscription?', a: 'Go to Settings, then Billing, and click Cancel Subscription. Your access continues until the end of the billing period.' },
    { q: 'Can I export my website?', a: 'Yes. Pro users can export their site as clean HTML, CSS, and JavaScript. You own your code completely.' },
    { q: 'Do you provide custom development?', a: 'We offer custom development services for enterprise clients. Contact our sales team for a consultation.' },
  ];
  const faqIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};

  for (const faq of faqs) {
    const itemId = generateId(); const qId = generateId(); const aId = generateId();
    faqIds.push(itemId);
    allEls[itemId] = el({ id: itemId, type: 'container', parentId: rightId, children: [qId, aId],
      styles: { padding: '20px 24px', backgroundColor: '#f9fafb', borderRadius: '12px' },
    });
    allEls[qId] = el({ id: qId, type: 'heading', tag: 'h3', parentId: itemId, content: faq.q,
      styles: { fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '6px' },
    });
    allEls[aId] = el({ id: aId, type: 'text', tag: 'p', parentId: itemId, content: faq.a,
      styles: { fontSize: '14px', color: '#6b7280', lineHeight: '1.6' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: '2-Column FAQ', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#ffffff' },
  });
  allEls[containerId] = el({ id: containerId, type: 'columns', parentId: sectionId, children: [leftId, rightId],
    styles: { maxWidth: '1100px', width: '100%', display: 'flex', gap: '60px', alignItems: 'flex-start' },
    responsiveStyles: { mobile: { flexDirection: 'column', gap: '40px' } },
  });
  allEls[leftId] = el({ id: leftId, type: 'container', parentId: containerId, children: [titleId, descId, contactBtnId],
    styles: { flex: '1', display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '100px' },
  });
  allEls[titleId] = el({ id: titleId, type: 'heading', tag: 'h2', parentId: leftId, content: 'Got Questions?',
    styles: { fontSize: '36px', fontWeight: '800', color: '#111827', lineHeight: '1.1' },
  });
  allEls[descId] = el({ id: descId, type: 'text', tag: 'p', parentId: leftId, content: 'Find quick answers below. If you still need help, our support team is always available.',
    styles: { fontSize: '16px', color: '#6b7280', lineHeight: '1.6' },
  });
  allEls[contactBtnId] = el({ id: contactBtnId, type: 'button', tag: 'a', parentId: leftId, content: 'Contact Support', href: '#',
    styles: { display: 'inline-flex', padding: '12px 24px', backgroundColor: '#111827', color: '#ffffff', fontSize: '14px', fontWeight: '600', borderRadius: '8px', textDecoration: 'none', width: 'fit-content', transition: 'all 0.2s' },
    hoverStyles: { backgroundColor: '#374151' },
  });
  allEls[rightId] = el({ id: rightId, type: 'container', parentId: containerId, children: faqIds,
    styles: { flex: '1.5', display: 'flex', flexDirection: 'column', gap: '12px' },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

// ============================================================
// CONTENT BLOCKS
// ============================================================

function statsCounter(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const gridId = generateId();
  const stats = [
    { value: '10M+', label: 'Websites Built', color: '#4c6ef5' },
    { value: '99.9%', label: 'Uptime Guarantee', color: '#10b981' },
    { value: '150+', label: 'Countries Served', color: '#f59e0b' },
    { value: '<50ms', label: 'Avg Response Time', color: '#ec4899' },
  ];
  const cardIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};

  for (const s of stats) {
    const cId = generateId(); const vId = generateId(); const lId = generateId();
    cardIds.push(cId);
    allEls[cId] = el({ id: cId, type: 'column', parentId: gridId, children: [vId, lId],
      styles: { textAlign: 'center', padding: '32px 16px' },
    });
    allEls[vId] = el({ id: vId, type: 'heading', tag: 'h3', parentId: cId, content: s.value,
      styles: { fontSize: '48px', fontWeight: '800', color: s.color, marginBottom: '8px', letterSpacing: '-0.02em' },
    });
    allEls[lId] = el({ id: lId, type: 'text', tag: 'p', parentId: cId, content: s.label,
      styles: { fontSize: '15px', color: '#6b7280', fontWeight: '500' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: 'Stats Counter', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '80px 24px', backgroundColor: '#f9fafb', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' },
  });
  allEls[containerId] = el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, gridId],
    styles: { maxWidth: '1000px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  });
  allEls[titleId] = el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Trusted by Teams Worldwide',
    styles: { fontSize: '32px', fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: '48px' },
  });
  allEls[gridId] = el({ id: gridId, type: 'columns', parentId: containerId, children: cardIds,
    styles: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', width: '100%' },
    responsiveStyles: { tablet: { gridTemplateColumns: 'repeat(2, 1fr)' }, mobile: { gridTemplateColumns: 'repeat(2, 1fr)' } },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

function logoCloud(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const gridId = generateId();
  const logos = ['Stripe', 'Vercel', 'GitHub', 'Figma', 'Notion', 'Linear'];
  const logoIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};

  for (const logo of logos) {
    const lId = generateId();
    logoIds.push(lId);
    allEls[lId] = el({ id: lId, type: 'text', tag: 'span', parentId: gridId, content: logo,
      styles: { fontSize: '20px', fontWeight: '700', color: '#d1d5db', textAlign: 'center', padding: '24px 16px', letterSpacing: '0.05em' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: 'Logo Cloud', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '60px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' },
  });
  allEls[containerId] = el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, gridId],
    styles: { maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  });
  allEls[titleId] = el({ id: titleId, type: 'text', tag: 'p', parentId: containerId, content: 'Trusted by leading companies worldwide',
    styles: { fontSize: '14px', fontWeight: '500', color: '#9ca3af', textAlign: 'center', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.08em' },
  });
  allEls[gridId] = el({ id: gridId, type: 'columns', parentId: containerId, children: logoIds,
    styles: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', width: '100%', alignItems: 'center' },
    responsiveStyles: { tablet: { gridTemplateColumns: 'repeat(3, 1fr)' }, mobile: { gridTemplateColumns: 'repeat(2, 1fr)' } },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

function teamGrid(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const subtitleId = generateId(); const gridId = generateId();
  const members = [
    { name: 'Alex Morgan', role: 'CEO & Co-Founder', bio: 'Former VP at Google. Passionate about democratizing web development.' },
    { name: 'Jordan Lee', role: 'CTO & Co-Founder', bio: '15 years in infrastructure. Built systems serving billions of requests.' },
    { name: 'Sam Rivera', role: 'Head of Design', bio: 'Award-winning designer. Previously at Apple and Figma.' },
    { name: 'Taylor Kim', role: 'Head of Engineering', bio: 'Open source contributor. Loves building developer tools.' },
  ];
  const cardIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};
  const avatarColors = ['#e0e7ff', '#fce7f3', '#d1fae5', '#fef3c7'];

  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    const cId = generateId(); const avId = generateId();
    const nId = generateId(); const rId = generateId(); const bId = generateId();
    cardIds.push(cId);
    allEls[cId] = el({ id: cId, type: 'column', parentId: gridId, children: [avId, nId, rId, bId],
      styles: { textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' },
    });
    allEls[avId] = el({ id: avId, type: 'shape', tag: 'div', parentId: cId,
      styles: { width: '120px', height: '120px', borderRadius: '50%', backgroundColor: avatarColors[i], marginBottom: '4px' },
    });
    allEls[nId] = el({ id: nId, type: 'heading', tag: 'h3', parentId: cId, content: m.name,
      styles: { fontSize: '18px', fontWeight: '700', color: '#111827' },
    });
    allEls[rId] = el({ id: rId, type: 'text', tag: 'span', parentId: cId, content: m.role,
      styles: { fontSize: '14px', fontWeight: '600', color: '#4c6ef5' },
    });
    allEls[bId] = el({ id: bId, type: 'text', tag: 'p', parentId: cId, content: m.bio,
      styles: { fontSize: '14px', color: '#6b7280', lineHeight: '1.5', maxWidth: '220px' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: 'Team Grid', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#ffffff' },
  });
  allEls[containerId] = el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, subtitleId, gridId],
    styles: { maxWidth: '1000px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  });
  allEls[titleId] = el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Meet Our Team',
    styles: { fontSize: '36px', fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: '12px' },
  });
  allEls[subtitleId] = el({ id: subtitleId, type: 'text', tag: 'p', parentId: containerId, content: 'The people behind the product, driven by a shared mission.',
    styles: { fontSize: '18px', color: '#6b7280', textAlign: 'center', marginBottom: '56px' },
  });
  allEls[gridId] = el({ id: gridId, type: 'columns', parentId: containerId, children: cardIds,
    styles: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', width: '100%' },
    responsiveStyles: { tablet: { gridTemplateColumns: 'repeat(2, 1fr)' }, mobile: { gridTemplateColumns: '1fr' } },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

function timeline(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const listId = generateId();
  const events = [
    { year: '2020', title: 'Company Founded', desc: 'Started in a small garage with a big vision: make web development accessible to everyone.' },
    { year: '2021', title: 'First 1,000 Users', desc: 'Launched our beta product and reached our first milestone of 1,000 active users.' },
    { year: '2023', title: 'Series A Funding', desc: 'Raised $12M to expand our team and accelerate product development.' },
    { year: '2025', title: '1 Million Users', desc: 'Hit the one million user mark with customers in over 150 countries worldwide.' },
  ];
  const itemIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};

  for (const ev of events) {
    const itemId = generateId(); const dotId = generateId();
    const contentId = generateId(); const yearId = generateId();
    const titleElId = generateId(); const descId = generateId();
    itemIds.push(itemId);
    allEls[itemId] = el({ id: itemId, type: 'container', parentId: listId, children: [dotId, contentId],
      styles: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
    });
    allEls[dotId] = el({ id: dotId, type: 'shape', tag: 'div', parentId: itemId,
      styles: { width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#4c6ef5', flexShrink: '0', marginTop: '4px', boxShadow: '0 0 0 4px #e0e7ff' },
    });
    allEls[contentId] = el({ id: contentId, type: 'container', parentId: itemId, children: [yearId, titleElId, descId],
      styles: { display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '40px', borderLeft: '2px solid #e5e7eb', paddingLeft: '24px', marginLeft: '-33px' },
    });
    allEls[yearId] = el({ id: yearId, type: 'text', tag: 'span', parentId: contentId, content: ev.year,
      styles: { fontSize: '13px', fontWeight: '700', color: '#4c6ef5', letterSpacing: '0.05em' },
    });
    allEls[titleElId] = el({ id: titleElId, type: 'heading', tag: 'h3', parentId: contentId, content: ev.title,
      styles: { fontSize: '20px', fontWeight: '700', color: '#111827' },
    });
    allEls[descId] = el({ id: descId, type: 'text', tag: 'p', parentId: contentId, content: ev.desc,
      styles: { fontSize: '15px', color: '#6b7280', lineHeight: '1.6', maxWidth: '440px' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: 'Timeline', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#ffffff' },
  });
  allEls[containerId] = el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, listId],
    styles: { maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column' },
  });
  allEls[titleId] = el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Our Journey',
    styles: { fontSize: '36px', fontWeight: '800', color: '#111827', marginBottom: '48px', textAlign: 'center' },
  });
  allEls[listId] = el({ id: listId, type: 'container', parentId: containerId, children: itemIds,
    styles: { display: 'flex', flexDirection: 'column', paddingLeft: '24px' },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

// ============================================================
// CONTACT BLOCKS
// ============================================================

function contactForm(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const leftId = generateId(); const rightId = generateId();
  const titleId = generateId(); const descId = generateId();
  const emailInfoId = generateId(); const phoneInfoId = generateId(); const addrInfoId = generateId();
  const formId = generateId();
  const nameRowId = generateId(); const fnameId = generateId(); const lnameId = generateId();
  const emailId = generateId(); const subjectId = generateId();
  const msgId = generateId(); const btnId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'section', tag: 'section', label: 'Contact Form', children: [containerId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#ffffff' },
    }),
    [containerId]: el({ id: containerId, type: 'columns', parentId: sectionId, children: [leftId, rightId],
      styles: { maxWidth: '1100px', width: '100%', display: 'flex', gap: '60px' },
      responsiveStyles: { mobile: { flexDirection: 'column', gap: '40px' } },
    }),
    [leftId]: el({ id: leftId, type: 'container', parentId: containerId, children: [titleId, descId, emailInfoId, phoneInfoId, addrInfoId],
      styles: { flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' },
    }),
    [titleId]: el({ id: titleId, type: 'heading', tag: 'h2', parentId: leftId, content: 'Get in Touch',
      styles: { fontSize: '36px', fontWeight: '800', color: '#111827', lineHeight: '1.1' },
    }),
    [descId]: el({ id: descId, type: 'text', tag: 'p', parentId: leftId, content: 'Have a question or want to work together? Fill out the form and we will get back to you within 24 hours.',
      styles: { fontSize: '16px', color: '#6b7280', lineHeight: '1.7' },
    }),
    [emailInfoId]: el({ id: emailInfoId, type: 'text', tag: 'p', parentId: leftId, content: 'hello@example.com',
      styles: { fontSize: '15px', color: '#111827', fontWeight: '500' },
    }),
    [phoneInfoId]: el({ id: phoneInfoId, type: 'text', tag: 'p', parentId: leftId, content: '+1 (555) 000-1234',
      styles: { fontSize: '15px', color: '#111827', fontWeight: '500' },
    }),
    [addrInfoId]: el({ id: addrInfoId, type: 'text', tag: 'p', parentId: leftId, content: '123 Innovation Drive, San Francisco, CA 94107',
      styles: { fontSize: '15px', color: '#6b7280' },
    }),
    [rightId]: el({ id: rightId, type: 'container', parentId: containerId, children: [formId],
      styles: { flex: '1.2' },
    }),
    [formId]: el({ id: formId, type: 'form', tag: 'form', parentId: rightId, children: [nameRowId, emailId, subjectId, msgId, btnId],
      styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
    }),
    [nameRowId]: el({ id: nameRowId, type: 'container', parentId: formId, children: [fnameId, lnameId],
      styles: { display: 'flex', gap: '12px' },
      responsiveStyles: { mobile: { flexDirection: 'column' } },
    }),
    [fnameId]: el({ id: fnameId, type: 'input', tag: 'input', parentId: nameRowId, placeholder: 'First name',
      styles: { flex: '1', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px' },
    }),
    [lnameId]: el({ id: lnameId, type: 'input', tag: 'input', parentId: nameRowId, placeholder: 'Last name',
      styles: { flex: '1', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px' },
    }),
    [emailId]: el({ id: emailId, type: 'input', tag: 'input', parentId: formId, placeholder: 'Email address',
      styles: { padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px' },
    }),
    [subjectId]: el({ id: subjectId, type: 'input', tag: 'input', parentId: formId, placeholder: 'Subject',
      styles: { padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px' },
    }),
    [msgId]: el({ id: msgId, type: 'textarea', tag: 'textarea', parentId: formId, placeholder: 'Your message...',
      styles: { padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', minHeight: '140px' },
    }),
    [btnId]: el({ id: btnId, type: 'button', tag: 'button', parentId: formId, content: 'Send Message',
      styles: { padding: '16px 32px', backgroundColor: '#4c6ef5', color: '#ffffff', fontSize: '16px', fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#3b5bdb' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

function contactSplit(): BlockResult {
  const sectionId = generateId();
  const leftId = generateId(); const rightId = generateId();
  const lTitleId = generateId(); const lDescId = generateId();
  const lEmail = generateId(); const lPhone = generateId();
  const lHoursTitle = generateId(); const lHours = generateId();
  const rTitleId = generateId();
  const formId = generateId();
  const nameId = generateId(); const emailId = generateId();
  const msgId = generateId(); const btnId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'section', tag: 'section', label: 'Split Contact', children: [leftId, rightId],
      styles: { display: 'flex', width: '100%', minHeight: '600px' },
      responsiveStyles: { mobile: { flexDirection: 'column' } },
    }),
    // Dark left side with info
    [leftId]: el({ id: leftId, type: 'container', parentId: sectionId, children: [lTitleId, lDescId, lEmail, lPhone, lHoursTitle, lHours],
      styles: { flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px', padding: '80px 60px', backgroundColor: '#0f172a' },
      responsiveStyles: { mobile: { padding: '48px 24px' } },
    }),
    [lTitleId]: el({ id: lTitleId, type: 'heading', tag: 'h2', parentId: leftId, content: 'Let\'s Talk',
      styles: { fontSize: '40px', fontWeight: '800', color: '#ffffff', lineHeight: '1.1' },
    }),
    [lDescId]: el({ id: lDescId, type: 'text', tag: 'p', parentId: leftId, content: 'We would love to hear from you. Reach out and we will respond as soon as possible.',
      styles: { fontSize: '16px', color: '#94a3b8', lineHeight: '1.7' },
    }),
    [lEmail]: el({ id: lEmail, type: 'text', tag: 'p', parentId: leftId, content: 'contact@company.com',
      styles: { fontSize: '15px', color: '#e2e8f0', fontWeight: '500' },
    }),
    [lPhone]: el({ id: lPhone, type: 'text', tag: 'p', parentId: leftId, content: '+1 (555) 987-6543',
      styles: { fontSize: '15px', color: '#e2e8f0', fontWeight: '500' },
    }),
    [lHoursTitle]: el({ id: lHoursTitle, type: 'text', tag: 'span', parentId: leftId, content: 'Business Hours',
      styles: { fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '12px' },
    }),
    [lHours]: el({ id: lHours, type: 'text', tag: 'p', parentId: leftId, content: 'Monday - Friday, 9:00 AM - 6:00 PM EST',
      styles: { fontSize: '14px', color: '#94a3b8' },
    }),
    // White right side with form
    [rightId]: el({ id: rightId, type: 'container', parentId: sectionId, children: [rTitleId, formId],
      styles: { flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '28px', padding: '80px 60px', backgroundColor: '#ffffff' },
      responsiveStyles: { mobile: { padding: '48px 24px' } },
    }),
    [rTitleId]: el({ id: rTitleId, type: 'heading', tag: 'h3', parentId: rightId, content: 'Send us a message',
      styles: { fontSize: '24px', fontWeight: '700', color: '#111827' },
    }),
    [formId]: el({ id: formId, type: 'form', tag: 'form', parentId: rightId, children: [nameId, emailId, msgId, btnId],
      styles: { display: 'flex', flexDirection: 'column', gap: '16px' },
    }),
    [nameId]: el({ id: nameId, type: 'input', tag: 'input', parentId: formId, placeholder: 'Full name',
      styles: { padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px' },
    }),
    [emailId]: el({ id: emailId, type: 'input', tag: 'input', parentId: formId, placeholder: 'Email address',
      styles: { padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px' },
    }),
    [msgId]: el({ id: msgId, type: 'textarea', tag: 'textarea', parentId: formId, placeholder: 'How can we help?',
      styles: { padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '15px', minHeight: '140px' },
    }),
    [btnId]: el({ id: btnId, type: 'button', tag: 'button', parentId: formId, content: 'Submit',
      styles: { padding: '16px 32px', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '16px', fontWeight: '600', borderRadius: '10px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#1e293b' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

// ============================================================
// FOOTER BLOCKS
// ============================================================

function footerMultiColumn(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const topRowId = generateId();
  const brandColId = generateId(); const brandNameId = generateId(); const brandDescId = generateId();
  const col1Id = generateId(); const c1Title = generateId();
  const c1l1 = generateId(); const c1l2 = generateId(); const c1l3 = generateId();
  const col2Id = generateId(); const c2Title = generateId();
  const c2l1 = generateId(); const c2l2 = generateId(); const c2l3 = generateId();
  const col3Id = generateId(); const c3Title = generateId();
  const c3l1 = generateId(); const c3l2 = generateId(); const c3l3 = generateId();
  const bottomId = generateId(); const copyrightId = generateId(); const socialId = generateId();
  const s1 = generateId(); const s2 = generateId(); const s3 = generateId();

  const linkStyle = { fontSize: '14px', color: '#9ca3af', textDecoration: 'none', display: 'block', padding: '4px 0', transition: 'color 0.2s' };
  const linkHover = { color: '#ffffff' };

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'footer', tag: 'footer', label: 'Multi-Column Footer', children: [containerId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '60px 24px 32px', backgroundColor: '#111827' },
    }),
    [containerId]: el({ id: containerId, type: 'container', parentId: sectionId, children: [topRowId, bottomId],
      styles: { maxWidth: '1100px', width: '100%', display: 'flex', flexDirection: 'column' },
    }),
    [topRowId]: el({ id: topRowId, type: 'columns', parentId: containerId, children: [brandColId, col1Id, col2Id, col3Id],
      styles: { display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' },
      responsiveStyles: { tablet: { gridTemplateColumns: 'repeat(2, 1fr)' }, mobile: { gridTemplateColumns: '1fr' } },
    }),
    [brandColId]: el({ id: brandColId, type: 'container', parentId: topRowId, children: [brandNameId, brandDescId],
      styles: { display: 'flex', flexDirection: 'column', gap: '12px' },
    }),
    [brandNameId]: el({ id: brandNameId, type: 'heading', tag: 'a', parentId: brandColId, content: 'Acme Inc', href: '#',
      styles: { fontSize: '20px', fontWeight: '800', color: '#ffffff', textDecoration: 'none' },
    }),
    [brandDescId]: el({ id: brandDescId, type: 'text', tag: 'p', parentId: brandColId, content: 'Building the future of web development. One block at a time.',
      styles: { fontSize: '14px', color: '#6b7280', lineHeight: '1.6', maxWidth: '280px' },
    }),
    [col1Id]: el({ id: col1Id, type: 'container', parentId: topRowId, children: [c1Title, c1l1, c1l2, c1l3],
      styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
    }),
    [c1Title]: el({ id: c1Title, type: 'text', tag: 'span', parentId: col1Id, content: 'Product',
      styles: { fontSize: '13px', fontWeight: '700', color: '#e5e7eb', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' },
    }),
    [c1l1]: el({ id: c1l1, type: 'link', tag: 'a', parentId: col1Id, content: 'Features', href: '#', styles: linkStyle, hoverStyles: linkHover }),
    [c1l2]: el({ id: c1l2, type: 'link', tag: 'a', parentId: col1Id, content: 'Pricing', href: '#', styles: linkStyle, hoverStyles: linkHover }),
    [c1l3]: el({ id: c1l3, type: 'link', tag: 'a', parentId: col1Id, content: 'Changelog', href: '#', styles: linkStyle, hoverStyles: linkHover }),
    [col2Id]: el({ id: col2Id, type: 'container', parentId: topRowId, children: [c2Title, c2l1, c2l2, c2l3],
      styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
    }),
    [c2Title]: el({ id: c2Title, type: 'text', tag: 'span', parentId: col2Id, content: 'Company',
      styles: { fontSize: '13px', fontWeight: '700', color: '#e5e7eb', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' },
    }),
    [c2l1]: el({ id: c2l1, type: 'link', tag: 'a', parentId: col2Id, content: 'About', href: '#', styles: linkStyle, hoverStyles: linkHover }),
    [c2l2]: el({ id: c2l2, type: 'link', tag: 'a', parentId: col2Id, content: 'Careers', href: '#', styles: linkStyle, hoverStyles: linkHover }),
    [c2l3]: el({ id: c2l3, type: 'link', tag: 'a', parentId: col2Id, content: 'Blog', href: '#', styles: linkStyle, hoverStyles: linkHover }),
    [col3Id]: el({ id: col3Id, type: 'container', parentId: topRowId, children: [c3Title, c3l1, c3l2, c3l3],
      styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
    }),
    [c3Title]: el({ id: c3Title, type: 'text', tag: 'span', parentId: col3Id, content: 'Legal',
      styles: { fontSize: '13px', fontWeight: '700', color: '#e5e7eb', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' },
    }),
    [c3l1]: el({ id: c3l1, type: 'link', tag: 'a', parentId: col3Id, content: 'Privacy', href: '#', styles: linkStyle, hoverStyles: linkHover }),
    [c3l2]: el({ id: c3l2, type: 'link', tag: 'a', parentId: col3Id, content: 'Terms', href: '#', styles: linkStyle, hoverStyles: linkHover }),
    [c3l3]: el({ id: c3l3, type: 'link', tag: 'a', parentId: col3Id, content: 'Cookies', href: '#', styles: linkStyle, hoverStyles: linkHover }),
    [bottomId]: el({ id: bottomId, type: 'container', parentId: containerId, children: [copyrightId, socialId],
      styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1f2937', paddingTop: '24px' },
      responsiveStyles: { mobile: { flexDirection: 'column', gap: '16px' } },
    }),
    [copyrightId]: el({ id: copyrightId, type: 'text', tag: 'p', parentId: bottomId, content: '© 2026 Acme Inc. All rights reserved.',
      styles: { fontSize: '13px', color: '#6b7280' },
    }),
    [socialId]: el({ id: socialId, type: 'container', parentId: bottomId, children: [s1, s2, s3],
      styles: { display: 'flex', gap: '20px' },
    }),
    [s1]: el({ id: s1, type: 'link', tag: 'a', parentId: socialId, content: 'Twitter', href: '#',
      styles: { fontSize: '13px', color: '#6b7280', textDecoration: 'none' }, hoverStyles: { color: '#ffffff' },
    }),
    [s2]: el({ id: s2, type: 'link', tag: 'a', parentId: socialId, content: 'GitHub', href: '#',
      styles: { fontSize: '13px', color: '#6b7280', textDecoration: 'none' }, hoverStyles: { color: '#ffffff' },
    }),
    [s3]: el({ id: s3, type: 'link', tag: 'a', parentId: socialId, content: 'LinkedIn', href: '#',
      styles: { fontSize: '13px', color: '#6b7280', textDecoration: 'none' }, hoverStyles: { color: '#ffffff' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

function footerMinimal(): BlockResult {
  const sectionId = generateId();
  const contentId = generateId();
  const linksId = generateId();
  const l1 = generateId(); const l2 = generateId(); const l3 = generateId(); const l4 = generateId();
  const divId = generateId();
  const copyrightId = generateId();

  const linkStyle = { fontSize: '14px', color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' };

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'footer', tag: 'footer', label: 'Minimal Footer', children: [contentId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '32px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' },
    }),
    [contentId]: el({ id: contentId, type: 'container', parentId: sectionId, children: [linksId, divId, copyrightId],
      styles: { maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' },
    }),
    [linksId]: el({ id: linksId, type: 'container', parentId: contentId, children: [l1, l2, l3, l4],
      styles: { display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' },
    }),
    [l1]: el({ id: l1, type: 'link', tag: 'a', parentId: linksId, content: 'About', href: '#', styles: linkStyle, hoverStyles: { color: '#111827' } }),
    [l2]: el({ id: l2, type: 'link', tag: 'a', parentId: linksId, content: 'Privacy', href: '#', styles: linkStyle, hoverStyles: { color: '#111827' } }),
    [l3]: el({ id: l3, type: 'link', tag: 'a', parentId: linksId, content: 'Terms', href: '#', styles: linkStyle, hoverStyles: { color: '#111827' } }),
    [l4]: el({ id: l4, type: 'link', tag: 'a', parentId: linksId, content: 'Contact', href: '#', styles: linkStyle, hoverStyles: { color: '#111827' } }),
    [divId]: el({ id: divId, type: 'divider', tag: 'hr', parentId: contentId,
      styles: { width: '48px', height: '1px', backgroundColor: '#e5e7eb', border: 'none' },
    }),
    [copyrightId]: el({ id: copyrightId, type: 'text', tag: 'p', parentId: contentId, content: '© 2026 Company. All rights reserved.',
      styles: { fontSize: '13px', color: '#9ca3af' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

function footerNewsletter(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const topRowId = generateId();
  const brandId = generateId(); const brandNameId = generateId();
  const nlBoxId = generateId(); const nlTitleId = generateId(); const nlDescId = generateId();
  const nlFormId = generateId(); const nlInputId = generateId(); const nlBtnId = generateId();
  const bottomId = generateId(); const linksId = generateId();
  const l1 = generateId(); const l2 = generateId(); const l3 = generateId();
  const copyrightId = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'footer', tag: 'footer', label: 'Newsletter Footer', children: [containerId],
      styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '60px 24px 32px', backgroundColor: '#0f172a' },
    }),
    [containerId]: el({ id: containerId, type: 'container', parentId: sectionId, children: [topRowId, bottomId],
      styles: { maxWidth: '1100px', width: '100%', display: 'flex', flexDirection: 'column' },
    }),
    [topRowId]: el({ id: topRowId, type: 'columns', parentId: containerId, children: [brandId, nlBoxId],
      styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '48px', marginBottom: '48px' },
      responsiveStyles: { mobile: { flexDirection: 'column' } },
    }),
    [brandId]: el({ id: brandId, type: 'container', parentId: topRowId, children: [brandNameId],
      styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
    }),
    [brandNameId]: el({ id: brandNameId, type: 'heading', tag: 'a', parentId: brandId, content: 'Acme Inc', href: '#',
      styles: { fontSize: '20px', fontWeight: '800', color: '#e2e8f0', textDecoration: 'none' },
    }),
    [nlBoxId]: el({ id: nlBoxId, type: 'container', parentId: topRowId, children: [nlTitleId, nlDescId, nlFormId],
      styles: { display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '380px' },
    }),
    [nlTitleId]: el({ id: nlTitleId, type: 'heading', tag: 'h4', parentId: nlBoxId, content: 'Subscribe to our newsletter',
      styles: { fontSize: '16px', fontWeight: '700', color: '#e2e8f0' },
    }),
    [nlDescId]: el({ id: nlDescId, type: 'text', tag: 'p', parentId: nlBoxId, content: 'The latest news, articles, and resources, sent to your inbox weekly.',
      styles: { fontSize: '14px', color: '#64748b', lineHeight: '1.5' },
    }),
    [nlFormId]: el({ id: nlFormId, type: 'container', parentId: nlBoxId, children: [nlInputId, nlBtnId],
      styles: { display: 'flex', gap: '10px' },
      responsiveStyles: { mobile: { flexDirection: 'column' } },
    }),
    [nlInputId]: el({ id: nlInputId, type: 'input', tag: 'input', parentId: nlFormId, placeholder: 'Enter your email',
      styles: { flex: '1', padding: '12px 14px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', fontSize: '14px', color: '#e2e8f0' },
    }),
    [nlBtnId]: el({ id: nlBtnId, type: 'button', tag: 'button', parentId: nlFormId, content: 'Subscribe',
      styles: { padding: '12px 20px', backgroundColor: '#6366f1', color: '#ffffff', fontSize: '14px', fontWeight: '600', borderRadius: '8px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#818cf8' },
    }),
    [bottomId]: el({ id: bottomId, type: 'container', parentId: containerId, children: [linksId, copyrightId],
      styles: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1e293b', paddingTop: '24px' },
      responsiveStyles: { mobile: { flexDirection: 'column', gap: '12px' } },
    }),
    [linksId]: el({ id: linksId, type: 'container', parentId: bottomId, children: [l1, l2, l3],
      styles: { display: 'flex', gap: '20px' },
    }),
    [l1]: el({ id: l1, type: 'link', tag: 'a', parentId: linksId, content: 'Privacy', href: '#',
      styles: { fontSize: '13px', color: '#64748b', textDecoration: 'none' }, hoverStyles: { color: '#e2e8f0' },
    }),
    [l2]: el({ id: l2, type: 'link', tag: 'a', parentId: linksId, content: 'Terms', href: '#',
      styles: { fontSize: '13px', color: '#64748b', textDecoration: 'none' }, hoverStyles: { color: '#e2e8f0' },
    }),
    [l3]: el({ id: l3, type: 'link', tag: 'a', parentId: linksId, content: 'Sitemap', href: '#',
      styles: { fontSize: '13px', color: '#64748b', textDecoration: 'none' }, hoverStyles: { color: '#e2e8f0' },
    }),
    [copyrightId]: el({ id: copyrightId, type: 'text', tag: 'p', parentId: bottomId, content: '© 2026 Acme Inc.',
      styles: { fontSize: '13px', color: '#475569' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

// ============================================================
// E-COMMERCE BLOCKS
// ============================================================

function productGrid(): BlockResult {
  const sectionId = generateId(); const containerId = generateId();
  const titleId = generateId(); const subtitleId = generateId(); const gridId = generateId();
  const products = [
    { name: 'Minimal Desk Lamp', price: '$89', img: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', tag: 'New' },
    { name: 'Wireless Headphones', price: '$249', img: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)', tag: 'Best Seller' },
    { name: 'Leather Backpack', price: '$179', img: 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)', tag: '' },
    { name: 'Smart Watch Pro', price: '$399', img: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)', tag: 'Sale' },
    { name: 'Ceramic Mug Set', price: '$45', img: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', tag: '' },
    { name: 'Bluetooth Speaker', price: '$129', img: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', tag: 'New' },
  ];
  const cardIds: string[] = [];
  const allEls: Record<string, BuilderElement> = {};

  for (const product of products) {
    const cId = generateId(); const imgId = generateId();
    const infoId = generateId(); const nId = generateId(); const pId = generateId();
    const btnId = generateId();
    cardIds.push(cId);

    const children = [imgId, infoId, btnId];
    allEls[cId] = el({ id: cId, type: 'column', parentId: gridId, children,
      styles: { backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f3f4f6', transition: 'all 0.3s' },
      hoverStyles: { boxShadow: '0 12px 32px rgba(0,0,0,0.08)', transform: 'translateY(-4px)' },
    });
    allEls[imgId] = el({ id: imgId, type: 'image', tag: 'div', parentId: cId,
      styles: { width: '100%', height: '220px', backgroundImage: product.img, backgroundSize: 'cover', position: 'relative' },
    });
    allEls[infoId] = el({ id: infoId, type: 'container', parentId: cId, children: [nId, pId],
      styles: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    });
    allEls[nId] = el({ id: nId, type: 'heading', tag: 'h3', parentId: infoId, content: product.name,
      styles: { fontSize: '15px', fontWeight: '600', color: '#111827' },
    });
    allEls[pId] = el({ id: pId, type: 'text', tag: 'span', parentId: infoId, content: product.price,
      styles: { fontSize: '15px', fontWeight: '700', color: '#4c6ef5' },
    });
    allEls[btnId] = el({ id: btnId, type: 'button', tag: 'a', parentId: cId, content: 'Add to Cart', href: '#',
      styles: { display: 'block', padding: '12px', backgroundColor: '#f9fafb', color: '#111827', fontSize: '13px', fontWeight: '600', textAlign: 'center', textDecoration: 'none', borderTop: '1px solid #f3f4f6', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#4c6ef5', color: '#ffffff' },
    });
  }

  allEls[sectionId] = el({ id: sectionId, type: 'section', tag: 'section', label: 'Product Grid', children: [containerId],
    styles: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '100px 24px', backgroundColor: '#ffffff' },
  });
  allEls[containerId] = el({ id: containerId, type: 'container', parentId: sectionId, children: [titleId, subtitleId, gridId],
    styles: { maxWidth: '1100px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  });
  allEls[titleId] = el({ id: titleId, type: 'heading', tag: 'h2', parentId: containerId, content: 'Shop Our Collection',
    styles: { fontSize: '36px', fontWeight: '800', color: '#111827', textAlign: 'center', marginBottom: '8px' },
  });
  allEls[subtitleId] = el({ id: subtitleId, type: 'text', tag: 'p', parentId: containerId, content: 'Curated products designed for modern living.',
    styles: { fontSize: '18px', color: '#6b7280', textAlign: 'center', marginBottom: '48px' },
  });
  allEls[gridId] = el({ id: gridId, type: 'columns', parentId: containerId, children: cardIds,
    styles: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', width: '100%' },
    responsiveStyles: { tablet: { gridTemplateColumns: 'repeat(2, 1fr)' }, mobile: { gridTemplateColumns: '1fr' } },
  });

  return { elements: allEls, rootIds: [sectionId] };
}

function featuredProduct(): BlockResult {
  const sectionId = generateId();
  const imgId = generateId();
  const contentId = generateId();
  const tagId = generateId(); const titleId = generateId(); const descId = generateId();
  const priceRowId = generateId(); const priceId = generateId(); const origPriceId = generateId();
  const featsId = generateId(); const f1 = generateId(); const f2 = generateId(); const f3 = generateId();
  const btnGroupId = generateId(); const btn1Id = generateId(); const btn2Id = generateId();

  const elements: Record<string, BuilderElement> = {
    [sectionId]: el({ id: sectionId, type: 'section', tag: 'section', label: 'Featured Product', children: [imgId, contentId],
      styles: { display: 'flex', alignItems: 'center', width: '100%', minHeight: '560px', padding: '80px 60px', backgroundColor: '#fafafa', gap: '60px' },
      responsiveStyles: { mobile: { flexDirection: 'column', padding: '40px 24px', gap: '32px' } },
    }),
    [imgId]: el({ id: imgId, type: 'image', tag: 'div', parentId: sectionId,
      styles: { flex: '1', height: '480px', borderRadius: '24px', backgroundImage: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 100%)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)' },
    }),
    [contentId]: el({ id: contentId, type: 'container', parentId: sectionId, children: [tagId, titleId, descId, priceRowId, featsId, btnGroupId],
      styles: { flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' },
    }),
    [tagId]: el({ id: tagId, type: 'text', tag: 'span', parentId: contentId, content: 'FEATURED PRODUCT',
      styles: { fontSize: '12px', fontWeight: '700', color: '#4c6ef5', letterSpacing: '0.1em', textTransform: 'uppercase' },
    }),
    [titleId]: el({ id: titleId, type: 'heading', tag: 'h2', parentId: contentId, content: 'Ultra-Slim Wireless Keyboard',
      styles: { fontSize: '36px', fontWeight: '800', color: '#111827', lineHeight: '1.15', letterSpacing: '-0.02em' },
    }),
    [descId]: el({ id: descId, type: 'text', tag: 'p', parentId: contentId, content: 'Experience the perfect blend of form and function. Our ultra-slim keyboard features low-profile mechanical switches, RGB backlight, and all-day battery life.',
      styles: { fontSize: '16px', color: '#6b7280', lineHeight: '1.7' },
    }),
    [priceRowId]: el({ id: priceRowId, type: 'container', parentId: contentId, children: [priceId, origPriceId],
      styles: { display: 'flex', alignItems: 'baseline', gap: '12px' },
    }),
    [priceId]: el({ id: priceId, type: 'heading', tag: 'span', parentId: priceRowId, content: '$149',
      styles: { fontSize: '32px', fontWeight: '800', color: '#111827' },
    }),
    [origPriceId]: el({ id: origPriceId, type: 'text', tag: 'span', parentId: priceRowId, content: '$199',
      styles: { fontSize: '18px', color: '#9ca3af', textDecoration: 'line-through' },
    }),
    [featsId]: el({ id: featsId, type: 'container', parentId: contentId, children: [f1, f2, f3],
      styles: { display: 'flex', flexDirection: 'column', gap: '8px' },
    }),
    [f1]: el({ id: f1, type: 'text', tag: 'p', parentId: featsId, content: '✓  Bluetooth 5.3 with multi-device pairing',
      styles: { fontSize: '14px', color: '#374151' },
    }),
    [f2]: el({ id: f2, type: 'text', tag: 'p', parentId: featsId, content: '✓  90-day battery life on a single charge',
      styles: { fontSize: '14px', color: '#374151' },
    }),
    [f3]: el({ id: f3, type: 'text', tag: 'p', parentId: featsId, content: '✓  Backlit keys with adjustable brightness',
      styles: { fontSize: '14px', color: '#374151' },
    }),
    [btnGroupId]: el({ id: btnGroupId, type: 'container', parentId: contentId, children: [btn1Id, btn2Id],
      styles: { display: 'flex', gap: '12px', marginTop: '8px' },
      responsiveStyles: { mobile: { flexDirection: 'column' } },
    }),
    [btn1Id]: el({ id: btn1Id, type: 'button', tag: 'a', parentId: btnGroupId, content: 'Buy Now', href: '#',
      styles: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 32px', backgroundColor: '#111827', color: '#ffffff', fontSize: '15px', fontWeight: '600', borderRadius: '10px', textDecoration: 'none', transition: 'all 0.2s' },
      hoverStyles: { backgroundColor: '#1f2937' },
    }),
    [btn2Id]: el({ id: btn2Id, type: 'button', tag: 'a', parentId: btnGroupId, content: 'Learn More', href: '#',
      styles: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 32px', backgroundColor: 'transparent', color: '#111827', fontSize: '15px', fontWeight: '600', borderRadius: '10px', textDecoration: 'none', border: '1px solid #d1d5db', transition: 'all 0.2s' },
      hoverStyles: { borderColor: '#111827' },
    }),
  };
  return { elements, rootIds: [sectionId] };
}

// ============================================================
// BLOCK REGISTRY & EXPORT
// ============================================================

const BLOCK_REGISTRY: Record<string, BlockGenerator> = {
  // Hero
  heroSplitImage,
  heroFullscreen,
  heroMinimal,
  heroVideo,
  heroGradient,
  heroCreative,
  // Navbar
  navbarSimple,
  navbarCentered,
  navbarDark,
  // Features
  featuresGrid3,
  featuresGrid4,
  featuresAlternating,
  featuresShowcase,
  // Testimonials
  testimonialCards,
  testimonialLarge,
  testimonialGrid,
  // CTA
  ctaBanner,
  ctaNewsletter,
  ctaMinimal,
  // Pricing
  pricingThreeColumn,
  pricingTwoColumn,
  // FAQ
  faqAccordion,
  faqTwoColumn,
  // Content
  statsCounter,
  logoCloud,
  teamGrid,
  timeline,
  // Contact
  contactForm,
  contactSplit,
  // Footer
  footerMultiColumn,
  footerMinimal,
  footerNewsletter,
  // E-Commerce
  productGrid,
  featuredProduct,
};

export function getBlock(blockId: string): BlockResult | null {
  const generator = BLOCK_REGISTRY[blockId];
  if (!generator) return null;
  return generator();
}
