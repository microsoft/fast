const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const manifest = require("@microsoft/site-utilities/src/curated-html.json").join("");

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = (env, args) => {
    const isProduction = args.mode === "production";
    return {
        devtool: isProduction ? "none" : "inline-source-map",
        entry: {
            main: path.resolve(appDir, "index.tsx"),
            serviceWorker: path.resolve(appDir, "service-worker-registration.ts"),
            focusVisible: require.resolve("focus-visible/dist/focus-visible.min.js"),
        },
        output: {
            path: outDir,
            publicPath: "/",
            filename: "[name]-[contenthash].js",
        },
        optimization: {
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
            ],
        },
        plugins: [
            new CleanWebpackPlugin([outDir]),
            new MiniCssExtractPlugin(),
            new HtmlWebpackPlugin({
                title: "FAST color explorer",
                manifest,
                inject: "body",
                template: path.resolve(appDir, "index.html"),
            }),
            new BundleAnalyzerPlugin({
                // Remove this to inspect bundle sizes.
                analyzerMode: "disabled",
            }),
            new WorkboxPlugin.GenerateSW({
                exclude: [/.html$/],
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
        ],
        resolve: {
            extensions: [".svg", ".js", ".tsx", ".ts", ".json"],
        },
        devServer: {
            compress: false,
            historyApiFallback: true,
            overlay: true,
            open: true,
            port: 7777,
        },
    };
};
