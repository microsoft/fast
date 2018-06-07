const clone = require('lodash-es').cloneDeep;

/**
 * Removes empty objects from data
 * @param {object} data - The data.
 * @return {object} - An object that has no empty objects.
 */
module.exports = function(data) {
    let dataClone = clone(data);

    // identify all objects, any found should be removed with 
    // their contents
    for (let dataItem of dataClone) {
        let emptyObjects = [];
        let objKeys = Object.keys(dataItem);

        for (let key of objKeys) {
            if (typeof dataItem[key] === 'object' && !Array.isArray(dataItem[key])) {
                emptyObjects.push(key);
            }
        }

        for (let key of objKeys) {
            for (let emptyItem of emptyObjects) {
                // if the key is a subitem or is the empty object itself, remove it
                if (key.includes(`${emptyItem}.`) || key === emptyItem) {
                    var objIndex = dataClone.indexOf(dataItem);
                    delete dataClone[objIndex][key];
                }
            }
        }
    }

    return dataClone;
};