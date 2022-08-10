const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const manifest = require("@microsoft/site-utilities/src/curated-html.json").join("");

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = (env, args) => {
    const isProduction = args.mode === "production";
    return {
        devtool: isProduction ? undefined : "inline-source-map",
        entry: {
            main: path.resolve(appDir, "index.ts"),
            serviceWorker: path.resolve(appDir, "service-worker-registration.ts"),
            focusVisible: require.resolve("focus-visible/dist/focus-visible.min.js"),
            footer: path.resolve(appDir, "site-footer.ts"),
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
                    test: /\.ts$/,
                    use: [
                        {
                            loader: "ts-loader",
                        },
                    ],
                    exclude: /node_modules/,
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
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
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
            extensions: [".svg", ".js", ".ts", ".json"],
        },
        devServer: {
            compress: false,
            historyApiFallback: true,
            open: true,
            port: 7777,
            client: {
                overlay: true,
            },
        },
    };
};
