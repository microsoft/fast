/**
 * Produce permutations of the object type
 * @export
 * @param {object} schema - The schema.
 * @param {string} propertyName - The property name.
 * @param {boolean} required - The propertys required status.
 * @return {array | object} - A function which returns an array of objects.
 */
module.exports = function(schema, propertyName, required) {
    let objectArray = [];
    let objectObj = {};

    objectObj[propertyName] = schema.default ? schema.default : {};
    objectArray.push(objectObj);

    return objectArray;
};
