/* eslint-disable */
const PrerenderSpaPlugin = require("prerender-spa-plugin");
const path = require("path");

const isCI = process.env.CI === 'true';

if (isCI) {
  console.log('CI detected.');
}

module.exports = {
  publicPath: isCI ? '/doomsday/' : '/',
  configureWebpack: (config) => {
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    return {
      plugins: [
        new PrerenderSpaPlugin({
          staticDir: path.resolve(__dirname, "dist"),
          routes: ["/"],
        }),
      ],
    };
  },
};
