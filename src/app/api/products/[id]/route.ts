// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";
import mongoose from "mongoose";

export const runtime = "nodejs"; // using Mongoose

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await dbConnect();
  const product = await Product.findById(id).lean();

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}
