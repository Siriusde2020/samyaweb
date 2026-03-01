import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUser } from '@/lib/auth';
import { SiteCompiler, StaticSiteGenerator } from '@/lib/engine/compiler';
import type { BuilderElement, DesignSystem, ExportFile } from '@/types/builder';

const deploySchema = z.object({
  siteId: z.string().min(1, 'siteId is required'),
  environment: z.enum(['production', 'staging', 'preview']).default('production'),
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
  if (!process.env.DATABASE_URL && !process.env.NETLIFY_DATABASE_URL) return false;
  try {
    const { prisma } = await import('@/lib/db');
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

// ---------- POST /api/deploy ----------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteId, environment } = deploySchema.parse(body);

    const dbAvailable = await isDatabaseAvailable();
    const buildStart = Date.now();

    if (dbAvailable) {
      const user = await getAuthUser(request);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 },
        );
      }

      const { prisma } = await import('@/lib/db');

      // Fetch site with pages
      const site = await prisma.site.findFirst({
        where: { id: siteId, userId: user.id },
        include: {
          pages: true,
        },
      });

      if (!site) {
        return NextResponse.json(
          { success: false, error: 'Site not found' },
          { status: 404 },
        );
      }

      // Create deployment record in BUILDING status
      const deployment = await prisma.deployment.create({
        data: {
          siteId,
          status: 'BUILDING',
          environment,
        },
      });

      try {
        // Compile all pages using StaticSiteGenerator
        const designSystem = (site.globalStyles as unknown as DesignSystem) ?? DEFAULT_DESIGN_SYSTEM;

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

        const files: ExportFile[] = await generator.generateSite(
          pageData,
          designSystem,
          { format: 'html', includeAssets: true, minify: true, cleanCode: true },
        );

        const buildDuration = Date.now() - buildStart;
        const siteUrl = site.domain
          ? `https://${site.domain}`
          : `https://${site.slug}.jamstack.app`;
        const previewUrl = `https://preview-${deployment.id.slice(0, 8)}.jamstack.app`;

        // Get the next version number
        const lastVersion = await prisma.siteVersion.findFirst({
          where: { siteId },
          orderBy: { version: 'desc' },
          select: { version: true },
        });
        const nextVersion = (lastVersion?.version ?? 0) + 1;

        // Update deployment, site status, and create version snapshot in a transaction
        await prisma.$transaction([
          prisma.deployment.update({
            where: { id: deployment.id },
            data: {
              status: 'LIVE',
              url: siteUrl,
              previewUrl,
              duration: buildDuration,
              version: nextVersion,
              completedAt: new Date(),
            },
          }),
          prisma.site.update({
            where: { id: siteId },
            data: {
              status: 'PUBLISHED',
              publishedAt: new Date(),
            },
          }),
          prisma.siteVersion.create({
            data: {
              siteId,
              version: nextVersion,
              data: {
                pages: site.pages.map((p) => ({ id: p.id, title: p.title, slug: p.slug })),
                fileCount: files.length,
              },
              message: `Deployed to ${environment}`,
            },
          }),
          // Mark previous deployments in same environment as not LIVE
          prisma.deployment.updateMany({
            where: {
              siteId,
              environment,
              status: 'LIVE',
              id: { not: deployment.id },
            },
            data: { status: 'ROLLED_BACK' },
          }),
        ]);

        return NextResponse.json({
          success: true,
          data: {
            id: deployment.id,
            url: siteUrl,
            previewUrl,
            status: 'LIVE',
            buildTime: buildDuration,
            environment,
            version: nextVersion,
            fileCount: files.length,
            totalSize: files.reduce((sum, f) => sum + f.size, 0),
          },
        });
      } catch (buildError) {
        // Mark deployment as failed
        await prisma.deployment.update({
          where: { id: deployment.id },
          data: {
            status: 'FAILED',
            buildLog: buildError instanceof Error ? buildError.message : 'Unknown build error',
            duration: Date.now() - buildStart,
            completedAt: new Date(),
          },
        });

        console.error('[deploy/POST] Build error:', buildError);
        return NextResponse.json(
          { success: false, error: 'Build failed. Check deployment logs for details.' },
          { status: 500 },
        );
      }
    }

    // ---- Demo mode ----
    const buildDuration = Math.floor(Math.random() * 2000) + 800;
    const deployId = 'deploy-' + Date.now().toString(36);

    return NextResponse.json({
      success: true,
      data: {
        id: deployId,
        url: `https://${siteId}.jamstack.app`,
        previewUrl: `https://preview-${deployId.slice(0, 12)}.jamstack.app`,
        status: 'LIVE',
        buildTime: buildDuration,
        environment,
        version: 1,
        fileCount: 5,
        totalSize: 45_678,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 },
      );
    }
    console.error('[deploy/POST] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Deployment failed' },
      { status: 500 },
    );
  }
}

// ---------- GET /api/deploy?siteId=xxx ----------
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json(
        { success: false, error: 'siteId is required' },
        { status: 400 },
      );
    }

    const dbAvailable = await isDatabaseAvailable();

    if (dbAvailable) {
      const user = await getAuthUser(request);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 },
        );
      }

      const { prisma } = await import('@/lib/db');

      // Verify ownership
      const site = await prisma.site.findFirst({
        where: { id: siteId, userId: user.id },
        select: { id: true },
      });

      if (!site) {
        return NextResponse.json(
          { success: false, error: 'Site not found' },
          { status: 404 },
        );
      }

      const deployments = await prisma.deployment.findMany({
        where: { siteId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      });

      return NextResponse.json({
        success: true,
        data: deployments,
      });
    }

    // ---- Demo mode ----
    return NextResponse.json({
      success: true,
      data: [
        {
          id: 'demo-deploy-1',
          siteId,
          status: 'LIVE',
          url: `https://${siteId}.jamstack.app`,
          previewUrl: `https://preview-demo.jamstack.app`,
          environment: 'production',
          duration: 1845,
          version: 1,
          createdAt: new Date(Date.now() - 86_400_000).toISOString(),
          completedAt: new Date(Date.now() - 86_400_000 + 1845).toISOString(),
        },
      ],
    });
  } catch (error) {
    console.error('[deploy/GET] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
