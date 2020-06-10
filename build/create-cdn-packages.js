/**
 * Utility for copying NPM packages to their CDN drop folder located at `sites/site-utilities/statics/assets/scripts/packages`
 * in this source repository and maps to `https://static.fast.design/assets/scripts/packages` on the CDN, referenced next with
 * $CDN.
 *
 * CDN Drop folder exist for the following:
 * Unminified location : `$CDN/scripts/package-name/version/package-name.js`
 * Minified location   : `$CDN/scripts/package-name/version/package-name.min.js`
 * Unminified location : `$CDN/scripts/package-name/x.x.x/package-name.js`
 * Minified location   : `$CDN/scripts/package-name/x.x.x/package-name.min.js`
 *
 * Usage         : `$ node build/create-cdn-packages.js`
 * Usage (debug) : `$ node build/create-cdn-packages.js --debug`
 */

const chalk = require("chalk");
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const spawn = require("child_process").spawn;
const yargs = require("yargs");

const rootDir = path.resolve(process.cwd());
const packagePrefix = "@microsoft/";

// Source Pathing
const srcPath = "packages/web-components/*";
const resolvedSrcPath = path.resolve(rootDir, srcPath);

// Destination Pathing
const dstPath = "sites/site-utilities/statics/assets/scripts/packages/";
const resolvedDstPath = path.resolve(rootDir, dstPath);

/**
 * Obtain command line aguments
 * If present when the script is run, their corresponding flags get set to true
 */
const argv = yargs.argv;
debug = argv.debug | false;

/**
 * Create NPM Package Name
 * @param {} filePath
 */
function CreatePackageName(filePath) {
    return new Promise((resolve, reject) => {
        let packageName = filePath.split("/").slice(-1).pop();
        let packageOfficialName = packagePrefix + packageName;

        console.log(chalk.green(`: ${packageName} [${packageOfficialName}]`));

        resolve(packageName);
    });
}

/**
 * Get NPM Package Version
 * @param {} packageName
 */
function GetVersion(packageName) {
    return new Promise((resolve, reject) => {
        let npm = spawn("npm", ["view", packagePrefix + packageName, "version"]);

        npm.stdout.on("data", data => {
            let version = data.toString().split("@").slice(-1).pop();

            if (debug) {
                console.log(chalk.yellow(`NPM Package Version: ${version}`));
            }

            resolve(version);
        });
    });
}

/**
 * Get Source File Path by concatenating to combine source folder/file/name paths
 * @param {} packageName
 */
function GetFilePaths(filePath, packageName, packageVersion) {
    return new Promise((resolve, reject) => {
        // Concatenation to combine source folder/file/name paths
        const distFolder = "/dist/";
        const srcNamePath = filePath + distFolder + packageName + ".js";
        const srcNamePathMin = filePath + distFolder + packageName + ".min.js";

        if (debug) {
            console.log(chalk.yellow("Source FS:"), srcNamePath);
            console.log(chalk.yellow("Source FS Minified:"), srcNamePathMin);
        }

        // Concatenation to combine destination folder/file/name paths
        const versionFolder = "/" + packageVersion + "/";
        const dstNameDirPath = resolvedDstPath + "/" + packageName + versionFolder;
        const dstNamePath = dstNameDirPath + packageName + ".js";
        const dstNamePathMin = dstNameDirPath + packageName + ".min.js";

        if (debug) {
            console.log(chalk.yellow("Destination FS:"), dstNamePath);
            console.log(chalk.yellow("Destination FS Minified:"), dstNamePathMin);
        }

        resolve({
            destinationPath: dstNameDirPath,
            packageVersion: packageVersion,
            srcNamePath: srcNamePath,
            dstNamePath: dstNamePath,
            srcNamePathMin: srcNamePathMin,
            dstNamePathMin: dstNamePathMin,
        });
    });
}

/**
 * Main program to package all requirements and place into CDN Drop folder beneath `sites/site-utilities/statics/assets/scripts/`
 */
function ExecuteBundlingForCDN() {
    console.log(
        chalk.greenBright(
            "Preparing NPM Packages to reside in the CDN drop folder at 'sites/site-utilities/statics/assets/scripts/packages/' on completion\n"
        )
    );

    glob(resolvedSrcPath, { realpath: true }, function (error, files) {
        files.forEach(filePath => {
            return new Promise((resolve, reject) => {
                CreatePackageName(filePath)
                    .then(packageName => {
                        GetVersion(packageName).then(packageVersion => {
                            console.log(
                                chalk.greenBright(
                                    `\nStart processing ${packageName}/${packageVersion}`
                                )
                            );

                            GetFilePaths(filePath, packageName, packageVersion).then(
                                object => {
                                    console.log(
                                        `* creating package drop folder ${packageName}/latest`
                                    );
                                    let destinationLatestPath = object.destinationPath.replace(
                                        object.packageVersion,
                                        "latest"
                                    );
                                    if (debug) {
                                        console.log(
                                            chalk.yellow("Destination latest:"),
                                            destinationLatestPath
                                        );
                                    }
                                    if (!fs.existsSync(destinationLatestPath)) {
                                        fs.mkdirSync(destinationLatestPath);
                                    }

                                    console.log(
                                        `* creating package drop folder ${packageName}/${object.packageVersion}`
                                    );
                                    if (debug) {
                                        console.log(
                                            chalk.yellow("Destination version:"),
                                            object.destinationPath
                                        );
                                    }
                                    if (!fs.existsSync(object.destinationPath)) {
                                        fs.mkdirSync(object.destinationPath);
                                    }

                                    console.log(
                                        `* copying unminified files to CDN package drop folder`
                                    );
                                    if (debug) {
                                        console.log(
                                            chalk.yellow("Source:"),
                                            object.srcNamePath
                                        );
                                        console.log(
                                            chalk.yellow("Destination latest:"),
                                            object.dstNamePath
                                        );
                                    }
                                    fs.copyFileSync(
                                        object.srcNamePath,
                                        object.dstNamePath
                                    );

                                    let srcNewNamePath = object.dstNamePath.replace(
                                        object.packageVersion,
                                        "latest"
                                    );
                                    if (debug) {
                                        console.log(
                                            chalk.yellow("Destination version:"),
                                            srcNewNamePath
                                        );
                                    }
                                    fs.copyFileSync(object.srcNamePath, srcNewNamePath);

                                    console.log(
                                        `* copying minified files to CDN package drop folders`
                                    );
                                    if (debug) {
                                        console.log(
                                            chalk.yellow("Source:"),
                                            object.srcNamePathMin
                                        );
                                        console.log(
                                            chalk.yellow("Destination latest:"),
                                            object.dstNamePathMin
                                        );
                                    }
                                    fs.copyFileSync(
                                        object.srcNamePathMin,
                                        object.dstNamePathMin
                                    );

                                    let srcNewNamePathMin = object.dstNamePathMin.replace(
                                        object.packageVersion,
                                        "latest"
                                    );
                                    if (debug) {
                                        console.log(
                                            chalk.yellow("Destination version:"),
                                            destinationLatestPath
                                        );
                                    }
                                    fs.copyFileSync(
                                        object.srcNamePathMin,
                                        srcNewNamePathMin
                                    );
                                }
                            );
                        });
                    })
                    .catch(error => {
                        console.log(chalk.red(error));
                    });
            });
        });
    });
}

ExecuteBundlingForCDN();
