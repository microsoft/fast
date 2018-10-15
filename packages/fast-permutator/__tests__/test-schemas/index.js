import { request } from 'http';

const permutator = require('../../src/index');

function prettyJSON(obj) {
    return JSON.stringify(obj, null, 4);
}

/**
 * Primitive types
 */

describe('Boolean primitive', function() {
    let possibleData;

    beforeAll(() => { // done
        const schemaData = require('../schemas/primitive/boolean.schema.json');
        possibleData = permutator(schemaData);
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).toHaveLength(6);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0].defaultItem).toEqual(true);
        expect(possibleData[0].enumItem).toEqual(true);
        expect(possibleData[0].optionalItem).toEqual(true);

        expect(possibleData[1].defaultItem).toEqual(false);
        expect(possibleData[1].enumItem).toEqual(true);
        expect(possibleData[1].optionalItem).toEqual(true);

        expect(possibleData[2].defaultItem).toEqual(true);
        expect(possibleData[2].enumItem).toEqual(true);
        expect(possibleData[2].optionalItem).toEqual(false);

        expect(possibleData[3].defaultItem).toEqual(false);
        expect(possibleData[3].enumItem).toEqual(true);
        expect(possibleData[3].optionalItem).toEqual(false);

        expect(possibleData[4].defaultItem).toEqual(true);
        expect(possibleData[4].enumItem).toEqual(true);
        expect(possibleData[4]).not.toHaveProperty('optionalItem');

        expect(possibleData[5].defaultItem).toEqual(false);
        expect(possibleData[5].enumItem).toEqual(true);
        expect(possibleData[5]).not.toHaveProperty('optionalItem');
    });
});

describe('String primitive', function() {
    let possibleData;

    beforeAll(() => { // done
        const schemaData = require('../schemas/primitive/string.schema.json');
        possibleData = permutator(schemaData);
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).toHaveLength(4);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(typeof possibleData[0].defaultItem === 'string').toBeTruthy();
        expect(possibleData[0].enumItem).toEqual('hello');
        expect(typeof possibleData[0].optionalItem === 'string').toBeTruthy();

        expect(typeof possibleData[1].defaultItem === 'string').toBeTruthy();
        expect(possibleData[1].enumItem).toEqual('world');
        expect(typeof possibleData[1].optionalItem === 'string').toBeTruthy();

        expect(typeof possibleData[2].defaultItem === 'string').toBeTruthy();
        expect(possibleData[2].enumItem).toEqual('hello');
        expect(possibleData[2]).not.toHaveProperty('optionalItem');

        expect(typeof possibleData[3].defaultItem === 'string').toBeTruthy();
        expect(possibleData[3].enumItem).toEqual('world');
        expect(possibleData[3]).not.toHaveProperty('optionalItem');
    });
});

describe('Number primitive', function() {
    let possibleData;

    beforeAll(() => { // done
        const schemaData = require('../schemas/primitive/number.schema.json');
        possibleData = permutator(schemaData);
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).toHaveLength(4);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(typeof possibleData[0].defaultItem == 'number').toBeTruthy();
        expect(possibleData[0].enumItem).toEqual(1);
        expect(typeof possibleData[0].optionalItem == 'number').toBeTruthy();

        expect(typeof possibleData[1].defaultItem == 'number').toBeTruthy();
        expect(possibleData[1].enumItem).toEqual(2);
        expect(typeof possibleData[1].optionalItem == 'number').toBeTruthy();

        expect(typeof possibleData[2].defaultItem == 'number').toBeTruthy();
        expect(possibleData[2].enumItem).toEqual(1);
        expect(possibleData[2]).not.toHaveProperty('optionalItem');

        expect(typeof possibleData[3].defaultItem == 'number').toBeTruthy();
        expect(possibleData[3].enumItem).toEqual(2);
        expect(possibleData[3]).not.toHaveProperty('optionalItem');
    });
});

describe('Enum primitive', function() {
    let possibleData;

    beforeAll(() => { // done
        const schemaData = require('../schemas/primitive/enum.schema.json');
        possibleData = permutator(schemaData);
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).toHaveLength(4);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0].enumNumberItem).toEqual(1);
        expect(possibleData[0].enumStringItem).toEqual('hello');

        expect(possibleData[1].enumNumberItem).toEqual(2);
        expect(possibleData[1].enumStringItem).toEqual('hello');

        expect(possibleData[2].enumNumberItem).toEqual(1);
        expect(possibleData[2].enumStringItem).toEqual('world');

        expect(possibleData[3].enumNumberItem).toEqual(2);
        expect(possibleData[3].enumStringItem).toEqual('world');
    });
});

describe('Not primitive', function() {
    let possibleData;

    beforeAll(() => { // done
        const schemaData = require('../schemas/primitive/not.schema.json');
        possibleData = permutator(schemaData);
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).toHaveLength(2);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0]).toHaveProperty('firstItem');
        expect(possibleData[0].firstItem).toHaveProperty('stringItem');
        expect(possibleData[0].firstItem).toHaveProperty('numberItem');
        expect(possibleData[0].firstItem).not.toHaveProperty('boolItem');
        
        expect(possibleData[1]).toHaveProperty('firstItem');
        expect(possibleData[1].firstItem).toHaveProperty('stringItem');
        expect(possibleData[1].firstItem).not.toHaveProperty('boolItem');        
    });
});

describe('Array primitive', function() {
    let possibleData;

    beforeAll(() => { // done
        let refSchemas = [];
        const refBoolean = require('../schemas/primitive/boolean.schema.json');

        refSchemas.push(refBoolean);

        const schemaData = require('../schemas/primitive/array.schema.json');
        possibleData = permutator(schemaData, refSchemas);
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).toHaveLength(1);
    });
    it('should generate correct array lengths in permutations', function() {
        expect(possibleData[0].defaultItem).toHaveLength(2);
        expect(possibleData[0].minItem).toHaveLength(1);
        expect(possibleData[0].maxItem).toHaveLength(4);
        expect(possibleData[0].constrainedItem).not.toHaveLength(5);
        expect(possibleData[0].constrainedItem).not.toHaveLength(0);
    });
});

describe('Object primitive', function() {
    let possibleData;

    beforeAll(() => { // done
        const schemaData = require('../schemas/primitive/object.schema.json');
        possibleData = permutator(schemaData);
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).toHaveLength(10);
    });
    it('should generate correct properties and values in permutations', function() {
        // check the first two objects
        expect(possibleData[0]).toHaveProperty('firstItem');
        expect(possibleData[0]).not.toHaveProperty('secondItem');

        expect(possibleData[1]).toHaveProperty('firstItem');
        expect(possibleData[1]).toHaveProperty('secondItem');
        expect(possibleData[1].secondItem).toHaveProperty('secondObj');
        expect(possibleData[1].secondItem.secondObj).toHaveProperty('stringItem');
    });
});

describe('Definition primitive', function() {
    let possibleData;

    beforeAll(() => { // done
        const schemaData = require('../schemas/primitive/definition.schema.json');
        possibleData = permutator(schemaData);
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).toHaveLength(2);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0]).toHaveProperty('defaultItem');
        expect(possibleData[0].defaultItem).toHaveProperty('one');
        expect(typeof possibleData[0].defaultItem.one === 'string').toBeTruthy();

        expect(possibleData[1]).toHaveProperty('defaultItem');
        expect(possibleData[1].defaultItem).toHaveProperty('one');
        expect(typeof possibleData[1].defaultItem.one === 'string').toBeTruthy();
        expect(possibleData[1]).toHaveProperty('optionalItem');
        expect(possibleData[1].optionalItem).toHaveProperty('one');
        expect(possibleData[1].optionalItem).toHaveProperty('two');
        expect(typeof possibleData[1].optionalItem.one == 'number').toBeTruthy();
        expect(typeof possibleData[1].optionalItem.two == 'number').toBeTruthy();
    });
});

describe('Refs primitive', function() {
    let possibleData;

    beforeAll(() => { // done
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
        
        const schemaData = require('../schemas/primitive/ref.schema.json');
        possibleData = permutator(schemaData, refSchemas);
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).toHaveLength(2);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0]).toHaveProperty('definitionItem');
        expect(possibleData[0].definitionItem).toHaveProperty('defaultItem');
        expect(possibleData[0].definitionItem).not.toHaveProperty('optionalItem');
        expect(possibleData[0]).toHaveProperty('allOfItem');
        expect(possibleData[0].allOfItem).toHaveProperty('numberItem');
        expect(possibleData[0].allOfItem).toHaveProperty('secondNumberItem');

        expect(possibleData[1]).toHaveProperty('definitionItem');
        expect(possibleData[1].definitionItem).toHaveProperty('defaultItem');
        expect(possibleData[1].definitionItem).toHaveProperty('optionalItem');
        expect(possibleData[1]).toHaveProperty('allOfItem');
        expect(possibleData[1].allOfItem).toHaveProperty('numberItem');
        expect(possibleData[1].allOfItem).toHaveProperty('secondNumberItem');
    });
});

describe('Deep reference primitive', function() {
    let possibleData;

    beforeAll(() => { // done
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
        possibleData = permutator(schemaData, refSchemas);
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).toHaveLength(2);
    });
});

describe('OneOf primitive', function() {
    let possibleData;

    beforeAll(() => { // done
        let refSchemas = [];
        const refNumber = require('../schemas/primitive/number.schema.json');

        refSchemas.push(refNumber);

        const schemaData = require('../schemas/primitive/oneOf.schema.json');
        possibleData = permutator(schemaData, refSchemas);
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).toHaveLength(3);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0]).toHaveProperty('booleanItem');
        expect(possibleData[1]).toHaveProperty('booleanItem');
        expect(possibleData[2]).toHaveProperty('numberItem');
    });
});

describe('AnyOf primitive', function() {
    let possibleData;

    beforeAll(() => { // done
        let refSchemas = [];
        const refNumber = require('../schemas/primitive/number.schema.json');

        refSchemas.push(refNumber);

        const schemaData = require('../schemas/primitive/anyOf.schema.json');
        possibleData = permutator(schemaData, refSchemas);
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).toHaveLength(10);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0]).toHaveProperty('booleanItem');

        expect(possibleData[2]).toHaveProperty('numberItem');

        expect(possibleData[4]).toHaveProperty('secondaryBooleanItem');
    });
});

describe('AllOf primitive', function() {
    let possibleData;

    beforeAll(() => { // done
        const schemaData = require('../schemas/primitive/allOf.schema.json');
        possibleData = permutator(schemaData);
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).toHaveLength(6);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0]).toHaveProperty('exampleArray');

        expect(possibleData[1]).toHaveProperty('example');
        expect(possibleData[1].example).toHaveProperty('size');
        expect(possibleData[1].example).toHaveProperty('text');
    });
});

describe('Dependencies primitive', function() {
    let possibleData;

    beforeAll(() => { // done
        const schemaData = require('../schemas/primitive/dependencies.schema.json');
        possibleData = permutator(schemaData);
    });
    it('should generate correct number of permutations', function() {
        expect(possibleData).toHaveLength(6);
    });
    it('should generate correct properties and values in permutations', function() {
        expect(possibleData[0]).toHaveProperty('numberItem');
        expect(possibleData[0]).toHaveProperty('stringItem');
        expect(possibleData[0]).toHaveProperty('booleanItem');
        expect(possibleData[0]).toHaveProperty('stringItem2');

        expect(possibleData[1]).toHaveProperty('numberItem');
        expect(possibleData[1]).toHaveProperty('stringItem');
        expect(possibleData[1]).toHaveProperty('booleanItem');
        expect(possibleData[1]).toHaveProperty('stringItem2');
        
        expect(possibleData[2]).toHaveProperty('numberItem');
        expect(possibleData[2]).toHaveProperty('booleanItem');
        expect(possibleData[2]).toHaveProperty('stringItem2');

        expect(possibleData[3]).toHaveProperty('numberItem');
        expect(possibleData[3]).toHaveProperty('booleanItem');
        expect(possibleData[3]).toHaveProperty('stringItem2');

        expect(possibleData[4]).toHaveProperty('booleanItem');
        expect(possibleData[4]).toHaveProperty('stringItem2');

        expect(possibleData[5]).toHaveProperty('booleanItem');
        expect(possibleData[5]).toHaveProperty('stringItem2');
    });
});

describe('FW: Hero item', function() {
    let possibleSchemas;

    beforeAll(() => { // done
        let refSchemas = [];
        const heading = require('../schemas/fw/heading.schema.json');
        const subheading = require('../schemas/fw/subheading.schema.json');
        const badge = require('../schemas/fw/badge.schema.json');
        const callToAction = require('../schemas/fw/call-to-action.schema.json');
        const hyperlink = require('../schemas/fw/hyperlink.schema.json');
        const paragraph = require('../schemas/fw/paragraph.schema.json');
        const image = require('../schemas/fw/image.schema.json');
        const mosaicPlacement = require('../schemas/fw/mosaic-placement.schema.json');
        const panesPlacement = require('../schemas/fw/panes-placement.schema.json');
        const logo = require('../schemas/fw/logo.schema.json');
        const price = require('../schemas/fw/price.schema.json');

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

        const schemaData = require('../schemas/fw/hero-item.schema.json');
        possibleSchemas = permutator.simplifySchemas(schemaData, refSchemas);
    });
    it('should generate correct number of permutations', function() {
        expect(possibleSchemas).toHaveLength(2);
    });
});

describe('FW: Supplemental navigation', function() {
    let possibleData;

    beforeAll(() => { // done
        let refSchemas = [];
        const propsToResolve = [
            'allOf',
            '$ref'
        ];

        const schemaData = require('../schemas/fw/supplemental-navigation.schema.json');
        possibleData = permutator(schemaData, refSchemas);
    });
    it('should resolve only the first level of props', function() {
        expect(possibleData).toHaveLength(2);
    });
});