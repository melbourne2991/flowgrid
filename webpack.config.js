const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: ["./src/index.tsx"],
  output: {},
  module: {
    rules: [
      {
        test: /\.(js|tsx?)$/,
        exclude: /node_modules/,
        loader: "ts-loader"
      },
      {
        test: /\.css$/,
        loader: ["style-loader", "css-loader"]
      }
    ]
  },

  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: __dirname + "/index.html"
    })
  ]
};
