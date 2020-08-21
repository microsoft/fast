const path = require("path");
const glob = require("glob");
const rootAppWebpackConfig = require(path.resolve(__dirname, "app/webpack.dev.js"));
const outDir = path.resolve(__dirname, "./www");

const configs = new Promise((resolver) => {
    try {
        glob(`${path.resolve(__dirname, "./app/examples")}/*/webpack.dev.js`, {}, function (err, files) {
            if (err) {
                throw err;
            }

            resolver(
                files.map((file) => {
                    const webpackConfig = require(file);
                    const directories = file.split("/");
                    const name = directories[directories.length - 2];

                    webpackConfig.name = name;
                    webpackConfig.output = {
                        ...webpackConfig.output,
                        path: path.resolve(outDir, name),
                        publicPath: `${name}/`,
                    }

                    return webpackConfig;
                })
            );
        });
    } catch (err) {
        console.info(`No example app webpack files found`, err);
        process.exit(0);
    }
}).then((webpackConfigs) => {
    return [
        rootAppWebpackConfig,
        ...webpackConfigs
    ];
});

module.exports = configs;