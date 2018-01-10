const webpack = require("webpack"); // eslint-disable-line
const webpackMerge = require("webpack-merge"); // eslint-disable-line
const commonConfig = require("./common.conf");
const path = require("path");

module.exports = webpackMerge(commonConfig, {
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "..", "build"),
    filename: "[name].js",
    chunkFilename: "[id].chunk.js"
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true
      },
      output: {
        comments: false
      }
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"), // required for Inferno production build
        TESTING: JSON.stringify(process.env.TESTING), // for test build
      }
    })
  ]
});
