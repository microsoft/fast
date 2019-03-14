/**
 * Utility for copying and mocking the copying of readme files from packages to .docs/en/packages/[package-name]/readme.md.
 * Usage (copy):run node build/documentation/copy-package-readme.js OR
 *              npm run docs:build
 * Usage (dry-run):run node build/documentation/copy-package-readme.js --dry-run OR
 *                 npm run docs:dry-run
 */
const path = require("path");
const fs = require("fs");
const glob = require("glob");
const chalk = require('chalk');

const rootDir = path.resolve(process.cwd());
const srcReadmePaths = "packages/*/?(readme.md|README.md)";
const destDir = path.join("docs", "en", "packages");
const srcSidebar = path.join("website", "sidebars.json");

var dryRun = false;
var sidebarEntries = [];

var totalDocs;
var updatedDocs = 0;

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
        console.log(chalk.red('Invalid argument used. To perform a dry-run use --dry-run'));
        process.exit(1);
    }

});

/**
 * Function to copy readme files to the ./docs/en/packages folder
 * and update Docusaurus sidebar, ./website/sidebars.json
 */
function copyReadmeFiles() {

    const resolvedSrcReadmePaths = path.resolve(rootDir, srcReadmePaths);

    dryRun ? console.log(`In ${destDir}, this script would...`) : console.log(`In ${destDir}...`);

    fs.readdir('packages', (err, files) => {
        totalDocs = files.length;
    });

    createDirectory(destDir);
    glob(resolvedSrcReadmePaths, {realpath:true}, function(error, srcFiles) {
        
        srcFiles.forEach((srcReadmePath) => {    
            createDestReadme(srcReadmePath);
            const srcDirPath = path.dirname(srcReadmePath);
            const lastSrcDir = srcDirPath.split(path.sep).pop();
            sidebarEntries.push(`en/packages/${lastSrcDir}/index`);
        });

        console.log(chalk.green(`${updatedDocs} of ${totalDocs} package readme.md files updated`));
        updateSidebar();
       
    });

}

/**
 * Builds a new readme in ./docs/en/packages
 * Creates and adds a docusaurus header to the new file
 * Then appends the original readme from .docs/en/packages/[package-name]
 */
function createDestReadme(srcReadmePath) {
 
    const destReadmePath = srcReadmePath.replace(/(\bpackages\b)(?!.*\1)/, destDir);
    const destDirPath = path.dirname(destReadmePath);
    const srcDirPath = path.dirname(srcReadmePath);
    const srcReadmeText = fs.readFileSync(srcReadmePath).toString();

    var folderName = srcDirPath
        .split(path.sep)
        .pop();

    var lines = fs.readFileSync(srcReadmePath, 'utf-8')
        .split('\n')
        .filter(Boolean);

    var title = lines[0]
        .replace(/#/g, '')
        .replace(/FAST/g, '')
        .trim();
            
    var docusaurusHeader = 
        `---\n` + 
        `id: index\n` + 
        `title: FAST ${title}\n` + 
        `sidebar_label: ${title}\n` +
        `---\n\n`;

    createDirectory(destDirPath);

    if (dryRun) {
        if (fs.existsSync(destReadmePath)) {
            console.log(`...REPLACE readme.md in the '${folderName}' folder`);
        } else {
            console.log(`...ADD readme.md to the '${folderName}' folder`);
        }
    } else {
        try {
            fs.writeFileSync(destReadmePath, docusaurusHeader);
            fs.appendFileSync(destReadmePath, srcReadmeText);
            updatedDocs++;
            console.log(`...${folderName} was succesfully updated`);
        } catch (err) {
            console.log(chalk.red(err));
        }
    }

}

/**
 * Updates ./website/sidebars.json
 */
function updateSidebar() {

    var sidebarJSONPath = path.resolve(rootDir, srcSidebar);
    const sidebarText = fs.readFileSync(sidebarJSONPath).toString();
    var sidebarJSON = JSON.parse(sidebarText);
    sidebarJSON.docs.Packages = [];

    sidebarEntries
        .map((entry) => sidebarJSON.docs.Packages.push(entry))

    if (dryRun) {
        console.log("In website/sidebars.json, this script updates...\n" +
            "...the Packages array with the filepath to each package's index file.");
    } else {
        fs.writeFile(sidebarJSONPath, JSON.stringify(sidebarJSON, null, 2), 'utf8', (err) => {
            if (err) throw err;
            console.log(chalk.green(`${srcSidebar} was succesfully updated!`));
        }); 
    }

}

/**
 * Utility function that creates new folders
 * based off dir argument
 */
function createDirectory(dir) {
    if (!fs.existsSync(dir)) {
        dryRun ? console.log(`...CREATE the '${dir}' folder.`) : fs.mkdirSync(dir);
    }
}

/**
 * Run script
 * Based off presence of --dry-run parameter
 */
copyReadmeFiles();