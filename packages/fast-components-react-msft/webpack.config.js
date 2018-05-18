const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackShellPlugin = require("webpack-shell-plugin");

const appDir = path.resolve(__dirname, "./app");
const outDir = path.resolve(__dirname, "./www");

module.exports = {
    devtool: 'inline-source-map',
    entry: path.resolve(appDir, "index.tsx"),
    output: {
        path: outDir,
        publicPath: "/",
        filename: "[name].js"
    },
    mode: process.env.NODE_ENV || "development",
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            tslint: path.resolve(__dirname, "../../tslint.json")
        }),
        new HtmlWebpackPlugin({
            contentBase: outDir,
        }),
        new WebpackShellPlugin({
            onBuildStart: [
                `npm run convert:readme`
            ]
        })
    ],
    resolve: {
        extensions: [".js", ".tsx", ".ts", ".json"],
    },
    devServer: {
        compress: false,
        historyApiFallback: true,
        open: true,
        overlay: true,
        port: 7001
    }
}
