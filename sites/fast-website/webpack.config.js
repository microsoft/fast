/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // Require  html-webpack-plugin plugin
const appDir = path.resolve(__dirname, "./src/app");
const publicDir = path.resolve(__dirname, "./src/public");
const outDir = path.resolve(__dirname, "./www");

module.exports = {
    entry: {
        main: path.resolve(appDir, "index.ts"),
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js", // Name of generated bundle after build
        publicPath: "/", // public URL of the output directory when referenced in a browser
    },
    module: {
        // where we defined file patterns and their loaders
        rules: [
            {
                test: /.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
            {
                test: /\.js$/,
                use: "babel-loader",
            },
        ],
    },
    plugins: [
        // Array of plugins to apply to build chunk
        new HtmlWebpackPlugin({
            title: "FAST website",
            template: path.resolve(publicDir, "index.html"),
            contentBase: outDir,
        }),
    ],
    devServer: {
        // configuration for webpack-dev-server
        contentBase: "./src/public", //source of static assets
        open: true,
        port: 7700, // port to run dev-server
    },
};
