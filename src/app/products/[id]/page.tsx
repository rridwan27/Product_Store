import { notFound } from "next/navigation";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import Footer from "@/components/Footer/Footer";

type ProductRating = {
  rate: number;
  count: number;
};

type Product = {
  _id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: ProductRating;
  __v: number;
};

export const runtime = "nodejs";

export default async function ProductDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) notFound();

  await dbConnect();
  const product = (await Product.findById(id).lean()) as Product | null;
  if (!product) notFound();

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Product Image Section */}
          <div className="flex items-center justify-center rounded-xl border bg-gray-50 p-6 dark:bg-neutral-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.title}
              className="aspect-square max-h-[480px] w-full object-contain"
            />
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                {product.category}
              </span>
              <h1 className="text-3xl font-bold md:text-4xl">
                {product.title}
              </h1>
              <div className="flex items-center gap-2">
                {product.rating?.rate !== undefined && (
                  <>
                    <div className="flex items-center">
                      <Star size={16} fill="currentColor" stroke="none" />
                      <span className="ml-1 text-sm font-semibold">
                        {product.rating.rate}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({product.rating.count} reviews)
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
              {formattedPrice}
            </div>

            <p className="leading-relaxed text-gray-700 dark:text-gray-300">
              {product.description}
            </p>

            <div className="flex flex-col gap-4 pt-4 md:flex-row">
              <Button className="w-full md:w-auto" asChild>
                <Link href="/products">← Back to products</Link>
              </Button>
              <Button
                className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 md:w-auto"
                size="lg"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
