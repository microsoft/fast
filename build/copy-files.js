/**
 * Utility for copying files to directories.
 * Usage:  node ../../build/copy-schemas.js --src=src/**\/*.jpg --dest=dist/images
 */
const path = require("path");
const fs = require("fs-extra");
const glob = require("glob");
const argv = require("yargs").argv;

/**
 * Function to remove a given path
 */
function copyFiles(srcPath, destPath) {
    const resolvedSrcPath = path.resolve(process.cwd(), srcPath);
    const resolvedDestPath = path.resolve(process.cwd(), destPath);

    glob(resolvedSrcPath, function(err, files) {
        if (err) {
            throw(err);
        }

        files.forEach((file) => {
            let filePathItems = file.split(/\//);
            fs.copy(file, `${resolvedDestPath}/${filePathItems[filePathItems.length - 1]}`)
              .catch((err) => { throw(err); })
        });
    });
}

/**
 * copy files
 */
if (argv.src && argv.dest) {
    copyFiles(argv.src, argv.dest);
} else {
    console.log(`Include a src and dest option eg --src=fileGlobbing pattern --dest=folderName2`);
}
