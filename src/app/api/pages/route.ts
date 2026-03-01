import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUser, verifyToken } from '@/lib/auth';

// ---------- Validation schemas ----------

const getPageSchema = z.object({
  siteId: z.string().min(1, 'siteId is required'),
  pageId: z.string().optional(),
});

const savePageSchema = z.object({
  siteId: z.string().min(1),
  pageId: z.string().min(1),
  elements: z.record(z.any()),
  rootElementIds: z.array(z.string()),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(500).optional(),
  customCss: z.string().max(50_000).optional(),
  customJs: z.string().max(50_000).optional(),
});

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

// ---------- In-memory store for demo mode ----------

interface DemoPage {
  id: string;
  siteId: string;
  title: string;
  slug: string;
  path: string;
  isHome: boolean;
  status: string;
  sortOrder: number;
  elements: Record<string, unknown>;
  layout: { rootElementIds: string[] };
  seoTitle: string | null;
  seoDescription: string | null;
  customCss: string | null;
  customJs: string | null;
  createdAt: string;
  updatedAt: string;
}

const demoPages = new Map<string, DemoPage>();

function seedDemoPagesForSite(siteId: string): void {
  const key = `${siteId}:/`;
  if (!demoPages.has(key)) {
    const homePage: DemoPage = {
      id: `demo-page-${siteId}-home`,
      siteId,
      title: 'Home',
      slug: 'home',
      path: '/',
      isHome: true,
      status: 'DRAFT',
      sortOrder: 0,
      elements: {},
      layout: { rootElementIds: [] },
      seoTitle: null,
      seoDescription: null,
      customCss: null,
      customJs: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    demoPages.set(key, homePage);
    demoPages.set(homePage.id, homePage);
  }
}

// ---------- GET /api/pages?siteId=xxx&pageId=yyy ----------
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = getPageSchema.parse({
      siteId: searchParams.get('siteId') ?? '',
      pageId: searchParams.get('pageId') ?? undefined,
    });

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
        where: { id: params.siteId, userId: user.id },
        select: { id: true },
      });

      if (!site) {
        return NextResponse.json(
          { success: false, error: 'Site not found' },
          { status: 404 },
        );
      }

      // If a specific page is requested, return it with full element data
      if (params.pageId) {
        const page = await prisma.page.findFirst({
          where: { id: params.pageId, siteId: params.siteId },
        });

        if (!page) {
          return NextResponse.json(
            { success: false, error: 'Page not found' },
            { status: 404 },
          );
        }

        return NextResponse.json({
          success: true,
          data: page,
        });
      }

      // Otherwise list all pages for the site
      const pages = await prisma.page.findMany({
        where: { siteId: params.siteId },
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          title: true,
          slug: true,
          path: true,
          isHome: true,
          status: true,
          sortOrder: true,
          seoTitle: true,
          seoDescription: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: pages,
      });
    }

    // ---- Demo mode ----
    seedDemoPagesForSite(params.siteId);

    if (params.pageId) {
      const page = demoPages.get(params.pageId);
      if (!page || page.siteId !== params.siteId) {
        return NextResponse.json(
          { success: false, error: 'Page not found' },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, data: page });
    }

    // List all demo pages for the site
    const pages = Array.from(demoPages.values())
      .filter((p) => p.siteId === params.siteId)
      .sort((a, b) => a.sortOrder - b.sortOrder);

    return NextResponse.json({ success: true, data: pages });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 },
      );
    }
    console.error('[pages/GET] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// ---------- PUT /api/pages - Save page content (auto-save) ----------
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = savePageSchema.parse(body);

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
        where: { id: data.siteId, userId: user.id },
        select: { id: true },
      });

      if (!site) {
        return NextResponse.json(
          { success: false, error: 'Site not found' },
          { status: 404 },
        );
      }

      const updatedPage = await prisma.page.update({
        where: { id: data.pageId },
        data: {
          elements: data.elements,
          layout: { rootElementIds: data.rootElementIds },
          seoTitle: data.seoTitle ?? undefined,
          seoDescription: data.seoDescription ?? undefined,
          customCss: data.customCss ?? undefined,
          customJs: data.customJs ?? undefined,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          updatedAt: true,
        },
      });

      // Touch the site updatedAt so dashboard shows correct "last edited"
      await prisma.site.update({
        where: { id: data.siteId },
        data: { updatedAt: new Date() },
      });

      return NextResponse.json({
        success: true,
        data: {
          pageId: updatedPage.id,
          savedAt: updatedPage.updatedAt.toISOString(),
        },
      });
    }

    // ---- Demo mode ----
    seedDemoPagesForSite(data.siteId);

    const existing = demoPages.get(data.pageId);
    const now = new Date().toISOString();

    if (existing && existing.siteId === data.siteId) {
      existing.elements = data.elements;
      existing.layout = { rootElementIds: data.rootElementIds };
      if (data.seoTitle !== undefined) existing.seoTitle = data.seoTitle;
      if (data.seoDescription !== undefined) existing.seoDescription = data.seoDescription;
      if (data.customCss !== undefined) existing.customCss = data.customCss;
      if (data.customJs !== undefined) existing.customJs = data.customJs;
      existing.updatedAt = now;
    } else {
      // Create new entry in the in-memory store
      const newPage: DemoPage = {
        id: data.pageId,
        siteId: data.siteId,
        title: 'Untitled Page',
        slug: data.pageId,
        path: '/' + data.pageId,
        isHome: false,
        status: 'DRAFT',
        sortOrder: demoPages.size,
        elements: data.elements,
        layout: { rootElementIds: data.rootElementIds },
        seoTitle: data.seoTitle ?? null,
        seoDescription: data.seoDescription ?? null,
        customCss: data.customCss ?? null,
        customJs: data.customJs ?? null,
        createdAt: now,
        updatedAt: now,
      };
      demoPages.set(data.pageId, newPage);
    }

    return NextResponse.json({
      success: true,
      data: {
        pageId: data.pageId,
        savedAt: now,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 },
      );
    }
    console.error('[pages/PUT] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
