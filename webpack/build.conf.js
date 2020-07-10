const webpack = require("webpack");
const { merge } = require("webpack-merge");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const commonConfig = require("./common.conf");
const path = require("path");

module.exports = merge(commonConfig, {
  mode: 'production',
  devtool: "source-map",
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "..", "build"),
    filename: "[name].js",
    chunkFilename: "[id].chunk.js"
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"), // required for Inferno production build
        TESTING: JSON.stringify(process.env.TESTING), // for test build
      }
    })
  ]
});
