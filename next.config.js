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
  env: {
    NEXT_PUBLIC_VERCEL_URL:
      process.env.VERCEL_ENV === "production"
        ? "https://www.mytinylibrary.com"
        : process.env.VERCEL_URL === "localhost:3000"
        ? `http://${process.env.VERCEL_URL}`
        : `https://${process.env.VERCEL_URL}`,
  },
});
