const _ = require("lodash");
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlBundlerPlugin = require("html-bundler-webpack-plugin");
const manifest = require("@microsoft/site-utilities/src/curated-html.json").join("");

const appDir = path.resolve(__dirname, "src/app");
const distDir = path.resolve(__dirname, "dist");

const isDev = process.env.NODE_ENV === "development";

module.exports = {
    resolve: {
        extensions: [".svg", ".ts", ".tsx", ".js"],
        alias: {
            app: appDir,
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
                loader: "css-loader",
            },
            {
                test: /\.svg$/,
                type: "asset/source",
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.ProvidePlugin({ _: "lodash-es" }),
        new HtmlBundlerPlugin({
            entry: {
                // define templates here
                index: {
                    // => dist/index.html
                    import: "src/public/index.ejs",
                    data: {
                        title: "FAST",
                        manifest,
                    },
                },
            },
            js: {
                // output filename of extracted JS
                filename: isDev ? "[name].js" : "bundle/[name].[contenthash:8].js",
            },
            css: {
                // output filename of extracted CSS
                filename: isDev ? "[name].css" : "bundle/[name].[contenthash:8].css",
            },
            loaderOptions: {
                preprocessor: "ejs", // compile EJS templates to HTML
            },
        }),
    ],
};
