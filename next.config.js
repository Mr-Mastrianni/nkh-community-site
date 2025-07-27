/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/nkh-community-site' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/nkh-community-site/' : '',
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;