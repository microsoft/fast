const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const CopyPlugin = require("copy-webpack-plugin");

const appDir = path.resolve(__dirname, "./src");
const outDir = path.resolve(__dirname, "./dist");

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
            filename: "[name].js",
        },
        mode: args.mode || "development",
        module: {
            rules: [
                {
                    test: /.tsx?$/,
                    use: [
                        {
                            loader: "babel-loader",
                        },
                        {
                            loader: "ts-loader",
                        },
                    ],
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                title: "FAST MSFT Figma Plugin",
                contentBase: outDir,
            }),
            new BundleAnalyzerPlugin({
                // Remove this to inspect bundle sizes.
                analyzerMode: "disabled",
            }),
            // new CopyPlugin([
            //     { from: path.resolve(__dirname, "./figma-manifest.json"), to: path.resolve(outDir, "manifest.json")}
            // ])
        ],
        resolve: {
            extensions: [".js", ".jsx", ".tsx", ".ts"],
        },
    };
};
