import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/sitemap(:any*)',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/:path((?!sitemap).*).xml', // everything except sitemap
        destination: '/some-destination',
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  devIndicators: false,
  transpilePackages: [
    'antd',
    '@ant-design',
    'rc-util',
    'rc-pagination',
    'rc-picker',
    'rc-notification',
    'rc-tooltip',
    'rc-tree',
    'rc-table',
  ],
};

export default nextConfig;
