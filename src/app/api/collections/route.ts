import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const collectionSchema = z.object({
  siteId: z.string(),
  name: z.string().min(1),
  fields: z.array(z.object({
    name: z.string(),
    slug: z.string(),
    type: z.string(),
    required: z.boolean().default(false),
    options: z.array(z.string()).optional(),
  })),
});

const collectionItemSchema = z.object({
  collectionId: z.string(),
  data: z.record(z.any()),
  slug: z.string(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SCHEDULED']).default('DRAFT'),
  tags: z.array(z.string()).default([]),
  scheduledAt: z.string().optional(),
});

// GET /api/collections?siteId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    // const collections = await prisma.collection.findMany({
    //   where: { siteId },
    //   include: { _count: { select: { items: true } } },
    // });

    return NextResponse.json({ success: true, data: [] });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/collections - Create collection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = collectionSchema.parse(body);

    // const slug = slugify(data.name);
    // const collection = await prisma.collection.create({
    //   data: {
    //     siteId: data.siteId,
    //     name: data.name,
    //     slug,
    //     fields: data.fields,
    //   },
    // });

    return NextResponse.json({
      success: true,
      data: { id: 'new-collection-id', name: data.name },
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

// PUT /api/collections - Add item to collection
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = collectionItemSchema.parse(body);

    // const item = await prisma.collectionItem.create({
    //   data: {
    //     collectionId: data.collectionId,
    //     data: data.data,
    //     slug: data.slug,
    //     status: data.status,
    //     tags: data.tags,
    //     scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : undefined,
    //     publishedAt: data.status === 'PUBLISHED' ? new Date() : undefined,
    //   },
    // });

    return NextResponse.json({
      success: true,
      data: { id: 'new-item-id' },
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
