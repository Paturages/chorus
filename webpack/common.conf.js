const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  target: "web",
  stats: {
    chunks: false,
    colors: true
  },
  context: path.resolve(__dirname, "..", "src", "app"),
  resolve: {
    extensions: [".js", ".jsx"],
    modules: [
      path.resolve(__dirname, "..", "node_modules"),
      path.resolve(__dirname, "..", "src", "app")
    ],
    /* When doing development workflow we want to make sure webpack picks up development build of inferno */
    alias: {
      inferno: path.resolve(__dirname, "..", "node_modules", "inferno", "dist", "index.dev.esm.js")
    }
  },
  entry: {
    polyfills: ["es5-shim", "es6-shim"],
    bundle: "index.jsx"
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "styles.css" })
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: "file-loader",
          query: {
            name: "[name].html"
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico|mp4|webm)(\?.+)?$/,
        exclude: /node_modules/,
        use: {
          loader: "file-loader",
          query: {
            context: path.resolve(__dirname, "..", "src", "app", "assets"),
            name: "assets/[path][name].[ext]"
          }
        }
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            query: {
              sourceMap: true
            }
          },
          {
            loader: "postcss-loader",
            query: {
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            query: {
              sourceMap: true,
              includePaths: [path.resolve(__dirname, "..", "src", "app", "scss")]
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        enforce: "pre",
        use: [
          {
            loader: "babel-loader",
            query: {
              presets: [
                ["env", {
                  "targets": {
                    "browsers": ["last 2 versions"]
                  }
                }],
              ],
              plugins: ["inferno", "transform-object-rest-spread"]
            }
          },
          "prettier-loader"
        ]
      }
    ]
  }
};
