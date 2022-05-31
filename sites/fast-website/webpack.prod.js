const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const baseConfig = require("./webpack.common");

module.exports = merge(baseConfig, {
    mode: "production",
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        splitChunks: {
            chunks: "all",
        },
    },
    output: {
        filename: "bundle/[name].[contenthash].js",
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "bundle/[name].[hash].css",
            chunkFilename: "bundle/[id].[hash].css",
        }),
    ],
});
