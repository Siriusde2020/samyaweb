import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { BuilderElement, ElementType } from '@/types/builder';

// ---------- Validation ----------

const aiRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').max(2000),
  type: z.enum(['website', 'page', 'section', 'copy', 'seo', 'image', 'logo', 'brand']),
  context: z.record(z.any()).optional(),
});

// ---------- ID helper ----------

let _idCounter = 0;
function uid(): string {
  return 'ai-' + (++_idCounter).toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

// ---------- OpenAI integration ----------

async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!res.ok) {
      console.error('[ai] OpenAI API error:', res.status, await res.text());
      return null;
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    console.error('[ai] OpenAI fetch error:', err);
    return null;
  }
}

function getSystemPrompt(type: string): string {
  const base =
    'You are an expert web designer AI that generates content for a JAMStack website builder. ' +
    'Always respond with valid JSON only -- no markdown fences, no explanation text.';

  switch (type) {
    case 'website':
    case 'page':
    case 'section':
      return (
        base +
        '\n\nGenerate an object with two keys: "elements" (Record<string, BuilderElement>) and "rootElementIds" (string[]). ' +
        'Each BuilderElement has: id (string), type (ElementType), tag (HTML tag), content (string for text nodes), ' +
        'children (string[] of child ids), parentId (string|null), styles (CSS-in-JS object with camelCase keys), ' +
        'hoverStyles (optional partial styles), src/href/alt (optional). ' +
        'Supported types: section, container, columns, column, text, heading, image, video, button, link, ' +
        'form, input, icon, divider, spacer, navbar, footer, hero, cta, feature-grid, testimonial, pricing-table. ' +
        'Use realistic placeholder content. Make it visually polished with modern spacing, typography, and color.'
      );
    case 'copy':
      return (
        base +
        '\n\nGenerate an object: { headlines: string[], body: string, cta: string, tagline?: string }.'
      );
    case 'seo':
      return (
        base +
        '\n\nGenerate an object: { title: string, description: string, keywords: string[], suggestions: string[] }.'
      );
    case 'brand':
      return (
        base +
        '\n\nGenerate an object: { colors: { primary, secondary, accent, dark, light }, fonts: { heading, body }, voice: string, tagline: string }.'
      );
    default:
      return base + '\n\nGenerate relevant JSON output based on the user request.';
  }
}

// ---------- Smart mock generators ----------

function makeElement(
  overrides: Partial<BuilderElement> & { id: string; type: ElementType },
): BuilderElement {
  return {
    tag: 'div',
    styles: {},
    ...overrides,
  } as BuilderElement;
}

function generateMockWebsite(prompt: string): { elements: Record<string, BuilderElement>; rootElementIds: string[] } {
  _idCounter = 0;

  // Derive theme hints from the prompt
  const lower = prompt.toLowerCase();
  const primaryColor = lower.includes('dark') ? '#6c63ff' : '#4c6ef5';
  const bgDark = lower.includes('dark') ? '#0f0f23' : '#ffffff';
  const textColor = lower.includes('dark') ? '#e2e8f0' : '#1a1a2e';
  const textSecondary = lower.includes('dark') ? '#94a3b8' : '#6c757d';
  const surfaceColor = lower.includes('dark') ? '#1a1a3e' : '#f8f9fa';

  // Extract business name from prompt (rough heuristic)
  const nameMatch = prompt.match(/(?:for|called|named)\s+"?([^",.]+)"?/i);
  const businessName = nameMatch ? nameMatch[1].trim() : 'Your Business';

  const elements: Record<string, BuilderElement> = {};
  const rootIds: string[] = [];

  // ---- Navbar ----
  const navId = uid();
  const navLogoId = uid();
  const navLinksContainerId = uid();
  const navLink1 = uid();
  const navLink2 = uid();
  const navLink3 = uid();
  const navCtaId = uid();

  elements[navId] = makeElement({
    id: navId,
    type: 'navbar',
    tag: 'nav',
    children: [navLogoId, navLinksContainerId, navCtaId],
    styles: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 48px',
      backgroundColor: bgDark,
      position: 'sticky',
      top: '0',
      zIndex: 100,
      borderBottom: `1px solid ${lower.includes('dark') ? '#2a2a4a' : '#e9ecef'}`,
    },
  });

  elements[navLogoId] = makeElement({
    id: navLogoId,
    type: 'text',
    tag: 'span',
    content: businessName,
    parentId: navId,
    styles: {
      fontSize: '20px',
      fontWeight: '700',
      color: primaryColor,
      letterSpacing: '-0.5px',
    },
  });

  elements[navLinksContainerId] = makeElement({
    id: navLinksContainerId,
    type: 'container',
    tag: 'div',
    children: [navLink1, navLink2, navLink3],
    parentId: navId,
    styles: { display: 'flex', gap: '32px', alignItems: 'center' },
  });

  for (const [id, label] of [
    [navLink1, 'Features'],
    [navLink2, 'Pricing'],
    [navLink3, 'About'],
  ] as const) {
    elements[id] = makeElement({
      id,
      type: 'link',
      tag: 'a',
      content: label,
      href: `#${label.toLowerCase()}`,
      parentId: navLinksContainerId,
      styles: {
        fontSize: '15px',
        color: textSecondary,
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'color 0.2s',
      },
      hoverStyles: { color: primaryColor },
    });
  }

  elements[navCtaId] = makeElement({
    id: navCtaId,
    type: 'button',
    tag: 'a',
    content: 'Get Started',
    href: '#cta',
    parentId: navId,
    styles: {
      padding: '10px 24px',
      backgroundColor: primaryColor,
      color: '#ffffff',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    hoverStyles: { backgroundColor: '#3b5bdb' },
  });

  rootIds.push(navId);

  // ---- Hero Section ----
  const heroId = uid();
  const heroContentId = uid();
  const heroH1 = uid();
  const heroP = uid();
  const heroButtonsId = uid();
  const heroCta1 = uid();
  const heroCta2 = uid();

  elements[heroId] = makeElement({
    id: heroId,
    type: 'hero',
    tag: 'section',
    children: [heroContentId],
    styles: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 48px',
      minHeight: '85vh',
      backgroundColor: bgDark,
      textAlign: 'center',
    },
  });

  elements[heroContentId] = makeElement({
    id: heroContentId,
    type: 'container',
    tag: 'div',
    children: [heroH1, heroP, heroButtonsId],
    parentId: heroId,
    styles: { maxWidth: '720px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  });

  elements[heroH1] = makeElement({
    id: heroH1,
    type: 'heading',
    tag: 'h1',
    content: `Build Something Amazing with ${businessName}`,
    parentId: heroContentId,
    styles: {
      fontSize: '56px',
      fontWeight: '800',
      lineHeight: '1.1',
      letterSpacing: '-1.5px',
      color: textColor,
      marginBottom: '24px',
    },
    responsiveStyles: {
      tablet: { fontSize: '42px' },
      mobile: { fontSize: '32px', letterSpacing: '-0.5px' },
    },
  });

  elements[heroP] = makeElement({
    id: heroP,
    type: 'text',
    tag: 'p',
    content:
      'Empower your workflow with cutting-edge tools designed for modern teams. Ship faster, iterate smarter, and delight your customers.',
    parentId: heroContentId,
    styles: {
      fontSize: '20px',
      lineHeight: '1.6',
      color: textSecondary,
      maxWidth: '560px',
      marginBottom: '40px',
    },
    responsiveStyles: {
      mobile: { fontSize: '17px' },
    },
  });

  elements[heroButtonsId] = makeElement({
    id: heroButtonsId,
    type: 'container',
    tag: 'div',
    children: [heroCta1, heroCta2],
    parentId: heroContentId,
    styles: { display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' },
  });

  elements[heroCta1] = makeElement({
    id: heroCta1,
    type: 'button',
    tag: 'a',
    content: 'Start Free Trial',
    href: '#cta',
    parentId: heroButtonsId,
    styles: {
      padding: '14px 32px',
      backgroundColor: primaryColor,
      color: '#ffffff',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'transform 0.15s, box-shadow 0.15s',
      boxShadow: `0 4px 14px ${primaryColor}44`,
    },
    hoverStyles: { transform: 'translateY(-2px)', boxShadow: `0 6px 20px ${primaryColor}66` },
  });

  elements[heroCta2] = makeElement({
    id: heroCta2,
    type: 'button',
    tag: 'a',
    content: 'Watch Demo',
    href: '#demo',
    parentId: heroButtonsId,
    styles: {
      padding: '14px 32px',
      backgroundColor: 'transparent',
      color: textColor,
      borderRadius: '10px',
      border: `2px solid ${lower.includes('dark') ? '#2a2a4a' : '#dee2e6'}`,
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'border-color 0.2s',
    },
    hoverStyles: { borderColor: primaryColor },
  });

  rootIds.push(heroId);

  // ---- Features Section ----
  const featuresId = uid();
  const featuresHeader = uid();
  const featuresH2 = uid();
  const featuresSubtext = uid();
  const featuresGrid = uid();

  elements[featuresId] = makeElement({
    id: featuresId,
    type: 'section',
    tag: 'section',
    children: [featuresHeader, featuresGrid],
    styles: {
      padding: '100px 48px',
      backgroundColor: surfaceColor,
    },
  });

  elements[featuresHeader] = makeElement({
    id: featuresHeader,
    type: 'container',
    tag: 'div',
    children: [featuresH2, featuresSubtext],
    parentId: featuresId,
    styles: {
      textAlign: 'center',
      maxWidth: '600px',
      margin: '0 auto 64px',
    },
  });

  elements[featuresH2] = makeElement({
    id: featuresH2,
    type: 'heading',
    tag: 'h2',
    content: 'Everything You Need',
    parentId: featuresHeader,
    styles: {
      fontSize: '40px',
      fontWeight: '700',
      color: textColor,
      marginBottom: '16px',
      letterSpacing: '-0.5px',
    },
  });

  elements[featuresSubtext] = makeElement({
    id: featuresSubtext,
    type: 'text',
    tag: 'p',
    content: 'Powerful features that help you manage, build, and grow your business with confidence.',
    parentId: featuresHeader,
    styles: { fontSize: '18px', color: textSecondary, lineHeight: '1.6' },
  });

  elements[featuresGrid] = makeElement({
    id: featuresGrid,
    type: 'feature-grid',
    tag: 'div',
    children: [],
    parentId: featuresId,
    styles: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '32px',
      maxWidth: '1100px',
      margin: '0 auto',
    },
    responsiveStyles: {
      tablet: { gridTemplateColumns: 'repeat(2, 1fr)' },
      mobile: { gridTemplateColumns: '1fr' },
    },
  });

  const featureItems = [
    { icon: 'lightning', title: 'Lightning Fast', desc: 'Optimized performance out of the box with edge deployment and smart caching.' },
    { icon: 'shield', title: 'Enterprise Security', desc: 'Bank-grade encryption, SSO support, and SOC 2 compliance built in.' },
    { icon: 'chart', title: 'Advanced Analytics', desc: 'Real-time dashboards and insights to track your growth metrics.' },
    { icon: 'code', title: 'Developer Friendly', desc: 'Clean APIs, webhooks, and SDK integrations for custom workflows.' },
    { icon: 'globe', title: 'Global CDN', desc: 'Content delivered from 200+ edge locations for sub-50ms load times.' },
    { icon: 'sparkles', title: 'AI-Powered', desc: 'Smart suggestions, auto-optimization, and content generation at your fingertips.' },
  ];

  for (const item of featureItems) {
    const cardId = uid();
    const cardIconId = uid();
    const cardTitleId = uid();
    const cardDescId = uid();

    elements[cardId] = makeElement({
      id: cardId,
      type: 'container',
      tag: 'div',
      children: [cardIconId, cardTitleId, cardDescId],
      parentId: featuresGrid,
      styles: {
        padding: '32px',
        backgroundColor: bgDark,
        borderRadius: '16px',
        border: `1px solid ${lower.includes('dark') ? '#2a2a4a' : '#e9ecef'}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
      },
      hoverStyles: {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
      },
    });

    elements[cardIconId] = makeElement({
      id: cardIconId,
      type: 'icon',
      tag: 'div',
      content: item.icon,
      parentId: cardId,
      styles: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        backgroundColor: `${primaryColor}15`,
        color: primaryColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        marginBottom: '20px',
      },
    });

    elements[cardTitleId] = makeElement({
      id: cardTitleId,
      type: 'heading',
      tag: 'h3',
      content: item.title,
      parentId: cardId,
      styles: {
        fontSize: '20px',
        fontWeight: '600',
        color: textColor,
        marginBottom: '8px',
      },
    });

    elements[cardDescId] = makeElement({
      id: cardDescId,
      type: 'text',
      tag: 'p',
      content: item.desc,
      parentId: cardId,
      styles: { fontSize: '15px', color: textSecondary, lineHeight: '1.6' },
    });

    (elements[featuresGrid].children as string[]).push(cardId);
  }

  rootIds.push(featuresId);

  // ---- CTA Section ----
  const ctaId = uid();
  const ctaH2 = uid();
  const ctaP = uid();
  const ctaButton = uid();

  elements[ctaId] = makeElement({
    id: ctaId,
    type: 'cta',
    tag: 'section',
    children: [ctaH2, ctaP, ctaButton],
    styles: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 48px',
      backgroundColor: primaryColor,
      textAlign: 'center',
    },
  });

  elements[ctaH2] = makeElement({
    id: ctaH2,
    type: 'heading',
    tag: 'h2',
    content: 'Ready to Get Started?',
    parentId: ctaId,
    styles: {
      fontSize: '40px',
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: '16px',
    },
  });

  elements[ctaP] = makeElement({
    id: ctaP,
    type: 'text',
    tag: 'p',
    content: 'Join thousands of teams already using our platform. No credit card required.',
    parentId: ctaId,
    styles: {
      fontSize: '18px',
      color: 'rgba(255,255,255,0.85)',
      marginBottom: '32px',
      maxWidth: '480px',
    },
  });

  elements[ctaButton] = makeElement({
    id: ctaButton,
    type: 'button',
    tag: 'a',
    content: 'Start Building for Free',
    href: '#',
    parentId: ctaId,
    styles: {
      padding: '16px 40px',
      backgroundColor: '#ffffff',
      color: primaryColor,
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'transform 0.15s',
    },
    hoverStyles: { transform: 'translateY(-2px)' },
  });

  rootIds.push(ctaId);

  // ---- Footer ----
  const footerId = uid();
  const footerText = uid();

  elements[footerId] = makeElement({
    id: footerId,
    type: 'footer',
    tag: 'footer',
    children: [footerText],
    styles: {
      padding: '32px 48px',
      backgroundColor: bgDark,
      borderTop: `1px solid ${lower.includes('dark') ? '#2a2a4a' : '#e9ecef'}`,
      textAlign: 'center',
    },
  });

  elements[footerText] = makeElement({
    id: footerText,
    type: 'text',
    tag: 'p',
    content: `\u00A9 ${new Date().getFullYear()} ${businessName}. All rights reserved.`,
    parentId: footerId,
    styles: { fontSize: '14px', color: textSecondary },
  });

  rootIds.push(footerId);

  return { elements, rootElementIds: rootIds };
}

function generateMockSection(prompt: string): { elements: Record<string, BuilderElement>; rootElementIds: string[] } {
  _idCounter = 0;
  const elements: Record<string, BuilderElement> = {};

  const sectionId = uid();
  const headingId = uid();
  const textId = uid();

  elements[sectionId] = makeElement({
    id: sectionId,
    type: 'section',
    tag: 'section',
    children: [headingId, textId],
    styles: {
      padding: '80px 48px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
    },
  });

  elements[headingId] = makeElement({
    id: headingId,
    type: 'heading',
    tag: 'h2',
    content: prompt.length > 60 ? prompt.slice(0, 60) + '...' : prompt,
    parentId: sectionId,
    styles: {
      fontSize: '36px',
      fontWeight: '700',
      color: '#1a1a2e',
      marginBottom: '16px',
      textAlign: 'center',
    },
  });

  elements[textId] = makeElement({
    id: textId,
    type: 'text',
    tag: 'p',
    content: 'AI-generated section based on your prompt. Customize it in the visual builder.',
    parentId: sectionId,
    styles: {
      fontSize: '18px',
      color: '#6c757d',
      textAlign: 'center',
      maxWidth: '560px',
      lineHeight: '1.6',
    },
  });

  return { elements, rootElementIds: [sectionId] };
}

function generateMockCopy(prompt: string) {
  const lower = prompt.toLowerCase();
  const isSaas = lower.includes('saas') || lower.includes('software') || lower.includes('app');
  const isEcom = lower.includes('shop') || lower.includes('store') || lower.includes('ecommerce');

  if (isSaas) {
    return {
      headlines: [
        'Ship Faster. Scale Smarter.',
        'The Platform That Grows With You',
        'Your Workflow, Supercharged',
      ],
      body: 'Streamline your operations with an all-in-one platform designed for modern SaaS teams. From ideation to deployment, we have got you covered.',
      cta: 'Start Your Free Trial',
      tagline: 'Where great products begin.',
    };
  }

  if (isEcom) {
    return {
      headlines: [
        'Discover Your New Favorites',
        'Quality Meets Convenience',
        'Shop the Collection',
      ],
      body: 'Curated products delivered to your door. Browse hundreds of items with free shipping and hassle-free returns.',
      cta: 'Shop Now',
      tagline: 'Curated for you.',
    };
  }

  return {
    headlines: [
      'Transform Your Vision Into Reality',
      'Where Innovation Meets Excellence',
      'Building the Future Together',
    ],
    body: 'We help businesses of all sizes achieve their goals with cutting-edge solutions tailored to their unique needs.',
    cta: 'Get Started Today',
    tagline: 'Excellence, delivered.',
  };
}

function generateMockSeo(prompt: string) {
  const businessHint = prompt.slice(0, 50);
  return {
    title: `${businessHint} - Professional Solutions | Your Brand`,
    description: `Discover how ${businessHint.toLowerCase()} can transform your business. Trusted by thousands of companies worldwide. Get started free today.`,
    keywords: [
      businessHint.toLowerCase().split(' ')[0],
      'solutions',
      'platform',
      'professional',
      'business',
    ],
    suggestions: [
      'Add structured data (JSON-LD) for rich search results',
      'Include internal links to your top 3 landing pages',
      'Ensure all images have descriptive alt text',
      'Target long-tail keywords in H2/H3 headings',
      'Add an FAQ section to capture featured snippet positions',
    ],
  };
}

function generateMockBrand(prompt: string) {
  const lower = prompt.toLowerCase();
  const isPlayful = lower.includes('fun') || lower.includes('playful') || lower.includes('creative');
  const isCorporate = lower.includes('corporate') || lower.includes('enterprise') || lower.includes('professional');

  if (isPlayful) {
    return {
      colors: { primary: '#ff6b6b', secondary: '#feca57', accent: '#48dbfb', dark: '#2d3436', light: '#ffeaa7' },
      fonts: { heading: 'Poppins', body: 'Nunito' },
      voice: 'Fun, energetic, approachable, and a little cheeky',
      tagline: 'Life is better when you are having fun.',
    };
  }

  if (isCorporate) {
    return {
      colors: { primary: '#1a365d', secondary: '#2b6cb0', accent: '#ed8936', dark: '#171923', light: '#edf2f7' },
      fonts: { heading: 'Source Serif Pro', body: 'Inter' },
      voice: 'Authoritative, trustworthy, clear, and professional',
      tagline: 'Trusted partnerships. Proven results.',
    };
  }

  return {
    colors: { primary: '#4c6ef5', secondary: '#748ffc', accent: '#f59f00', dark: '#1a1a2e', light: '#f8f9fa' },
    fonts: { heading: 'Poppins', body: 'Inter' },
    voice: 'Modern, innovative, friendly, and confident',
    tagline: 'Designed for the future.',
  };
}

// ---------- POST /api/ai ----------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, type, context } = aiRequestSchema.parse(body);

    // Attempt OpenAI call first
    const systemPrompt = getSystemPrompt(type);
    const contextStr = context ? `\nContext: ${JSON.stringify(context)}` : '';
    const aiResponse = await callOpenAI(systemPrompt, prompt + contextStr);

    // If OpenAI returned a result, try to parse it
    if (aiResponse) {
      try {
        // Strip possible markdown code fences
        const cleaned = aiResponse
          .replace(/^```(?:json)?\n?/gm, '')
          .replace(/\n?```$/gm, '')
          .trim();
        const parsed = JSON.parse(cleaned);

        return NextResponse.json({
          success: true,
          data: {
            result: parsed,
            source: 'openai',
            suggestions: ['AI-generated content. Review and customize in the builder.'],
          },
        });
      } catch {
        // If JSON parse fails, return raw text wrapped in an object
        return NextResponse.json({
          success: true,
          data: {
            result: { text: aiResponse },
            source: 'openai',
            suggestions: ['AI response was not structured JSON. Raw text is provided.'],
          },
        });
      }
    }

    // ---- Smart mock fallback (no OPENAI_API_KEY) ----
    let result: unknown;

    switch (type) {
      case 'website':
        result = generateMockWebsite(prompt);
        break;

      case 'page':
        result = generateMockWebsite(prompt); // Pages get the same full treatment
        break;

      case 'section':
        result = generateMockSection(prompt);
        break;

      case 'copy':
        result = generateMockCopy(prompt);
        break;

      case 'seo':
        result = generateMockSeo(prompt);
        break;

      case 'brand':
        result = generateMockBrand(prompt);
        break;

      case 'image':
        result = {
          url: `https://placehold.co/800x600/4c6ef5/ffffff?text=${encodeURIComponent(prompt.slice(0, 30))}`,
          alt: prompt,
          width: 800,
          height: 600,
          note: 'Set OPENAI_API_KEY to enable DALL-E image generation.',
        };
        break;

      case 'logo':
        result = {
          url: `https://placehold.co/200x200/4c6ef5/ffffff?text=${encodeURIComponent(prompt.slice(0, 10))}`,
          alt: `${prompt} logo`,
          width: 200,
          height: 200,
          note: 'Set OPENAI_API_KEY to enable AI logo generation.',
        };
        break;

      default:
        result = { generated: true, type, prompt };
    }

    return NextResponse.json({
      success: true,
      data: {
        result,
        source: 'mock',
        suggestions: [
          'Running in demo mode without OpenAI.',
          'Set OPENAI_API_KEY in your environment to enable AI-powered generation.',
        ],
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 },
      );
    }
    console.error('[ai/POST] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'AI generation failed' },
      { status: 500 },
    );
  }
}
