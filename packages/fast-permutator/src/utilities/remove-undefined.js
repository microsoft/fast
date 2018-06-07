const clone = require('lodash-es').cloneDeep;

/**
 * Remove any undefined keys in an object
 * @param {object} obj - The object.
 * @return {object} - The object without undefined keys.
 */
module.exports = function(obj) {
    let newObj = clone(obj);
    let objKeys = Object.keys(newObj);

    for (let key of objKeys) {
        if (typeof key === 'undefined') {
            delete newObj[key];
        }
        if (Array.isArray(newObj[key])) {
            for (let i = 0, keyLength = newObj[key].length; i < keyLength; i++) {
                if (typeof newObj[key][i] === 'undefined') {
                    newObj[key].splice(i, 1);
                }
            }
        }
    }

    return newObj;
};