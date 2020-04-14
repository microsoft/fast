const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    devtool: "inline-source-map",
    entry: "./app/index.tsx",
    mode: "development",
    output: {
        path: path.resolve("www"),
        publicPath: "/",
        filename: "app.js",
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "babel-loader",
                    },
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
            {
                test: /\.jsx?$/,
                use: {
                    loader: "babel-loader",
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "FAST shell",
        }),
    ],
    devServer: {
        compress: false,
        historyApiFallback: true,
        port: 3000,
    },
};
