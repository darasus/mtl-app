const withPlugins = require("next-compose-plugins");

module.exports = withPlugins([], {
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  webpack5: true,
});
