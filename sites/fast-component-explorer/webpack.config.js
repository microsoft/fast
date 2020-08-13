const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const WebpackShellPlugin = require("webpack-shell-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const FASTCuratedManifest = require("@microsoft/site-utilities/src/curated-html.json");

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = (env, args) => {
    const isProduction = args.mode === "production";
    return {
        devtool: isProduction ? "none" : "inline-source-map",
        entry: {
            main: path.resolve(appDir, "index.tsx"),
            // Due to issues during development, service workers and the WorkboxPlugin are disabled for now
            // serviceWorker: path.resolve(appDir, "service-worker-registration.ts"),
            focusVisible: require.resolve("focus-visible/dist/focus-visible.min.js"),
        },
        output: {
            path: outDir,
            publicPath: "/",
            filename: "[name]-[contenthash].js",
        },
        optimization: {
            minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
            runtimeChunk: "single",
            splitChunks: {
                chunks: "all",
                maxInitialRequests: 100,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: module => {
                            const packageName = module.context.match(
                                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                            )[1];
                            // npm package names are URL-safe, but some servers don't like @ symbols
                            return `npm.${packageName.replace("@", "")}`;
                        },
                    },
                },
            },
        },
        mode: args.mode || "development",
        module: {
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
                    use: {
                        loader: "babel-loader",
                    },
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
                    test: /(message\-system\.min\.js)$/,
                    use: {
                        loader: "worker-loader",
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
            ],
        },
        plugins: [
            new CleanWebpackPlugin([outDir]),
            new MiniCssExtractPlugin(),
            new HtmlWebpackPlugin({
                title: "FAST Component explorer",
                manifest: FASTCuratedManifest.reduce((manifestItems, manifestItem) => {
                    return manifestItems + manifestItem;
                }, ""),
                inject: "body",
                template: path.resolve(appDir, "index.html"),
            }),
            new WebpackShellPlugin({
                onBuildStart: [`yarn convert:readme`],
            }),
            new BundleAnalyzerPlugin({
                // Remove this to inspect bundle sizes.
                analyzerMode: "disabled",
            }),
            // Due to issues during development, service workers and the WorkboxPlugin are disabled for now
            // new WorkboxPlugin.GenerateSW({
            //     exclude: [/\.map$/, /^manifest.*\.js(?:on)?$/, /\.html$/],
            // }),
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
                features: ["format", "coreCommands", "codeAction"],
            }),
        ],
        resolve: {
            extensions: [".js", ".tsx", ".ts", ".json"],
            alias: {
                lodash: require.resolve("lodash-es"),
                "lodash-es": require.resolve("lodash-es"),
            },
        },
        devServer: {
            compress: false,
            historyApiFallback: true,
            overlay: true,
            open: true,
            port: 7778,
        },
    };
};
