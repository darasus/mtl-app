const withPlugins = require("next-compose-plugins");
const { withSentryConfig } = require("@sentry/nextjs");

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withPlugins(
  [withSentryConfig({}, SentryWebpackPluginOptions)],
  {
    images: {
      domains: ["avatars.githubusercontent.com"],
    },
    webpack5: true,
  }
);
