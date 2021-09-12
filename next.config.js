const withPlugins = require("next-compose-plugins");

module.exports = withPlugins([], {
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  webpack5: true,
  // env: {
  //   // app
  //   BASE_URL: process.env.VERCEL_URL,
  //   // prisma
  //   DATABASE_URL:
  //     "mysql://doadmin:ix2s813ci20zmr3h@db-mysql-ams3-57417-do-user-1778867-0.b.db.ondigitalocean.com:25060/defaultdb?ssl-mode=REQUIRED",
  //   // auth
  //   GITHUB_ID: "6bd2ff63e6651b8196a1",
  //   GITHUB_SECRET: "950dd24bd72eff809a44b0863ce117f94e7602f1",
  //   NEXTAUTH_URL: process.env.VERCEL_URL,
  // },
});
