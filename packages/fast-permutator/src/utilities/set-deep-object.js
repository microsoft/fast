const set = require("lodash-es").set;
const get = require("lodash-es").get;

const removeUndefined = require("./remove-undefined");

/**
 * Adds properties to an object with a flat structure
 * @param {object} obj - The object.
 * @return {object} - An object with properties.
 */
module.exports = function(obj) {
    let deepSetObj = {};
    let objKeys = Object.keys(obj);

    for (let key of objKeys) {
        set(deepSetObj, key, get(obj, key));
    }

    deepSetObj = removeUndefined(deepSetObj);

    return deepSetObj;
};
