/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const merge = require("webpack-merge");
const baseConfig = require("./webpack.common");

module.exports = merge(baseConfig, {
    devServer: {
        contentBase: "./src/public",
        open: true,
        port: 7778,
    },
    mode: "development",
    output: {
        filename: "[name].js",
    },
});
