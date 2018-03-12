/**
 * Produce permutations of the boolean type
 * @export
 * @param {object} schema - The schema.
 * @param {string} propertyName - The property name.
 * @param {boolean} required - The propertys required status.
 * @param {boolean} example - Return a single example.
 * @return {array | object} - A function which returns an array of booleans.
 */
module.exports = function(schema, propertyName, required, example) {
    let boolObjTrue = {};
    let boolObjFalse = {};
    let boolArray = [];
    boolObjTrue[propertyName] = true;
    boolObjFalse[propertyName] = false;

    if (schema.enum) {
        if (example) {
            let boolObj = {};
            boolObj[propertyName] = true;
            
            return boolObj;
        }

        for (let enumItem of schema.enum) {
            let boolObj = {};
            boolObj[propertyName] = enumItem;
            boolArray.push(boolObj);
        }
    } else {

        if (example) {
            return boolObjTrue;
        }

        boolArray.push(boolObjTrue);
        boolArray.push(boolObjFalse);
    }

    return boolArray;
};