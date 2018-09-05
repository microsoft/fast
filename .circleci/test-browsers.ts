
var webdriver = require('selenium-webdriver'),
        username = process.env.SAUCELABS_USER,
        accessKey = process.env.SAUCELABS_KEY,
        driver;
 
driver = new webdriver.Builder().
    withCapabilities({
            'browserName': 'MicrosoftEdge',
            'platform': 'Windows 10',
            'version': '17',
            'username': username,
            'accessKey': accessKey
          
    }).
      usingServer("http://" + username + ":" + accessKey +
                    "@ondemand.saucelabs.com:80/wd/hub").
      build();
 
driver.get("http://saucelabs.com/test/guinea-pig");
 
driver.getTitle().then(function (title) {
        console.log("title is: " + title);

});
 
driver.quit();
