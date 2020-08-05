// FIXME: #3298 Merge fast-website and website projects to replace temporary build/copy script

/* eslint-env node */
/* eslint-disable @typescript-eslint/typedef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const copyfiles = require("copyfiles");
const webpack = require("webpack");
const fastWebsiteConfig = require("fast-website/webpack.prod.js");

const staticPath = path.resolve(__dirname, "../static");
const utilitiesPath = path.resolve(__dirname, "../../site-utilities");
const componentsPath = require.resolve(
    "@microsoft/fast-components/dist/fast-components.iife.min.js"
);

// Set the webpack output path
fastWebsiteConfig.output.path = staticPath;

console.info("Building fast-website with webpack...");
webpack(fastWebsiteConfig, (err, stats) => {
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

    console.info("Built fast-website to static");

    copyfiles(
        [`${utilitiesPath}/statics/assets/favicon.ico`, componentsPath, staticPath],
        { flat: true, verbose: true, up: true },
        () => console.info("Copied favicon to static")
    );
});
