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
let browsers = [/*{
        'platform': 'Windows 8.1',
        'browserName': 'firefox',
        'version': '43.0',
        'screenResolution': '1280x1024'
},*/{
        'platform': 'Windows 10',
        'browserName': 'MicrosoftEdge',
        'version': '17.17134',
        'screenResolution': '1280x1024'}
];

var flows = browsers.map(function(browser) {

        // Setup capabilities
        let caps = {
                name : "FAST-DNA MSFT Documentation",
                build : "test-build-0005",
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
        
                        // Iterate each components documentation
                        await driver.findElement(By.linkText('Button')).click();
                        await driver.findElement(By.linkText('Caption')).click();
                        await driver.findElement(By.linkText('Checkbox')).click();
                        await driver.findElement(By.linkText('Dialog')).click();
                        await driver.findElement(By.linkText('Divider')).click();
                        await driver.findElement(By.linkText('Flipper')).click();
                        await driver.findElement(By.linkText('Heading')).click();
                        await driver.findElement(By.linkText('Hypertext')).click();
                        await driver.findElement(By.linkText('Image')).click();
                        await driver.findElement(By.linkText('Label')).click();
                        await driver.findElement(By.linkText('Metatext')).click();
                        await driver.findElement(By.linkText('Paragraph')).click();
                        await driver.findElement(By.linkText('Subheading')).click();
                        await driver.findElement(By.linkText('Text field')).click();
                        await driver.findElement(By.linkText('Toggle')).click();
                        await driver.findElement(By.linkText('Typography')).click();
                        
                       
                        // Turn on Developer tools and iterate each component
                        await driver.findElement(By.xpath("//button[text()='Dev Tools']")).click();
        
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
