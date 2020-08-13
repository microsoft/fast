/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const FASTCuratedManifest = require("@microsoft/site-utilities/src/curated-html.json");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = {
    entry: {
        main: path.resolve(appDir, "index.tsx"),
        focusVisible: require.resolve("focus-visible/dist/focus-visible.min.js"),
    },
    resolve: {
        extensions: [".svg", ".ts", ".tsx", ".js"],
        alias: {
            svg: path.resolve(__dirname, "src/app/svg"),
        },
    },
    output: {
        path: outDir,
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
                test: /\.m?js$/,
                use: "babel-loader",
            },
            {
                test: /\.(svg|png|jpe?g|gif|ttf)$/i,
                use: {
                    loader: "file-loader",
                    options: {
                        esModule: false,
                    },
                },
            },
            {
                test: /\.css$/,
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
                test: /message\-system\.min\.js/,
                use: {
                    loader: "worker-loader",
                },
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            title: "FAST",
            manifest: FASTCuratedManifest.reduce((manifestItems, manifestItem) => {
                return manifestItems + manifestItem;
            }, ""),
            inject: "body",
            template: path.resolve(appDir, "index.html"),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(
                        __dirname,
                        "../site-utilities/statics/assets/favicon.ico"
                    ),
                    to: outDir,
                },
            ],
        }),
        new MonacoWebpackPlugin({
            // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
            languages: ["html"],
            features: ["format", "coreCommands", "codeAction"]
        })
    ],
};
