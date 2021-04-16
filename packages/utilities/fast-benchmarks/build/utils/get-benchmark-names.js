/* eslint-disable */
const glob = require("glob");
const path = require("path");

module.exports = function getBenchmarkNames(src) {
    return glob.sync(path.resolve(src, "**/index.ts")).map(x => {
        const dirname = path.dirname(x);
        return dirname.slice(dirname.lastIndexOf(path.sep) + 1);
    });
};
