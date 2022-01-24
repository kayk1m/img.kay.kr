// @ts-check

const { StatusCodes } = require('http-status-codes');

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
      `style-src 'self' fonts.googleapis.com 'unsafe-inline'`,
      `font-src 'self' fonts.gstatic.com`,
      `worker-src 'self' data: blob:`,
      `script-src 'self' 'unsafe-eval'`,
      `object-src 'self'`,
      `img-src 'self' data: blob:`,
      `connect-src 'self' ws:`,
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
};

module.exports = nextConfig;
