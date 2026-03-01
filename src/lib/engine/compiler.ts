import type { BuilderElement, DesignSystem, ExportConfig, ExportFile } from '@/types/builder';
import { cssPropertiesToString } from '@/lib/utils';

/**
 * JAMStack Site Compiler
 * Compiles builder elements into static HTML/CSS/JS for deployment
 */

export class SiteCompiler {
  private elements: Record<string, BuilderElement>;
  private rootIds: string[];
  private designSystem: DesignSystem;
  private config: ExportConfig;
  private cssClasses: Map<string, string> = new Map();
  private classCounter = 0;

  constructor(
    elements: Record<string, BuilderElement>,
    rootIds: string[],
    designSystem: DesignSystem,
    config: ExportConfig = { format: 'html', includeAssets: true, minify: true, cleanCode: true }
  ) {
    this.elements = elements;
    this.rootIds = rootIds;
    this.designSystem = designSystem;
    this.config = config;
  }

  compile(): { html: string; css: string; js: string } {
    this.cssClasses.clear();
    this.classCounter = 0;

    const bodyHtml = this.rootIds
      .map(id => this.compileElement(id))
      .join('\n');

    const css = this.generateCSS();
    const js = this.generateJS();

    const html = this.wrapInDocument(bodyHtml, css, js);

    return {
      html: this.config.minify ? this.minifyHtml(html) : html,
      css: this.config.minify ? this.minifyCss(css) : css,
      js: this.config.minify ? this.minifyJs(js) : js,
    };
  }

  compileToFiles(): ExportFile[] {
    const { html, css, js } = this.compile();
    const files: ExportFile[] = [];

    files.push({
      path: 'index.html',
      content: html,
      type: 'html',
      size: new Blob([html]).size,
    });

    if (css) {
      files.push({
        path: 'styles.css',
        content: css,
        type: 'css',
        size: new Blob([css]).size,
      });
    }

    if (js) {
      files.push({
        path: 'scripts.js',
        content: js,
        type: 'js',
        size: new Blob([js]).size,
      });
    }

    return files;
  }

  private compileElement(id: string, depth: number = 0): string {
    const element = this.elements[id];
    if (!element || element.hidden) return '';

    const tag = element.tag || 'div';
    const className = this.getClassName(element);
    const attrs = this.compileAttributes(element);
    const indent = '  '.repeat(depth);

    // Self-closing tags
    if (['img', 'hr', 'br', 'input'].includes(tag)) {
      return `${indent}<${tag} class="${className}"${attrs} />`;
    }

    // Compile children
    let children = '';
    if (element.children && element.children.length > 0) {
      children = element.children
        .map(childId => this.compileElement(childId, depth + 1))
        .filter(Boolean)
        .join('\n');
    }

    const content = element.content || '';
    const innerContent = children || content;

    if (!innerContent) {
      return `${indent}<${tag} class="${className}"${attrs}></${tag}>`;
    }

    if (children) {
      return `${indent}<${tag} class="${className}"${attrs}>\n${children}\n${indent}</${tag}>`;
    }

    return `${indent}<${tag} class="${className}"${attrs}>${content}</${tag}>`;
  }

  private getClassName(element: BuilderElement): string {
    const styleKey = JSON.stringify(element.styles);
    if (this.cssClasses.has(styleKey)) {
      return this.cssClasses.get(styleKey)!;
    }

    const className = `el-${element.type}-${++this.classCounter}`;
    this.cssClasses.set(styleKey, className);
    return className;
  }

  private compileAttributes(element: BuilderElement): string {
    const attrs: string[] = [];

    if (element.src) attrs.push(`src="${this.escapeAttr(element.src)}"`);
    if (element.alt) attrs.push(`alt="${this.escapeAttr(element.alt)}"`);
    if (element.href) attrs.push(`href="${this.escapeAttr(element.href)}"`);
    if (element.placeholder) attrs.push(`placeholder="${this.escapeAttr(element.placeholder)}"`);

    if (element.attributes) {
      Object.entries(element.attributes).forEach(([key, value]) => {
        attrs.push(`${key}="${this.escapeAttr(value)}"`);
      });
    }

    if (element.id) attrs.push(`data-element-id="${element.id}"`);

    return attrs.length ? ' ' + attrs.join(' ') : '';
  }

  private escapeAttr(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private generateCSS(): string {
    const reset = `/* Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
body { font-family: ${this.designSystem.typography.bodyFont}, system-ui, sans-serif; font-size: ${this.designSystem.typography.baseSize}px; line-height: ${this.designSystem.typography.lineHeight}; color: ${this.designSystem.colors.text}; background-color: ${this.designSystem.colors.background}; }
img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; }
button { cursor: pointer; border: none; background: none; font: inherit; }
`;

    const cssVariables = `/* Design System Variables */
:root {
  --color-primary: ${this.designSystem.colors.primary};
  --color-secondary: ${this.designSystem.colors.secondary};
  --color-accent: ${this.designSystem.colors.accent};
  --color-background: ${this.designSystem.colors.background};
  --color-surface: ${this.designSystem.colors.surface};
  --color-text: ${this.designSystem.colors.text};
  --color-text-secondary: ${this.designSystem.colors.textSecondary};
  --color-border: ${this.designSystem.colors.border};
  --font-heading: ${this.designSystem.typography.headingFont}, system-ui, sans-serif;
  --font-body: ${this.designSystem.typography.bodyFont}, system-ui, sans-serif;
}
`;

    // Element styles
    const elementStyles = Array.from(this.cssClasses.entries())
      .map(([styleJson, className]) => {
        const styles = JSON.parse(styleJson);
        const cssString = cssPropertiesToString(styles);
        return `.${className} { ${cssString}; }`;
      })
      .join('\n\n');

    // Hover styles
    const hoverStyles = Object.values(this.elements)
      .filter(el => el.hoverStyles && Object.keys(el.hoverStyles).length > 0)
      .map(el => {
        const className = this.getClassName(el);
        const cssString = cssPropertiesToString(el.hoverStyles as Record<string, string>);
        return `.${className}:hover { ${cssString}; }`;
      })
      .join('\n\n');

    // Responsive styles
    const tabletStyles = Object.values(this.elements)
      .filter(el => el.responsiveStyles?.tablet)
      .map(el => {
        const className = this.getClassName(el);
        const cssString = cssPropertiesToString(el.responsiveStyles!.tablet as Record<string, string>);
        return `.${className} { ${cssString}; }`;
      })
      .join('\n  ');

    const mobileStyles = Object.values(this.elements)
      .filter(el => el.responsiveStyles?.mobile)
      .map(el => {
        const className = this.getClassName(el);
        const cssString = cssPropertiesToString(el.responsiveStyles!.mobile as Record<string, string>);
        return `.${className} { ${cssString}; }`;
      })
      .join('\n  ');

    let responsive = '';
    if (tabletStyles) {
      responsive += `\n@media (max-width: ${this.designSystem.breakpoints.tablet}px) {\n  ${tabletStyles}\n}\n`;
    }
    if (mobileStyles) {
      responsive += `\n@media (max-width: ${this.designSystem.breakpoints.mobile}px) {\n  ${mobileStyles}\n}\n`;
    }

    // Animation keyframes
    const animations = `/* Animations */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
`;

    return [reset, cssVariables, elementStyles, hoverStyles, responsive, animations]
      .filter(Boolean)
      .join('\n\n');
  }

  private generateJS(): string {
    return `// JAMStack Builder - Generated Script
(function() {
  'use strict';

  // Intersection Observer for scroll animations
  const animatedElements = document.querySelectorAll('[data-animate]');
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Lazy loading for images
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          imgObserver.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
  }

  // Form handling
  document.querySelectorAll('form[data-form-id]').forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      try {
        const response = await fetch('/api/forms/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ formId: this.dataset.formId, data }),
        });
        if (response.ok) {
          this.reset();
          const successMsg = this.querySelector('.form-success');
          if (successMsg) successMsg.style.display = 'block';
        }
      } catch (err) {
        console.error('Form submission failed:', err);
      }
    });
  });
})();
`;
  }

  private wrapInDocument(body: string, css: string, js: string): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="generator" content="JAMStack Builder">
  <title>Built with JAMStack Builder</title>
  <style>${css}</style>
</head>
<body>
${body}
<script>${js}</script>
</body>
</html>`;
  }

  private minifyHtml(html: string): string {
    return html
      .replace(/\n\s*/g, '')
      .replace(/>\s+</g, '><')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  private minifyCss(css: string): string {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\n\s*/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/;\s*}/g, '}')
      .replace(/\s*{\s*/g, '{')
      .replace(/;\s*/g, ';')
      .replace(/:\s*/g, ':')
      .trim();
  }

  private minifyJs(js: string): string {
    return js
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\n\s*/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }
}

/**
 * Static Site Generator
 * Generates static pages with ISR support
 */
export class StaticSiteGenerator {
  async generateSite(
    pages: Array<{
      slug: string;
      elements: Record<string, BuilderElement>;
      rootIds: string[];
      seo: { title: string; description: string; ogImage?: string };
    }>,
    designSystem: DesignSystem,
    config: ExportConfig
  ): Promise<ExportFile[]> {
    const files: ExportFile[] = [];

    for (const page of pages) {
      const compiler = new SiteCompiler(
        page.elements,
        page.rootIds,
        designSystem,
        config
      );

      const { html, css, js } = compiler.compile();

      files.push({
        path: page.slug === '/' ? 'index.html' : `${page.slug}/index.html`,
        content: this.injectSEO(html, page.seo),
        type: 'html',
        size: new Blob([html]).size,
      });

      files.push({
        path: `css/${page.slug === '/' ? 'index' : page.slug}.css`,
        content: css,
        type: 'css',
        size: new Blob([css]).size,
      });

      if (js) {
        files.push({
          path: `js/${page.slug === '/' ? 'index' : page.slug}.js`,
          content: js,
          type: 'js',
          size: new Blob([js]).size,
        });
      }
    }

    // Generate sitemap
    const sitemap = this.generateSitemap(pages.map(p => p.slug));
    files.push({
      path: 'sitemap.xml',
      content: sitemap,
      type: 'html',
      size: new Blob([sitemap]).size,
    });

    // Generate robots.txt
    const robots = this.generateRobotsTxt();
    files.push({
      path: 'robots.txt',
      content: robots,
      type: 'html',
      size: new Blob([robots]).size,
    });

    return files;
  }

  private injectSEO(
    html: string,
    seo: { title: string; description: string; ogImage?: string }
  ): string {
    const seoTags = `
  <title>${this.escapeHtml(seo.title)}</title>
  <meta name="description" content="${this.escapeHtml(seo.description)}">
  <meta property="og:title" content="${this.escapeHtml(seo.title)}">
  <meta property="og:description" content="${this.escapeHtml(seo.description)}">
  ${seo.ogImage ? `<meta property="og:image" content="${seo.ogImage}">` : ''}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${this.escapeHtml(seo.title)}">
  <meta name="twitter:description" content="${this.escapeHtml(seo.description)}">`;

    return html.replace('</head>', `${seoTags}\n</head>`);
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  private generateSitemap(slugs: string[]): string {
    const urls = slugs
      .map(slug => `  <url><loc>${slug}</loc><changefreq>weekly</changefreq></url>`)
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  private generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

Sitemap: /sitemap.xml`;
  }
}
