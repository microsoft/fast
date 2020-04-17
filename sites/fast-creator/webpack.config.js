const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const rootNodeModules = path.resolve(__dirname, "./node_modules");
const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = (env, args) => {
    const isProduction = args.mode === "production";
    return {
        devtool: isProduction ? "none" : "inline-source-map",
        entry: {
            main: path.resolve(appDir, "index.tsx"),
            // serviceWorker: path.resolve(appDir, "service-worker-registration.ts"),
            focusVisible: path.resolve(
                __dirname,
                "node_modules/focus-visible/dist/focus-visible.min.js"
            ),
            "message-system": path.resolve(
                __dirname,
                "node_modules/@microsoft/fast-tooling/dist/message-system.min.js"
            ),
        },
        output: {
            path: outDir,
            publicPath: "/",
            filename: "[name].js", // hashing removed due to screwing up the message system path
        },
        optimization: {
            // Note: when this is enabled it wraps the web worker with some kind of wrapper that breaks the web worker
            // runtimeChunk: "single",
            // splitChunks: {
            //     chunks: "all",
            //     maxInitialRequests: 100,
            //     cacheGroups: {
            //         vendor: {
            //             test: /[\\/]node_modules[\\/]/,
            //             name: module => {
            //                 const packageName = module.context.match(
            //                     /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            //                 )[1];
            //                 // npm package names are URL-safe, but some servers don't like @ symbols
            //                 return `npm.${packageName.replace("@", "")}`;
            //             },
            //         },
            //     },
            // },
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
            ],
        },
        plugins: [
            new CleanWebpackPlugin([outDir]),
            new HtmlWebpackPlugin({
                title: "FAST Creator",
                contentBase: outDir,
            }),
            new BundleAnalyzerPlugin({
                // Remove this to inspect bundle sizes.
                analyzerMode: "disabled",
            }),
            // new WorkboxPlugin.GenerateSW({
            //     exclude: [/\.map$/, /^manifest.*\.js(?:on)?$/, /\.html$/],
            // }),
            new FaviconsWebpackPlugin(path.resolve(__dirname, "favicon.png")),
        ],
        resolve: {
            extensions: [".js", ".tsx", ".ts", ".json"],
            alias: {
                lodash: path.resolve(rootNodeModules, "lodash-es"),
                "lodash-es": path.resolve(rootNodeModules, "lodash-es"),
                "react-dnd": path.resolve(rootNodeModules, "react-dnd"),
                "react-dnd-html5-backend": path.resolve(
                    rootNodeModules,
                    "react-dnd-html5-backend"
                ),
                react: path.resolve(rootNodeModules, "react"),
                "react-dom": path.resolve(rootNodeModules, "react-dom"),
                cjs: path.resolve(rootNodeModules, "cjs"),
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
