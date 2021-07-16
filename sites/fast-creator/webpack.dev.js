/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const merge = require("webpack-merge");
const baseConfigs = require("./webpack.common");

module.exports = baseConfigs.map(baseConfig => {
    return merge(baseConfig, {
        devServer: {
            open: true,
            port: 7777,
        },
        mode: "development",
        output: {
            filename: "[name].js",
        },
    });
});
