/**
 * Utility for copying schemas to their dist folders.
 * Usage: node build/copy-schemas.js
 */
const path = require("path");
const fs = require("fs");
const glob = require("glob");

const rootDir = path.resolve(process.cwd());
const srcSchemaPaths = "src/**/*.schema.json";
const destDir = "dist";

/**
 * Function to copy schema files to their dist folder
 */
function copySchemaFiles() {
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
copySchemaFiles();
