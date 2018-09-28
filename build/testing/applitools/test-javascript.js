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

const { Builder, By, Capabilities } = require("selenium-webdriver");
const Eyes = require("eyes.selenium").Eyes;
const { spawn } = require('child_process');
const chalk = require('chalk');

/**
 * Setup and SDK and batch
 * @param {*} eyes 
 * @param {*} branch
 */
function setup(eyes, branch) {

    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
    eyes.setBatch(branch);

    //eliminate artifacts caused by a blinking cursor - on by default in latest SDK
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

    // Setup WebDriver for Chrome Browser
    const innerDriver = new Builder()
        .withCapabilities(Capabilities.chrome())
        .build();

    // Set viewports
    const viewportLandscape = {width: 1024, height: 768};
    const viewportPortrait  = {width: 600, height: 800};

    // Test execution
    runTest(eyes, innerDriver, viewportLandscape);
    runTest(eyes, innerDriver, viewportPortrait);
    
    // Close the browser
    if(innerDriver) {
        innerDriver.quit(); 
    }
}

/**
 * Execute tests against different drivers (browsers) and viewports
 * @param {*} eyes 
 * @param {*} innerDriver 
 * @param {*} viewportSize 
 */
function runTest(eyes, innerDriver, viewportSize) {
    
    eyes.open(innerDriver, 'Microsoft Docs', 'Documentation Site Test', viewportSize)
        .then(function (driver){ 
            afterOpen(eyes, driver)
        });
    
}

/**
 * Test script to run and capture results
 * @param {*} eyes
 * @param {*} driver
 */
function afterOpen(eyes, driver) {

    try {
        // Navigate the browser to the "hello world!" web-site.
        var website = "https://applitools.com/helloworld";
        driver.get(website);
  
        eyes.checkWindow('Before mouse click');  // Visual checkpoint #1.
  
        // Click the "Click me!" button.
        driver.findElement(By.tagName('button')).click();
  
        eyes.checkWindow('After mouse click'); // Visual checkpoint #2.
  
        // End the test
        eyes.close(false).then(function (result){ 
            handleResult(result);
        });

    } finally {
        // If the test was aborted before eyes.close was called ends the test as aborted.
        eyes.abortIfNotClosed(); //could add .then if necessary
    }
}

/**
 * Handle the result by logging status to output
 * @param {*} result 
 */
function handleResult(result) {
    const url = result.appUrls.session;
    const totalSteps = result.steps;

    if (result.isNew) {
    
        console.log(chalk.yellow("New Baseline Created: %d steps \n View Results at %s"), totalSteps, url);
    
    } else if (result.isPassed) {
    
        console.log(chalk.green("All Steps Passed: %d steps \n View Results at %s"), totalSteps, url);
    
    } else {
    
        console.log(chalk.red("\nTest Failed:\n\t Matches=%d \n\t Missing=%s \n\t MisMatches=%s \nView Results at %s"),
            result.matches, 
            result.missing, 
            result.mismatches, 
            url
        );
    
    } 
}
