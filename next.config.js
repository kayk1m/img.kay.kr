const { StatusCodes } = require('http-status-codes');
// @ts-check
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      `default-src 'self'`,
      `base-uri 'self'`,
      `style-src 'self' 'unsafe-inline'`,
      `font-src 'self'`,
      `worker-src 'self' data: blob:`,
      `script-src 'self' www.googletagmanager.com 'sha256-TXxkhhv5PbMCjHYmlg9z/7BJZyFLLrozKCYjRZVuuHg=' 'unsafe-eval'`,
      `object-src 'self'`,
      `img-src 'self' data: blob:`,
      `connect-src 'self' www.google-analytics.com analytics.google.com ws:`,
    ].join(';'),
  },
];

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/index.html',
        statusCode: StatusCodes.PERMANENT_REDIRECT,
        permanent: true,
      },
    ];
  },
  pwa: { dest: 'public' },
  runtimeCaching,
};

module.exports = withPWA(nextConfig);
