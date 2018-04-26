/**
 * Gets a single example from the schema
 */
module.exports = function (location, pattern) {
    return isRecursive(location, pattern);
};

/**
 * Determines if a location is recursive if it has 3 consecutively repeating sections
 * @param {string} location 
 * @param {string} pattern 
 */
const isRecursive = function(location, pattern) {
    let isLocationRecursive = location.match(pattern) === null ? false : true;

    return isLocationRecursive;
};