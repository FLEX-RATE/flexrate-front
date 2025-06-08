/** @type {import('next').NextConfig} */
import TerserPlugin from 'terser-webpack-plugin';

const nextConfig = {
  swcMinify: true,
  compiler: {
    emotion: true,
  },
  experimental: {
    optimizeCss: true,
    legacyBrowsers: false,
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ];
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
