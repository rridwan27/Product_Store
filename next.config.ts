/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      { protocol: "https", hostname: "cdn.dummyjson.com", pathname: "/img/**" },
      { protocol: "https", hostname: "fakestoreapi.com", pathname: "/img/**" },
      { protocol: "https", hostname: "imgs.search.brave.com", pathname: "/**" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
