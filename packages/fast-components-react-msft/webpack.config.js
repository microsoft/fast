const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = (env, args) => {
    return {
        devtool: "inline-source-map",
        entry: path.resolve(appDir, "index.tsx"),
        output: {
            path: outDir,
            publicPath: "/",
            filename: "[name].js"
        },
        mode: args.mode || "development",
        module: {
            rules: [
                {
                    test: /.tsx?$/,
                    use: [
                        {
                            loader: "ts-loader"
                        }
                    ]
                },
                {
                    test: /.sketch$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "[path][name].[ext]"
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "FAST documentation",
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
            }),
            new FaviconsWebpackPlugin(path.resolve(__dirname, "favicon.png"))
        ],
        resolve: {
            extensions: [".js", ".tsx", ".ts", ".json"],
            alias: {
                fbjs: path.resolve('./node_modules/fbjs'),
                'lodash-es': path.resolve('./node_modules/lodash-es'),
                react: path.resolve('./node_modules/react'),
                'react-dom': path.resolve('./node_modules/react-dom'),
            }
        },
        devServer: {
            compress: false,
            historyApiFallback: true,
            open: true,
            overlay: true,
            port: 7001
        }
    }
}
