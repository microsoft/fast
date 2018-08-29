require("./fast-selenium.js");
var webdriver = require("selenium-webdriver");

// Input capabilities
var capabilities = {
    'browserName': 'Edge',
    'browser_version': '17.0',
    'os': 'Windows',
    'os_version': '10',
    'resolution': '1280x800',
    'browserstack.user': 'aaronwentzel1',
    'browserstack.key': 'Q9GSSQS1GvEh8xyhsB1b',
    'acceptSslCerts' : 'true'
};

var driver = new webdriver.Builder().
    usingServer('https://hub-cloud.browserstack.com/wd/hub').
    withCapabilities(capabilities).
    build();

driver.get('http://www.google.com').then(function () {
    driver.findElement(webdriver.By.name('q')).sendKeys('BrowserStack\n').then(function () {
        driver.getTitle().then(function (title) {
            console.log(title);
            driver.quit();
        });
    });
});

// driver.get('https://msft-docs.fast-dna.net/components/button/').then(function () {
//     driver.findElement(webdriver.By.name('q')).sendKeys('BrowserStack\n').then(function () {
//         driver.getTitle().then(function (title) {
//             console.log(title);
//             driver.quit();
//         });
//     });
// });