const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CleanWebpackPlugin = require("clean-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = (env, args) => {
    const isProduction = args.mode === "production";
    return {
        devtool: isProduction ? "none" : "inline-source-map",
        entry: {
            main: path.resolve(appDir, "index.ts"),
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
                title: "FAST Tooling Examples",
                template: path.resolve(appDir, "index.html"),
            }),
            new MiniCssExtractPlugin({
                chunkFilename: "[name]-[contenthash].css",
            }),
            new BundleAnalyzerPlugin({
                // Remove this to inspect bundle sizes.
                analyzerMode: "disabled",
            }),
            new FaviconsWebpackPlugin(),
        ],
        resolve: {
            extensions: [".js", ".tsx", ".ts"],
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
