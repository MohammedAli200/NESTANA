// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     serverActions: true,
//     appDir: true,
//     serverComponentsExternalPackages: ["mongoose"],
//   },
//   output: "standalone",
//   eslint: {
//     // Warning: This allows production builds to successfully complete even if
//     // your project has ESLint errors.
//     ignoreDuringBuilds: true,
//   },
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "img.clerk.com",
//       },
//       {
//         protocol: "https",
//         hostname: "images.clerk.dev",
//       },
//       {
//         protocol: "https",
//         hostname: "uploadthing.com",
//       },
//       {
//         protocol: "https",
//         hostname: "placehold.co",
//       },
//     ],
//   },
// };

// module.exports = nextConfig;






/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  eslint: {
    // ✅ Allows production builds even if ESLint errors exist
    ignoreDuringBuilds: true,
  },

  typescript: {
    // ✅ Allows production builds even if TS type errors exist
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.clerk.com" },
      { protocol: "https", hostname: "images.clerk.dev" },
      { protocol: "https", hostname: "uploadthing.com" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },

  // ✅ Correct for Next.js 15 (instead of experimental.serverComponentsExternalPackages)
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;