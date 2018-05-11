/**
 * Utility for copy files to directories.
 * Usage: node build/copy-schemas.js
 */
const path = require("path");
const fs = require("fs");
const glob = require("glob");

/**
 * All files passed to the copy script
 * Note: the first match will be referred to in the src argument and the rest of the matches
 * will be in the _ array. All of the paths are combined to create the complete source path array.
 */
const rootDir = path.resolve(process.cwd());
const srcSchemaPaths = "src/**/*.schema.json";
const destDir = "dist";

/**
 * Function to copy a src file a given path
 */
function copyPath() {
    const resolvedSrcSchemaPaths = path.resolve(rootDir, srcSchemaPaths);

    glob(resolvedSrcSchemaPaths, void(0), function(error, files) {
        files.forEach((filePath) => {
        const destSchemaPath = filePath.replace(/(\bsrc\b)(?!.*\1)/, destDir);
            fs.copyFileSync(filePath, destSchemaPath);
        });
    });
}

/**
 * Copy all files
 */
copyPath();
