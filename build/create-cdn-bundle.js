/**
 * Utility for copying package bundles to their CDN drop folder. PR's submitted with revisions the CDN Drop will
 * trigger a GitHub Action to deploy these assets to the CDN located at https://static.fast.design/assets/* which
 * maps to `sites/site-utilities/statics/assets/*` in this project, further known as $CDN.
 *
 * CDN Drop folder exist for the following:
 * Unminified location: `$CDN/scripts/package-name/version/package-name.js`
 * Minified location  : `$CDN/scripts/package-name/version/package-name.min.js`
 *
 * Usage        : `node build/create-cdn-bundle.js`
 * Usage (debug): `node build/create-cdn-bundle.js --debug`
 */

const chalk = require("chalk");
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const yargs = require("yargs");

const rootDir = path.resolve(process.cwd());
const srcPath = "packages/web-components/*";
const dstPath = "sites/site-utilities/statics/assets/scripts/";

var debug = false;

/**
 * Obtain command line aguments
 * If present when the script is run, their corresponding flags get set to true
 */
const argv = yargs.argv;
var debug = argv.debug;

/**
 * Function to get the latest Git Tag
 */
function getGetLatestGitTag() {
    // Works on Master only
    //git describe --exact-match --abbrev=0
    return "1.0.0";
}

/**
 * Function to copy package distribution bundles to CDN statics folder
 */
function copyPackageBundles() {
    const resolvedSrcPath = path.resolve(rootDir, srcPath);
    const resolvedDstPath = path.resolve(rootDir, dstPath);

    glob(resolvedSrcPath, { realpath: true }, function(error, files) {
        files.forEach(filePath => {
            const packagename = filePath
                .split("/")
                .slice(-1)
                .pop();

            // Concatenation to combine source folder/file/name paths
            const distFolder = "/dist/";
            const srcNamePath = filePath + distFolder + packagename + ".js";
            const srcNamePathMin = filePath + distFolder + packagename + ".min.js";

            if (debug) {
                console.log(chalk.yellow("Source File Path:"), srcNamePath);
                console.log(chalk.yellow("Source File Path Minified:"), srcNamePathMin);
            }

            // Concatenation to combine destination folder/file/name paths
            const version = getGetLatestGitTag();
            const versionFolder = "/" + version + "/";
            const dstNameDirPath = resolvedDstPath + "/" + packagename + versionFolder;
            const dstNamePath = dstNameDirPath + packagename + ".js";
            const dstNamePathMin = dstNameDirPath + packagename + ".min.js";

            if (debug) {
                console.log(chalk.yellow("Destination File Path:"), dstNamePath);
                console.log(
                    chalk.yellow("Destination File Path Minified:"),
                    dstNamePathMin
                );
            }

            // Create new version folder
            try {
                if (!fs.existsSync(dstNameDirPath)) {
                    fs.mkdirSync(dstNameDirPath);
                    console.log(
                        chalk.green(
                            `new package bundle folder, ${version}, has been created for the CDN drop ... `
                        )
                    );
                }
            } catch (err) {
                console.log(chalk.red(err));
                return;
            }

            // Copy unminified file to CDN package bundle
            try {
                fs.copyFileSync(srcNamePath, dstNamePath);
                console.log(
                    chalk.green(
                        `Unminified package, ${packagename}, has been copied to the CDN drop folder ... `
                    )
                );
            } catch (err) {
                console.log(chalk.red(err));
                return;
            }

            // Copy minified file to CDN package bundle folders
            try {
                fs.copyFileSync(srcNamePathMin, dstNamePathMin);
                console.log(
                    chalk.green(
                        `Minified package, ${packagename}, has been copied to the CDN drop folder ... `
                    )
                );
            } catch (err) {
                console.log(chalk.red(err));
                return;
            }
            console.log(
                chalk.green(
                    `Publishing files have been placed in CDN drop folder. Please verify, and submit new PR to deploy to CDN...`
                )
            );
        });
    });
}

/**
 * Copy all files
 */
copyPackageBundles();
