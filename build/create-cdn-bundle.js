/**
 * Utility for copying package bundles to their CDN drop folder. PR's submitted with revisions the CDN Drop will
 * trigger a GitHub Action to deploy these assets to the CDN located at https://static.fast.design/assets/* which
 * maps to `sites/site-utilities/statics/assets/*` in this project, further known as $CDN.
 *
 * CDN Drop folder exist for the following:
 * Unminified location: `$CDN/scripts/package-name/version/package-name.js`
 * Minified location  : `$CDN/scripts/package-name/version/package-name.min.js`
 *
 * Usage        : `$ node build/create-cdn-bundle.js`
 * Usage (debug): `$ node build/create-cdn-bundle.js --debug`
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

// TODO: So... "postpublish": "node build/create-cdn-bundle.js" => for which I simply loop npm packages (4 web components) get npm version, generate folder structure, copy bundles, and execute azure cli to deploy to CDN.

/**
 * Get the latest Git Tag then parse out the version number from the end
 */
// const git = spawn("git", ["describe", "--abbrev=0"]);

// git.stdout.on("data", data => {
//     version = data.toString().split("@").slice(-1).pop();

//     if (debug) {
//         console.log(chalk.green(`Version: ${version}`));
//     }
//     return;
// });

// git.on("error", err => {
//     console.log(chalk.red(`Error retrieving git tag version, ${err})`));
// });

// git.on("close", function (code) {
//     console.log(chalk.green(`Git Tag version ${version}`));
//     copyPackageBundles(version);
// });

// /**
//  * API call to get package version from NPMJS
//  * @param {*} version
//  */
// function getNpmPackageVersion(npmPackageName){
//     return new Promise((resolve, reject) => {

//         const npm = spawn("git", ["describe", "--abbrev=0"]);

//         npm.stdout.on("data", data => {
//             version = data.toString().split("@").slice(-1).pop();

//             if (debug) {
//                 console.log(chalk.green(`Version: ${version}`));
//             }
//         });

//         npm.on("close", function (code) {
//             console.log(chalk.green(`Git Tag version ${version}`));
//         });

//         resolve(version);
//     })
// }

function copyPackageBundles(data, callback) {
    return new Promise((resolve, reject) => {
        resolve("Package Bundled Created");
    });
}

/**
 * Create NPM Package Name
 * @param {} filePath
 */
function CreatePackageName(filePath) {
    return new Promise((resolve, reject) => {
        let packageName = filePath.split("/").slice(-1).pop();
        let packageOfficialName = packagePrefix + packageName;

        if (debug) {
            console.log(
                chalk.yellow(`NPM Package Name: ${packageName} [${packageOfficialName}]`)
            );
        }
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

function ExecuteBundlingForCDN() {
    console.log(chalk.green("Preparing package bundles ..."));

    glob(resolvedSrcPath, { realpath: true }, function (error, files) {
        files.forEach(filePath => {
            return new Promise((resolve, reject) => {
                CreatePackageName(filePath)
                    .then(packageName => {
                        GetVersion(packageName).then(packageVersion => {
                            GetFilePaths(filePath, packageName, packageVersion).then(
                                object => {
                                    console.log(
                                        chalk.green(
                                            `Creating new package bundle folder ${object.packageVersion} ... `
                                        )
                                    );
                                    if (!fs.existsSync(object.destinationPath)) {
                                        fs.mkdirSync(object.destinationPath);
                                    }

                                    console.log(
                                        chalk.green(
                                            `Copying unminified files to CDN package bundle drop folder ... `
                                        )
                                    );
                                    if (debug) {
                                        console.log(
                                            chalk.yellow("Source:"),
                                            object.srcNamePath
                                        );
                                        console.log(
                                            chalk.yellow("Destination:"),
                                            object.dstNamePath
                                        );
                                    }
                                    fs.copyFileSync(
                                        object.srcNamePath,
                                        object.dstNamePath
                                    );

                                    console.log(
                                        chalk.green(
                                            `Copying minified files to CDN package bundle drop folder ... `
                                        )
                                    );
                                    if (debug) {
                                        console.log(
                                            chalk.yellow("Source:"),
                                            object.srcNamePathMin
                                        );
                                        console.log(
                                            chalk.yellow("Destination:"),
                                            object.dstNamePathMin
                                        );
                                    }
                                    fs.copyFileSync(
                                        object.srcNamePathMin,
                                        object.dstNamePathMin
                                    );

                                    console.log(
                                        chalk.greenBright(
                                            `Publishing files have been placed in CDN drop folder. Please verify, and submit new PR to deploy to CDN ... `
                                        )
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

// .then(()=> {
//     return getVersion();
// }).then(() => {
//     return getSourcePath();
// }).then(() => {
//     return getDestinationPath();
// }).then(() => {
//     return createFolderVersion();
// }).then(() => {
//     return copyUnminifiedBundles();
// }).then(() => {
//     return copyMinifiedBundles();
// }).then(() => {
//     console.log(
//         chalk.green(`Publishing files have been placed in CDN drop folder. Please verify, and submit new PR to deploy to CDN...`)
//     );
// }).catch((error) => {
//     console.log(chalk.red(error))
// });

// ******************

//     let version = new Promise(function(resolve, reject) {

//         try{
//             const npm = spawn("git", ["describe", "--abbrev=0"]);

//             npm.stdout.on("data", data => {
//                 version = data.toString().split("@").slice(-1).pop();

//                 if (debug) {
//                     console.log(chalk.green(`Version: ${version}`));
//                 }
//             });

//             npm.on("close", function (code) {
//                 console.log(chalk.green(`Git Tag version ${version}`));
//             });

//         } catch (error){
//             npm.on("error", err => {
//                 console.log(chalk.red(`Error retrieving git tag version, ${err})`));
//             });
//     }
//       // if(version) {
//         //     console.log(chalk.green(`NPM Package version ${version}`));
//         //     // resolve();
//         //     return version;
//         // } else {
//         //     reject(error);
//         // }
//     }).then(function(result){
//         console.log(chalk.yellow(`result:${result}`))
//         return result;
//     });

//     // reject(error) {
//     //     console.error("EERROR: error");
//     // };
// }

// getNpmPackageVersion("@microsoft/fast-element");

/**
 * Function to copy package distribution bundles to CDN statics folder
 */
// function copyPackageBundles() {

//     glob(resolvedSrcPath, { realpath: true }, function (error, files) {
//         files.forEach(filePath => {
//             const packagename = filePath.split("/").slice(-1).pop();

//             // Create package realname
//             const npmPackageName = '@microsoft/' + packagename
//             if (debug) {
//                 console.log(chalk.yellow("NPM Package Name:", npmPackageName));
//             }

//             // Get latest NPM published version
//             // `npm view @microsoft/fast-element version`
//             // `npm view ${npmPackageName} version`
//             version = getNpmPackageVersion(npmPackageName);
//             console.log(chalk.greenBright(`Final V: ${version}`));
//             return

//             // Concatenation to combine source folder/file/name paths
//             const distFolder = "/dist/";
//             const srcNamePath = filePath + distFolder + packagename + ".js";
//             const srcNamePathMin = filePath + distFolder + packagename + ".min.js";

//             if (debug) {
//                 console.log(chalk.yellow("Source File Path:"), srcNamePath);
//                 console.log(chalk.yellow("Source File Path Minified:"), srcNamePathMin);
//             }

//             // Concatenation to combine destination folder/file/name paths
//             const versionFolder = "/" + version + "/";
//             const dstNameDirPath = resolvedDstPath + "/" + packagename + versionFolder;
//             const dstNamePath = dstNameDirPath + packagename + ".js";
//             const dstNamePathMin = dstNameDirPath + packagename + ".min.js";

//             if (debug) {
//                 console.log(chalk.yellow("Destination File Path:"), dstNamePath);
//                 console.log(
//                     chalk.yellow("Destination File Path Minified:"),
//                     dstNamePathMin
//                 );
//             }

//             // Create new version folder
//             try {
//                 if (!fs.existsSync(dstNameDirPath)) {
//                     fs.mkdirSync(dstNameDirPath);
//                     console.log(
//                         chalk.green(
//                             `new package bundle folder, ${version}, has been created for the CDN drop ... `
//                         )
//                     );
//                 }
//             } catch (err) {
//                 console.log(chalk.red(err));
//                 return;
//             }

//             // Copy unminified file to CDN package bundle
//             try {
//                 fs.copyFileSync(srcNamePath, dstNamePath);
//                 console.log(
//                     chalk.green(
//                         `Unminified package, ${packagename}, has been copied to the CDN drop folder ... `
//                     )
//                 );
//             } catch (err) {
//                 console.log(chalk.red(err));
//                 return;
//             }

//             // Copy minified file to CDN package bundle folders
//             try {
//                 fs.copyFileSync(srcNamePathMin, dstNamePathMin);
//                 console.log(
//                     chalk.green(
//                         `Minified package, ${packagename}, has been copied to the CDN drop folder ... `
//                     )
//                 );
//             } catch (err) {
//                 console.log(chalk.red(err));
//                 return;
//             }
//             console.log(
//                 chalk.green(
//                     `Publishing files have been paced in CDN drop folder. Please verify, and submit new PR to deploy to CDN...`
//                 )
//             );
//         });
//     });
// }
