/**
 * Utility for copying readme to their dist folders.
 * Usage: node build/copy-readme.js
 */
const path = require("path");
const fs = require("fs");
const glob = require("glob");

const rootDir = path.resolve(process.cwd());
const srcReadmePaths = "src/**/README.md";
const destDir = "dist";

/**
 * Function to copy readme files to their dist folder
 */
function copyReadmeFiles() {
    const resolvedSrcReadmePaths = path.resolve(rootDir, srcReadmePaths);

    glob(resolvedSrcReadmePaths, void(0), function(error, files) {
        files.forEach((filePath) => {
        const destReadmePath = filePath.replace(/(\bsrc\b)(?!.*\1)/, destDir);
            fs.copyFileSync(filePath, destReadmePath);
        });
    });
}

/**
 * Copy all files
 */
copyReadmeFiles();
