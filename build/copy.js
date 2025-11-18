const fs = require("fs");
const path = require("path");
const { glob } = require("glob");

/**
 * Recursively create directories
 */
function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

/**
 * Copy a single file
 */
function copyFile(src, dest) {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
}

async function copy(files, destination, config = { flat: true, verbose: true, up: true }) {
    try {
        ensureDir(destination);

        const allFiles = [];
        for (const pattern of files) {
            const matches = await glob(pattern, { nodir: true });
            allFiles.push(...matches);
        }

        for (const file of allFiles) {
            let destPath;
            if (config.flat) {
                destPath = path.join(destination, path.basename(file));
            } else {
                destPath = path.join(destination, file);
            }

            copyFile(file, destPath);

            if (config.verbose) {
                console.log(`Copied ${file} to ${destPath}`);
            }
        }
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

/**
 * Copy files from one place to another.
 * @param {string[]} files - Paths and globs to copy
 * @param {string} destination - Directory to copy the files to
 * @param {{ flat?: boolean; verbose?: boolean; up?: boolean; }} config - Configuration options.
 */
module.exports = copy;
