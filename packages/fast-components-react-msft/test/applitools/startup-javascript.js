function main() {

    var webdriver = require('selenium-webdriver');

    // Open a Chrome browser.
    var driver = new webdriver.Builder()
        .withCapabilities(webdriver.Capabilities.chrome())
        .build();

    // Initialize the eyes SDK and set your private API key.
    var Eyes = require('eyes.selenium').Eyes;
    var eyes = new Eyes();
    eyes.setApiKey(process.env.APPLITOOLS_API_KEY);

    try {

        // Start the test and set the browser's viewport size to 800x600.
        eyes.open(driver, 'Hello World!', 'My first Javascript test!',
            {width: 800, height: 600});

        // Navigate the browser to the "hello world!" web-site.
        driver.get('https://applitools.com/helloworld');

        // Visual checkpoint #1.
        eyes.checkWindow('Main Page');

        // Click the "Click me!" button.
        driver.findElement(webdriver.By.tagName('button')).click();

        // Visual checkpoint #2.
        eyes.checkWindow('Click!');

        // End the test.
        eyes.close();

    } finally {

      // Close the browser.
      driver.quit();

      // If the test was aborted before eyes.close was called ends the test as aborted.
      eyes.abortIfNotClosed();

  }

}

main();