const { merge } = require("webpack-merge");
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
});
