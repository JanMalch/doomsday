/* eslint-disable */
const PrerenderSpaPlugin = require("prerender-spa-plugin");
const path = require("path");

module.exports = {
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
