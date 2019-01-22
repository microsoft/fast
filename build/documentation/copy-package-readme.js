/**
 * Utility for copying readme to .docs/en/packages/[package-name]/readme.md.
 * Usage: node build/documentation/copy-package-readme.js
 */
const path = require("path");
const fs = require("fs");
const glob = require("glob");

const rootDir = path.resolve(process.cwd());
const srcReadmePaths = "packages/*/README.md";
const destDir = "docs\\en\\packages";
var dryRun = false;

/**
 * Determine if a dry run will be executed based off --dry-run argument being present
 * if an invalid third parameter is entered, the application will exit
 */
process.argv.forEach(function (val, index) {

    var validArg = true;

    if (index == 2) {
        val === "--dry-run" ? dryRun = true : validArg = false;
    }

    if (!validArg) {
        console.log('Invalid argument used. To perform a dry-run use --dry-run');
        process.exit(1);
    }
});

/**
 * Function to copy readme files to the docs/en/packages folder
 */
function copyReadmeFiles() {

    const resolvedSrcReadmePaths = path.resolve(rootDir, srcReadmePaths);

    glob(resolvedSrcReadmePaths, {realpath:true}, function(error, files) {

        files.forEach((filePath) => {
            const destReadmePath = filePath.replace(/(\bpackages\b)(?!.*\1)/, destDir);
            const dirPath = destReadmePath.replace(/(\b\\README.md\b)(?!.*\1)/, '');
            if (!fs.existsSync(dirPath)) {
                dryRun ? console.log("----> Would create folder " + dirPath) : fs.mkdirSync(dirPath);
            }
            if (!fs.existsSync(destReadmePath)) {
                dryRun ? console.log("  --> Would create file README.md in " + dirPath) : fs.copyFileSync(filePath, destReadmePath);
            } else {
                dryRun ? console.log("  --> Would replace README.md in " + dirPath) : fs.copyFileSync(filePath, destReadmePath);
            }

        });

    });

}

/**
 * Copy all files
 */
copyReadmeFiles();