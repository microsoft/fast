const clone = require('lodash/cloneDeep');
const mergeWith = require('lodash/mergeWith');
const get = require('lodash/get');
const set = require('lodash/set');
const unset = require('lodash/unset');
const isObject = require('lodash/isObject');

const getDeepPropLocations = require('./get-deep-prop-locations');

/**
 * Exports a schema with allOf items merged
 * @export
 * @param {object} schema - The schema.
 * @return {object} - A function which returns a schema object.
 */
module.exports = function (schema) {
    return resolveAllOf(schema);
};

/**
 * Resolve each location of an allOf
 * @param {object} schema - The schema.
 * @param {array} locations - The locations of the allOf properties.
 * @return {object}
 */
const resolveAllOf = function (schema) {
    let schemaClone = clone(schema);
    let locations = getDeepPropLocations(schemaClone, 'allOf');

    if (locations.length > 0) {
        let resolvedAllOf = mergeAllOf(get(schemaClone, locations[0]));
        set(schemaClone, locations[0], resolvedAllOf);

        if (locations[0] !== '') {
            unset(schemaClone, `${locations[0]}.allOf`);
        } else {
            unset(schemaClone, `allOf`);
        }

        return resolveAllOf(schemaClone);
    } else {
        return schemaClone;
    }
};

/**
 * Merges a schemas allOf items
 * @param {object} schema - The schema.
 * @return {object} - A schema object.
 */
let mergeAllOf = function (schema) {
    let schemaClone = clone(schema);

    if (isObject(schemaClone) && schemaClone.allOf) {
        for (let allOfItem of schemaClone.allOf) {

            if (allOfItem.properties && allOfItem.required) {
                let objKeys = Object.keys(allOfItem.properties);

                for (let key of objKeys) {
                    schemaClone.required = allOfItem.required.filter((requiredItem) => {
                        if (requiredItem === key) {
                            return key;
                        }
                    });
                }
            }

            const enumLocations = getDeepPropLocations(schemaClone, 'enum');

            schemaClone = restrictedPropertyByEnums(schemaClone, enumLocations);
        }

        let mergedAllOfObj = {};

        for (let allOfItem of schemaClone.allOf) {
            mergeWith(mergedAllOfObj, allOfItem, arrayMerge);
        }

        schemaClone = mergedAllOfObj;
    }

    if (isObject(schemaClone) && schemaClone.properties) {
        let objKeys = Object.keys(schemaClone.properties);

        for (let key of objKeys) {
            if (schemaClone.properties[key].allOf) {
                schemaClone.properties[key] = mergeAllOf(schema.properties[key]);

                if (schemaClone.properties[key].properties) {
                    schemaClone.properties[key].type = 'object';
                }
            }

            if (schemaClone.properties[key].items && schemaClone.properties[key].items.allOf) {
                schemaClone.properties[key].items = mergeAllOf(schema.properties[key].items);

                if (schemaClone.properties[key].items.properties) {
                    schemaClone.properties[key].items.type = 'object';
                }
            }
        }
    }

    return schemaClone;
};

/**
 * Concatenates any array during a merge
 * @param {object | array} objValue 
 * @param {object | array} srcValue 
 */
let arrayMerge = function (objValue, srcValue) {
    if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
    }
};

/**
 * Restricts a properties enums
 * @param {object} schema - The schema or sub-schema.
 * @param {array} enumLocations - An array of enum locations.
 * @return {object}
 */
let restrictedPropertyByEnums = function (schema, enumLocations) {
    let schemaClone = clone(schema);
    let directLocations = [];

    if (enumLocations.length > 0) {
        // identify same properties
        for (let enumLocation of enumLocations) {
            directLocations.push(enumLocation.replace(/allOf\[\d+\]./g, ''));
        }

        // make sure the enum is not inside a oneOf/anyOf since these are unique
        directLocations = directLocations.filter((directLocation) => {
            if (directLocation.match(/oneOf/g) === null && directLocation.match(/anyOf/g) === null) {
                return directLocation;
            }
        });

        let uniqueLocations = [...new Set(directLocations)];

        for (let uniqueLocation of uniqueLocations) {
            let restrictedEnums;

            for (let allOfItem of schemaClone.allOf) {
                let allOfItemEnums = get(allOfItem, `${uniqueLocation}.enum`);

                if (allOfItemEnums) {
                    if (typeof restrictedEnums !== 'undefined') {
                        restrictedEnums = restrictedEnums.filter((enumItem) => {

                            for (let allOfItemEnum of allOfItemEnums) {
                                if (enumItem === allOfItemEnum) {

                                    return enumItem;
                                }
                            }
                        });
                    } else {
                        restrictedEnums = allOfItemEnums;
                    }

                    unset(allOfItem, `${uniqueLocation}.enum`);
                }
            }

            set(schemaClone.allOf[0], `${uniqueLocation}.enum`, restrictedEnums);
        }
    }

    return schemaClone;
};