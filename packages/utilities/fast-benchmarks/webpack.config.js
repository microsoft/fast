/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const outDir = path.resolve(__dirname, "./dist");

module.exports = {
    entry: {
        a: path.resolve("./benchmarks/a/index.ts"),
        b: path.resolve("./benchmarks/b/index.ts"),
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    mode: "production",
    output: {
        library: "benchmarkk",
        path: outDir,
        publicPath: "/", // public URL of the output directory when referenced in a browser
    },
    module: {
        // where we defined file patterns and their loaders
        rules: [
            {
                test: /.ts?$/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: "FAST a",
            chunks: ["a"],
            filename: "a.html",
            template: "benchmarks/a/index.html",
            inject: "head",
            scriptLoading: "blocking",
        }),
        new HtmlWebpackPlugin({
            title: "FAST b",
            chunks: ["b"],
            filename: "b.html",
            template: "benchmarks/b/index.html",
            inject: "head",
            scriptLoading: "blocking",
        }),
    ],
};
