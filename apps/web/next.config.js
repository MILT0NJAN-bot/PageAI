const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  outputFileTracingRoot: path.join(__dirname, '../..'),
  transpilePackages: ['@shared/types'],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: '**.pexels.com' },
    ],
  },
  async headers() {
    const apiOrigin = (() => { try { return new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').origin; } catch { return ''; } })();
    const isProduction = process.env.NODE_ENV === 'production';
    const csp = [
      "default-src 'self'", `script-src 'self' 'unsafe-inline'${isProduction ? '' : " 'unsafe-eval'"}`,
      "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob: https:", "font-src 'self' data:",
      `connect-src 'self' ${apiOrigin} https:`, "frame-ancestors 'none'", "base-uri 'self'", "form-action 'self'", "object-src 'none'",
      isProduction ? 'upgrade-insecure-requests' : '',
    ].filter(Boolean).join('; ');
    const values = [
      { key:'Content-Security-Policy', value:csp }, { key:'X-Content-Type-Options', value:'nosniff' },
      { key:'X-Frame-Options', value:'DENY' }, { key:'Referrer-Policy', value:'strict-origin-when-cross-origin' },
      { key:'Permissions-Policy', value:'camera=(), microphone=(), geolocation=(), payment=()' },
      { key:'Cross-Origin-Opener-Policy', value:'same-origin' },
      ...(isProduction ? [{ key:'Strict-Transport-Security', value:'max-age=31536000; includeSubDomains' }] : []),
    ];
    return [{ source:'/:path*', headers:values }];
  },
};

module.exports = nextConfig;
