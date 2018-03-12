const get = require('lodash').get;

/**
 * Returns an array of locations of the given property name
 * @param {object} schema - The schema.
 * @param {stirng} propName - The name of the property.
 */
module.exports = function (schema, propName) {
    let propertyLocations = [];

    // resolve prop locations inside definitions
    if (schema.definitions) {
        propertyLocations = propertyLocations.concat(findPropsInDefinitions(schema, 'definitions', propName));
    }
    // resolve prop locations outside definitions
    propertyLocations = propertyLocations.concat(findProps(schema, '', propName));

    // make sure all locations are unique
    let uniquePropertyLocations = [...new Set(propertyLocations)];

    // sort the locations to make sure there are none of the same prop inside a given prop
    // this ensures that resolving 'allOf' etc. can resolve
    uniquePropertyLocations.sort(function (a, b) {
        let aSchema = get(schema, a);
        let bSchema = get(schema, b);

        let aPropLocations = [];
        let bPropLocations = [];

        if (typeof aSchema !== 'undefined') {
            aPropLocations = aPropLocations.concat(findProps(aSchema, '', propName));
        } 
        
        if (typeof bSchema !== 'undefined') {
            bPropLocations = bPropLocations.concat(findProps(bSchema, '', propName));
        }

        return aPropLocations.length - bPropLocations.length;
    });

    return uniquePropertyLocations;
};

/**
 * Finds the location of properties within a definition
 * @param {object} schema - The schema.
 * @param {string} location - The location of the reference.
 * @param {string} propName - The name of the property.
 * @return {array} - Schema reference locations.
 */
let findPropsInDefinitions = function (schema, location, propName) {
    let matches = [];
    let definitions = get(schema, location);
    let keys = Object.keys(definitions);

    if (keys && keys.length > 0) {
        for (let key of keys) {
            matches = matches.concat(findProps(get(definitions, key), `${location}.${key}`, propName));
        }
    }

    return matches;
};

/**
 * Finds the locations of properties in a schema
 * @param {object} schema - The schema.
 * @param {string} location - The location of the reference.
 * @param {string} propName - The name of the property.
 * @return {array} - Schema reference locations.
 */
let findProps = function (schema, location, propName) {
    let matches = [];

    if (schema[propName]) {
        let newLocation = (location === '') ? `` : `${location}`;

        matches.push(newLocation);
    }

    if (schema.properties) {
        let keys = Object.keys(schema.properties);

        for (let key of keys) {
            if (schema.properties[key].items) {
                let newLocation = (location === '') ? `properties.${key}.items` : `${location}.properties.${key}.items`;

                if (!isRecursive(newLocation)) {
                    matches = matches.concat(findProps(schema.properties[key].items, newLocation, propName));
                }
            } else {
                let newLocation = (location === '') ? `properties.${key}` : `${location}.properties.${key}`;

                if (!isRecursive(newLocation)) {
                    matches = matches.concat(findProps(schema.properties[key], newLocation, propName));
                }
            }
        }
    }

    if (schema.items) {
        let newLocation = (location === '') ? `items` : `${location}.items`;

        if (!isRecursive(newLocation)) {
            matches = matches.concat(findProps(schema.items, newLocation, propName));
        }
    }

    if (schema.allOf || schema.oneOf || schema.anyOf) {
        let oneOfAnyOfAllOf;

        if (schema.allOf) oneOfAnyOfAllOf = 'allOf';
        if (schema.oneOf) oneOfAnyOfAllOf = 'oneOf';
        if (schema.anyOf) oneOfAnyOfAllOf = 'anyOf';

        for (let i = 0, schemaArrayLength = schema[oneOfAnyOfAllOf].length; i < schemaArrayLength; i++) {
            let arrayItem = schema[oneOfAnyOfAllOf][i];

            if (arrayItem[propName]) {
                let newLocation = (location === '') ? `${oneOfAnyOfAllOf}[${i}]` : `${location}.${oneOfAnyOfAllOf}[${i}]`;

                matches.push(newLocation);
            } else if (arrayItem.properties) {
                let keys = Object.keys(arrayItem.properties);

                for (let key of keys) {
                    let newLocation = (location === '') ? `${oneOfAnyOfAllOf}[${i}].properties.${key}` : `${location}.${oneOfAnyOfAllOf}[${i}].properties.${key}`;

                    if (!isRecursive(newLocation)) {
                        matches = matches.concat(findProps(arrayItem.properties[key], newLocation, propName));
                    }
                }
            } else if (arrayItem.items) {
                let newLocation = (location === '')
                    ? `${oneOfAnyOfAllOf}[${i}].items`
                    : `${location}.${oneOfAnyOfAllOf}[${i}].items`;

                if (!isRecursive(newLocation)) {
                    matches = matches.concat(findProps(arrayItem.items, newLocation, propName));
                }
            }

            if (arrayItem.allOf || arrayItem.anyOf || arrayItem.oneOf) {
                let newLocation = (location === '') ? `${oneOfAnyOfAllOf}[${i}]` : `${location}.${oneOfAnyOfAllOf}[${i}]`;

                if (!isRecursive(newLocation)) {
                    matches = matches.concat(findProps(arrayItem, newLocation, propName));
                }
            }
        }
    }

    return matches;
};

/**
 * Determines if a location is recursive if it has 3 consecutively repeating sections
 * @param {string} location 
 */
let isRecursive = function(location) {
    let repeatingPattern = /(.*)\.\1\.\1/;
    let isLocationRecursive = location.match(repeatingPattern) === null ? false : true;

    return isLocationRecursive;
};