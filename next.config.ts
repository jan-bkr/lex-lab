import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  // Entfernte Module (Relaunch 2026-10): alte URLs nicht ins Leere laufen lassen
  async redirects() {
    return [
      { source: '/workflows', destination: '/skill-bibliothek', permanent: true },
      { source: '/workflows/:slug*', destination: '/skill-bibliothek', permanent: true },
      { source: '/prompts/builder', destination: '/prompts', permanent: true },
      { source: '/radar', destination: '/research', permanent: true },
      { source: '/schwerpunkte', destination: '/skill-bibliothek', permanent: false },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig;
