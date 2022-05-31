const _ = require("lodash");
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const manifest = require("@microsoft/site-utilities/src/curated-html.json").join("");

const appDir = path.resolve(__dirname, "src/app");
const distDir = path.resolve(__dirname, "dist");

module.exports = {
    entry: {
        main: path.resolve(appDir, "index.ts"),
    },
    resolve: {
        extensions: [".svg", ".ts", ".tsx", ".js"],
        alias: {
            svg: path.resolve(appDir, "svg"),
        },
    },
    output: {
        path: distDir,
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
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    {
                        loader: "css-loader",
                    },
                ],
            },
            {
                test: /\.svg$/,
                type: "asset/resource",
            },
            {
                test: /\.ejs$/,
                use: [
                    {
                        loader: "ejs-loader",
                        options: {
                            esModule: false,
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({ _: "lodash-es" }),
        new HtmlWebpackPlugin({
            title: "FAST",
            manifest,
            template: path.resolve(__dirname, "src/public/index.ejs"),
        }),
    ],
};
