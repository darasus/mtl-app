const withPlugins = require("next-compose-plugins");

module.exports = withPlugins([], {
  images: {
    domains: ["avatars.githubusercontent.com", "images.clerk.dev"],
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: false,
  },
});
