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
    ]
  },
  entry: {
    urlsearchparams: "urlsearchparams.polyfill",
    polyfills: ["es5-shim", "es6-shim"],
    bundle: "index.jsx",
    "embed/bundle": "embed/embed.jsx"
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].css" })
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {
          loader: "file-loader",
          query: {
            name: "[path][name].html"
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
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true
            }
          },
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
              sassOptions: {
                includePaths: [path.resolve(__dirname, "..", "src", "app", "scss")]
              }
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
                ["@babel/preset-env", {
                  "targets": "> 0.25%, not dead"
                }],
              ],
              plugins: ["babel-plugin-inferno", "@babel/plugin-proposal-object-rest-spread"]
            }
          },
          {
            loader: "prettier-loader",
            query: {
              parser: "babel"
            }
          }
        ]
      }
    ]
  }
};
