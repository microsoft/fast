var https = require('https');
var Eyes = require('eyes.images').Eyes;
var ConsoleLogHandler = require('eyes.images').ConsoleLogHandler;
var RSVP = require('rsvp');

// Initialize the eyes SDK and set your private API key.
var eyes = new Eyes();
eyes.setApiKey(process.env.APPLITOOLS_API_KEY);
eyes.setLogHandler(new ConsoleLogHandler(true));
// Define the OS.
eyes.setOs("Windows 10");

// Start the test and set the browser's viewport size to 800x600.
var testPromise = eyes.open("Image test", "Javascript screenshot test!", {width: 800, height: 600})
    .then(function () {

        // Load page image and validate.
        return getImage('applitools.com', '/images/tutorials/applitools_hero.png').then(function (img) {

            // Visual validation.
            return eyes.checkImage(img, 'Contact-us page');
        });
    })
    .then(function () {
            // End visual UI testing. Validate visual correctness.
            return eyes.close(false);
        }, function () {
            return eyes.abortIfNotClosed();
        }
    );

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
        res.on('data', function(chunk) {
            return data += chunk;
        });
        res.on('end', function() {
            return deferred.resolve(new Buffer(data, 'binary'));
        });
        res.on('error', function(err) {
            console.log("Error during HTTP request");
            console.log(err.message);
            deferred.reject();
        });
    }).end();

    return deferred.promise;
}