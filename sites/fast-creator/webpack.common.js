const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const outDir = path.resolve(__dirname, "./www");
const rootAppWebpackConfig = require(path.resolve(__dirname, `./app/webpack.common.js`));
const updatedRootAppWebpackConfig = {
    ...rootAppWebpackConfig,
    ...{
        output: {
            ...rootAppWebpackConfig.output,
            path: outDir,
            publicPath: "/",
        },
        plugins: rootAppWebpackConfig.plugins.map(plugin => {
            if (plugin instanceof CopyPlugin) {
                return new CopyPlugin({
                    patterns: [
                        {
                            from: path.resolve(
                                __dirname,
                                "../site-utilities/statics/assets/favicon.ico"
                            ),
                            to: outDir,
                        },
                    ],
                });
            }

            return plugin;
        }),
    },
};
const previewWebpackConfig = require(path.resolve(
    __dirname,
    `./app/preview/webpack.common.js`
));
const updatedPreviewWebpackConfig = {
    ...previewWebpackConfig,
    ...{
        output: {
            ...previewWebpackConfig.output,
            path: path.resolve(outDir, "preview"),
            publicPath: "/preview/",
        },
    },
};

module.exports = [updatedRootAppWebpackConfig, updatedPreviewWebpackConfig];
