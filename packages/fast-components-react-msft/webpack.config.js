const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = (env, args) => {
    const isProduction = args.mode === "production";

    return {
        devtool: isProduction ? "none" : "inline-source-map",
        entry: {
            app: path.resolve(appDir, "index.tsx"),
            focusVisible: path.resolve(__dirname, "node_modules/focus-visible/dist/focus-visible.min.js")
        },
        output: {
            path: outDir,
            publicPath: "/",
            filename: isProduction ? "[name]-[contenthash].js" : "[name].js"
        },
        mode: args.mode || "development",
        optimization: {
            splitChunks: {
                chunks: "all",
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                    },
                },
            }
        },
        module: {
            rules: [
                {
                    test: /.tsx?$/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                compilerOptions: {
                                    declaration: false,
                                }
                            }
                        }
                    ],
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
                title: "FAST Component explorer",
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
