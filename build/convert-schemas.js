/**
 * Utility for copying schemas to their dist folders.
 * Usage: node build/convert-schemas.js
 */
const path = require("path");
const fs = require("fs");
const glob = require("glob");

const rootDir = path.resolve(process.cwd());
const srcSchemaPaths = "src/**/*.schema.ts";
const destDir = "dist";

let exit = 0;

/**
 * Function to convert and copy schema files to their dist folder
 */
function copySchemaFiles() {
    const resolvedSrcSchemaPaths = path.resolve(rootDir, srcSchemaPaths);

    glob.sync(resolvedSrcSchemaPaths, void 0).forEach(function(filePath) {
        let destSchemaPath = filePath.replace(/(\bsrc\b)(?!.*\1)/, destDir);
        destSchemaPath =
            destSchemaPath.substr(0, destSchemaPath.lastIndexOf(".ts")) + ".json";
        fs.copyFileSync(filePath, destSchemaPath);
        const fileContents = fs.readFileSync(destSchemaPath).toString();
        const commonJS = "module.exports = ".concat(
            fileContents.substring(fileContents.indexOf("{"))
        );
        const tempPath = path.resolve(
            path.dirname(filePath),
            `.tmp/${path.basename(filePath)}.js`
        );

        try {
            if (!fs.existsSync(path.dirname(tempPath))) {
                fs.mkdirSync(path.dirname(tempPath));
            }
            fs.writeFileSync(tempPath, commonJS);
            const schemaData = require(tempPath);
            const json = JSON.stringify(schemaData, null, 2);
            fs.writeFileSync(destSchemaPath, json);
        } catch (e) {
            console.error(e);
            exit = 1;
        } finally {
            if (fs.existsSync(tempPath)) {
                fs.unlinkSync(tempPath);
            }
        }
    });

    process.exit(exit);
}

/**
 * Convert and Copy all files
 */
copySchemaFiles();
