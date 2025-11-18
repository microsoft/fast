const fs = require("fs");
const path = require("path");
const glob = require("glob");

function copy(files, destination, config = { flat: true, verbose: true, up: true }) {
    return new Promise((resolve, reject) => {
        try {
            // Expand glob patterns and collect all files to copy
            const filesToCopy = [];
            files.forEach(pattern => {
                const matches = glob.sync(pattern);
                filesToCopy.push(...matches);
            });

            // Create destination directory
            fs.mkdirSync(destination, { recursive: true });

            // Copy each file
            filesToCopy.forEach(file => {
                let destPath;
                if (config.flat) {
                    // flat: true - copy files directly to destination with just their basename
                    destPath = path.join(destination, path.basename(file));
                } else {
                    // flat: false - preserve directory structure
                    destPath = path.join(destination, file);
                }

                // Create destination subdirectories if needed
                const destDir = path.dirname(destPath);
                fs.mkdirSync(destDir, { recursive: true });

                // Copy the file
                fs.copyFileSync(file, destPath);

                if (config.verbose) {
                    console.log(`Copied: ${file} -> ${destPath}`);
                }
            });

            resolve();
        } catch (err) {
            reject(err);
        }
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
