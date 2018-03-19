const get = require('lodash').get,
    permutator = require('../../src/index');

function prettyJSON(obj) {
    return JSON.stringify(obj, null, 2);
}

/**
 * Exported method for getting shallow refs
 */

describe('Reference IDs', function() {
    let possibleRefs;

    beforeAll(() => {
        const schemaData = require('../schemas/primitive/ref.schema.json');

        const refLocations = permutator.getDeepPropLocations(schemaData, '$ref');
        possibleRefs = [];
        
        for (const refLocation of refLocations) {
            possibleRefs.push(get(schemaData, `${refLocation}['$ref']`));
        }
    });
    it('should the correct number schema IDs', function() {
        expect(possibleRefs).toHaveLength(2);
    });
    it('should return the correct schema IDs', function() {
        expect(possibleRefs[0]).toEqual('/primitives/definition');
        expect(possibleRefs[1]).toEqual('/primitives/oneOf#/definitions/numberObj');
    })
});

/**
 * Exported method for getting deep refs
 */

describe('Deep reference IDs', function() {
    let possibleRefs;

    beforeAll(() => {
        let refSchemas = [];

        const refRef = require('../schemas/primitive/ref.schema.json');
        const refDefinition = require('../schemas/primitive/definition.schema.json');
        const refBoolean = require('../schemas/primitive/boolean.schema.json');
        const refString = require('../schemas/primitive/string.schema.json');
        const refNumber = require('../schemas/primitive/number.schema.json');
        const refOneOf = require('../schemas/primitive/oneOf.schema.json');

        refSchemas.push(refRef);
        refSchemas.push(refDefinition);
        refSchemas.push(refBoolean);
        refSchemas.push(refString);
        refSchemas.push(refNumber);
        refSchemas.push(refOneOf);

        const schemaData = require('../schemas/primitive/deepRef.schema.json');
        const refLocations = permutator.getDeepPropLocations(schemaData, '$ref');
        possibleRefs = [];
        
        for (const refLocation of refLocations) {
            possibleRefs.push(get(schemaData, `${refLocation}['$ref']`));
        }
    });
    it('should the correct number schema IDs', function() {
        expect(possibleRefs).toHaveLength(5);
    });
});

/**
 * Exported method for getting locations to properties
 */

describe('Locations of properties', function() {
    let possibleRefs;
    let possibleAllOf;
    let possibleRequired;

    beforeAll(() => { 
        let refSchemas = [];

        const refRef = require('../schemas/primitive/ref.schema.json');
        const refDefinition = require('../schemas/primitive/definition.schema.json');
        const refBoolean = require('../schemas/primitive/boolean.schema.json');
        const refString = require('../schemas/primitive/string.schema.json');
        const refNumber = require('../schemas/primitive/number.schema.json');
        const refOneOf = require('../schemas/primitive/oneOf.schema.json');

        refSchemas.push(refRef);
        refSchemas.push(refDefinition);
        refSchemas.push(refBoolean);
        refSchemas.push(refString);
        refSchemas.push(refNumber);
        refSchemas.push(refOneOf);

        const schemaData = require('../schemas/primitive/deepRef.schema.json');
        possibleRefs = permutator.getDeepPropLocations(schemaData, '$ref');
        possibleAllOf = permutator.getDeepPropLocations(schemaData, 'allOf');
        possibleRequired = permutator.getDeepPropLocations(schemaData, 'required');
    });
    it('should the correct number of locations', function() {
        expect(possibleRefs).toHaveLength(5);
        expect(possibleAllOf).toHaveLength(2);
        expect(possibleRequired).toHaveLength(2);
    });
});

describe('Reference resolver', function() {
    let possibleSchema;

    beforeAll(() => { 
        let refSchemas = [];

        const refRef = require('../schemas/refs/ref.schema.json');
        const oneOfRef = require('../schemas/refs/oneOfRef.schema.json');
        
        refSchemas.push(refRef);
        refSchemas.push(oneOfRef);

        const schemaData = require('../schemas/refs/base.schema.json');
        possibleSchema = permutator.resolveReferences(schemaData, refSchemas);
    });
    it('should generate correct number of references', function() {
        let refs = permutator.getDeepPropLocations(possibleSchema, '$ref');

        expect(refs).toHaveLength(0);
    });
});

describe('Schema permutator', function() {
    let possibleData;

    beforeAll(() => { 
        let refSchemas = [];

        const refDefinition = require('../schemas/primitive/definition.schema.json');
        const refBoolean = require('../schemas/primitive/boolean.schema.json');
        const refString = require('../schemas/primitive/string.schema.json');
        const refNumber = require('../schemas/primitive/number.schema.json');
        const refOneOf = require('../schemas/primitive/oneOf.schema.json');

        refSchemas.push(refDefinition);
        refSchemas.push(refBoolean);
        refSchemas.push(refString);
        refSchemas.push(refNumber);
        refSchemas.push(refOneOf);

        const schemaData = require('../schemas/primitive/oneOf.schema.json');
        possibleData = permutator.simplifySchemas(schemaData, refSchemas);
    });
    it('should generate correct number of schemas', function() {
        expect(possibleData).toHaveLength(2);
    });
});

describe('Property resolver', function() {
    let refsArray;
    let allOfArray;

    beforeAll(() => { 
        let refSchemas = [];

        const refRef = require('../schemas/refs/ref.schema.json');
        const oneOfRef = require('../schemas/refs/oneOfRef.schema.json');

        refSchemas.push(refRef);
        refSchemas.push(oneOfRef);

        const propsToResolve = [
            'allOf',
            '$ref'
        ];

        const schemaData = require('../schemas/refs/base.schema.json');
        const possibleData = permutator.resolveSchemaProps(schemaData, refSchemas, propsToResolve);
        refsArray = permutator.getDeepPropLocations(possibleData, '$ref');
        allOfArray = permutator.getDeepPropLocations(possibleData, 'allOf');
    });
    it('should not find any $ref or allOf properties', function() {
        expect(refsArray).toHaveLength(0);
        expect(allOfArray).toHaveLength(0);
    });
});

describe('Get an example', function() {
    let possibleData;

    beforeAll(() => { 
        let refSchemas = [];

        const refRef = require('../schemas/refs/ref.schema.json');
        const oneOfRef = require('../schemas/refs/oneOfRef.schema.json');

        refSchemas.push(refRef);
        refSchemas.push(oneOfRef);

        const schemaData = require('../schemas/refs/base.schema.json');
        possibleData = permutator.getExample(schemaData, refSchemas);
    });
    it('should return a single example from the required data available', function() {
        expect(possibleData).toHaveProperty('oneOfRef');
    });
});

describe('Get an example of an array', function() {
    let possibleData;

    beforeAll(() => { 
        let refSchemas = [];

        const contextMenu = require('../schemas/fw/context-menu.schema.json');
        const actionTrigger = require('../schemas/fw/action-trigger.schema.json');

        refSchemas.push(contextMenu);
        refSchemas.push(actionTrigger);

        const schemaData = require('../schemas/fw/action-menu.schema.json');
        possibleData = permutator.getExample(schemaData, refSchemas);
    });
    it('should return a single example from the required data available', function() {
        expect(possibleData).toHaveProperty('menu');
        expect(possibleData.menu).toHaveProperty('items');
        expect(possibleData.menu.items).toHaveLength(1);
    });
});

describe('Get an example of nested arrays', function() {
    let possibleData;

    beforeAll(() => { 
        let refSchemas = [];
        const schemaData = require('../schemas/primitive/nested-array.schema.json');
        possibleData = permutator.getExample(schemaData, refSchemas);
    });
    it('should return a single example from the required data available', function() {
        expect(possibleData).toHaveProperty('defaultObj');
        expect(possibleData.defaultObj).toHaveProperty('defaultArray');
        expect(possibleData.defaultObj.defaultArray).toHaveLength(2);
        expect(possibleData.defaultObj.defaultArray[0]).toHaveProperty('requiredString');
        expect(possibleData.defaultObj.defaultArray[0].requiredString).toEqual('hello');
    });
});

describe('Resolve a recursive reference', function() {
    let resolvedRecursiveSchema;

    beforeAll(() => { 
        let refSchemas = [];
        const propsToResolve = [
            'allOf',
            '$ref'
        ];

        const schemaData = require('../schemas/fw/supplemental-navigation.schema.json');
        const resolvedSchema = permutator.resolveSchemaProps(schemaData, refSchemas, propsToResolve);
        resolvedRecursiveSchema = permutator.resolveRecursiveReferences(resolvedSchema);
    });
    it('should not throw a circular reference error', function() {
        prettyJSON(resolvedRecursiveSchema);
    });
});