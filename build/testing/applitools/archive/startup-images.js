/**
 * @name
 * Test Visual User Interfaces
 * 
 * @description
 * Used to generate baselines and test the difference of those baselines against future changes.
 * 
 * @example
 * To execute on CLI, run `node build/testing/applitools/startup-image.js` from root directory.
 * 
 * @requires
 * You must create environment variables if executing this script locally using CLI. 
 * 
 * This can be done one of two recommended ways.
 * 1. Update your '~/.bashrc' file.
 *    export APPLITOOLS_API_KEY=[some value]
 * 
 * 2. Create a '.env' file at the root of your project
 *    APPLITOOLS_API_KEY=[some value]
 * 
 * - Cirlce CI has these values included as environment variables. 
 * - The api key can be found in the portal on Applitools.
 * 
 */

const https = require("https");
const Eyes = require("eyes.images").Eyes;
const ConsoleLogHandler = require("eyes.images").ConsoleLogHandler;
const RSVP = require("rsvp");
const dotenv = require("dotenv").config();

// Initialize the eyes SDK and set your private API key.
var eyes = new Eyes();
eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
eyes.setLogHandler(new ConsoleLogHandler(true));

// Define the OS.
eyes.setOs("Windows 10");

// Set batch
eyes.setBatch("MSFT-Docs");

// Start the test and set the browser's viewport size to 800x600.
var testPromise = eyes.open("Image test", "Image snapshot test : 1", {
        width: 1024,
        height: 768,
        name: 'firefox'
    })
    // .then(function () { // Load page image and validate

    //     eyes.
    //     return getImage("applitools.com", "/images/tutorials/applitools_hero.png").then(function (img) {
    //         return eyes.checkImage(img, 'Microsoft Hero HP');
    //     });
    // })
    .then(function () { // Load page image and validate

        return getImage("applitools.com", "/images/tutorials/applitools_hero.png").then(function (img) {
            return eyes.checkImage(img, 'Microsoft Hero HP');
        });
    })
    .then(function () { // End visual UI testing
        
        var throwtTestCompleteException = false;
        return eyes.close(throwtTestCompleteException)
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

    }, function () {
        return eyes.abortIfNotClosed();
    });

// Handle test results.
testPromise.then(function (results) {
    console.log("results", results);
});

// Handle the image.
function getImage(host, path) {
    var options = {
        host: host,
        path: path
    };

    var deferred = RSVP.defer();

    https.request(options, function (res) {
        res.setEncoding('binary');

        var data = "";
        res.on('data', function (chunk) {
            return data += chunk;
        });
        res.on('end', function () {
            return deferred.resolve(new Buffer(data, 'binary'));
        });
        res.on('error', function (err) {
            console.log("Error during HTTP request");
            console.log(err.message);
            deferred.reject();
        });
    }).end();

    return deferred.promise;
}

// cy.eyesOpen({
//     appName: 'blog app',
//     testName: 'blog app cypress',
//     browser: [{
//             deviceName: 'iPhone X',
//             screenOrientation: 'portrait'
//         },
//         {
//             deviceName: 'iPhone 6/7/8',
//             screenOrientation: 'landscape'
//         },
//         {
//             width: 800,
//             height: 600,
//             name: 'firefox'
//         },
//         {
//             width: 800,
//             height: 600,
//             name: 'chrome'
//         }
//     ]
// })