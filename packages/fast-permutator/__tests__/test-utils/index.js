var get = require('lodash').get,
    permutator = require('../../src/index'),
    refSchemas = [];

function prettyJSON(obj) {
    return JSON.stringify(obj, null, 2);
}

/**
 * Exported method for getting shallow refs
 */

describe('Reference IDs', function() {
    let possibleRefs;

    beforeAll((done) => { // done
        let schemaData = require('../schemas/primitive/ref.schema.json');

        let refLocations = permutator.getDeepPropLocations(schemaData, '$ref');
        possibleRefs = [];
        
        for (let refLocation of refLocations) {
            possibleRefs.push(get(schemaData, `${refLocation}['$ref']`));
        }

        done();
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

    beforeAll((done) => { // done
        let refSchemas = [];

        let refRef = require('../schemas/primitive/ref.schema.json');
        let refDefinition = require('../schemas/primitive/definition.schema.json');
        let refBoolean = require('../schemas/primitive/boolean.schema.json');
        let refString = require('../schemas/primitive/string.schema.json');
        let refNumber = require('../schemas/primitive/number.schema.json');
        let refOneOf = require('../schemas/primitive/oneOf.schema.json');

        refSchemas.push(refRef);
        refSchemas.push(refDefinition);
        refSchemas.push(refBoolean);
        refSchemas.push(refString);
        refSchemas.push(refNumber);
        refSchemas.push(refOneOf);

        let schemaData = require('../schemas/primitive/deepRef.schema.json');
        let refLocations = permutator.getDeepPropLocations(schemaData, '$ref');
        possibleRefs = [];
        
        for (let refLocation of refLocations) {
            possibleRefs.push(get(schemaData, `${refLocation}['$ref']`));
        }

        done();
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

    beforeAll((done) => { // done
        let refSchemas = [];

        let refRef = require('../schemas/primitive/ref.schema.json');
        let refDefinition = require('../schemas/primitive/definition.schema.json');
        let refBoolean = require('../schemas/primitive/boolean.schema.json');
        let refString = require('../schemas/primitive/string.schema.json');
        let refNumber = require('../schemas/primitive/number.schema.json');
        let refOneOf = require('../schemas/primitive/oneOf.schema.json');

        refSchemas.push(refRef);
        refSchemas.push(refDefinition);
        refSchemas.push(refBoolean);
        refSchemas.push(refString);
        refSchemas.push(refNumber);
        refSchemas.push(refOneOf);

        let schemaData = require('../schemas/primitive/deepRef.schema.json');
        possibleRefs = permutator.getDeepPropLocations(schemaData, '$ref');
        possibleAllOf = permutator.getDeepPropLocations(schemaData, 'allOf');
        possibleRequired = permutator.getDeepPropLocations(schemaData, 'required');

        done();
    });
    it('should the correct number of locations', function() {
        expect(possibleRefs).toHaveLength(5);
        expect(possibleAllOf).toHaveLength(2);
        expect(possibleRequired).toHaveLength(2);
    });
});

describe('Reference resolver', function() {
    let possibleSchema;

    beforeAll((done) => { // done
        let refSchemas = [];

        let refRef = require('../schemas/refs/ref.schema.json');
        let oneOfRef = require('../schemas/refs/oneOfRef.schema.json');
        
        refSchemas.push(refRef);
        refSchemas.push(oneOfRef);

        let schemaData = require('../schemas/refs/base.schema.json');
        possibleSchema = permutator.resolveReferences(schemaData, refSchemas);

        done();
    });
    it('should generate correct number of references', function() {
        let refs = permutator.getDeepPropLocations(possibleSchema, '$ref');

        expect(refs).toHaveLength(0);
    });
});

describe('Schema permutator', function() {
    let possibleData;

    beforeAll((done) => { // done
        let refSchemas = [];

        let refDefinition = require('../schemas/primitive/definition.schema.json');
        let refBoolean = require('../schemas/primitive/boolean.schema.json');
        let refString = require('../schemas/primitive/string.schema.json');
        let refNumber = require('../schemas/primitive/number.schema.json');
        let refOneOf = require('../schemas/primitive/oneOf.schema.json');

        refSchemas.push(refDefinition);
        refSchemas.push(refBoolean);
        refSchemas.push(refString);
        refSchemas.push(refNumber);
        refSchemas.push(refOneOf);

        let schemaData = require('../schemas/primitive/oneOf.schema.json');
        possibleData = permutator.simplifySchemas(schemaData, refSchemas);

        done();
    });
    it('should generate correct number of schemas', function() {
        expect(possibleData).toHaveLength(2);
    });
});

describe('Property resolver', function() {
    let refsArray;
    let allOfArray;

    beforeAll((done) => { // done
        let refSchemas = [];

        let refRef = require('../schemas/refs/ref.schema.json');
        let oneOfRef = require('../schemas/refs/oneOfRef.schema.json');

        refSchemas.push(refRef);
        refSchemas.push(oneOfRef);

        let propsToResolve = [
            'allOf',
            '$ref'
        ];

        let schemaData = require('../schemas/refs/base.schema.json');
        let possibleData = permutator.resolveSchemaProps(schemaData, refSchemas, propsToResolve);
        refsArray = permutator.getDeepPropLocations(possibleData, '$ref');
        allOfArray = permutator.getDeepPropLocations(possibleData, 'allOf');

        done();
    });
    it('should not find any $ref or allOf properties', function() {
        expect(refsArray).toHaveLength(0);
        expect(allOfArray).toHaveLength(0);
    });
});

describe('Get an example', function() {
    let possibleData;

    beforeAll((done) => { // done
        let refSchemas = [];

        let refRef = require('../schemas/refs/ref.schema.json');
        let oneOfRef = require('../schemas/refs/oneOfRef.schema.json');

        refSchemas.push(refRef);
        refSchemas.push(oneOfRef);

        let schemaData = require('../schemas/refs/base.schema.json');
        possibleData = permutator.getExample(schemaData, refSchemas);

        done();
    });
    it('should return a single example from the required data available', function() {
        expect(possibleData).toHaveProperty('oneOfRef');
    });
});

describe('Get an example of an array', function() {
    let possibleData;

    beforeAll((done) => { // done
        let refSchemas = [];

        let contextMenu = require('../schemas/fw/context-menu.schema.json');
        let actionTrigger = require('../schemas/fw/action-trigger.schema.json');

        refSchemas.push(contextMenu);
        refSchemas.push(actionTrigger);

        let schemaData = require('../schemas/fw/action-menu.schema.json');
        possibleData = permutator.getExample(schemaData, refSchemas);

        done();
    });
    it('should return a single example from the required data available', function() {
        expect(possibleData).toHaveProperty('menu');
        expect(possibleData.menu).toHaveProperty('items');
        expect(possibleData.menu.items).toHaveLength(1);
    });
});

describe('Get an example of nested arrays', function() {
    let possibleData;

    beforeAll((done) => { // done
        let refSchemas = [];
        let schemaData = require('../schemas/primitive/nested-array.schema.json');
        possibleData = permutator.getExample(schemaData, refSchemas);

        done();
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

    beforeAll((done) => { // done
        let refSchemas = [];
        let propsToResolve = [
            'allOf',
            '$ref'
        ];

        let schemaData = require('../schemas/fw/supplemental-navigation.schema.json');
        let resolvedSchema = permutator.resolveSchemaProps(schemaData, refSchemas, propsToResolve);
        resolvedRecursiveSchema = permutator.resolveRecursiveReferences(resolvedSchema);

        done();
    });
    it('should not throw a circular reference error', function() {
        prettyJSON(resolvedRecursiveSchema);
    });
});