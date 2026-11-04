import type { NextConfig } from 'next';
import { STUB_ROUTES } from './lib/stub-routes';

const nextConfig: NextConfig = {
  // Tailwind v4 is compiled by the Turbopack loader (there is no postcss config); keep this rule.
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  // The Resources page is gone: its content now lives on Case studies (research, achievements, knowledge base, video) and Blog.
  async redirects() {
    return [{ source: '/resources', destination: '/case-studies', permanent: true }];
  },
  async rewrites() {
    return STUB_ROUTES.map((source) => ({ source, destination: '/coming-soon' }));
  },
};

export default nextConfig;
