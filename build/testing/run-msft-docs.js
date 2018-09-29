"use strict";

let spawn = require('child_process').spawnSync;

/**
 * Get Branch Name using child_process and Git which runs Asynchronously
 */
class Config {

    constructor() {
        this.DomainName = "https://msft-docs.fast-dna.net";
        this.AppName = "FAST-DNA"; // Should be batch name
        this.SiteName = "MSFT Doc Site"; // Should be branch name
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

    constructor(eyes, driver, domain) {

        console.log("Starting script on: %s", domain);

            driver.get(domain);

            eyes.checkWindow("Before any action");
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
                driver.navigate().to(domain + "/components/button/");
                eyes.checkWindow("After navigation");
                // driver.navigate().to(domain + "/components/caption/");
                // driver.navigate().to(domain + "/components/checkbox/");
                // driver.navigate().to(domain + "/components/dialog/");
                // driver.navigate().to(domain + "/components/divider/");
                // driver.navigate().to(domain + "/components/flipper/");
                // driver.navigate().to(domain + "/components/heading/");
                // driver.navigate().to(domain + "/components/hypertext/");
                // driver.navigate().to(domain + "/components/image/");
                // driver.navigate().to(domain + "/components/label/");
                // driver.navigate().to(domain + "/components/metatext/");
                // driver.navigate().to(domain + "/components/paragraph/");
                // driver.navigate().to(domain + "/components/subheading/");
                // driver.navigate().to(domain + "/components/text-field/");
                // driver.navigate().to(domain + "/components/toggle/");
                // driver.navigate().to(domain + "/components/typography/");

            // Turn on Developer tools and iterate each component
            // xpath selectors do not work across browsers. This in particular breaks in Internet Explorer
            // driver.findElement(By.xpath("//button[text()='dev tools']")).click();
            // one possible solution would be to inject data attributes for each component we can bind to.
            // For example, data-test="friendly name"
            // driver.findElement(By.cssSelector('[data-element="city"]'))

            // Navigate to example views for each component
                // driver.navigate().to(domain + "/components/button/examples");
                // driver.navigate().to(domain + "/components/caption/examples");
                // driver.navigate().to(domain + "/components/checkbox/examples");
                // driver.navigate().to(domain + "/components/dialog/examples");
                // driver.navigate().to(domain + "/components/divider/examples");
                // driver.navigate().to(domain + "/components/flipper/examples");
                // driver.navigate().to(domain + "/components/heading/examples");
                // driver.navigate().to(domain + "/components/hypertext/examples");
                // driver.navigate().to(domain + "/components/image/examples");
                // driver.navigate().to(domain + "/components/label/examples");
                // driver.navigate().to(domain + "/components/metatext/examples");
                // driver.navigate().to(domain + "/components/paragraph/examples");
                // driver.navigate().to(domain + "/components/subheading/examples");
                // driver.navigate().to(domain + "/components/text-field/examples");
                // driver.navigate().to(domain + "/components/toggle/examples");
                // driver.navigate().to(domain + "/components/typography/examples");


    }
}

exports.Run = Run;
