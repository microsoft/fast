/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const _ = require("lodash");
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
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
                test: /\.js$/,
                use: "babel-loader",
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === "development",
                        },
                    },
                    {
                        loader: "css-loader",
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: "svg-inline-loader",
                        options: {
                            removeSVGTagAttrs: false,
                        },
                    },
                ],
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
        new CopyPlugin({
            patterns: [
                {
                    from: require.resolve(
                        "@microsoft/site-utilities/statics/assets/favicon.ico"
                    ),
                    to: distDir,
                },
            ],
        }),
    ],
};
