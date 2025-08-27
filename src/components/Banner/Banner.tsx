"use client";

import Image from "next/image";
import Link from "next/link";

const Banner = () => {
  return (
    <section className="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative mx-auto max-w-screen-xl px-6 py-24 lg:flex lg:items-center lg:gap-12">
        {/* Text content */}
        <div className="max-w-2xl text-center sm:text-left">
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            Welcome to <span className="text-yellow-300">Jubilee</span>
          </h1>
          <p className="mt-4 text-lg text-gray-100 sm:leading-relaxed">
            Discover quality products, unbeatable deals, and a seamless shopping
            experience — all in one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center sm:justify-start">
            <Link
              href="/products"
              className="rounded-full bg-white px-6 py-3 text-base font-semibold text-indigo-600 shadow-md transition hover:bg-gray-100"
            >
              Shop Now
            </Link>

            <Link
              href="/dashboard"
              className="rounded-full border border-white px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>

        {/* Image */}
        <div className="mt-10 lg:mt-0 lg:flex-1">
          <Image
            src="https://imgs.search.brave.com/69o8M-FAayfhs737uNWZh3QhVeO_nLSPcrqYmMlfgto/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMi9SZWQt/U25lYWtlcnMtUE5H/LUltYWdlLnBuZw"
            alt="Banner product"
            className="mx-auto w-full max-w-md\ lg:max-w-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default Banner;
