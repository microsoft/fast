const path = require("path");
const copy = require("../../../build/copy");

function getPackageDir(pkg) {
    return path.dirname(require.resolve(`${pkg}/package.json`));
}

const outputPath = path.resolve(__dirname, "../static");
const homepageDir = getPackageDir("@microsoft/fast-website");
const utilitiesDir = getPackageDir("@microsoft/site-utilities");
const fastComponentsDir = getPackageDir("@microsoft/fast-components");
const utilitiesAssets = path.resolve(utilitiesDir, "statics/assets");

(async function () {
    await copy([`${homepageDir}/dist/*`], outputPath);

    await copy(
        [
            `${utilitiesAssets}/favicon.ico`,
            `${utilitiesAssets}/fast-inline-logo.svg`,
            `${utilitiesAssets}/fast-inline-logo-light.svg`,
            `${fastComponentsDir}/dist/fast-components.iife.min.js`,
        ].map(x => require.resolve(x)),
        outputPath
    );

    await copy([`${homepageDir}/dist/bundle/*`], `${outputPath}/bundle`, {
        flat: false,
        verbose: true,
        up: true,
    });

    await copy([`${utilitiesAssets}/badges/*.svg`], `${outputPath}/badges`);
})();
