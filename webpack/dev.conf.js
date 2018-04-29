const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const commonConfig = require("./common.conf");
const path = require("path");

module.exports = webpackMerge(commonConfig, {
  mode: 'development',
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, "..", "dist"),
    publicPath: "http://localhost:8080/",
    filename: "[name].js"
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("dev"),
        FRONTEND: JSON.stringify(process.env.FRONTEND)
      }
    })
  ]
});
