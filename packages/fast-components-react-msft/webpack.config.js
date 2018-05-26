const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = {
    devtool: false,
    entry: path.resolve(appDir, "index.tsx"),
    output: {
        path: outDir,
        publicPath: "/",
        filename: "[name].js"
    },
    mode: process.env.NODE_ENV || "development",
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsWebpackPlugin({
                sourceMap: false
            })
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            tslint: path.resolve(__dirname, "../../tslint.json")
        }),
        new HtmlWebpackPlugin({
            contentBase: outDir,
        }),
        new WebpackShellPlugin({
            onBuildStart: [
                `npm run convert:readme`
            ]
        }),
        new BundleAnalyzerPlugin({
            // Remove this to inspect bundle sizes.
            analyzerMode: "disabled"
        })
    ],
    resolve: {
        extensions: [".js", ".tsx", ".ts", ".json"],
    },
    devServer: {
        compress: false,
        historyApiFallback: true,
        open: true,
        overlay: true,
        port: 7001
    }
}
