const path = require("path");
const fs = require("fs");

/**
 * Resolves the directory of the package.json for a given dependency.
 * @param {string} name - the package name
 * @returns
 *
 * @description
 * NodeJS exports fields prevent arbitrarily resolving files in a package
 * that are not explicitly enumerated in the exports field of the package.
 * This function provides a mechanism to resolve the package 'root' by package name,
 * allowing file-system retrieval by relative path for arbitrary files outside of
 * Node's module system.
 */
exports.getPackageJsonDir = (name, options) => {
    const entry = require.resolve(name, options).toString();
    let dir = path.parse(entry).dir;

    while (!fs.existsSync(path.resolve(dir, "package.json"))) {
        dir = path.parse(dir).dir;
    }

    return dir;
};
