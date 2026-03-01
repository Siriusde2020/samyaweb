import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const savePageSchema = z.object({
  siteId: z.string(),
  pageId: z.string(),
  elements: z.record(z.any()),
  rootElementIds: z.array(z.string()),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  customCss: z.string().optional(),
  customJs: z.string().optional(),
});

// GET /api/pages?siteId=xxx - List pages for a site
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json(
        { success: false, error: 'siteId is required' },
        { status: 400 }
      );
    }

    // const pages = await prisma.page.findMany({
    //   where: { siteId },
    //   orderBy: { sortOrder: 'asc' },
    // });

    return NextResponse.json({
      success: true,
      data: [],
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/pages - Save page content (auto-save)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = savePageSchema.parse(body);

    // In production:
    // await prisma.page.update({
    //   where: { id: data.pageId },
    //   data: {
    //     elements: data.elements,
    //     layout: { rootElementIds: data.rootElementIds },
    //     seoTitle: data.seoTitle,
    //     seoDescription: data.seoDescription,
    //     customCss: data.customCss,
    //     customJs: data.customJs,
    //     updatedAt: new Date(),
    //   },
    // });

    return NextResponse.json({
      success: true,
      data: {
        savedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
