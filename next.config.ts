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
  async rewrites() {
    return STUB_ROUTES.map((source) => ({ source, destination: '/coming-soon' }));
  },
};

export default nextConfig;
