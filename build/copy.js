const copyfiles = require("copyfiles");

function copy(files, destination, config = { flat: true, verbose: true, up: true }) {
    return new Promise((resolve, reject) => {
        return copyfiles([...files, destination], config, err =>
            err ? reject(err.details) : resolve()
        );
    }).catch(err => {
        console.error(err);
        process.exit(1);
    });
}

/**
 * Copy files from one place to another.
 * @param {string[]} files - Paths and globs to copy
 * @param {string} destination - Directory to copy the files to
 * @param {{ flat?: boolean; verbose?: boolean; up?: boolean; }} config - Configuration options passed to `copyfiles`.
 */
module.exports = copy;
