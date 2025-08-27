"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-center text-white px-6">
      <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">
        404
      </h1>
      <p className="mt-4 text-xl md:text-2xl text-blue-100">
        Oops! Page not found.
      </p>
      <p className="mt-2 max-w-md text-blue-200">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-white/10 px-6 py-3 text-white backdrop-blur transition hover:bg-white/20"
      >
        Back to Home
      </Link>
    </div>
  );
}
