/**
 * Produce permutations of the null type
 * @export
 * @param {object} schema - The schema.
 * @param {string} propertyName - The property name.
 * @param {boolean} required - The propertys required status.
 * @param {boolean} example - Return a single example.
 * @return {array | object} - A function which returns an array of null.
 */
module.exports = function (schema, propertyName, required, example) {
    let nullArray = [];
    let nullObj = {};

    nullObj[propertyName] = null;

    if (example) {
        return nullObj;
    }

    nullArray.push(nullObj);

    return nullArray;
};