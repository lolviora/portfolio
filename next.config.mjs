/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow next/image with external domains if needed later
  images: {
    domains: [],
  },
  // Transpile packages that ship ESM
  transpilePackages: ["lenis", "three"],
  webpack: (config) => {
    // Ensure Three.js works with dynamic imports
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig;
