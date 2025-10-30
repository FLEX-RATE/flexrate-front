// next.config.mjs
import bundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: { emotion: true },
  swcMinify: true,
  reactStrictMode: true,

  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  eslint: { ignoreDuringBuilds: true },

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  productionBrowserSourceMaps: false,

  modularizeImports: {
    'date-fns': { transform: 'date-fns/{{member}}' },
  },

  experimental: {
    optimizePackageImports: ['antd'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 414, 640, 750, 828, 1080],
    imageSizes: [48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24,
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
