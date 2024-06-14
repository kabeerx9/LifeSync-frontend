/** @type {import('next').NextConfig} */
const nextConfig = {
  // images: {
  //   domains: ['utfs.io']
  // }
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      },
      {
        protocol: 'http',
        hostname: '**'
      }
    ]
  }
};

module.exports = nextConfig;
