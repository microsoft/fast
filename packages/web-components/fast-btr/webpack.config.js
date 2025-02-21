import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "./");

export default {
  entry: "./server/main.ts",
  mode: "production",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "./server/dist"),
  },
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
