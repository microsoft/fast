/**
 * Utility for cleaning package locks.
 * Usage: node build/clean-locks.js
 */

var glob = require('glob');
var rimraf = require('rimraf');

glob('./packages/**/package-lock.json', (err, files) => {
    if (err) {
        throw err;
    }

    files.forEach(file => {
        rimraf(file, (err) => {
            console.log(file, "deleted");
        })
    });  
});