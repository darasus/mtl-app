const withPlugins = require("next-compose-plugins");
// const withCSS = require("@zeit/next-css");
const withTM = require("next-transpile-modules")([
  "@adobe/react-spectrum",
  "@spectrum-icons/.*",
  "@react-spectrum/.*",
]);

module.exports = withPlugins([withTM], {
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  env: {
    // app
    BASE_URL: "http://localhost:3000",
    // prisma
    DATABASE_URL:
      "mysql://doadmin:ix2s813ci20zmr3h@db-mysql-ams3-57417-do-user-1778867-0.b.db.ondigitalocean.com:25060/defaultdb?ssl-mode=REQUIRED",
    // auth
    GITHUB_ID: "6bd2ff63e6651b8196a1",
    GITHUB_SECRET: "950dd24bd72eff809a44b0863ce117f94e7602f1",
    NEXTAUTH_URL: "http://localhost:3000",
  },
});
