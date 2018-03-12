/**
 * Produce permutations of the typeless enum
 * @export
 * @param {object} schema - The schema.
 * @param {string} propertyName - The property name.
 * @param {boolean} required - The propertys required status.
 * @param {boolean} example - Return a single example.
 * @return {array | object} - A function that returns an array of enums.
 */
module.exports = function (schema, propertyName, required, arrayConfig, example) {
    let enumArray = [];

    if (schema.enum) {
        if (example) {
            let enumObj = {};
            enumObj[propertyName] = schema.enum[0];
            
            return enumObj;
        }

        for (let enumItem of schema.enum) {
            if (arrayConfig && arrayConfig.itemNumber) {
                let enumObjArray = {};
                enumObjArray[propertyName] = [];

                for (let i = 0; i < arrayConfig.itemNumber; i++) {
                    enumObjArray[propertyName].push((schema.default) ? schema.default : enumItem);
                }

                enumArray.push(enumObjArray);
            } else {
                let enumObj = {};
                enumObj[propertyName] = enumItem;
                enumArray.push(enumObj);
            }
        }
    }

    return enumArray;
};