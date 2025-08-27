import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";

async function getLatestProducts(): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/products?limit=8`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export default async function LatestProducts() {
  const products = await getLatestProducts();

  return (
    <section className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Products</h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            href={`/products/${product._id}`}
            key={product._id}
            className="block rounded-lg border bg-white shadow hover:shadow-lg transition"
          >
            <div className="relative h-48 w-full">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain rounded-t-lg p-4"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-800 line-clamp-1">
                {product.title}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {product.description}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-lg font-bold text-indigo-600">
                  ${product.price}
                </span>
                <span className="text-sm text-blue-600 hover:underline">
                  View
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
