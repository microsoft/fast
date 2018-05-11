/**
 * Utility for copy files to directories.
 * Usage: node build/copy.js --src %srcPathGlob% --dest %destDirectory%
 */
const path = require("path");
const fs = require("fs");
const argv = require("yargs").argv;

/**
 * All files passed to the copy script
 * Note: the first match will be referred to in the src argument and the rest of the matches
 * will be in the _ array. All of the paths are combined to create the complete source path array.
 */
const srcPaths = argv._.concat(argv.src);

/**
 * Function to copy a src file a given path
 */
function copyPath(srcPath) {
    const firstDirectoryRegex = /[^\/]*/;

    if (argv.dest) {
        fs.copyFileSync(srcPath, srcPath.replace(firstDirectoryRegex, argv.dest));
    }
}

/**
 * Copy all files
 */
if (Array.isArray(srcPaths)) {
    srcPaths.forEach(copyPath);
}
