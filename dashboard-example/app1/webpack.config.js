const HtmlWebpackPlugin = require("html-webpack-plugin");
const BuildHashPlugin = require("@module-federation/propriatery-tools/packages/dashboard-plugin");
const ModuleFederationPlugin = require("webpack").container
  .ModuleFederationPlugin;
const path = require("path");

module.exports = {
  entry: "./src/index",
  mode: "development",
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    port: 3001,
  },
  output: {
    publicPath: "http://localhost:3001/",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "app1",
      library: { type: "var", name: "app1" },
      filename: "remoteEntry.js",
      remotes: {
        app2: "app2",
      },
      exposes: {
        Button: "./src/Button",
      },
      // sharing code based on the installed version, to allow for multiple vendors with different versions
      shared: require("package.json").dependencies,
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new BuildHashPlugin({
      filename: "dashboard.json",
      reportFunction: (data) => {
        console.log("afterDone", data);
      },
    }),
  ],
};
