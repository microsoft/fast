// FIXME: #3298 Merge fast-website and website projects to replace temporary build/copy script

/* eslint-env node */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const fastWebsiteConfig = require("@microsoft/fast-website/webpack.prod.js");
const copy = require("../../../build/copy");

function getPackageDir(pkg) {
    return path.dirname(require.resolve(`${pkg}/package.json`));
}

const outputPath = path.resolve(__dirname, "../static");

const utilitiesDir = getPackageDir("@microsoft/site-utilities");
const fastComponentsDir = getPackageDir("@microsoft/fast-components");
const utilitiesAssets = path.resolve(utilitiesDir, "statics/assets");

const config = merge(fastWebsiteConfig, {
    output: { path: outputPath },
    performance: { hints: false },
    plugins: [new ProgressBarPlugin()],
});

const compiler = webpack(config);

compiler.hooks.beforeRun.tap("buildMessage", () => {
    console.info("Building @microsoft/fast-website with webpack to static/");
});

compiler.run(async (err, stats) => {
    if (err) {
        console.error(err.stack || err);
        if (err.details) {
            console.error(err.details);
        }
        process.exit(1);
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
        info.errors.forEach(e => console.error(e));
        process.exit(1);
    }

    if (stats.hasWarnings()) {
        info.warnings.forEach(w => console.warn(w));
    }

    await copy(
        [
            `${utilitiesAssets}/favicon.ico`,
            `${utilitiesAssets}/fast-inline-logo.svg`,
            `${utilitiesAssets}/fast-inline-logo-light.svg`,
            `${fastComponentsDir}/dist/fast-components.iife.min.js`,
        ].map(x => require.resolve(x)),
        outputPath
    );

    await copy([`${utilitiesAssets}/badges/*.svg`], `${outputPath}/badges`);
});
