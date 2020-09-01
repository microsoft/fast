/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const merge = require("webpack-merge");
const TerserJSPlugin = require("terser-webpack-plugin");
const baseConfig = require("./webpack.common");

module.exports = merge(baseConfig, {
    mode: "production",
    optimization: {
        minimizer: [new TerserJSPlugin({})],
        splitChunks: {
            chunks: "all",
            maxInitialRequests: 100,
            cacheGroups: {
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
    output: {
        filename: "bundle/[name].[contenthash].js",
    },
});
