/**
 * Utility for generating Typedoc API documentation and placing it in the docs/en/packages folder so it can be hosted by
 * Github pages and viewed through Docusaurus
 * 
 * Usage :run node build/documentation/generate-typedocs.js OR
 * Usage (dry-run): run node build/documentation/generate-typedocs.js --dry-run
 */

const path = require("path");
const fs = require("fs");
const glob = require("glob");
const os = require('os');
const chalk = require('chalk');

const { exec } = require('child_process');
const { spawn } = require("child_process");


const rootDir = path.resolve(process.cwd());
const srcDir = "packages/*";
const destDir = path.join("docs", "en", "packages");

var copyReadmeScript = 'copy-package-readme.js';
var copyReadmeScriptPath = path.join('build', 'documentation', copyReadmeScript);
var dryRun = false;

const excludedPackages = [
    "fast-browser-extensions",
    "fast-development-site-react",
    "fast-permutator",
    "fast-tslint-rules"
];

/**
 * Determine if a dry run will be executed based off --dry-run argument being present
 * if an invalid third parameter is entered, the application will exit
 */
process.argv.forEach(function (val, index) {

    var validArg = true;

    if (index === 2) {
        val === "--dry-run" ? dryRun = true : validArg = false;
    }

    if (!validArg) {
        console.log(chalk.red(`Invalid argument used. To perform a dry-run use --dry-run`));
        process.exit(1);
    }

});

/**
 * Run the copy readme script, then this one if successful
 * To prevent new links constantly being appended to the readme every 
 * time the script is run, the copy readme script is run to regenerate 
 * files to their original form with the needed header
 */

var proc = dryRun ? exec(`node ${copyReadmeScriptPath} --dry-run`) : exec(`node ${copyReadmeScriptPath}`);

proc.stdout.on('data', function(data) {
    process.stdout.write(data);
});

proc.on('error', (err) => {
    console.log(chalk.red(err));
});

proc.on('close', function(code) {
    console.log(chalk.green(`${copyReadmeScript} ran successfully.`));
    execute();
});

/**
 * Generate TypeDocs for each package
 */
function execute() {

    if (dryRun) {
        console.log(`In ${destDir}, this script would...`);
    } else {
        console.log(`Generating API documentation using TypeDoc...`);
    }

    const packages = path.resolve(rootDir, srcDir);

    glob(packages, {realpath:true}, function(error, srcFiles) {
       
        srcFiles.forEach((srcPath) => {    
            
            var valid = true;

            var packageName = srcPath
                .split(path.sep)
                .pop();

            excludedPackages.forEach((excludedPackageName) => {
                if (packageName === excludedPackageName) {
                    console.log(chalk.yellow(`...skip generating Typedoc API files for ${packageName}`));
                    valid = false;
                }
            });

            if(valid) {
                dryRun ? console.log(`...generate Typedoc API files for ${packageName}`) : createAPIFiles(packageName, srcPath);
                dryRun ? console.log(`...add API link to ${packageName}`) : addAPILinkToReadme(packageName);
            }

        });

    });
}

/**
 * Uses Typedoc process to generate API docs for a given package
 * Stores them in the docs/en/packages folder 
 */
function createAPIFiles(packageName, srcPath) {
    
    var config = path.join(srcPath, '/tsconfig.json');
    var output = path.join(destDir, packageName, 'api');
    var file = (packageName === "fast-animation") ? path.join(srcPath, '/lib/index.ts') : path.join(srcPath, '/src/index.ts');

    var typedocCmd = os.platform() == 'win32' ? 'typedoc.cmd' : 'typedoc';
    var typedocPath = path.join('node_modules', '.bin', typedocCmd);

    const typedoc = spawn(typedocPath, // the local typedoc installation is needed for the markdown theme to work
        [
            '--tsconfig', config,
            '--excludeNotExported',
            '--out', output, file,
            '--theme', "markdown"
        ]);

    typedoc.on('close', code => {
        if (code) {
            console.log(chalk.red(`${packageName} - typedoc API docs not generated, error code: ${code}`));
        } else {
            console.log(`${packageName} - typedoc API docs generated`)
            addHeaderToReadme(packageName);
        }
    });

    // sometimes important errors will get sent to stdout for this process
    // leaving this here because it's useful for debugging, but generates a lot
    // of output, makes the terminal output harder to read so it's commented out

    // typedoc.stdout.on('data', (data) => {
    //     console.error(`${data}`);
    // });

    typedoc.on('error', (err) => {
        console.log(chalk.red(err));
    });

}

/**
 * If the typedoc readme doesn't have this header
 * It won't be accessible in docusaurus
 */
function addHeaderToReadme(packageName) {

    const readmePath = path.join(destDir, packageName, 'api', 'README.md');
    const readmeText = fs.readFileSync(readmePath).toString();

    var docusaurusHeader = 
    `---\n` + 
    `id: index\n` +
    `---\n\n`;

    try {
        fs.writeFileSync(readmePath, docusaurusHeader);
        fs.appendFileSync(readmePath, readmeText);
    } catch (err) {
        console.log(chalk.red(err));
    }

}

/**
 * Creates link in package readme.md docs used by Docusaurus
 * Said link routes to the Typedoc API docs generated by this script
 */
function addAPILinkToReadme(packageName) {

    var readmePath = path.join(destDir, packageName, 'README.md');
    var apiLink = "api";

    var usageText = 
        "\n" + 
        `[API Reference](${apiLink})`;

    fs.appendFile(readmePath, usageText, function (err) {
        if (err) {
            console.log(chalk.red(err));
        } 
    })

}

