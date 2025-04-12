import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'storage.googleapis.com',
      'https://api.zora.co/graphql',
      'nft-cdn.alchemy.com',
      'ipfs.io',
      'amethyst-conscious-vole-978.mypinata.cloud',
      'cdn.prod.website-files.com',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      'https://img-cdn.magiceden.dev',
      'img-cdn.magiceden.dev',
    ], // Add the hostname here
  },
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async headers() {
//     return [
//       {
//         // Allow CORS for 0x API
//         source: '/api/:path*',
//         headers: [
//           { key: 'Access-Control-Allow-Origin', value: '*' },
//           { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
//           {
//             key: 'Access-Control-Allow-Headers',
//             value: 'Content-Type, Authorization',
//           },
//         ],
//       },
//     ];
//   },
// };

// module.exports = nextConfig;
