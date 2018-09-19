/**
 * @name 
 * Test Browsers
 * 
 * @description 
 * Cross browser testing with Selenium Webdriver (browser configurations) and Appium 
 * (device configurations) for testing on Sauce Labs. The configurations are sourced
 * from 'build/testing/config-browsers.js'.
 * 
 * @example 
 * To execute on CLI, run 'node build/testing/sauce-labs/test-browsers.js' from root directory.
 * 
 * @requires
 * You must create environment variables if executing this script locally using CLI. This can be done 
 * by adding to your '~/.bashrc' file.
 * 
 * export SAUCE_LABS_USER=[some value]
 * export SAUCE_LABS_USER=[some value] 
 *
 * CircleCI has these values included as environment variables
 * 
 * @see
 * To understand in detail:
 * Getting Started: https://help.crossbrowsertesting.com/selenium-testing/getting-started/javascript/
 * Scripting docs: https://www.seleniumhq.org/docs/03_webdriver.jsp#chapter03-reference 
 */
const { Builder } = require("selenium-webdriver");
const chalk = require("chalk");
const { Configure, Phases } = require("../config-browsers.js");
const { spawn } = require("child_process");

// Retrive user/key from environment variables
const username = process.env.SAUCE_LABS_USER;
const accessKey = process.env.SAUCE_LABS_KEY;
const domain = "https://msft-docs.fast-dna.net";

// Configure to connect to remote hub
const remoteHub = `http://${username}:${accessKey}@ondemand.saucelabs.com:80/wd/hub`;

/**
 * Get configuration based on the accepted Phase argument
 * @param {Phases} phases
 * @returns {Configuration based on phases}
 */
const getConfiguration = (phases) => {
    switch (phases) {
        case Phases.alpha:
            return new Configure(Phases.alpha);
        case Phases.beta:
            return new Configure(Phases.beta);
        case Phases.release:
            return new Configure(Phases.release);
        default:
            console.log(chalk.red("Invalid Argument : must be 'alpha', 'beta', or 'release'"));
            return process.exit(1);
    }
}

// Assign browser configurations to an array
let browsers = getConfiguration(process.argv[2]);

/**
 * Run tests on Sauce Labs
 * @param {string} branchName 
 */
function test(branchName) {
    console.log("Testing Git branch:", branchName);

    // Execute Selenium/Appium Web Drivers on Sauce Labs for each browser configuration
    var flows = browsers.map(function (browser) {

        // Setup capabilities
        let capabilities = {
            name: "FAST-DNA MSFT Documentation",
            build: branchName,
            tags: "msft-docs",
            appiumVersion: browser.appiumVersion,
            platform: browser.platform,
            platformName: browser.platformName,
            platformVersion: browser.platformVersion,
            deviceName: browser.deviceName,
            orientation: browser.deviceOrientation,
            browserName: browser.browserName,
            version: browser.version,
            screen_resolution: browser.screenResolution,
            language: browser.language,
            locale: browser.locale,
            username: username,
            password: accessKey,
            extendedDebugging: true
        };

        // Setup WebDriver
        let driver = new Builder()
            .withCapabilities(capabilities)
            .usingServer(remoteHub)
            .build();

        // Start session and execute test cases
        driver.getSession().then(async function () {
            try {
                await driver.get(domain);

                /**
                 * Note: There are many ways to nagivate/find elements on a page
                 * unfortunately, not all are cross-browser compliant.
                 * As a result, we're using webdriver's navigate.
                 * 
                 * Add in data-test attributes to each component, page, layout,
                 * or container we want to capture and select on that.
                 * 
                 * TODO: After browsers matrix is determined we can fine tune and
                 * optimize to use other selectors to see what works. If we're
                 * testing on modern browsers this isn't as much a limitation.
                 */

                // Iterate each components documentation
                await driver.navigate().to(`${domain}/components/button/`);
                await driver.navigate().to(`${domain}/components/caption/`);
                await driver.navigate().to(`${domain}/components/checkbox/`);
                await driver.navigate().to(`${domain}/components/dialog/`);
                await driver.navigate().to(`${domain}/components/divider/`);
                await driver.navigate().to(`${domain}/components/flipper/`);
                await driver.navigate().to(`${domain}/components/heading/`);
                await driver.navigate().to(`${domain}/components/hypertext/`);
                await driver.navigate().to(`${domain}/components/image/`);
                await driver.navigate().to(`${domain}/components/label/`);
                await driver.navigate().to(`${domain}/components/metatext/`);
                await driver.navigate().to(`${domain}/components/paragraph/`);
                await driver.navigate().to(`${domain}/components/subheading/`);
                await driver.navigate().to(`${domain}/components/text-field/`);
                await driver.navigate().to(`${domain}/components/toggle/`);
                await driver.navigate().to(`${domain}/components/typography/`);

                /**
                 * Turn on Developer tools and iterate each component
                 * For example:
                 * data-test="friendly name"
                 * driver.findElement(By.cssSelector('[data-element="city"]'))
                 */

                // Navigate to example views for each component
                await driver.navigate().to(`${domain}/components/button/examples`);
                await driver.navigate().to(`${domain}/components/caption/examples`);
                await driver.navigate().to(`${domain}/components/checkbox/examples`);
                await driver.navigate().to(`${domain}/components/dialog/examples`);
                await driver.navigate().to(`${domain}/components/divider/examples`);
                await driver.navigate().to(`${domain}/components/flipper/examples`);
                await driver.navigate().to(`${domain}/components/heading/examples`);
                await driver.navigate().to(`${domain}/components/hypertext/examples`);
                await driver.navigate().to(`${domain}/components/image/examples`);
                await driver.navigate().to(`${domain}/components/label/examples`);
                await driver.navigate().to(`${domain}/components/metatext/examples`);
                await driver.navigate().to(`${domain}/components/paragraph/examples`);
                await driver.navigate().to(`${domain}/components/subheading/examples`);
                await driver.navigate().to(`${domain}/components/text-field/examples`);
                await driver.navigate().to(`${domain}/components/toggle/examples`);
                await driver.navigate().to(`${domain}/components/typography/examples`);

            } finally {
                await driver.quit();
            }
        })
    });
}

/**
 * Run tests from a branch
 */
new Promise(function(resolve, reject) {
    const git = spawn('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

    git.stdout.on('data', (data) => {
        resolve(`${data}`.trim());
    });
    git.stderr.on('data', (data) => {
        reject('Unable to get branch name', data);
    });
}).then(function(branchName) {
    test(branchName);
});
