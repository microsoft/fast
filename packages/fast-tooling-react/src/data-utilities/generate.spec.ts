import "jest";
import { getDataFromSchema } from "./generate";
import { ChildOptionItem } from ".";

/**
 * Gets an example from a schema
 */
describe("getDataFromSchema", () => {
    test("should return a default even if no type has been specified", () => {
        const schema: any = {
            default: "foo",
        };

        expect(getDataFromSchema(schema)).toEqual("foo");
    });
    test("should return the first example from the examples array", () => {
        const schema: any = {
            examples: ["bar", "bat"],
        };

        expect(getDataFromSchema(schema)).toEqual("bar");
    });
    test("should not return an example if a default is available", () => {
        const schema: any = {
            default: "foo",
            examples: ["bar", "bat"],
        };

        expect(getDataFromSchema(schema)).toEqual("foo");
    });
    test("should return an enum value", () => {
        const schema: any = {
            enum: ["foo", "bar"],
        };

        expect(getDataFromSchema(schema)).toEqual("foo");
    });
    test("should return a string", () => {
        const schema: any = {
            type: "string",
        };

        expect(typeof getDataFromSchema(schema)).toBe("string");

        const schemaWithDefault: any = {
            type: "string",
            default: "foo",
        };

        expect(typeof getDataFromSchema(schemaWithDefault)).toBe("string");
        expect(getDataFromSchema(schemaWithDefault)).toEqual("foo");
    });
    test("should return a boolean", () => {
        const schema: any = {
            type: "boolean",
        };

        expect(typeof getDataFromSchema(schema)).toBe("boolean");

        const schemaWithDefault: any = {
            type: "boolean",
            default: false,
        };

        expect(typeof getDataFromSchema(schemaWithDefault)).toBe("boolean");
        expect(getDataFromSchema(schemaWithDefault)).toEqual(false);
    });
    test("should return a number", () => {
        const schema: any = {
            type: "number",
        };

        expect(typeof getDataFromSchema(schema)).toBe("number");

        const schemaWithDefault: any = {
            type: "number",
            default: 1,
        };

        expect(typeof getDataFromSchema(schemaWithDefault)).toBe("number");
        expect(getDataFromSchema(schemaWithDefault)).toEqual(1);
    });
    test("should return null", () => {
        const schema: any = {
            type: "null",
        };

        expect(getDataFromSchema(schema)).toBe(null);
    });
    test("should return an enum specified value", () => {
        const schema: any = {
            enum: ["foo", "bar", "bat"],
        };

        expect(getDataFromSchema(schema)).toBe("foo");
    });
    test("should return default even if enums are specified", () => {
        const schema: any = {
            enum: ["foo", "bar", "bat"],
            default: "bat",
        };

        expect(getDataFromSchema(schema)).toBe("bat");
    });
    test("should return an array", () => {
        const schema: any = {
            type: "array",
            items: {
                type: "string",
            },
        };

        const exampleData: any = getDataFromSchema(schema);

        expect(Array.isArray(exampleData)).toBe(true);
        expect(exampleData).not.toHaveLength(0);
    });
    test("should return an array with minItems", () => {
        const schema: any = {
            type: "array",
            items: {
                type: "string",
            },
            minItems: 4,
        };

        const exampleData: any = getDataFromSchema(schema);

        expect(Array.isArray(exampleData)).toBe(true);
        expect(exampleData).toHaveLength(4);
    });
    test("should return an empty object", () => {
        const schemaWithObjectTypeAndProperties: any = {
            type: "object",
            properties: {},
        };

        const schemaWithObjectTypeAndPropertiesExampleData: any = getDataFromSchema(
            schemaWithObjectTypeAndProperties
        );

        expect(schemaWithObjectTypeAndPropertiesExampleData).toEqual({});

        const schemaWithObjectType: any = {
            type: "object",
        };

        const schemaWithObjectTypeExampleData: any = getDataFromSchema(
            schemaWithObjectType
        );

        expect(schemaWithObjectTypeExampleData).toEqual({});

        const schemaWithProperties: any = {
            properties: {},
        };

        const schemaWithPropertiesExampleData: any = getDataFromSchema(
            schemaWithProperties
        );

        expect(schemaWithPropertiesExampleData).toEqual({});

        const schemaWithOptionalProperties: any = {
            properties: {
                bool: {
                    type: "boolean",
                },
            },
        };

        const schemaWithOptionalPropertiesExampleData: any = getDataFromSchema(
            schemaWithOptionalProperties
        );

        expect(schemaWithOptionalPropertiesExampleData).toEqual({});
    });
    test("should return an object with required properties", () => {
        const schemaWithEmptyRequiredProperties: any = {
            properties: {
                bool: {
                    type: "boolean",
                },
            },
            required: [],
        };

        const schemaWithEmptyRequiredPropertiesExampleData: any = getDataFromSchema(
            schemaWithEmptyRequiredProperties
        );

        expect(schemaWithEmptyRequiredPropertiesExampleData).toEqual({});

        const schemaWithRequiredProperties: any = {
            properties: {
                bool: {
                    type: "boolean",
                },
            },
            required: ["bool"],
        };

        const schemaWithRequiredPropertiesExampleData: any = getDataFromSchema(
            schemaWithRequiredProperties
        );

        expect(schemaWithRequiredPropertiesExampleData).toEqual({ bool: true });

        const schemaWithRequiredAndOptionalProperties: any = {
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

        const schemaWithRequiredAndOptionalPropertiesExampleData: any = getDataFromSchema(
            schemaWithRequiredAndOptionalProperties
        );

        expect(schemaWithRequiredAndOptionalPropertiesExampleData).toEqual({
            bool: true,
        });
    });
    test("should return a nested object", () => {
        const schemaWithNestedObject: any = {
            type: "object",
            properties: {
                object: {
                    type: "object",
                    properties: {},
                },
            },
            required: ["object"],
        };

        const schemaWithNestedObjectExampleData: any = getDataFromSchema(
            schemaWithNestedObject
        );

        expect(schemaWithNestedObjectExampleData).toEqual({ object: {} });
    });
    test("should return a nested object with other required types", () => {
        const schemaWithNestedObjectAndOtherProperties: any = {
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

        const schemaWithNestedObjectAndOtherPropertiesExampleData: any = getDataFromSchema(
            schemaWithNestedObjectAndOtherProperties
        );

        expect(schemaWithNestedObjectAndOtherPropertiesExampleData).toEqual({
            object: { string: "example text" },
            bool: true,
        });
    });
    test("should return data corresponding to an anyOf", () => {
        const schemaWithAnyOf: any = {
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

        expect(getDataFromSchema(schemaWithAnyOf)).toEqual("bar");
    });
    test("should return data corresponding to a oneOf", () => {
        const schemaWithOneOf: any = {
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

        expect(getDataFromSchema(schemaWithOneOf)).toEqual("foo");
    });
    test("should return the default as a react child", () => {
        const schemaWithChildren: any = {
            type: "object",
            reactProperties: {
                foo: {
                    type: "children",
                    default: "Hello world",
                },
            },
            required: ["foo"],
        };

        expect(getDataFromSchema(schemaWithChildren)).toEqual({ foo: "Hello world" });
    });
    test("should return a string as a react child", () => {
        const schemaWithChildren: any = {
            type: "object",
            reactProperties: {
                foo: {
                    type: "children",
                    defaults: ["text"],
                },
            },
            required: ["foo"],
        };

        expect(getDataFromSchema(schemaWithChildren)).toEqual({ foo: "example text" });
    });
    test("should return data that corresponds to the established react children data syntax", () => {
        const childOptions: ChildOptionItem[] = [
            {
                schema: {
                    id: "bar",
                    properties: {
                        text: {
                            type: "string",
                            default: "Hello world",
                        },
                    },
                    required: ["text"],
                },
                component: null,
            },
        ];
        const schemaWithChildren: any = {
            type: "object",
            reactProperties: {
                foo: {
                    type: "children",
                    ids: ["bar"],
                },
            },
            required: ["foo"],
        };

        expect(getDataFromSchema(schemaWithChildren, childOptions)).toEqual({
            foo: { id: "bar", props: { text: "Hello world" } },
        });
    });
});
