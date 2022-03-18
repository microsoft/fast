/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const appDir = path.resolve(__dirname, "./src");
const outDir = path.resolve(__dirname, "./www");

module.exports = {
    name: "root",
    entry: {
        main: path.resolve(appDir, "index.ts"),
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        path: outDir,
        publicPath: "/",
    },
    module: {
        rules: [
            {
                test: /.ts$/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "Welcome to FAST!",
            template: path.resolve(appDir, "index.html"),
        }),
    ],
};
