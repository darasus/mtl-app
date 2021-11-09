const withPlugins = require("next-compose-plugins");

const baseUrl =
  process.env.VERCEL_URL === "localhost:3000"
    ? `http://${process.env.VERCEL_URL}`
    : `https://${process.env.VERCEL_URL}`;

module.exports = withPlugins([], {
  images: {
    domains: ["avatars.githubusercontent.com", "imagedelivery.net"],
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: false,
  },
  env: {
    NEXT_PUBLIC_BASE_URL: baseUrl,
  },
});
