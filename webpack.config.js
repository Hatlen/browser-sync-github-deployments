const HtmlWebpackPlugin = require("html-webpack-plugin");

process.env.NODE_ENV = "production";

module.exports = {
  mode: process.env.NODE_ENV,
  entry: "./src/index.js",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader", options: { sourceMap: true } }
        ]
      }
    ]
  },
  plugins: [new HtmlWebpackPlugin()]
};
