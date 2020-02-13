import "jest";
import {
    getErrorFromDataLocation,
    getInitialOneOfAnyOfState,
    getSchemaByDataLocation,
} from "./form";

import mergedOneOfSchema from "../../__tests__/schemas/merged-one-of.schema.json";
import childrenSchema from "../../__tests__/schemas/children.schema.json";
import textFieldSchema from "../../__tests__/schemas/textarea.schema.json";
import { InitialOneOfAnyOfState } from "../controls/control.section.props";
import { CombiningKeyword } from "../../data-utilities/types";
import ajv, { ValidationError } from "ajv";
import { getValidationErrors } from "../../utilities/ajv-validation";

/**
 * Gets a schema by data location (lodash path syntax)
 */
describe("getSchemaByDataLocation", () => {
    test("should return the schema given from data requiring no children", () => {
        const data: any = {
            tag: "span",
            text: "test",
        };
        const schema: any = getSchemaByDataLocation(textFieldSchema, data, "", [
            {
                name: "textarea",
                component: null,
                schema: textFieldSchema,
            },
        ]);

        expect(schema.id).toBe(textFieldSchema.id);
    });
    test("should return the schema given from data with a single child", () => {
        const data: any = {
            children: {
                id: childrenSchema.id,
                props: {
                    children: [
                        {
                            id: childrenSchema.id,
                            props: {},
                        },
                        {
                            id: textFieldSchema.id,
                            props: {
                                tag: "span",
                                text: "test",
                            },
                        },
                    ],
                },
            },
        };
        const schema1: any = getSchemaByDataLocation(
            childrenSchema,
            data,
            "children.props.children[0]",
            [
                {
                    name: "textarea",
                    component: null,
                    schema: textFieldSchema,
                },
            ]
        );
        expect(schema1.id).toBe(childrenSchema.id);

        const schema2: any = getSchemaByDataLocation(
            childrenSchema,
            data,
            "children.props.children[1]",
            [
                {
                    name: "textarea",
                    component: null,
                    schema: textFieldSchema,
                },
            ]
        );
        expect(schema2.id).toBe(textFieldSchema.id);
    });
});

/**
 * Gets an initial oneOfAnyOf state
 */
describe("getInitialOneOfAnyOfState", () => {
    test("should get the initial oneOf/anyOf activeIndex and oneOf/anyOf keyword", () => {
        const initialOneOfAnyOfNoData: InitialOneOfAnyOfState = getInitialOneOfAnyOfState(
            mergedOneOfSchema.properties.foo,
            {}
        );
        const initialOneOfAnyOfWithData: InitialOneOfAnyOfState = getInitialOneOfAnyOfState(
            mergedOneOfSchema.properties.foo,
            {
                a: 5,
                b: "foo",
            }
        );

        expect(initialOneOfAnyOfNoData.oneOfAnyOf).toEqual({
            type: CombiningKeyword.oneOf,
            activeIndex: -1,
        });
        expect(initialOneOfAnyOfWithData.oneOfAnyOf).toEqual({
            type: CombiningKeyword.oneOf,
            activeIndex: 1,
        });
    });
    test("should correctly get the oneOf/anyOf schema and merge it with any definitions outside of the selected oneOf/anyOf item", () => {
        const initialOneOfAnyOfNoData: InitialOneOfAnyOfState = getInitialOneOfAnyOfState(
            mergedOneOfSchema.properties.foo,
            {}
        );

        expect(initialOneOfAnyOfNoData.schema.required).toEqual(["a", "b"]);
    });
});

/**
 * Gets errors for a data location
 */
describe("getErrorFromDataLocation", () => {
    test("should not get an error if no errors are available", () => {
        expect(getErrorFromDataLocation("", [])).toEqual("");
    });
    test("should get an error that matches a data location", () => {
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "string",
                },
            },
        };
        const data: any = "foo";
        const validationErrors: ajv.ErrorObject[] = getValidationErrors(schema, data);

        expect(getErrorFromDataLocation("", validationErrors)).toEqual(
            "should be object"
        );
    });
    test("should get an error nested inside a data location", () => {
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "string",
                    const: "bar",
                },
            },
        };
        const data: any = {
            foo: "bat",
        };
        const validationErrors: ajv.ErrorObject[] = getValidationErrors(schema, data);

        expect(getErrorFromDataLocation("", validationErrors)).toEqual(
            "Contains invalid data"
        );
        expect(getErrorFromDataLocation("foo", validationErrors)).toEqual(
            "should be equal to constant"
        );
    });
    test("should get an error when multiple errors are generated with similar paths", () => {
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    oneOf: [
                        {
                            type: "object",
                            properties: {
                                bar: {
                                    type: "string",
                                    const: "bar",
                                },
                            },
                        },
                        {
                            type: "number",
                        },
                    ],
                },
            },
        };
        const data: any = {
            foo: {
                bar: "bat",
            },
        };
        const validationErrors: ajv.ErrorObject[] = getValidationErrors(schema, data);

        expect(getErrorFromDataLocation("", validationErrors)).toEqual(
            "Contains invalid data"
        );
        expect(getErrorFromDataLocation("foo", validationErrors)).toEqual(
            "should match exactly one schema in oneOf"
        );
    });
    test("should get an error that is the closest error to the data location", () => {
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "array",
                    items: {
                        oneOf: [
                            {
                                type: "number",
                            },
                            {
                                type: "object",
                                properties: {
                                    bar: {
                                        type: "string",
                                        const: "bar",
                                    },
                                },
                            },
                        ],
                    },
                },
            },
        };
        const data: any = {
            foo: [
                {
                    bar: "bat",
                },
            ],
        };
        const validationErrors: ajv.ErrorObject[] = getValidationErrors(schema, data);

        expect(getErrorFromDataLocation("", validationErrors)).toEqual(
            "Contains invalid data"
        );
        expect(getErrorFromDataLocation("foo", validationErrors)).toEqual(
            "Contains invalid data"
        );
        expect(getErrorFromDataLocation("foo[0]", validationErrors)).toEqual(
            "should match exactly one schema in oneOf"
        );
    });
    test("should get an error from an item in additionalProperties", () => {
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "string",
                },
            },
            additionalProperties: {
                type: "number",
            },
        };
        const data: any = {
            foo: "bar",
            additionalProp: "a string",
        };

        const validationErrors: ajv.ErrorObject[] = getValidationErrors(schema, data);

        expect(validationErrors).toHaveLength(1);
        expect(getErrorFromDataLocation("", validationErrors)).toEqual(
            "Contains invalid data"
        );
        expect(getErrorFromDataLocation("additionalProp", validationErrors)).toEqual(
            "should be number"
        );
    });
    test("should get an error from a nested item in additionalProperties", () => {
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "string",
                },
            },
            additionalProperties: {
                type: "object",
                properties: {
                    foo: {
                        type: "number",
                    },
                    bar: {
                        type: "string",
                        enum: ["hello", "world"],
                    },
                },
            },
        };
        const data: any = {
            foo: "bar",
            additionalProp: {
                foo: 5,
                bar: "bat",
            },
        };

        const validationErrors: ajv.ErrorObject[] = getValidationErrors(schema, data);

        expect(validationErrors).toHaveLength(1);
        expect(getErrorFromDataLocation("", validationErrors)).toEqual(
            "Contains invalid data"
        );
        expect(getErrorFromDataLocation("additionalProp", validationErrors)).toEqual(
            "Contains invalid data"
        );
        expect(getErrorFromDataLocation("additionalProp.bar", validationErrors)).toEqual(
            "should be equal to one of the allowed values"
        );
        expect(getErrorFromDataLocation("foo", validationErrors)).toEqual("");
    });
    test("should detect nested invalid data", () => {
        const schema: any = {
            type: "object",
            properties: {
                foo: {
                    type: "object",
                    properties: {
                        bar: {
                            type: "string",
                        },
                    },
                    required: ["bar"],
                },
            },
        };
        const data: any = {
            foo: {},
        };

        const validationErrors: ajv.ErrorObject[] = getValidationErrors(schema, data);

        expect(validationErrors).toHaveLength(1);
        expect(getErrorFromDataLocation("", validationErrors)).toEqual(
            "Contains invalid data"
        );
    });
});
