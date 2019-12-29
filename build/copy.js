/**
 * Utility for copying readme to their dist folders.
 * Usage: node build/copy-readme.js
 * @arg src - globbing pattern targeting source files
 * @arg dist - the dist directory
 */
const path = require("path");
const fs = require("fs");
const glob = require("glob");

function getArg(raw, required = false) {
    const index = process.argv.indexOf(raw);

    if (index === -1) {
        if (required) {
            throw new Error(`Required argument "${raw}" was not provided`);
        }
    } else {
        return process.argv[index + 1];
    }
}

const rootDir = path.resolve(process.cwd());
const srcReadmePaths = getArg("--src", true);
const destDir = getArg("--dist", true);
const resolvedSrcReadmePaths = path.resolve(rootDir, srcReadmePaths);

glob(resolvedSrcReadmePaths, void 0, function(error, files) {
    if (error) {
        throw error;
    }

    files.forEach(filePath => {
        const destReadmePath = filePath.replace(/(\bsrc\b)(?!.*\1)/, destDir);
        fs.copyFileSync(filePath, destReadmePath);
    });
});
