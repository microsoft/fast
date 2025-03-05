export default {
  mode: "production",
  devServer: {
    static: "./public",
    port: 3001
  },
  resolve: {
    extensions: [".ts", ".js"],
    extensionAlias: {
     ".js": [".js", ".ts"],
    }
  },
  module: {
    rules: [
      { test: /\.([cm]?ts)$/, loader: "ts-loader" }
    ]
  },
};
