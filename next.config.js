const withPlugins = require("next-compose-plugins");

module.exports = withPlugins([], {
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "imagedelivery.net",
      "mytinylibrary.com",
      "lh3.googleusercontent.com",
      "s.gravatar.com",
      "secure.gravatar.com",
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    esmExternals: false,
  },
});
