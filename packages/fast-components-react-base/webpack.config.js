const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = {
    entry: path.resolve(appDir, "index.tsx"),
    output: {
        path: outDir,
        publicPath: "/",
        filename: "[name].js"
    },
    mode: process.env.NODE_ENV || "development",
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: [
                    {
                        loader: "ts-loader"
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
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
    devServer: {
        compress: false,
        historyApiFallback: true,
        open: true,
        overlay: true,
        port: 7000,
    }
}
