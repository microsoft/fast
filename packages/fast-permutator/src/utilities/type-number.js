/**
 * Produce permutations of the number type
 * @export
 * @param {object} schema - The schema.
 * @param {string} propertyName - The property name.
 * @param {boolean} required - The propertys required status.
 * @param {boolean} example - Return a single example.
 * @return {array | object} - A function that returns an array of numbers.
 */
module.exports = function (schema, propertyName, required, arrayConfig, example) {
    let numberArray = [];
    let exampleNumber = Math.round(Math.random() * 100);

    if (schema.enum) {
        if (example) {
            let numberObj = {};
            numberObj[propertyName] = schema.enum[0];
            
            return numberObj;
        }

        for (let enumItem of schema.enum) {
            if (arrayConfig && arrayConfig.itemNumber) {
                let numberObjArray = {};
                numberObjArray[propertyName] = [];

                for (let i = 0; i < arrayConfig.itemNumber; i++) {
                    numberObjArray[propertyName].push((schema.default) ? schema.default : enumItem);
                }

                numberArray.push(numberObjArray);
            } else {
                let numberEnumObj = {};
                numberEnumObj[propertyName] = enumItem;
                numberArray.push(numberEnumObj);
            }
        }
    } else {
        if (arrayConfig && arrayConfig.itemNumber) {
            let numberObjArray = {};
            numberObjArray[propertyName] = [];

            for (let i = 0; i < arrayConfig.itemNumber; i++) {
                numberObjArray[propertyName].push(schema.default || schema.example || exampleNumber);
            }

            if (example) {
                return numberObjArray;
            }

            numberArray.push(numberObjArray);
        } else {
            let numberObj = {};
            numberObj[propertyName] = schema.default || schema.example || exampleNumber;

            if (example) {
                return numberObj;
            }

            numberArray.push(numberObj);
        }
    }

    return numberArray;
};