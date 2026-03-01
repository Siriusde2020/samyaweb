import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUser } from '@/lib/auth';
import { SiteCompiler, StaticSiteGenerator } from '@/lib/engine/compiler';
import type { BuilderElement, DesignSystem, ExportConfig, ExportFile } from '@/types/builder';

const exportSchema = z.object({
  siteId: z.string().min(1, 'siteId is required'),
  format: z.enum(['html', 'nextjs', 'gatsby', 'zip']).default('html'),
  includeAssets: z.boolean().default(true),
  minify: z.boolean().default(true),
});

const DEFAULT_DESIGN_SYSTEM: DesignSystem = {
  colors: {
    primary: '#4c6ef5',
    secondary: '#748ffc',
    accent: '#f59f00',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#1a1a2e',
    textSecondary: '#6c757d',
    border: '#dee2e6',
    error: '#e03131',
    success: '#2f9e44',
    warning: '#f08c00',
    custom: {},
  },
  typography: {
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseSize: 16,
    scale: 1.25,
    lineHeight: 1.6,
    headings: {},
    body: {},
  },
  spacing: { unit: 4, scale: [0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128] },
  borderRadius: { none: '0', sm: '4px', md: '8px', lg: '12px', xl: '16px', full: '9999px' },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.07)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
  },
  breakpoints: { desktop: 1280, tablet: 768, mobile: 480 },
};

async function isDatabaseAvailable(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    const { prisma } = await import('@/lib/db');
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a Next.js project wrapper around the compiled HTML pages.
 */
function wrapAsNextjsProject(files: ExportFile[], siteName: string): ExportFile[] {
  const projectFiles: ExportFile[] = [];

  // package.json
  const packageJson = JSON.stringify(
    {
      name: siteName.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      private: true,
      scripts: { dev: 'next dev', build: 'next build', start: 'next start' },
      dependencies: { next: '^14.1.0', react: '^18.2.0', 'react-dom': '^18.2.0' },
      devDependencies: { typescript: '^5.3.0', '@types/node': '^20.0.0', '@types/react': '^18.2.0' },
    },
    null,
    2,
  );
  projectFiles.push({ path: 'package.json', content: packageJson, type: 'json', size: packageJson.length });

  // Each HTML file becomes a page component
  for (const file of files) {
    if (file.type === 'html' && file.path.endsWith('.html')) {
      const pagePath = file.path === 'index.html' ? 'page.tsx' : file.path.replace('/index.html', '/page.tsx').replace('.html', '/page.tsx');
      const component = `export default function Page() {\n  return (\n    <div dangerouslySetInnerHTML={{ __html: \`${file.content.replace(/`/g, '\\`')}\` }} />\n  );\n}\n`;
      projectFiles.push({ path: `app/${pagePath}`, content: component, type: 'js', size: component.length });
    }
  }

  // Copy CSS files into public
  for (const file of files) {
    if (file.type === 'css') {
      projectFiles.push({ ...file, path: `public/${file.path}` });
    }
    if (file.type === 'js') {
      projectFiles.push({ ...file, path: `public/${file.path}` });
    }
  }

  return projectFiles;
}

/**
 * Generate a Gatsby project wrapper around the compiled HTML pages.
 */
function wrapAsGatsbyProject(files: ExportFile[], siteName: string): ExportFile[] {
  const projectFiles: ExportFile[] = [];

  const packageJson = JSON.stringify(
    {
      name: siteName.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      private: true,
      scripts: { develop: 'gatsby develop', build: 'gatsby build', serve: 'gatsby serve' },
      dependencies: { gatsby: '^5.0.0', react: '^18.2.0', 'react-dom': '^18.2.0' },
    },
    null,
    2,
  );
  projectFiles.push({ path: 'package.json', content: packageJson, type: 'json', size: packageJson.length });

  // Each HTML file becomes a Gatsby page
  for (const file of files) {
    if (file.type === 'html' && file.path.endsWith('.html')) {
      const pageName = file.path === 'index.html' ? 'index' : file.path.replace('/index.html', '').replace('.html', '');
      const component = `import React from 'react';\n\nexport default function ${pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/[^a-zA-Z]/g, '')}Page() {\n  return (\n    <div dangerouslySetInnerHTML={{ __html: \`${file.content.replace(/`/g, '\\`')}\` }} />\n  );\n}\n`;
      projectFiles.push({ path: `src/pages/${pageName}.tsx`, content: component, type: 'js', size: component.length });
    }
  }

  // Static assets
  for (const file of files) {
    if (file.type === 'css' || file.type === 'js') {
      projectFiles.push({ ...file, path: `static/${file.path}` });
    }
  }

  return projectFiles;
}

// ---------- POST /api/export ----------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteId, format, includeAssets, minify } = exportSchema.parse(body);

    const dbAvailable = await isDatabaseAvailable();

    const exportConfig: ExportConfig = {
      format,
      includeAssets,
      minify,
      cleanCode: true,
    };

    if (dbAvailable) {
      const user = await getAuthUser(request);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 },
        );
      }

      const { prisma } = await import('@/lib/db');

      const site = await prisma.site.findFirst({
        where: { id: siteId, userId: user.id },
        include: { pages: true },
      });

      if (!site) {
        return NextResponse.json(
          { success: false, error: 'Site not found' },
          { status: 404 },
        );
      }

      const designSystem = (site.globalStyles as unknown as DesignSystem) ?? DEFAULT_DESIGN_SYSTEM;

      // Compile all pages
      const generator = new StaticSiteGenerator();
      const pageData = site.pages.map((page) => ({
        slug: page.path,
        elements: (page.elements as unknown as Record<string, BuilderElement>) ?? {},
        rootIds: ((page.layout as unknown as { rootElementIds?: string[] })?.rootElementIds) ?? [],
        seo: {
          title: page.seoTitle ?? page.title,
          description: page.seoDescription ?? '',
          ogImage: page.ogImage ?? undefined,
        },
      }));

      let files = await generator.generateSite(pageData, designSystem, exportConfig);

      // Wrap into framework project structure if needed
      if (format === 'nextjs') {
        files = wrapAsNextjsProject(files, site.name);
      } else if (format === 'gatsby') {
        files = wrapAsGatsbyProject(files, site.name);
      }

      const totalSize = files.reduce((sum, f) => sum + f.size, 0);

      return NextResponse.json({
        success: true,
        data: {
          format,
          files,
          fileCount: files.length,
          totalSize,
        },
      });
    }

    // ---- Demo mode ----
    // Generate a simple demo export using the compiler directly
    const demoElements: Record<string, BuilderElement> = {
      'demo-section': {
        id: 'demo-section',
        type: 'section',
        tag: 'section',
        children: ['demo-heading', 'demo-text', 'demo-button'],
        styles: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px',
          minHeight: '100vh',
          backgroundColor: '#f8f9fa',
        },
      },
      'demo-heading': {
        id: 'demo-heading',
        type: 'heading',
        tag: 'h1',
        content: 'Welcome to Your Site',
        parentId: 'demo-section',
        styles: {
          fontSize: '48px',
          fontWeight: '700',
          color: '#1a1a2e',
          marginBottom: '16px',
          textAlign: 'center',
        },
      },
      'demo-text': {
        id: 'demo-text',
        type: 'text',
        tag: 'p',
        content: 'Built with JAMStack Builder. Edit this page in the visual builder.',
        parentId: 'demo-section',
        styles: {
          fontSize: '18px',
          color: '#6c757d',
          maxWidth: '600px',
          textAlign: 'center',
          marginBottom: '32px',
          lineHeight: '1.6',
        },
      },
      'demo-button': {
        id: 'demo-button',
        type: 'button',
        tag: 'a',
        content: 'Get Started',
        href: '#',
        parentId: 'demo-section',
        styles: {
          display: 'inline-block',
          padding: '12px 32px',
          backgroundColor: '#4c6ef5',
          color: '#ffffff',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '600',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        },
        hoverStyles: {
          backgroundColor: '#3b5bdb',
        },
      },
    };

    const compiler = new SiteCompiler(
      demoElements,
      ['demo-section'],
      DEFAULT_DESIGN_SYSTEM,
      exportConfig,
    );

    const { html, css, js } = compiler.compile();
    let files: ExportFile[] = [
      { path: 'index.html', content: html, type: 'html', size: html.length },
      { path: 'styles.css', content: css, type: 'css', size: css.length },
      { path: 'scripts.js', content: js, type: 'js', size: js.length },
    ];

    if (format === 'nextjs') {
      files = wrapAsNextjsProject(files, 'demo-site');
    } else if (format === 'gatsby') {
      files = wrapAsGatsbyProject(files, 'demo-site');
    }

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);

    return NextResponse.json({
      success: true,
      data: {
        format,
        files,
        fileCount: files.length,
        totalSize,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 },
      );
    }
    console.error('[export/POST] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Export failed' },
      { status: 500 },
    );
  }
}
