/**
 * Produce permutations of the strings type
 * @export
 * @param {object} schema - The schema.
 * @param {string} propertyName - The property name.
 * @param {boolean} required - The propertys required status.
 * @param {boolean} example - Return a single example.
 * @return {array | object} - A function that returns an array of strings.
 */
module.exports = function(schema, propertyName, required, arrayConfig, example) {
    let stringArray = [];
    let exampleText = "example text";

    if (schema.enum) {
        if (example) {
            let stringObj = {};
            stringObj[propertyName] = schema.enum[0];

            return stringObj;
        }

        for (let enumItem of schema.enum) {
            if (arrayConfig && arrayConfig.itemNumber) {
                let stringObjArray = {};
                stringObjArray[propertyName] = [];

                for (let i = 0; i < arrayConfig.itemNumber; i++) {
                    stringObjArray[propertyName].push(
                        schema.default ? schema.default : enumItem
                    );
                }

                stringArray.push(stringObjArray);
            } else {
                let stringEnumObj = {};
                stringEnumObj[propertyName] = enumItem;
                stringArray.push(stringEnumObj);
            }
        }
    } else {
        if (arrayConfig && arrayConfig.itemNumber) {
            let stringObjArray = {};
            stringObjArray[propertyName] = [];

            for (let i = 0; i < arrayConfig.itemNumber; i++) {
                stringObjArray[propertyName].push(
                    schema.default || schema.example || exampleText
                );
            }

            if (example) {
                return stringObjArray;
            }

            stringArray.push(stringObjArray);
        } else {
            let stringObj = {};

            stringObj[propertyName] = schema.default || schema.example || exampleText;

            if (example) {
                return stringObj;
            }

            stringArray.push(stringObj);
        }
    }

    return stringArray;
};
