// How to documentation for Node/JavaScript 
// https://www.seleniumhq.org/docs/03_webdriver.jsp#chapter03-reference
// JavaScript API: https://seleniumhq.github.io/selenium/docs/api/javascript/index.html
// https://help.crossbrowsertesting.com/selenium-testing/getting-started/javascript/
const { Builder, By, Key, until } = require("selenium-webdriver");

// Values must be stored locally as key/name value pairs
// 1. export for temporary local usage
// 2. update .bashrc for permananet local usage
// 3. circle ci already has values stored as environment variables
const username = process.env.SAUCELABS_USER;
const accessKey = process.env.SAUCELABS_KEY;
const domain = "https://msft-docs.azurewebsites.net";

// Configure Remote access
const remoteHub = "http://" + username + ":" + accessKey + "@ondemand.saucelabs.com:80/wd/hub";

// Configure browser options
let browsers = [
        {
            'platform': 'Windows 8.1',
            'browserName': 'internet explorer',
            'version': '11.0',
            'screenResolution': '1024x768'
        },
        {
            'platform': 'Windows 10',
            'browserName': 'MicrosoftEdge',
            'version': '17.17134',
            'screenResolution': '1280x1024'
        },
        {
            'platform': 'Windows 10',
            'browserName': 'internet explorer',
            'version':'11.103',
            'screenResolution':'1400x1050'
        },
        {
            'platform': 'Windows 10',
            'browserName': 'chrome',
            'version':'67.0',
            'screenResolution':'1920x1080'
        },
        {
            'platform': 'Windows 10',
            'browserName': 'chrome',
            'version':'68.0',
            'screenResolution':'1920x1200'
        },
        {
            'platform': 'Windows 10',
            'browserName': 'firefox',
            'version':'61.0',
            'screenResolution':'2560x1600'
        },
        {
            'platform': 'macOS 10.13',
            'browserName': 'safari',
            'version':'11.1',
            'screenResolution':'1920x1440'
        },
        {
            'platform': 'macOS 10.12',
            'browserName': 'safari',
            'version':'11.0',
            'screenResolution':'2048x1536'
        },
        {
            'platform': 'macOS 10.12',
            'browserName': 'safari',
            'version':'10.1',
            'screenResolution':'2360x1770'
        },
        {
            'platform': 'macOS 10.11',
            'browserName': 'chrome',
            'version':'69.0',
            'screenResolution':'2360x1770'
        },
        {
            'platform': 'macOS 10.13',
            'browserName': 'firefox',
            'version':'62.0',
            'screenResolution':'2360x1770'
        },
        {
            'platformName': 'ios',
            'platformVersion': '11.3',
            'deviceOrientation': 'portrait',
            'deviceName': 'iPhone 7 Simulator',
            'appiumVersion': '1.8.1',
            'browserName': 'Safari'
        },
        {
            'platformName': 'ios',
            'platformVersion': '11.2',
            'deviceOrientation': 'portrait',
            'deviceName': 'iPhone 8 Plus Simulator',
            'appiumVersion': '1.8.1',
            'browserName': 'Safari'
        },
        {
            'platformName': 'ios',
            'platformVersion': '11.1',
            'deviceOrientation': 'portrait',
            'deviceName': 'iPhone X Simulator',
            'appiumVersion': '1.8.1',
            'browserName': 'Safari'
        },
        {
            'platformName': 'ios',
            'platformVersion': '11.0',
            'deviceOrientation': 'portrait',
            'deviceName': 'iPhone 7 Simulator',
            'appiumVersion': '1.8.1',
            'browserName': 'Safari'
            }/*,
        {
            'platformName': 'Android',
            'platformVersion': '7.1',
            'deviceOrientation': 'portrait',
            'deviceName': 'Samsung Galaxy S7 Edge FHD GoogleAPI Emulator',
            'appiumVersion': '1.8.1',
            'browserName': 'Chrome'
        },
        {
            'platformName': 'Android',
            'platformVersion': '7.0',
            'deviceOrientation': 'portrait',
            'deviceName': 'Samsung Galaxy Tab A 10 GoogleAPI Emulator',
            'appiumVersion': '1.8.1',
            'browserName': 'Chrome'
        },
        {
            'platformName': 'Android',
            'platformVersion': '6.0',
            'deviceOrientation': 'portrait',
            'deviceName': 'Android Emulator',
            'appiumVersion': '1.8.1',
            'browserName': 'Chrome'
        },
        {
            'platformName': 'Android',
            'platformVersion': '5.1',
            'deviceOrientation': 'portrait',
            'deviceName': 'Android GoogleAPI Emulator',
            'appiumVersion': '1.8.1',
            'browserName': 'Browser'
        },
        {
            'platformName': 'Android',
            'platformVersion': '5.0',
            'deviceOrientation': 'portrait',
            'deviceName': 'Android Emulator',
            'appiumVersion': '1.8.1',
            'browserName': 'Browser'
        },
        {
            'platformName': 'Android',
            'platformVersion': '4.4',
            'deviceOrientation': 'portrait',
            'deviceName': 'LG Nexus 4 Emulator',
            'appiumVersion': '1.8.1',
            'browserName': 'Browser'
            }*/
];

var flows = browsers.map(function(browser) {

        // Setup capabilities
        let caps = {
                name : "FAST-DNA MSFT Documentation",
                build : "test-build-0011",
                tags : "msft-docs",
                platform : browser.platform,
                browserName : browser.browserName,
                version : browser.version,
                screen_resolution : browser.screenResolution,
                username : username,
                password : accessKey,
                extendedDebugging : true
        };

        // Setup WebDriver
        let driver = new Builder()
                .withCapabilities(caps)
                .usingServer(remoteHub)
                .build();

        driver.getSession().then(async function(session){
               
                let sessionId = session.id_;

                try {
                        await driver.get(domain);

                        // Note: There are many ways to nagivate/find elements on a page
                        // unfortunately, not all are cross-browser compliant and so
                        // for example, we can't use xpath. As a result, we're using
                        // navigation though not necessarily most performant but effective.

                        // After browsers matrix is determined we can fine tune and
                        // optimize to use other selectors to see what works. If we're
                        // t8esting mostly on modern browsers this isn't as much a limitation.

                        // Recommendation, add in data-test attributes to each component,
                        // page, layout, or container we want to capture and select on that.

                        // Iterate each components documentation
                        await driver.navigate().to(domain + "/components/button/");
                        await driver.navigate().to(domain + "/components/caption/");
                        await driver.navigate().to(domain + "/components/checkbox/");
                        await driver.navigate().to(domain + "/components/dialog/");
                        await driver.navigate().to(domain + "/components/divider/");
                        await driver.navigate().to(domain + "/components/flipper/");
                        await driver.navigate().to(domain + "/components/heading/");
                        await driver.navigate().to(domain + "/components/hypertext/");
                        await driver.navigate().to(domain + "/components/image/");
                        await driver.navigate().to(domain + "/components/label/");
                        await driver.navigate().to(domain + "/components/metatext/");
                        await driver.navigate().to(domain + "/components/paragraph/");
                        await driver.navigate().to(domain + "/components/subheading/");
                        await driver.navigate().to(domain + "/components/text-field/");
                        await driver.navigate().to(domain + "/components/toggle/");
                        await driver.navigate().to(domain + "/components/typography/");

                        // Turn on Developer tools and iterate each component
                        // xpath selectors do not work across browsers. This in particular breaks in Internet Explorer
                        // await driver.findElement(By.xpath("//button[text()='dev tools']")).click();
                        // one possible solution would be to inject data attributes for each component we can bind to.
                        // For example, data-test="friendly name"
                        // driver.findElement(By.cssSelector('[data-element="city"]'))

                        // Navigate to example views for each component
                        await driver.navigate().to(domain + "/components/button/examples");
                        await driver.navigate().to(domain + "/components/caption/examples");
                        await driver.navigate().to(domain + "/components/checkbox/examples");
                        await driver.navigate().to(domain + "/components/dialog/examples");
                        await driver.navigate().to(domain + "/components/divider/examples");
                        await driver.navigate().to(domain + "/components/flipper/examples");
                        await driver.navigate().to(domain + "/components/heading/examples");
                        await driver.navigate().to(domain + "/components/hypertext/examples");
                        await driver.navigate().to(domain + "/components/image/examples");
                        await driver.navigate().to(domain + "/components/label/examples");
                        await driver.navigate().to(domain + "/components/metatext/examples");
                        await driver.navigate().to(domain + "/components/paragraph/examples");
                        await driver.navigate().to(domain + "/components/subheading/examples");
                        await driver.navigate().to(domain + "/components/text-field/examples");
                        await driver.navigate().to(domain + "/components/toggle/examples");
                        await driver.navigate().to(domain + "/components/typography/examples");
        
                
                } finally {
                        await driver.quit();
                }
        })
        
});
