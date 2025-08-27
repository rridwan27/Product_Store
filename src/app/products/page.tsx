"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";

interface Product {
  _id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />

      <div className="bg-white min-h-screen py-12 text-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-800">
            Explore Our Collection
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
              <span className="ml-4 text-gray-500">Loading products...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 text-xl mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="
              bg-white rounded-2xl shadow-lg 
              border border-gray-200 p-6 
              transform hover:scale-105 transition-all duration-300 ease-in-out
              flex flex-col h-full
            "
                >
                  <div className="relative w-full h-56 mb-4 flex items-center justify-center bg-gray-100 rounded-lg p-4">
                    <div className="relative w-full h-full">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRERERCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE4IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzY2NiI+SW1hZ2UgTm90IEZvdW5kPC90ZXh0Pjwvc3ZnPg==";
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {product.title}
                    </h2>
                    <p className="text-purple-600 font-extrabold text-2xl mb-3">
                      ${product.price}
                    </p>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
                      {product.description}
                    </p>
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <span className="bg-yellow-400 text-gray-800 rounded-full px-2 py-0.5 mr-2 font-semibold">
                        {product.rating.rate} ⭐
                      </span>
                      <span className="text-gray-500">
                        ({product.rating.count} reviews)
                      </span>
                    </div>
                    <Link href={`/products/${product?._id}`}>
                      <button
                        className="
                  mt-auto w-full bg-gradient-to-r from-blue-600 to-purple-800 
                  text-white font-bold py-3 rounded-xl 
                  hover:scale-105 transform transition-all duration-200 cursor-pointer
                  hover:shadow-lg hover:shadow-purple-800/20
                  focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-75
                "
                        aria-label={`Add ${product.title} to cart`}
                      >
                        Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Products;
