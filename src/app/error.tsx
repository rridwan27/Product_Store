"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex h-screen items-center justify-center bg-red-50">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Something went wrong!
          </h2>
          <p className="mt-2 text-gray-600">{error.message}</p>
          <button
            onClick={() => reset()}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
