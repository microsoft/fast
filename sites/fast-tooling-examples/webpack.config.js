const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const FASTCuratedManifest = require("@microsoft/site-utilities/src/curated-html.json");

const rootNodeModules = path.resolve(__dirname, "../../node_modules");
const nodeModules = path.resolve(__dirname, "./node_modules");
const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = (env, args) => {
    const isProduction = args.mode === "production";
    return {
        devtool: isProduction ? "none" : "inline-source-map",
        entry: {
            main: path.resolve(appDir, "index.ts"),
            exampleNativeElement1: path.resolve(
                appDir,
                "examples/native-element-1/index.ts"
            ),
            exampleReact1: path.resolve(appDir, "examples/react-1/index.tsx"),
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
                    styles: {
                        name: "styles",
                        test: /\.css$/,
                    },
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
                    test: /\.css$/i,
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
                },
                {
                    test: /\.(svg|png|jpe?g|gif)$/i,
                    use: {
                        loader: "file-loader",
                        options: {
                            esModule: false,
                        },
                    },
                },
                {
                    test: /message\-system\.min\.js/,
                    use: {
                        loader: "worker-loader",
                    },
                },
            ],
        },
        performance: {
            // asset file size increased due to the standard limit is 244kib
            // and the favicons occasionally produce larger files than that
            maxAssetSize: 290000,
        },
        plugins: [
            new CleanWebpackPlugin([outDir]),
            new HtmlWebpackPlugin({
                inject: false,
                title: "FAST Tooling Examples",
                template: path.resolve(appDir, "index.html"),
                manifest: FASTCuratedManifest.reduce((manifestItems, manifestItem) => {
                    return manifestItems + manifestItem;
                }, ""),
            }),
            new HtmlWebpackPlugin({
                inject: false,
                title: "FAST Tooling Examples - Native elements",
                filename: "examples/native-element-1/index.html",
                template: path.resolve(appDir, "examples/native-element-1/index.html"),
                manifest: FASTCuratedManifest.reduce((manifestItems, manifestItem) => {
                    return manifestItems + manifestItem;
                }, ""),
            }),
            new HtmlWebpackPlugin({
                inject: false,
                title: "FAST Tooling Examples - React",
                filename: "examples/react-1/index.html",
                template: path.resolve(appDir, "examples/react-1/index.html"),
                manifest: FASTCuratedManifest.reduce((manifestItems, manifestItem) => {
                    return manifestItems + manifestItem;
                }, ""),
            }),
            new WebpackShellPlugin({
                onBuildStart: [`yarn convert:readme`],
            }),
            new MiniCssExtractPlugin({
                chunkFilename: "[name]-[contenthash].css",
            }),
            new BundleAnalyzerPlugin({
                // Remove this to inspect bundle sizes.
                analyzerMode: "disabled",
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
            extensions: [".js", ".tsx", ".ts"],
            alias: {
                lodash: path.resolve(rootNodeModules, "lodash-es"),
                "lodash-es": path.resolve(rootNodeModules, "lodash-es"),
                "react-dnd-html5-backend": path.resolve(
                    rootNodeModules,
                    "react-dnd-html5-backend"
                ),
                react: path.resolve(rootNodeModules, "react"),
                "react-dnd": path.resolve(rootNodeModules, "react-dnd"),
                "react-dom": path.resolve(rootNodeModules, "react-dom"),
                "@microsoft/fast-components-react-msft": path.resolve(
                    rootNodeModules,
                    "@microsoft/fast-components-react-msft"
                ),
            },
        },
        devServer: {
            compress: false,
            historyApiFallback: true,
            overlay: true,
            open: true,
            port: 7779,
        },
    };
};
