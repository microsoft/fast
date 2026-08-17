const path = require("node:path");

const versions = Object.freeze([
    Object.freeze({
        packageDirectory: "1x",
        packageName: "@microsoft/fast-site-1x",
        publicVersion: "1.x",
    }),
    Object.freeze({
        packageDirectory: "2x",
        packageName: "@microsoft/fast-site-2x",
        publicVersion: "2.x",
    }),
    Object.freeze({
        packageDirectory: "3x",
        packageName: "@microsoft/fast-site-3x",
        publicVersion: "3.x",
    }),
]);

function getVersionByPackageRoot(packageRoot) {
    const packageDirectory = path.basename(packageRoot);
    const version = versions.find(item => item.packageDirectory === packageDirectory);

    if (!version) {
        throw new Error(`Unknown documentation version package: ${packageRoot}`);
    }

    return version;
}

module.exports = {
    getVersionByPackageRoot,
    versions,
};
