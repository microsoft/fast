// How to documentation for Node/JavaScript 
// https://www.seleniumhq.org/docs/03_webdriver.jsp#chapter03-reference
// JavaScript API: https://seleniumhq.github.io/selenium/docs/api/javascript/index.html
// https://help.crossbrowsertesting.com/selenium-testing/getting-started/javascript/
var _a = require("selenium-webdriver"), Builder = _a.Builder, By = _a.By, Key = _a.Key, until = _a.until;
// Values must be stored locally as key/name value pairs
// 1. export for temporary local usage
// 2. update .bashrc for permananet local usage
// 3. circle ci already has values stored as environment variables
var username = process.env.SAUCELABS_USER;
var accessKey = process.env.SAUCELABS_KEY;
var domain = "https://msft-docs.azurewebsites.net";
// Configure Remote access
var remoteHub = "http://" + username + ":" + accessKey + "@ondemand.saucelabs.com:80/wd/hub";
// Configure browser options
var browsers = [
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
        'version': '11.103',
        'screenResolution': '1400x1050'
    },
    {
        'platform': 'Windows 10',
        'browserName': 'chrome',
        'version': '67.0',
        'screenResolution': '1920x1080'
    },
    {
        'platform': 'Windows 10',
        'browserName': 'chrome',
        'version': '68.0',
        'screenResolution': '1920x1200'
    },
    {
        'platform': 'Windows 10',
        'browserName': 'firefox',
        'version': '61.0',
        'screenResolution': '2560x1600'
    },
    {
        'platform': 'macOS 10.13',
        'browserName': 'safari',
        'version': '11.1',
        'screenResolution': '1920x1440'
    },
    {
        'platform': 'macOS 10.13',
        'browserName': 'firefox',
        'version': '62.0',
        'screenResolution': '2360x1770'
    },
    {
        'platform': 'macOS 10.12',
        'browserName': 'safari',
        'version': '11.0',
        'screenResolution': '2048x1536'
    },
    {
        'platform': 'macOS 10.12',
        'browserName': 'safari',
        'version': '10.1',
        'screenResolution': '2360x1770'
    },
    {
        'platform': 'OS X 10.11',
        'browserName': 'chrome',
        'version': '69.0',
        'screenResolution': '2048x1536'
    },
    {
        'platformName': 'iOS',
        'platformVersion': '11.3',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'iPhone X Simulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Safari'
    },
    {
        'platformName': 'iOS',
        'platformVersion': '11.2',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'iPhone 8 Plus Simulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Safari'
    },
    {
        'platformName': 'iOS',
        'platformVersion': '11.1',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'iPhone 7 Simulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Safari'
    },
    {
        'platformName': 'iOS',
        'platformVersion': '11.0',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'iPhone 6s Simulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Safari'
    },
    {
        'platformName': 'iOS',
        'platformVersion': '10.0',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'iPad Retina Simulator',
        'appiumVersion': '1.8.0',
        'browserName': 'Safari'
    },
    {
        'platformName': 'iOS',
        'platformVersion': '9.3',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'iPad Pro Simulator',
        'appiumVersion': '1.7.1',
        'browserName': 'Safari'
    },
    {
        'platformName': 'Android',
        'platformVersion': '7.1',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'Samsung Galaxy S7 Edge FHD GoogleAPI Emulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Chrome',
        'language': 'en',
        'locale': 'en_US'
    },
    {
        'platformName': 'Android',
        'platformVersion': '7.0',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'Samsung Galaxy Tab A 10 GoogleAPI Emulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Chrome',
        'language': 'en',
        'locale': 'en_US'
    },
    {
        'platformName': 'Android',
        'platformVersion': '6.0',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'Android Emulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Chrome',
        'language': 'en',
        'locale': 'en_US'
    },
    {
        'platformName': 'Android',
        'platformVersion': '5.1',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'Android GoogleAPI Emulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Browser'
    },
    {
        'platformName': 'Android',
        'platformVersion': '5.0',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'Android Emulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Browser'
    },
    {
        'platformName': 'Android',
        'platformVersion': '4.4',
        'deviceOrientation': 'PORTRAIT',
        'deviceName': 'LG Nexus 4 Emulator',
        'appiumVersion': '1.8.1',
        'browserName': 'Browser'
    }
];
var flows = browsers.map(function (browser) {
    // Setup capabilities
    var caps = {
        name: "FAST-DNA MSFT Documentation",
        build: "test-build-0020",
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
    var driver = new Builder()
        .withCapabilities(caps)
        .usingServer(remoteHub)
        .build();
    driver.getSession().then(function (session) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sessionId = session.id_;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, , 35, 37]);
                        return [4 /*yield*/, driver.get(domain)];
                    case 2:
                        _a.sent();
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
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/button/")];
                    case 3:
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
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/caption/")];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/checkbox/")];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/dialog/")];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/divider/")];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/flipper/")];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/heading/")];
                    case 9:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/hypertext/")];
                    case 10:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/image/")];
                    case 11:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/label/")];
                    case 12:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/metatext/")];
                    case 13:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/paragraph/")];
                    case 14:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/subheading/")];
                    case 15:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/text-field/")];
                    case 16:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/toggle/")];
                    case 17:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/typography/")];
                    case 18:
                        _a.sent();
                        // Turn on Developer tools and iterate each component
                        // xpath selectors do not work across browsers. This in particular breaks in Internet Explorer
                        // await driver.findElement(By.xpath("//button[text()='dev tools']")).click();
                        // one possible solution would be to inject data attributes for each component we can bind to.
                        // For example, data-test="friendly name"
                        // driver.findElement(By.cssSelector('[data-element="city"]'))
                        // Navigate to example views for each component
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/button/examples")];
                    case 19:
                        // Turn on Developer tools and iterate each component
                        // xpath selectors do not work across browsers. This in particular breaks in Internet Explorer
                        // await driver.findElement(By.xpath("//button[text()='dev tools']")).click();
                        // one possible solution would be to inject data attributes for each component we can bind to.
                        // For example, data-test="friendly name"
                        // driver.findElement(By.cssSelector('[data-element="city"]'))
                        // Navigate to example views for each component
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/caption/examples")];
                    case 20:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/checkbox/examples")];
                    case 21:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/dialog/examples")];
                    case 22:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/divider/examples")];
                    case 23:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/flipper/examples")];
                    case 24:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/heading/examples")];
                    case 25:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/hypertext/examples")];
                    case 26:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/image/examples")];
                    case 27:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/label/examples")];
                    case 28:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/metatext/examples")];
                    case 29:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/paragraph/examples")];
                    case 30:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/subheading/examples")];
                    case 31:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/text-field/examples")];
                    case 32:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/toggle/examples")];
                    case 33:
                        _a.sent();
                        return [4 /*yield*/, driver.navigate().to(domain + "/components/typography/examples")];
                    case 34:
                        _a.sent();
                        return [3 /*break*/, 37];
                    case 35: return [4 /*yield*/, driver.quit()];
                    case 36:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 37: return [2 /*return*/];
                }
            });
        });
    });
});
