/**
 * SEO Analysis Engine
 * Analyzes pages and provides actionable SEO recommendations
 */

export interface SEOAnalysis {
  score: number; // 0-100
  issues: SEOIssue[];
  recommendations: string[];
  meta: MetaAnalysis;
  content: ContentAnalysis;
  technical: TechnicalAnalysis;
}

export interface SEOIssue {
  severity: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  fix?: string;
}

export interface MetaAnalysis {
  title: { value: string; length: number; optimal: boolean };
  description: { value: string; length: number; optimal: boolean };
  ogTitle: boolean;
  ogDescription: boolean;
  ogImage: boolean;
  twitterCard: boolean;
  canonical: boolean;
  robots: boolean;
}

export interface ContentAnalysis {
  wordCount: number;
  headingStructure: { tag: string; text: string; level: number }[];
  imageCount: number;
  imagesWithAlt: number;
  internalLinks: number;
  externalLinks: number;
  keywordDensity: Record<string, number>;
}

export interface TechnicalAnalysis {
  hasSSL: boolean;
  mobileOptimized: boolean;
  loadTime: number;
  pageSize: number;
  cssSize: number;
  jsSize: number;
  imageOptimization: number; // percentage
  coreWebVitals: {
    lcp: number;  // Largest Contentful Paint (ms)
    fid: number;  // First Input Delay (ms)
    cls: number;  // Cumulative Layout Shift
  };
}

export function analyzeSEO(
  html: string,
  meta: {
    title?: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonical?: string;
  }
): SEOAnalysis {
  const issues: SEOIssue[] = [];
  let score = 100;

  // Title analysis
  const titleLength = (meta.title || '').length;
  if (!meta.title) {
    issues.push({ severity: 'error', category: 'Meta', message: 'Missing page title', fix: 'Add a descriptive title between 50-60 characters' });
    score -= 15;
  } else if (titleLength < 30) {
    issues.push({ severity: 'warning', category: 'Meta', message: `Title too short (${titleLength} chars)`, fix: 'Expand title to 50-60 characters for better SEO' });
    score -= 5;
  } else if (titleLength > 60) {
    issues.push({ severity: 'warning', category: 'Meta', message: `Title too long (${titleLength} chars)`, fix: 'Shorten title to under 60 characters to prevent truncation' });
    score -= 5;
  }

  // Description analysis
  const descLength = (meta.description || '').length;
  if (!meta.description) {
    issues.push({ severity: 'error', category: 'Meta', message: 'Missing meta description', fix: 'Add a meta description between 150-160 characters' });
    score -= 15;
  } else if (descLength < 120) {
    issues.push({ severity: 'warning', category: 'Meta', message: `Description too short (${descLength} chars)`, fix: 'Expand to 150-160 characters' });
    score -= 5;
  } else if (descLength > 160) {
    issues.push({ severity: 'warning', category: 'Meta', message: `Description too long (${descLength} chars)`, fix: 'Shorten to under 160 characters' });
    score -= 3;
  }

  // Open Graph
  if (!meta.ogTitle) {
    issues.push({ severity: 'warning', category: 'Social', message: 'Missing Open Graph title', fix: 'Add og:title for better social sharing' });
    score -= 3;
  }
  if (!meta.ogImage) {
    issues.push({ severity: 'warning', category: 'Social', message: 'Missing Open Graph image', fix: 'Add og:image (1200x630px recommended)' });
    score -= 5;
  }

  // Content analysis (simplified from HTML)
  const h1Count = (html.match(/<h1/gi) || []).length;
  if (h1Count === 0) {
    issues.push({ severity: 'error', category: 'Content', message: 'Missing H1 heading', fix: 'Add exactly one H1 heading per page' });
    score -= 10;
  } else if (h1Count > 1) {
    issues.push({ severity: 'warning', category: 'Content', message: `Multiple H1 headings found (${h1Count})`, fix: 'Use only one H1 per page' });
    score -= 5;
  }

  const imgCount = (html.match(/<img/gi) || []).length;
  const imgWithAlt = (html.match(/<img[^>]*alt="[^"]+"/gi) || []).length;
  if (imgCount > 0 && imgWithAlt < imgCount) {
    issues.push({
      severity: 'warning',
      category: 'Accessibility',
      message: `${imgCount - imgWithAlt} images missing alt text`,
      fix: 'Add descriptive alt text to all images',
    });
    score -= (imgCount - imgWithAlt) * 2;
  }

  // Canonical
  if (!meta.canonical) {
    issues.push({ severity: 'info', category: 'Technical', message: 'No canonical URL set', fix: 'Add rel="canonical" to prevent duplicate content issues' });
    score -= 2;
  }

  const recommendations = [
    score < 90 ? 'Fix all error-level issues for maximum SEO impact' : null,
    !meta.ogImage ? 'Add social sharing images for better engagement' : null,
    'Ensure all images are optimized and use WebP format',
    'Add structured data (JSON-LD) for rich search results',
    'Monitor Core Web Vitals regularly',
    'Create an XML sitemap and submit to search engines',
    'Use internal linking to improve page authority',
  ].filter(Boolean) as string[];

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
    meta: {
      title: { value: meta.title || '', length: titleLength, optimal: titleLength >= 50 && titleLength <= 60 },
      description: { value: meta.description || '', length: descLength, optimal: descLength >= 150 && descLength <= 160 },
      ogTitle: !!meta.ogTitle,
      ogDescription: !!meta.ogDescription,
      ogImage: !!meta.ogImage,
      twitterCard: false,
      canonical: !!meta.canonical,
      robots: true,
    },
    content: {
      wordCount: html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length,
      headingStructure: [],
      imageCount: imgCount,
      imagesWithAlt: imgWithAlt,
      internalLinks: (html.match(/<a[^>]*href="\//gi) || []).length,
      externalLinks: (html.match(/<a[^>]*href="https?:\/\//gi) || []).length,
      keywordDensity: {},
    },
    technical: {
      hasSSL: true,
      mobileOptimized: true,
      loadTime: 0,
      pageSize: new Blob([html]).size,
      cssSize: 0,
      jsSize: 0,
      imageOptimization: imgCount > 0 ? (imgWithAlt / imgCount) * 100 : 100,
      coreWebVitals: { lcp: 0, fid: 0, cls: 0 },
    },
  };
}

export function generateSchemaMarkup(type: string, data: Record<string, unknown>): string {
  const schemas: Record<string, unknown> = {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name,
      url: data.url,
      logo: data.logo,
      description: data.description,
      sameAs: data.socialLinks,
    },
    product: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: data.name,
      description: data.description,
      image: data.image,
      offers: {
        '@type': 'Offer',
        price: data.price,
        priceCurrency: data.currency || 'USD',
        availability: 'https://schema.org/InStock',
      },
    },
    article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.title,
      description: data.description,
      image: data.image,
      datePublished: data.publishedAt,
      dateModified: data.updatedAt,
      author: { '@type': 'Person', name: data.author },
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: (data.items as Array<{ name: string; url: string }>)?.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (data.questions as Array<{ question: string; answer: string }>)?.map(q => ({
        '@type': 'Question',
        name: q.question,
        acceptedAnswer: { '@type': 'Answer', text: q.answer },
      })),
    },
  };

  return `<script type="application/ld+json">${JSON.stringify(schemas[type] || {}, null, 2)}</script>`;
}

export function generateRobotsTxt(options: {
  allowAll?: boolean;
  disallowPaths?: string[];
  sitemapUrl?: string;
}): string {
  const lines = ['User-agent: *'];

  if (options.allowAll) {
    lines.push('Allow: /');
  }

  if (options.disallowPaths) {
    options.disallowPaths.forEach(path => lines.push(`Disallow: ${path}`));
  }

  if (options.sitemapUrl) {
    lines.push('', `Sitemap: ${options.sitemapUrl}`);
  }

  return lines.join('\n');
}

export function generate301Redirects(redirects: Array<{ from: string; to: string }>): string {
  return redirects
    .map(r => `${r.from} ${r.to} 301`)
    .join('\n');
}
