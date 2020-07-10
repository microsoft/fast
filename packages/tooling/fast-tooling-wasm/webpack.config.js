const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = {
    devServer: {
        compress: false,
        historyApiFallback: true,
        open: true,
        overlay: true,
        port: 7003,
    },
    devtool: process.env.NODE_ENV === "production" ? "none" : "inline-source-map",
    entry: {
        app: path.resolve(appDir, "index.ts"),
    },
    output: {
        path: outDir,
        publicPath: "/",
        filename: "[name].js",
    },
    mode: process.env.NODE_ENV || "development",
    node: {
        fs: "empty",
        module: "empty",
    },
    module: {
        rules: [
            {
                test: /.ts$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                declaration: false,
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "./permutator/permutator.wasm"),
                    to: outDir,
                },
                {
                    from: path.resolve(__dirname, "./permutator/permutator.js"),
                    to: outDir,
                },
            ],
        }),
        new HtmlWebpackPlugin({
            title: "FAST Tooling WASM Test Application",
            inject: "body",
            template: path.resolve(appDir, "index.html"),
        }),
    ],
    resolve: {
        extensions: [".js", ".ts", ".json"],
    },
};
