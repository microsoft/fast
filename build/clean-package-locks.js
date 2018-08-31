/**
 * Utility for cleaning package locks.
 * Usage: node build/clean-package-locks.js
 */

var rimraf = require('rimraf');

/* Remove all package json locks */
rimraf('./packages/**/package-lock.json', (err) => {  
    if (err) {
        throw err;
    }

    console.log("All `package-lock.json` files have been deleted");
});

/* Remove the root package lock */
rimraf('package-lock.json', (err) => {  
    if (err) {
        throw err;
    }

    console.log("`package-lock.json` root file has been deleted");
});

