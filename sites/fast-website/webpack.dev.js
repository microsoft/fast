/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const baseConfig = require("./webpack.common");

module.exports = merge(baseConfig, {
    devServer: {
        contentBase: "./src/public",
        open: true,
        port: 7700,
        disableHostCheck: true,
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
