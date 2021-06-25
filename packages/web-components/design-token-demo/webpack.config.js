/* eslint-disable */
const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: [
        path.resolve(__dirname, "./src/setup.ts"),
        path.resolve(__dirname, "./src/main.ts"),
    ],
    output: {
        filename: "main.bundle.js",
    },
    resolve: {
        extensions: [".ts", ".js"],
        modules: ["src", "node_modules"],
    },
    devServer: {
        port: 9000,
    },
    module: {
        rules: [
            {
                test: /\.ts$/i,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, "index.ejs"),
            inject: "body",
        }),
    ],
};
