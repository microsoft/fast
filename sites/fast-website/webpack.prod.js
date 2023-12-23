const { merge } = require("webpack-merge");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const baseConfig = require("./webpack.common");

module.exports = merge(baseConfig, {
    mode: "production",
    optimization: {
        minimizer: [new TerserJSPlugin({}), new CssMinimizerPlugin()],
        splitChunks: {
            chunks: "all",
        },
    },
});
