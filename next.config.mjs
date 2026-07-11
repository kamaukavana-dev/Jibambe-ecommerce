/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Images are curated static assets in /public served through next/image at
    // known dimensions — deterministic, zero-CLS, and reliable offline. No
    // runtime third-party fetches. See DESIGN_SYSTEM.md "Images" for rationale.
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;
