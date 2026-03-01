import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const productSchema = z.object({
  storeId: z.string(),
  name: z.string().min(1),
  price: z.number().min(0),
  comparePrice: z.number().optional(),
  description: z.string().optional(),
  type: z.enum(['PHYSICAL', 'DIGITAL', 'SUBSCRIPTION']).default('PHYSICAL'),
  sku: z.string().optional(),
  inventory: z.number().optional(),
  trackInventory: z.boolean().default(false),
  images: z.array(z.string()).default([]),
  variants: z.array(z.object({
    name: z.string(),
    price: z.number().optional(),
    sku: z.string().optional(),
    inventory: z.number().optional(),
    options: z.record(z.string()),
  })).default([]),
});

// GET /api/store/products?storeId=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    // const products = await prisma.product.findMany({
    //   where: { storeId },
    //   include: { variants: true },
    //   orderBy: { createdAt: 'desc' },
    // });

    return NextResponse.json({ success: true, data: [] });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/store/products
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = productSchema.parse(body);

    // const slug = slugify(data.name);
    // const product = await prisma.product.create({
    //   data: {
    //     storeId: data.storeId,
    //     name: data.name,
    //     slug,
    //     price: data.price,
    //     comparePrice: data.comparePrice,
    //     description: data.description,
    //     type: data.type,
    //     sku: data.sku,
    //     inventory: data.inventory,
    //     trackInventory: data.trackInventory,
    //     images: data.images,
    //     status: 'DRAFT',
    //   },
    // });

    // Create variants
    // for (const variant of data.variants) {
    //   await prisma.productVariant.create({
    //     data: { productId: product.id, ...variant },
    //   });
    // }

    return NextResponse.json({
      success: true,
      data: { id: 'new-product-id', name: data.name },
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
