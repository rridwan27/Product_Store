import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";
import { z } from "zod";

// Optional: Zod schema to validate POST body
const productSchema = z.object({
  title: z.string().min(3),
  price: z.number().positive(),
  description: z.string().min(10),
  category: z.string(),
  image: z.string().url(),
  rating: z
    .object({
      rate: z.number().min(0).max(5).optional(),
      count: z.number().min(0).optional(),
    })
    .optional(),
});

// GET /api/products →
export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "0");

  const query = Product.find().sort({ createdAt: -1 });
  if (limit > 0) query.limit(limit);

  const products = await query.lean();
  return NextResponse.json(products);
}

// POST /api/products → create a new product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = productSchema.parse(body);

    await dbConnect();
    const product = await Product.create(data);

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error("Product create error:", error);

    // Type guard for ZodError
    if (error && typeof error === 'object' && 'issues' in error) {
      const zodError = error as { issues: Array<{ message: string }> };
      return NextResponse.json(
        { error: zodError.issues[0]?.message || 'Validation error' },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
