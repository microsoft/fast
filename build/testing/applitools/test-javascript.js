/**
 * @name
 * Test Visual User Interfaces
 * 
 * @description
 * Used to generate baselines and test the difference of those baselines against future changes.
 * 
 * @example
 * To execute on CLI, run 'node build/testing/applitools/startup-image.js' from root directory.
 * 
 * @requires
 * You must create environment variables if executing this script locally using CLI. 
 * 
 * This can be done one of two recommended ways.
 * 1. Update your '~/.bashrc' file.
 *    export APPLITOOLS_API_KEY=[some value]
 * 
 * 2. Create a '.env' file at the root of your project
 *    APPLITOOLS_API_KEY=[some value]
 * 
 * - Cirlce CI has these values included as environment variables. 
 * - The api key can be found in the portal on Applitools.
 * 
 */

"use strict";

const { Builder, Capabilities } = require("selenium-webdriver");
const chalk = require('chalk');
const Eyes = require("eyes.selenium").Eyes;
const { spawn } = require('child_process');
const { Run } = require("../run-msft-docs.js");

/**
 * Setup and SDK and batch
 * @param {*} eyes 
 * @param {*} branch
 */
function setup(eyes, branch) {

    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    eyes.setBatch(branch, process.env.APPLITOOLS_BATCH_ID, 0);
    eyes.setIgnoreCaret(true);

}

/**
 * Get Branch Name using child_process and Git which runs Asynchronously
 */
new Promise(function(resolve, reject) {

    const git = spawn('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

    git.stdout.on('data', (data) => {
        resolve(`${data}`);
    });

}).then(function(branchName) {

    // Remove all white space
    branchName = branchName.trim();

    // Run Testing
    main(branchName);
});


/**
 * Startup function used to connect to Applitools and execute tests
 */
function main(branch) {

    // Initialize SDK using API Key from environment variables
    const domain = "https://eyesapi.applitools.com";
    const eyes = new Eyes(domain);

    // Setup Applitools
    setup(eyes, branch);

    // Set viewports
    const viewportLandscape = {width: 1920, height: 1200};
    const viewportPortrait  = {width: 600, height: 800};
    
    /* Setup WebDriver for Chrome Browser */
    const chromeDriver = new Builder()
        .withCapabilities(Capabilities.chrome())
        .build();

    chromeDriver.getSession().then(function(session) {
        runTest(eyes, chromeDriver, viewportLandscape);
        runTest(eyes, chromeDriver, viewportPortrait);
    
        if(chromeDriver) {
            chromeDriver.quit(); 
        }
    });
    
    /* Setup WebDriver for FireFox Browser */
    const firefoxDriver = new Builder()
        .withCapabilities(Capabilities.firefox())
        .build();
    
    firefoxDriver.getSession().then(function(session){
        runTest(eyes, firefoxDriver, viewportLandscape);
        runTest(eyes, firefoxDriver, viewportPortrait);
        
        // Close the browser
        if(firefoxDriver) {
            firefoxDriver.quit(); 
        }
    })

}

/**
 * Execute tests against different drivers (browsers) and viewports
 * @param {*} eyes 
 * @param {*} innerDriver 
 * @param {*} viewportSize 
 */
function runTest(eyes, innerDriver, viewportSize) {
    
    eyes.open(innerDriver, 'xxx', 'zzz', viewportSize)
        .then(function (driver){ 
            
            try{

                new Run(eyes, driver);

                eyes.close(false).then(function (result){ 
                    handleResult(result);
                });
        
            } finally {
                eyes.abortIfNotClosed();
            }

        });
    
}

/**
 * Handle the result by logging status to output
 * @param {*} result 
 */
function handleResult(result) {

    const url = result.appUrls.session;
    const totalSteps = result.steps;

    if (result.isNew) {
    
        console.log(chalk.yellow("\nNew Baseline Created: %d steps \nView Results at %s"), totalSteps, url);
    
    } else if (result.isPassed) {
    
        console.log(chalk.green("\nAll Steps Passed: %d steps \nView Results at %s"), totalSteps, url);
    
    } else {
    
        console.log(chalk.red("\nTest Failed:\n\t Matches=%d \n\t Missing=%s \n\t MisMatches=%s \nView Results at %s\n"),
            result.matches, 
            result.missing, 
            result.mismatches, 
            url
        );
    
    } 
}
