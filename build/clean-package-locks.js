/**
 * Utility for cleaning package locks.
 * Usage: node build/clean-package-locks.js
 */

var rimraf = require('rimraf');

rimraf('./packages/**/package-lock.json', (err) => {  
    if (err) {
        throw err;
    }

    console.log("All `package-lock.json` files have been deleted");
});
