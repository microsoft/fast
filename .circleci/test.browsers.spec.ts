

var assert = require('assert'),
    webdriver = require('selenium-webdriver'),
    SauceLabs = require("saucelabs"),
    username = process.env.SAUCELABS_USER,
    accessKey = process.env.SAUCELABS_KEY,
    saucelabs = new SauceLabs({
              username: username,
              password: accessKey
            
    });

describe('Test Staging Documentation', () => {
      this.timeout(60000);

      var driver;

    beforeEach(function() {
            var browser = process.env.BROWSER,
                    version = process.env.VERSION,
                    platform = process.env.PLATFORM,
                    server = "http://" + username + ":" + accessKey + 
                              "@ondemand.saucelabs.com:80/wd/hub"; 

            driver = new webdriver.Builder().
                    withCapabilities({
                        'browserName': browser,
                        'platform': platform,
                        'version': version,
                        'username': username,
                        'accessKey': accessKey
                      
                    }).
                  usingServer(server).
                  build();

                  driver.getSession().then(function (sessionid){
                  driver.sessionID = sessionid.id_;
                
        });

          
    });

    afterEach(function(done) {
            var title = this.currentTest.title,
                    passed = (this.currentTest.state === 'passed') ? true : false;

            driver.quit();

        saucelabs.updateJob(driver.sessionID, {
                  name: title,
                  passed: passed
                
        }, done);
          
    })

    it('searching for webdriver using google', function() {
            driver.get('http://google.com');

            var searchBox = driver.findElement(webdriver.By.name('q'));
            searchBox.sendKeys('webdriver');
        searchBox.getAttribute('value').then(function(value) {
                  assert.equal(value, 'webdriver');
                
        });

          
    });

});
