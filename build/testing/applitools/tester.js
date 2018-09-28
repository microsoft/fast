var webdriver = require('selenium-webdriver');

var Eyes = require('eyes.selenium').Eyes;

function main() {

  // Initialize the eyes SDK and set your private API key.
  
  var serverURL = "https://eyesapi.applitools.com";   
  var eyes = new Eyes(serverURL); 
  var apiKey = process.env.APPLITOOLS_API_KEY;
  eyes.setApiKey(apiKey);

  eyes.setBatch("Hello World Batch");
 
  // Open a Chrome browser.
  var innerDriver = new webdriver.Builder()
      .withCapabilities(webdriver.Capabilities.chrome())
      .build();

  var viewportSize_landscape = {width: 1024, height: 768};
  var viewportSize_portrait  = {width: 600, height: 800};
  runTest(eyes, innerDriver, viewportSize_landscape);
  runTest(eyes, innerDriver, viewportSize_portrait);
  if (innerDriver) {
      innerDriver.quit(); // Close the browser.
  } 
}

function runTest(eyes,innerDriver,viewportSize) {
  // Start the test and set the browser's viewport size to 800x600.
  eyes.open(innerDriver, 'Hello World App v1', 'Hello World Test', viewportSize)
      .then(function (driver){ afterOpen(eyes,driver)});
}

function afterOpen(eyes,driver) {
try {

      // Navigate the browser to the "hello world!" web-site.
      var  website = "https://applitools.com/helloworld";
      driver.get(website);

      eyes.checkWindow('Before mouse click');  // Visual checkpoint #1.

      // Click the "Click me!" button.
      driver.findElement(webdriver.By.tagName('button')).click();

      eyes.checkWindow('After mouse click'); // Visual checkpoint #2.

      // End the test.
      var throwtTestCompleteException = false;
      eyes.close(throwtTestCompleteException)
      .then(function(result) {
          var url = result.appUrls.session;
          if (result.isNew) {
              console.log("New Baseline Created: URL=" + url);
          } else if (result.isPassed) {
              console.log("All steps passed:     URL=" + url);
          } else {
              console.log("Test Failed:          URL=" + url);
              }            
      });

 } finally {
    // If the test was aborted before eyes.close was called ends the test as aborted.
    eyes.abortIfNotClosed(); //could add .then if necessary
}
}

main();