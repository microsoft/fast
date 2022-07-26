const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const baseConfig = require("./webpack.common");

module.exports = merge(baseConfig, {
    devServer: {
        static: {
            directory: "./src/public",
        },
        open: true,
        port: 7700,
        allowedHosts: "all",
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
