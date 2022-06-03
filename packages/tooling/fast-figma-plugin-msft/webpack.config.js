const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const appDir = path.resolve(__dirname, "./src");
const outDir = path.resolve(__dirname, "./dist");

module.exports = (env, args) => {
    const isProduction = args.mode === "production";

    return {
        devtool: isProduction ? undefined : "inline-source-map",
        entry: {
            main: path.resolve(appDir, "main.ts"),
            ui: path.resolve(appDir, "ui.ts"),
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
                    test: /.ts$/,
                    loader: "ts-loader",
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                    exclude: /node_modules/,
                },
                {
                    test: /\.svg$/,
                    loader: "raw-loader",
                    exclude: /node_modules/,
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new webpack.DefinePlugin({
                global: {}, // Fix missing symbol error when running in developer VM
            }),
            new HtmlWebpackPlugin({
                title: "Fluent UI Design Tokens",
                contentBase: outDir,
                chunks: ["ui"],
                inlineSource: "(js)$",
                template: path.resolve(appDir, "index.html"),
            }),
            new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin),
            new BundleAnalyzerPlugin({
                // Remove this to inspect bundle sizes.
                analyzerMode: "disabled",
            }),
        ],
        resolve: {
            extensions: [".js", ".svg", ".ts"],
        },
    };
};
