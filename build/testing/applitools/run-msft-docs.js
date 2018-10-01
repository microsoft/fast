"use strict";

let spawn = require('child_process').spawnSync;

/**
 * Get Branch Name using child_process and Git which runs Asynchronously
 */
class Config {

    constructor() {
        this.domainName = "https://msft-docs.fast-dna.net";
        this.appName = "FAST-DNA";
        this.siteName = "MSFT Doc Site";
    }

    branchName() {

        return spawn('git', ['rev-parse', '--abbrev-ref', 'HEAD']).output[1].toString().trim();
    
    }
}
exports.Config = Config;


/**
 * Testing script that can be used across services  
 */
class Run {

    constructor(eyes, driver, website) {

        console.log("Starting tests on: %s", website);

            driver.get(website);

            // eyes.checkWindow("Before any action");
            // Note: There are many ways to nagivate/find elements on a page
            // unfortunately, not all are cross-browser compliant and so
            // for example, we can't use xpath. As a result, we're using
            // navigation though not necessarily most performant but effective.

            // After browsers matrix is determined we can fine tune and
            // optimize to use other selectors to see what works. If we're
            // Testing on modern browsers this isn't as much a limitation.

            // Recommendation, add in data-test attributes to each component,
            // page, layout, or container we want to capture and select on that.

            // Iterate each components documentation

            driver.navigate().to(website + "/components/button/");
            eyes.checkWindow("button");
                        
            driver.navigate().to(website + "/components/caption/");
            eyes.checkWindow("caption");
            
            driver.navigate().to(website + "/components/checkbox/");
            eyes.checkWindow("checkbox");
            
            driver.navigate().to(website + "/components/dialog/");
            eyes.checkWindow("dialog");
            
            driver.navigate().to(website + "/components/divider/");
            eyes.checkWindow("divider");
            
            driver.navigate().to(website + "/components/flipper/");
            eyes.checkWindow("flipper");
            
            driver.navigate().to(website + "/components/heading/");
            eyes.checkWindow("heading");
            
            driver.navigate().to(website + "/components/hypertext/");
            eyes.checkWindow("hypertext");
            
            driver.navigate().to(website + "/components/image/");
            eyes.checkWindow("image");
            
            driver.navigate().to(website + "/components/label/");
            eyes.checkWindow("label");
            
            driver.navigate().to(website + "/components/metatext/");
            eyes.checkWindow("metatext");
            
            driver.navigate().to(website + "/components/paragraph/");
            eyes.checkWindow("paragraph");
            
            driver.navigate().to(website + "/components/subheading/");
            eyes.checkWindow("subheading");
            
            driver.navigate().to(website + "/components/text-field/");
            eyes.checkWindow("text-field");
            
            driver.navigate().to(website + "/components/toggle/");
            eyes.checkWindow("toggle");
            
            driver.navigate().to(website + "/components/typography/");
            eyes.checkWindow("typography");
            
            // Turn on Developer tools and iterate each component
            // xpath selectors do not work across browsers. This in particular breaks in Internet Explorer
            // driver.findElement(By.xpath("//button[text()='dev tools']")).click();
            // one possible solution would be to inject data attributes for each component we can bind to.
            // For example, data-test="friendly name"
            // driver.findElement(By.cssSelector('[data-element="city"]'))

            // Navigate to example views for each component
            driver.navigate().to(website + "/components/button/examples");
            eyes.checkWindow("button example");
            
            driver.navigate().to(website + "/components/caption/examples");
            eyes.checkWindow("caption example");
            
            driver.navigate().to(website + "/components/checkbox/examples");
            eyes.checkWindow("checkbox example");
            
            driver.navigate().to(website + "/components/dialog/examples");
            eyes.checkWindow("dialog example");
            
            driver.navigate().to(website + "/components/divider/examples");
            eyes.checkWindow("divider example");

            driver.navigate().to(website + "/components/flipper/examples");
            eyes.checkWindow("flipper example");
            
            driver.navigate().to(website + "/components/heading/examples");
            eyes.checkWindow("heading example");
            
            driver.navigate().to(website + "/components/hypertext/examples");
            eyes.checkWindow("hypertext example");
            
            driver.navigate().to(website + "/components/image/examples");
            eyes.checkWindow("image example");
            
            driver.navigate().to(website + "/components/label/examples");
            eyes.checkWindow("label example");
            
            driver.navigate().to(website + "/components/metatext/examples");
            eyes.checkWindow("metatext example");
            
            driver.navigate().to(website + "/components/paragraph/examples");
            eyes.checkWindow("paragraph example");
            
            driver.navigate().to(website + "/components/subheading/examples");
            eyes.checkWindow("subheading example");
            
            driver.navigate().to(website + "/components/text-field/examples");
            eyes.checkWindow("text-field example");
            
            driver.navigate().to(website + "/components/toggle/examples");
            eyes.checkWindow("toggle example");
            
            driver.navigate().to(website + "/components/typography/examples");
            eyes.checkWindow("typograph example");
            
    }
}

exports.Run = Run;
