/**
 * Utility for cleaning directories.
 * Usage: node build/clean.js %path%
 */
const fs = require("fs");
const path = require("path");
const argv = require("yargs").argv;

/**
 * All paths passed to the clean script
 */
const paths = argv._;

/**
 * Function to remove a given path
 */
function cleanPath(cleanPath) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index){
            var currentPath = `${path}/${file}`;
            
            if (fs.lstatSync(currentPath).isDirectory()) { // recurse
                deleteFolderRecursive(currentPath);
                console.log(currentPath, "cleaned");
            } else { // delete file
                fs.unlinkSync(currentPath);
            }
        });

        fs.rmdirSync(path);
    }
}

/**
 * Clean all paths
 */
if (Array.isArray(paths)) {
    paths.forEach(cleanPath);
}
