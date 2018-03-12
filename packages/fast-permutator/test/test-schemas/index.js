var should = require('chai').should(),
    expect = require('chai').expect,
    permutator = require('../../src/index'),
    fs = require('fs');
refSchemas = [];

function prettyJSON(obj) {
    return JSON.stringify(obj, null, 4);
}

/**
 * Primitive types
 */

describe('Boolean primitive', function() {
    beforeEach((done) => { // done
        fs.readFile('test/schemas/primitive/boolean.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }

            schemaData = JSON.parse(data);
            possibleData = permutator(schemaData);

            done();
        });
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).to.have.lengthOf(6);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0].defaultItem).to.equal(true);
        expect(possibleData[0].enumItem).to.equal(true);
        expect(possibleData[0].optionalItem).to.equal(true);

        expect(possibleData[1].defaultItem).to.equal(false);
        expect(possibleData[1].enumItem).to.equal(true);
        expect(possibleData[1].optionalItem).to.equal(true);

        expect(possibleData[2].defaultItem).to.equal(true);
        expect(possibleData[2].enumItem).to.equal(true);
        expect(possibleData[2].optionalItem).to.equal(false);

        expect(possibleData[3].defaultItem).to.equal(false);
        expect(possibleData[3].enumItem).to.equal(true);
        expect(possibleData[3].optionalItem).to.equal(false);

        expect(possibleData[4].defaultItem).to.equal(true);
        expect(possibleData[4].enumItem).to.equal(true);
        expect(possibleData[4]).to.not.have.property('optionalItem');

        expect(possibleData[5].defaultItem).to.equal(false);
        expect(possibleData[5].enumItem).to.equal(true);
        expect(possibleData[5]).to.not.have.property('optionalItem');
    });
});

describe('String primitive', function() {
    beforeEach((done) => { // done
        fs.readFile('test/schemas/primitive/string.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator(schemaData);

            done();
        });
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).to.have.lengthOf(4);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0].defaultItem).to.be.a('string');
        expect(possibleData[0].enumItem).to.equal('hello');
        expect(possibleData[0].optionalItem).to.be.a('string');

        expect(possibleData[1].defaultItem).to.be.a('string');
        expect(possibleData[1].enumItem).to.equal('world');
        expect(possibleData[1].optionalItem).to.be.a('string');

        expect(possibleData[2].defaultItem).to.be.a('string');
        expect(possibleData[2].enumItem).to.equal('hello');
        expect(possibleData[2]).to.not.have.property('optionalItem');

        expect(possibleData[3].defaultItem).to.be.a('string');
        expect(possibleData[3].enumItem).to.equal('world');
        expect(possibleData[3]).to.not.have.property('optionalItem');
    });
});

describe('Number primitive', function() {
    beforeEach((done) => { // done
        fs.readFile('test/schemas/primitive/number.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator(schemaData);

            done();
        });
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).to.have.lengthOf(4);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0].defaultItem).to.be.a('number');
        expect(possibleData[0].enumItem).to.equal(1);
        expect(possibleData[0].optionalItem).to.be.a('number');

        expect(possibleData[1].defaultItem).to.be.a('number');
        expect(possibleData[1].enumItem).to.equal(2);
        expect(possibleData[1].optionalItem).to.be.a('number');

        expect(possibleData[2].defaultItem).to.be.a('number');
        expect(possibleData[2].enumItem).to.equal(1);
        expect(possibleData[2]).to.not.have.property('optionalItem');

        expect(possibleData[3].defaultItem).to.be.a('number');
        expect(possibleData[3].enumItem).to.equal(2);
        expect(possibleData[3]).to.not.have.property('optionalItem');
    });
});

describe('Enum primitive', function() {
    beforeEach((done) => { // done
        fs.readFile('test/schemas/primitive/enum.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator(schemaData);

            done();
        });
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).to.have.lengthOf(4);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0].enumNumberItem).to.equal(1);
        expect(possibleData[0].enumStringItem).to.equal('hello');

        expect(possibleData[1].enumNumberItem).to.equal(2);
        expect(possibleData[1].enumStringItem).to.equal('hello');

        expect(possibleData[2].enumNumberItem).to.equal(1);
        expect(possibleData[2].enumStringItem).to.equal('world');

        expect(possibleData[3].enumNumberItem).to.equal(2);
        expect(possibleData[3].enumStringItem).to.equal('world');
    });
});

describe('Not primitive', function() {
    beforeEach((done) => { // done
        fs.readFile('test/schemas/primitive/not.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator(schemaData);

            done();
        });
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).to.have.lengthOf(2);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0]).to.have.property('firstItem');
        expect(possibleData[0].firstItem).to.have.property('stringItem');
        expect(possibleData[0].firstItem).to.have.property('numberItem');
        expect(possibleData[0].firstItem).to.not.have.property('boolItem');
        
        expect(possibleData[1]).to.have.property('firstItem');
        expect(possibleData[1].firstItem).to.have.property('stringItem');
        expect(possibleData[1].firstItem).to.not.have.property('boolItem');        
    });
});

describe('Array primitive', function() {
    beforeEach((done) => { // done
        let refSchemas = [];
        let refBoolean = JSON.parse(fs.readFileSync('test/schemas/primitive/boolean.schema.json', 'utf8'));

        refSchemas.push(refBoolean);

        fs.readFile('test/schemas/primitive/array.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator(schemaData, refSchemas);

            done();
        });
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).to.have.lengthOf(1);
    });
    it('should generate correct array lengths in permutations', function() {
        expect(possibleData[0].defaultItem).to.have.lengthOf(2);
        expect(possibleData[0].minItem).to.have.lengthOf(1);
        expect(possibleData[0].maxItem).to.have.lengthOf(4);
        expect(possibleData[0].constrainedItem).to.have.length.below(5);
        expect(possibleData[0].constrainedItem).to.have.length.above(0);
    });
});

describe('Object primitive', function() {
    beforeEach((done) => { // done
        fs.readFile('test/schemas/primitive/object.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator(schemaData);

            done();
        });
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).to.have.lengthOf(10);
    });
    it('should generate correct properties and values in permutations', function() {
        // check the first two objects
        expect(possibleData[0]).to.have.property('firstItem');
        expect(possibleData[0]).to.not.have.property('secondItem');

        expect(possibleData[1]).to.have.property('firstItem');
        expect(possibleData[1]).to.have.property('secondItem');
        expect(possibleData[1].secondItem).to.have.property('secondObj');
        expect(possibleData[1].secondItem.secondObj).to.have.property('stringItem');
    });
});

describe('Definition primitive', function() {
    beforeEach((done) => { // done
        fs.readFile('test/schemas/primitive/definition.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator(schemaData);

            done();
        });
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).to.have.lengthOf(2);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0]).to.have.property('defaultItem');
        expect(possibleData[0].defaultItem).to.have.property('one');
        expect(possibleData[0].defaultItem.one).to.be.a('string');

        expect(possibleData[1]).to.have.property('defaultItem');
        expect(possibleData[1].defaultItem).to.have.property('one');
        expect(possibleData[1].defaultItem.one).to.be.a('string');
        expect(possibleData[1]).to.have.property('optionalItem');
        expect(possibleData[1].optionalItem).to.have.property('one');
        expect(possibleData[1].optionalItem).to.have.property('two');
        expect(possibleData[1].optionalItem.one).to.be.a('number');
        expect(possibleData[1].optionalItem.two).to.be.a('number');
    });
});

describe('Refs primitive', function() {
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

        fs.readFile('test/schemas/primitive/ref.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator(schemaData, refSchemas);
            possibleSchemas = permutator.simplifySchemas(schemaData, refSchemas);

            done();
        });
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).to.have.lengthOf(2);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0]).to.have.property('definitionItem');
        expect(possibleData[0].definitionItem).to.have.property('defaultItem');
        expect(possibleData[0].definitionItem).to.not.have.property('optionalItem');
        expect(possibleData[0]).to.have.property('allOfItem');
        expect(possibleData[0].allOfItem).to.have.property('numberItem');
        expect(possibleData[0].allOfItem).to.have.property('secondNumberItem');

        expect(possibleData[1]).to.have.property('definitionItem');
        expect(possibleData[1].definitionItem).to.have.property('defaultItem');
        expect(possibleData[1].definitionItem).to.have.property('optionalItem');
        expect(possibleData[1]).to.have.property('allOfItem');
        expect(possibleData[1].allOfItem).to.have.property('numberItem');
        expect(possibleData[1].allOfItem).to.have.property('secondNumberItem');
    });
});

describe('Deep reference primitive', function() {
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
            possibleData = permutator(schemaData, refSchemas);

            done();
        });
    });
    it('should the correct number of permutations', function() {
        expect(possibleData).to.have.lengthOf(2);
    });
});

describe('OneOf primitive', function() {
    beforeEach((done) => { // done
        let refSchemas = [];
        let refNumber = JSON.parse(fs.readFileSync('test/schemas/primitive/number.schema.json', 'utf8'));

        refSchemas.push(refNumber);

        fs.readFile('test/schemas/primitive/oneOf.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator(schemaData, refSchemas);

            done();
        });
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).to.have.lengthOf(3);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0]).to.have.property('booleanItem');
        expect(possibleData[1]).to.have.property('booleanItem');
        expect(possibleData[2]).to.have.property('numberItem');
    });
});

describe('AnyOf primitive', function() {
    beforeEach((done) => { // done
        let refSchemas = [];
        let refNumber = JSON.parse(fs.readFileSync('test/schemas/primitive/number.schema.json', 'utf8'));

        refSchemas.push(refNumber);

        fs.readFile('test/schemas/primitive/anyOf.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator(schemaData, refSchemas);

            done();
        });
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).to.have.lengthOf(10);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0]).to.have.property('booleanItem');

        expect(possibleData[2]).to.have.property('numberItem');

        expect(possibleData[4]).to.have.property('secondaryBooleanItem');
    });
});

describe('AllOf primitive', function() {
    beforeEach((done) => { // done
        fs.readFile('test/schemas/primitive/allOf.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator(schemaData);
            possibleSchemas = permutator.simplifySchemas(schemaData);

            done();
        });
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).to.have.lengthOf(6);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0]).to.have.property('exampleArray');

        expect(possibleData[1]).to.have.property('example');
        expect(possibleData[1].example).to.have.property('size');
        expect(possibleData[1].example).to.have.property('text');
    });
});

describe('Dependencies primitive', function() {
    beforeEach((done) => { // done
        fs.readFile('test/schemas/primitive/dependencies.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleData = permutator(schemaData);

            done();
        });
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).to.have.lengthOf(6);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0]).to.have.property('numberItem');
        expect(possibleData[0]).to.have.property('stringItem');
        expect(possibleData[0]).to.have.property('booleanItem');
        expect(possibleData[0]).to.have.property('stringItem2');

        expect(possibleData[1]).to.have.property('numberItem');
        expect(possibleData[1]).to.have.property('stringItem');
        expect(possibleData[1]).to.have.property('booleanItem');
        expect(possibleData[1]).to.have.property('stringItem2');
        
        expect(possibleData[2]).to.have.property('numberItem');
        expect(possibleData[2]).to.have.property('booleanItem');
        expect(possibleData[2]).to.have.property('stringItem2');

        expect(possibleData[3]).to.have.property('numberItem');
        expect(possibleData[3]).to.have.property('booleanItem');
        expect(possibleData[3]).to.have.property('stringItem2');

        expect(possibleData[4]).to.have.property('booleanItem');
        expect(possibleData[4]).to.have.property('stringItem2');

        expect(possibleData[5]).to.have.property('booleanItem');
        expect(possibleData[5]).to.have.property('stringItem2');
    });
});

/**
 * Fluent Web
 */
describe('FW: Hero item', function() {
    beforeEach((done) => { // done
        let refSchemas = [];
        let heading = JSON.parse(fs.readFileSync('test/schemas/fw/heading.schema.json', 'utf8'));
        let subheading = JSON.parse(fs.readFileSync('test/schemas/fw/subheading.schema.json', 'utf8'));
        let badge = JSON.parse(fs.readFileSync('test/schemas/fw/badge.schema.json', 'utf8'));
        let callToAction = JSON.parse(fs.readFileSync('test/schemas/fw/call-to-action.schema.json', 'utf8'));
        let hyperlink = JSON.parse(fs.readFileSync('test/schemas/fw/hyperlink.schema.json', 'utf8'));
        let paragraph = JSON.parse(fs.readFileSync('test/schemas/fw/paragraph.schema.json', 'utf8'));
        let image = JSON.parse(fs.readFileSync('test/schemas/fw/image.schema.json', 'utf8'));
        let mosaicPlacement = JSON.parse(fs.readFileSync('test/schemas/fw/mosaic-placement.schema.json', 'utf8'));
        let panesPlacement = JSON.parse(fs.readFileSync('test/schemas/fw/panes-placement.schema.json', 'utf8'));
        let logo = JSON.parse(fs.readFileSync('test/schemas/fw/logo.schema.json', 'utf8'));
        let price = JSON.parse(fs.readFileSync('test/schemas/fw/price.schema.json', 'utf8'));

        refSchemas.push(heading);
        refSchemas.push(subheading);
        refSchemas.push(logo);
        refSchemas.push(badge);
        refSchemas.push(callToAction);
        refSchemas.push(hyperlink);
        refSchemas.push(paragraph);
        refSchemas.push(image);
        refSchemas.push(mosaicPlacement);
        refSchemas.push(panesPlacement);
        refSchemas.push(price);

        fs.readFile('test/schemas/fw/hero-item.schema.json', 'utf8', function(err, data){
            if (err) {
                return err;
            }
            schemaData = JSON.parse(data);
            possibleSchemas = permutator.simplifySchemas(schemaData, refSchemas);

            done();
        });
    });
    it('should generate correct number of permutations', function() {
        expect(possibleSchemas).to.have.lengthOf(2);
    });
});

describe('FW: Supplemental navigation', function() {
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
            possibleData = permutator(schemaData, refSchemas);

            done();
        });
    });
    it('should resolve only the first level of props', function() {
        expect(possibleData).to.have.lengthOf(2);
    });
});