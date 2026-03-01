import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getAuthUser, verifyToken } from '@/lib/auth';
import { slugify } from '@/lib/utils';

const createSiteSchema = z.object({
  name: z.string().min(1, 'Site name is required').max(100),
  templateId: z.string().optional(),
  description: z.string().max(500).optional(),
});

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
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

/** Extract userId from token even in demo mode (where getAuthUser hits Prisma). */
function getUserIdFromRequest(request: NextRequest): string | null {
  const token =
    request.cookies.get('auth-token')?.value ||
    request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.userId ?? null;
}

// ---------- Demo data ----------
const DEMO_SITES = [
  {
    id: 'demo-site-1',
    name: 'My Portfolio',
    slug: 'my-portfolio',
    description: 'Personal portfolio website',
    status: 'PUBLISHED',
    domain: null,
    favicon: null,
    publishedAt: '2025-12-01T00:00:00.000Z',
    createdAt: '2025-11-15T00:00:00.000Z',
    updatedAt: '2025-12-20T00:00:00.000Z',
    _count: { pages: 4 },
  },
  {
    id: 'demo-site-2',
    name: 'Startup Landing Page',
    slug: 'startup-landing',
    description: 'A modern SaaS landing page',
    status: 'DRAFT',
    domain: null,
    favicon: null,
    publishedAt: null,
    createdAt: '2025-12-10T00:00:00.000Z',
    updatedAt: '2025-12-22T00:00:00.000Z',
    _count: { pages: 1 },
  },
];

// ---------- GET /api/sites ----------
export async function GET(request: NextRequest) {
  try {
    const dbAvailable = await isDatabaseAvailable();
    const { searchParams } = new URL(request.url);
    const { page, pageSize } = paginationSchema.parse({
      page: searchParams.get('page') ?? 1,
      pageSize: searchParams.get('pageSize') ?? 20,
    });

    if (dbAvailable) {
      const user = await getAuthUser(request);
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Authentication required' },
          { status: 401 },
        );
      }

      const { prisma } = await import('@/lib/db');

      const [sites, total] = await Promise.all([
        prisma.site.findMany({
          where: { userId: user.id },
          include: { _count: { select: { pages: true } } },
          orderBy: { updatedAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.site.count({ where: { userId: user.id } }),
      ]);

      return NextResponse.json({
        success: true,
        data: {
          items: sites,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    }

    // ---- Demo mode ----
    return NextResponse.json({
      success: true,
      data: {
        items: DEMO_SITES,
        total: DEMO_SITES.length,
        page: 1,
        pageSize: 20,
        totalPages: 1,
      },
    });
  } catch (error) {
    console.error('[sites/GET] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// ---------- POST /api/sites ----------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, templateId, description } = createSiteSchema.parse(body);

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

      // Generate a unique slug
      let baseSlug = slugify(name);
      let slug = baseSlug;
      let suffix = 1;
      while (await prisma.site.findUnique({ where: { slug }, select: { id: true } })) {
        slug = `${baseSlug}-${suffix++}`;
      }

      // Default design system stored as JSON
      const defaultGlobalStyles = {
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

      // Create the site and default home page in a transaction
      const site = await prisma.$transaction(async (tx) => {
        const newSite = await tx.site.create({
          data: {
            userId: user.id,
            name,
            slug,
            description: description ?? null,
            status: 'DRAFT',
            globalStyles: defaultGlobalStyles,
          },
        });

        // Create default home page
        await tx.page.create({
          data: {
            siteId: newSite.id,
            title: 'Home',
            slug: 'home',
            path: '/',
            isHome: true,
            status: 'DRAFT',
            sortOrder: 0,
            elements: {},
            layout: { rootElementIds: [] },
          },
        });

        // Create initial version snapshot
        await tx.siteVersion.create({
          data: {
            siteId: newSite.id,
            version: 1,
            data: { globalStyles: defaultGlobalStyles, pages: [] },
            message: 'Initial version',
          },
        });

        return newSite;
      });

      // If a template was specified, we would copy its pages here.
      // Template logic is a future enhancement.
      if (templateId) {
        // TODO: copy pages from template into the new site
      }

      return NextResponse.json(
        {
          success: true,
          data: site,
        },
        { status: 201 },
      );
    }

    // ---- Demo mode ----
    const demoId = 'demo-site-' + Date.now().toString(36);
    const demoSlug = slugify(name);

    const userId = getUserIdFromRequest(request);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: demoId,
          userId: userId ?? 'demo-user-id',
          name,
          slug: demoSlug,
          description: description ?? null,
          status: 'DRAFT',
          domain: null,
          favicon: null,
          publishedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 },
      );
    }
    console.error('[sites/POST] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
