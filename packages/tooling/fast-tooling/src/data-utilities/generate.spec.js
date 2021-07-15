import { expect } from "chai";
import { getDataFromSchema } from "./generate";
/**
 * Gets an example from a schema
 */
describe("getDataFromSchema", () => {
    it("should return a default even if no type has been specified", () => {
        const schema = {
            default: "foo",
        };
        expect(getDataFromSchema(schema)).to.equal("foo");
    });
    it("should return the first example from the examples array", () => {
        const schema = {
            examples: ["bar", "bat"],
        };
        expect(getDataFromSchema(schema)).to.equal("bar");
    });
    it("should not return an example if a default is available", () => {
        const schema = {
            default: "foo",
            examples: ["bar", "bat"],
        };
        expect(getDataFromSchema(schema)).to.equal("foo");
    });
    it("should return an enum value", () => {
        const schema = {
            enum: ["foo", "bar"],
        };
        expect(getDataFromSchema(schema)).to.equal("foo");
    });
    it("should return a const value", () => {
        const schema = {
            const: "foo",
        };
        expect(getDataFromSchema(schema)).to.equal("foo");
    });
    it("should return a string", () => {
        const schema = {
            type: "string",
        };
        expect(typeof getDataFromSchema(schema)).to.equal("string");
        const schemaWithDefault = {
            type: "string",
            default: "foo",
        };
        expect(typeof getDataFromSchema(schemaWithDefault)).to.equal("string");
        expect(getDataFromSchema(schemaWithDefault)).to.equal("foo");
    });
    it("should return a boolean", () => {
        const schema = {
            type: "boolean",
        };
        expect(typeof getDataFromSchema(schema)).to.equal("boolean");
        const schemaWithDefault = {
            type: "boolean",
            default: false,
        };
        expect(typeof getDataFromSchema(schemaWithDefault)).to.equal("boolean");
        expect(getDataFromSchema(schemaWithDefault)).to.equal(false);
    });
    it("should return a number", () => {
        const schema = {
            type: "number",
        };
        expect(typeof getDataFromSchema(schema)).to.equal("number");
        const schemaWithDefault = {
            type: "number",
            default: 1,
        };
        expect(typeof getDataFromSchema(schemaWithDefault)).to.equal("number");
        expect(getDataFromSchema(schemaWithDefault)).to.equal(1);
    });
    it("should return null", () => {
        const schema = {
            type: "null",
        };
        expect(getDataFromSchema(schema)).to.equal(null);
    });
    it("should return an enum specified value", () => {
        const schema = {
            enum: ["foo", "bar", "bat"],
        };
        expect(getDataFromSchema(schema)).to.equal("foo");
    });
    it("should return default even if enums are specified", () => {
        const schema = {
            enum: ["foo", "bar", "bat"],
            default: "bat",
        };
        expect(getDataFromSchema(schema)).to.equal("bat");
    });
    it("should return an array", () => {
        const schema = {
            type: "array",
            items: {
                type: "string",
            },
        };
        const exampleData = getDataFromSchema(schema);
        expect(Array.isArray(exampleData)).to.equal(true);
        expect(exampleData).not.to.have.length(0);
    });
    it("should return an array with minItems", () => {
        const schema = {
            type: "array",
            items: {
                type: "string",
            },
            minItems: 4,
        };
        const exampleData = getDataFromSchema(schema);
        expect(Array.isArray(exampleData)).to.equal(true);
        expect(exampleData).to.have.length(4);
    });
    it("should return an empty object", () => {
        const schemaWithObjectTypeAndProperties = {
            type: "object",
            properties: {},
        };
        const schemaWithObjectTypeAndPropertiesExampleData = getDataFromSchema(
            schemaWithObjectTypeAndProperties
        );
        expect(schemaWithObjectTypeAndPropertiesExampleData).to.deep.equal({});
        const schemaWithObjectType = {
            type: "object",
        };
        const schemaWithObjectTypeExampleData = getDataFromSchema(schemaWithObjectType);
        expect(schemaWithObjectTypeExampleData).to.deep.equal({});
        const schemaWithProperties = {
            properties: {},
        };
        const schemaWithPropertiesExampleData = getDataFromSchema(schemaWithProperties);
        expect(schemaWithPropertiesExampleData).to.deep.equal({});
        const schemaWithOptionalProperties = {
            properties: {
                bool: {
                    type: "boolean",
                },
            },
        };
        const schemaWithOptionalPropertiesExampleData = getDataFromSchema(
            schemaWithOptionalProperties
        );
        expect(schemaWithOptionalPropertiesExampleData).to.deep.equal({});
    });
    it("should return an object with required properties", () => {
        const schemaWithEmptyRequiredProperties = {
            properties: {
                bool: {
                    type: "boolean",
                },
            },
            required: [],
        };
        const schemaWithEmptyRequiredPropertiesExampleData = getDataFromSchema(
            schemaWithEmptyRequiredProperties
        );
        expect(schemaWithEmptyRequiredPropertiesExampleData).to.deep.equal({});
        const schemaWithRequiredProperties = {
            properties: {
                bool: {
                    type: "boolean",
                },
            },
            required: ["bool"],
        };
        const schemaWithRequiredPropertiesExampleData = getDataFromSchema(
            schemaWithRequiredProperties
        );
        expect(schemaWithRequiredPropertiesExampleData).to.deep.equal({ bool: true });
        const schemaWithRequiredAndOptionalProperties = {
            properties: {
                bool: {
                    type: "boolean",
                },
                string: {
                    type: "string",
                },
            },
            required: ["bool"],
        };
        const schemaWithRequiredAndOptionalPropertiesExampleData = getDataFromSchema(
            schemaWithRequiredAndOptionalProperties
        );
        expect(schemaWithRequiredAndOptionalPropertiesExampleData).to.deep.equal({
            bool: true,
        });
    });
    it("should return a nested object", () => {
        const schemaWithNestedObject = {
            type: "object",
            properties: {
                object: {
                    type: "object",
                    properties: {},
                },
            },
            required: ["object"],
        };
        const schemaWithNestedObjectExampleData = getDataFromSchema(
            schemaWithNestedObject
        );
        expect(schemaWithNestedObjectExampleData).to.deep.equal({ object: {} });
    });
    it("should return a nested object with other required types", () => {
        const schemaWithNestedObjectAndOtherProperties = {
            type: "object",
            properties: {
                object: {
                    type: "object",
                    properties: {
                        string: {
                            type: "string",
                        },
                    },
                    required: ["string"],
                },
                bool: {
                    type: "boolean",
                },
            },
            required: ["object", "bool"],
        };
        const schemaWithNestedObjectAndOtherPropertiesExampleData = getDataFromSchema(
            schemaWithNestedObjectAndOtherProperties
        );
        expect(schemaWithNestedObjectAndOtherPropertiesExampleData).to.deep.equal({
            object: { string: "example text" },
            bool: true,
        });
    });
    it("should return data corresponding to an anyOf", () => {
        const schemaWithAnyOf = {
            anyOf: [
                {
                    type: "string",
                    default: "bar",
                },
                {
                    type: "string",
                    default: "foo",
                },
            ],
        };
        expect(getDataFromSchema(schemaWithAnyOf)).to.equal("bar");
    });
    it("should return data corresponding to a oneOf", () => {
        const schemaWithOneOf = {
            oneOf: [
                {
                    type: "string",
                    default: "foo",
                },
                {
                    type: "string",
                    default: "bar",
                },
            ],
        };
        expect(getDataFromSchema(schemaWithOneOf)).to.equal("foo");
    });
    it("should return data when the schema contains nested oneOfs", () => {
        const schemaWithNestedOneOfs = {
            type: "object",
            properties: {
                foo: {
                    oneOf: [
                        {
                            type: "string",
                        },
                        {
                            type: "boolean",
                        },
                    ],
                },
                bar: {
                    type: "boolean",
                },
            },
            required: ["foo", "bar"],
        };
        expect(getDataFromSchema(schemaWithNestedOneOfs)).to.deep.equal({
            foo: "example text",
            bar: true,
        });
    });
});
