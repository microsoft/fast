/**
 * Utility for cleaning package locks.
 * Usage: node build/clean-package-locks.js
 */

var rimraf = require('rimraf');

// Delete packages package lock files
rimraf('./packages/**/package-lock.json', (err) => {  
    if (err) {
        throw err;
    }

    console.log("All `package-lock.json` files have been deleted");
});

// Delete root package lock file
rimraf('package-lock.json', (err) => {  
    if (err) {
        throw err;
    }

    console.log("The root `package-lock.json` file has been deleted");
});

// Delete all dist files
rimraf('./packages/**/dist', (err) => {  
    if (err) {
        throw err;
    }

    console.log("All `./dist` files have been deleted");
});


// Delete all code coverage files
rimraf('./packages/**/coverage', (err) => {  
    if (err) {
        throw err;
    }

    console.log("All `./coverage` files have been deleted");
});


// Delete all www distribution files
rimraf('./packages/**/www', (err) => {  
    if (err) {
        throw err;
    }

    console.log("All `./www` files have been deleted");
});
