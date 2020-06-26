const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const FASTManifest = require("@microsoft/site-utilities/src/manifest/html.json");
const FASTCuratedManifest = require("@microsoft/site-utilities/src/curated-html.json");

const rootNodeModules = path.resolve(__dirname, "../../node_modules");
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
            focusVisible: path.resolve(
                rootNodeModules,
                "focus-visible/dist/focus-visible.min.js"
            ),
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
                    test: /\.m?js$/,
                    use: {
                        loader: "babel-loader",
                    },
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
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
        plugins: [
            new CleanWebpackPlugin([outDir]),
            new HtmlWebpackPlugin({
                title: "FAST Creator",
                manifest: FASTCuratedManifest.concat(FASTManifest).reduce(
                    (manifestItems, manifestItem) => {
                        return manifestItems + manifestItem;
                    },
                    ""
                ),
                inject: "body",
                template: path.resolve(appDir, "index.html"),
            }),
            new BundleAnalyzerPlugin({
                // Remove this to inspect bundle sizes.
                analyzerMode: "disabled",
            }),
            // Due to issues during development, service workers and the WorkboxPlugin are disabled for now
            // new WorkboxPlugin.GenerateSW({
            //     exclude: [/\.map$/, /^manifest.*\.js(?:on)?$/, /\.html$/],
            // }),
        ],
        resolve: {
            extensions: [".js", ".tsx", ".ts", ".json"],
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
            },
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
