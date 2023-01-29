// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const isProduction = process.env.NODE_ENV == "production";

const config = {
  resolve: {

    fallback: {
      "fs":false,
      /*"util": require.resolve("util/"),
      "assert": require.resolve("assert/"),
      "path": require.resolve("path-browserify"),
      "zlib":require.resolve("browserify-zlib"),
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "url": require.resolve("url/")*/
      /*"util": false,
      "assert": false,
      "path": false,
      "zlib": false,
      "stream": false,
      "crypto": false,
      "http": false,
      "https": false,
      "url": false*/
    }
  },
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    new NodePolyfillPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
