var should = require('chai').should(),
    expect = require('chai').expect,
    get = require('lodash').get,
    permutator = require('../../src/index'),
    fs = require('fs'),
    refSchemas = [];

function prettyJSON(obj) {
    return JSON.stringify(obj, null, 2);
}

/**
 * Exported method for getting shallow refs
 */

describe('Reference IDs', function() {
    beforeEach((done) => { // done
        fs.readFile('test/schemas/primitive/ref.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);

            let refLocations = permutator.getDeepPropLocations(schemaData, '$ref');
            possibleRefs = [];
            
            for (let refLocation of refLocations) {
                possibleRefs.push(get(schemaData, `${refLocation}['$ref']`));
            }

            done();
        });
    });
    it('should the correct number schema IDs', function() {
        expect(possibleRefs).to.have.lengthOf(2);
    });
    it('should return the correct schema IDs', function() {
        expect(possibleRefs[0]).to.equal('/primitives/definition');
        expect(possibleRefs[1]).to.equal('/primitives/oneOf#/definitions/numberObj');
    })
});

/**
 * Exported method for getting deep refs
 */

describe('Deep reference IDs', function() {
    beforeEach((done) => { // done
        let refSchemas = [];

        let refRef = JSON.parse(fs.readFileSync('test/schemas/primitive/ref.schema.json', 'utf8'));
        let refDefinition = JSON.parse(fs.readFileSync('test/schemas/primitive/definition.schema.json', 'utf8'));
        let refBoolean = JSON.parse(fs.readFileSync('test/schemas/primitive/boolean.schema.json', 'utf8'));
        let refString = JSON.parse(fs.readFileSync('test/schemas/primitive/string.schema.json', 'utf8'));
        let refNumber = JSON.parse(fs.readFileSync('test/schemas/primitive/number.schema.json', 'utf8'));
        let refOneOf = JSON.parse(fs.readFileSync('test/schemas/primitive/oneOf.schema.json', 'utf8'));

        refSchemas.push(refRef);
        refSchemas.push(refDefinition);
        refSchemas.push(refBoolean);
        refSchemas.push(refString);
        refSchemas.push(refNumber);
        refSchemas.push(refOneOf);

        fs.readFile('test/schemas/primitive/deepRef.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            
            let refLocations = permutator.getDeepPropLocations(schemaData, '$ref');
            possibleRefs = [];
            
            for (let refLocation of refLocations) {
                possibleRefs.push(get(schemaData, `${refLocation}['$ref']`));
            }

            done();
        });
    });
    it('should the correct number schema IDs', function() {
        expect(possibleRefs).to.have.lengthOf(5);
    });
});

/**
 * Exported method for getting locations to properties
 */

describe('Locations of properties', function() {
    beforeEach((done) => { // done
        let refSchemas = [];

        let refRef = JSON.parse(fs.readFileSync('test/schemas/primitive/ref.schema.json', 'utf8'));
        let refDefinition = JSON.parse(fs.readFileSync('test/schemas/primitive/definition.schema.json', 'utf8'));
        let refBoolean = JSON.parse(fs.readFileSync('test/schemas/primitive/boolean.schema.json', 'utf8'));
        let refString = JSON.parse(fs.readFileSync('test/schemas/primitive/string.schema.json', 'utf8'));
        let refNumber = JSON.parse(fs.readFileSync('test/schemas/primitive/number.schema.json', 'utf8'));
        let refOneOf = JSON.parse(fs.readFileSync('test/schemas/primitive/oneOf.schema.json', 'utf8'));

        refSchemas.push(refRef);
        refSchemas.push(refDefinition);
        refSchemas.push(refBoolean);
        refSchemas.push(refString);
        refSchemas.push(refNumber);
        refSchemas.push(refOneOf);

        fs.readFile('test/schemas/primitive/deepRef.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleRefs = permutator.getDeepPropLocations(schemaData, '$ref');
            possibleAllOf = permutator.getDeepPropLocations(schemaData, 'allOf');
            possibleRequired = permutator.getDeepPropLocations(schemaData, 'required');

            done();
        });
    });
    it('should the correct number of locations', function() {
        expect(possibleRefs).to.have.lengthOf(5);
        expect(possibleAllOf).to.have.lengthOf(2);
        expect(possibleRequired).to.have.lengthOf(2);
    });
});

describe('Reference resolver', function() {
    beforeEach((done) => { // done
        let refSchemas = [];

        let refRef = JSON.parse(fs.readFileSync('test/schemas/refs/ref.schema.json', 'utf8'));
        let oneOfRef = JSON.parse(fs.readFileSync('test/schemas/refs/oneOfRef.schema.json', 'utf8'));
        
        refSchemas.push(refRef);
        refSchemas.push(oneOfRef);

        fs.readFile('test/schemas/refs/base.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleSchema = permutator.resolveReferences(schemaData, refSchemas);

            done();
        });
    });
    it('should generate correct number of references', function() {
        let refs = permutator.getDeepPropLocations(possibleSchema, '$ref');

        expect(refs).to.have.lengthOf(0);
    });
});

describe('Schema permutator', function() {
    beforeEach((done) => { // done
        let refSchemas = [];

        let refDefinition = JSON.parse(fs.readFileSync('test/schemas/primitive/definition.schema.json', 'utf8'));
        let refBoolean = JSON.parse(fs.readFileSync('test/schemas/primitive/boolean.schema.json', 'utf8'));
        let refString = JSON.parse(fs.readFileSync('test/schemas/primitive/string.schema.json', 'utf8'));
        let refNumber = JSON.parse(fs.readFileSync('test/schemas/primitive/number.schema.json', 'utf8'));
        let refOneOf = JSON.parse(fs.readFileSync('test/schemas/primitive/oneOf.schema.json', 'utf8'));

        refSchemas.push(refDefinition);
        refSchemas.push(refBoolean);
        refSchemas.push(refString);
        refSchemas.push(refNumber);
        refSchemas.push(refOneOf);

        fs.readFile('test/schemas/primitive/oneOf.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator.simplifySchemas(schemaData, refSchemas);

            done();
        });
    });
    it('should generate correct number of schemas', function() {
        expect(possibleData).to.have.lengthOf(2);
    });
});

describe('Property resolver', function() {
    beforeEach((done) => { // done
        let refSchemas = [];

        let refRef = JSON.parse(fs.readFileSync('test/schemas/refs/ref.schema.json', 'utf8'));
        let oneOfRef = JSON.parse(fs.readFileSync('test/schemas/refs/oneOfRef.schema.json', 'utf8'));

        refSchemas.push(refRef);
        refSchemas.push(oneOfRef);

        let propsToResolve = [
            'allOf',
            '$ref'
        ];

        fs.readFile('test/schemas/refs/base.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator.resolveSchemaProps(schemaData, refSchemas, propsToResolve);
            refsArray = permutator.getDeepPropLocations(possibleData, '$ref');
            allOfArray = permutator.getDeepPropLocations(possibleData, 'allOf');

            done();
        });
    });
    it('should not find any $ref or allOf properties', function() {
        expect(refsArray).to.have.lengthOf(0);
        expect(allOfArray).to.have.lengthOf(0);
    });
});

describe('Get an example', function() {
    beforeEach((done) => { // done
        let refSchemas = [];

        let refRef = JSON.parse(fs.readFileSync('test/schemas/refs/ref.schema.json', 'utf8'));
        let oneOfRef = JSON.parse(fs.readFileSync('test/schemas/refs/oneOfRef.schema.json', 'utf8'));

        refSchemas.push(refRef);
        refSchemas.push(oneOfRef);

        fs.readFile('test/schemas/refs/base.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator.getExample(schemaData, refSchemas);

            done();
        });
    });
    it('should return a single example from the required data available', function() {
        expect(possibleData).to.not.have.property('oneOfRef');
    });
});

describe('Get an example of an array', function() {
    beforeEach((done) => { // done
        let refSchemas = [];

        let contextMenu = JSON.parse(fs.readFileSync('test/schemas/fw/context-menu.schema.json', 'utf8'));
        let actionTrigger = JSON.parse(fs.readFileSync('test/schemas/fw/action-trigger.schema.json', 'utf8'));

        refSchemas.push(contextMenu);
        refSchemas.push(actionTrigger);

        fs.readFile('test/schemas/fw/action-menu.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator.getExample(schemaData, refSchemas);

            done();
        });
    });
    it('should return a single example from the required data available', function() {
        expect(possibleData).to.have.property('menu');
        expect(possibleData.menu).to.have.property('items');
        expect(possibleData.menu.items).to.have.lengthOf(1);
    });
});

describe('Get an example of nested arrays', function() {
    beforeEach((done) => { // done
        let refSchemas = [];

        fs.readFile('test/schemas/primitive/nested-array.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator.getExample(schemaData, refSchemas);

            done();
        });
    });
    it('should return a single example from the required data available', function() {
        expect(possibleData).to.have.property('defaultObj');
        expect(possibleData.defaultObj).to.have.property('defaultArray');
        expect(possibleData.defaultObj.defaultArray).to.have.lengthOf(2);
        expect(possibleData.defaultObj.defaultArray[0]).to.have.property('requiredString');
        expect(possibleData.defaultObj.defaultArray[0].requiredString).to.equal('hello');
    });
});

describe('Resolve a recursive reference', function() {
    beforeEach((done) => { // done
        let refSchemas = [];
        let propsToResolve = [
            'allOf',
            '$ref'
        ];

        fs.readFile('test/schemas/fw/supplemental-navigation.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            resolvedSchema = permutator.resolveSchemaProps(schemaData, refSchemas, propsToResolve);
            resolvedRecursiveSchema = permutator.resolveRecursiveReferences(resolvedSchema);

            done();
        });
    });
    it('should not throw a circular reference error', function() {
        prettyJSON(resolvedRecursiveSchema);
    });
});