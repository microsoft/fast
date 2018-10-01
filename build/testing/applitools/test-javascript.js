/**
 * @name
 * Test Visual User Interfaces
 * 
 * @description
 * Used to generate baselines and test the difference of those baselines against future changes.
 * 
 * @example
 * To execute on CLI, run `node build/testing/applitools/test-javascript.js` from root directory.
 * 
 * @requires
 * You must create environment variables if executing this script locally using CLI. 
 * 
 * This can be done one of two recommended ways.
 * 1. Update your `~/.bashrc` file.
 *    export APPLITOOLS_API_KEY=[some value]
 * 
 * 2. Create a `.env` file at the root of your project
 *    APPLITOOLS_API_KEY=[some value]
 * 
 * - Cirlce CI has these values included as environment variables. 
 * - The api key can be found in the portal on Applitools.
 */

"use strict";

const { Builder, Capabilities } = require("selenium-webdriver");
const chalk = require('chalk');
const Eyes = require("eyes.selenium").Eyes;
const { Config, Run } = require("./run-msft-docs.js");

/**
 * Setup and SDK and batch
 * @param {*} eyes 
 * @param {*} branch
 */
function setup() {

    // Initialize SDK using API Key from environment variables
    const domain = "https://eyesapi.applitools.com";
    const config = new Config();
    let eyes = new Eyes(domain);

    // Set Applitools Dashboard variables
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    eyes.setBatch(config.branchName(), process.env.APPLITOOLS_BATCH_ID, 0);
    eyes.setIgnoreCaret(true);

    return eyes;
}

/**
 * Startup function used to connect to Applitools and execute tests
 */
function main() {

    // Setup Applitools
    let eyes = setup();

    // Set viewports
    const viewportLandscape = {width: 1920, height: 1200};
    const viewportPortrait  = {width: 600, height: 800};
    
    // Execute Chrome driver tests
    browserDriver(eyes, Capabilities.chrome(), viewportLandscape, viewportPortrait);
    
    // Execute FireFox driver tests
    browserDriver(eyes, Capabilities.firefox(), viewportLandscape, viewportPortrait);
    
}

/**
 * Setup FireFox WebDriver and run tests
 * @param {*} eyes
 * @param {*} webDriver
 * @param {*} viewportLandscape 
 * @param {*} viewportPortrait 
 */
function browserDriver(eyes, webDriver, viewportLandscape, viewportPortrait) {
    
    const innerDriver = new Builder()
        .withCapabilities(webDriver)
        .build();

    innerDriver.getSession().then(function(session){
        runTest(eyes, innerDriver, viewportLandscape);
        runTest(eyes, innerDriver, viewportPortrait);

        if(innerDriver) {
            innerDriver.quit(); 
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
    
    // Config for AppName, SiteName must be set before opening eyes
    const config = new Config();

    eyes.open(innerDriver, config.appName, config.siteName, viewportSize)
        .then(function (driver) { 
            
            try{

                new Run(eyes, driver, config.domainName);

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

main();