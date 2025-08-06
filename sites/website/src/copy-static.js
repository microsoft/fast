const path = require("path");
const copy = require("../../../build/copy");

function getPackageDir(pkg) {
    return path.dirname(require.resolve(`${pkg}/package.json`));
}

const outputPath = path.resolve(__dirname, "../static");
const utilitiesDir = getPackageDir("@microsoft/site-utilities");
const utilitiesAssets = path.resolve(utilitiesDir, "statics/assets");

(async function () {
    await copy(
        [
            `${utilitiesAssets}/favicon.ico`,
            `${utilitiesAssets}/fast-inline-logo.svg`,
            `${utilitiesAssets}/fast-inline-logo-light.svg`,
        ].map(x => require.resolve(x)),
        outputPath
    );

    await copy([`${utilitiesAssets}/badges/*.svg`], `${outputPath}/badges`);
})();
