/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const baseConfig = require("./webpack.common");

module.exports = merge(baseConfig, {
    devServer: {
        contentBase: "./src/public",
        host: "0.0.0.0",
        port: 7700,
    },
    mode: "development",
    output: {
        filename: "[name].js",
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css",
        }),
    ],
});
