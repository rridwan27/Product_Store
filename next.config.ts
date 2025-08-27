/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["imgs.search.brave.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
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
