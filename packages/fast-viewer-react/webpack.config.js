const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = {
    devtool: "inline-source-map",
    entry: path.resolve(appDir, "index.tsx"),
    output: {
        path: path.resolve("./www"),
        publicPath: "/",
        filename: "app.js"
    },
    mode: process.env.NODE_ENV || "development",
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                declaration: false,
                            }
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "FAST viewer",
            contentBase: outDir
        })
    ],
    devServer: {
        compress: false,
        historyApiFallback: true,
        open: true,
        port: 3000
    }
}
