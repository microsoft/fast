import "jest";
import { getInitialOneOfAnyOfState, getSchemaByDataLocation } from "./form";

import mergedOneOfSchema from "../../__tests__/schemas/merged-one-of.schema.json";
import childrenSchema from "../../__tests__/schemas/children.schema.json";
import textFieldSchema from "../../__tests__/schemas/textarea.schema.json";
import { InitialOneOfAnyOfState, oneOfAnyOfType } from "../form-section.props";

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
            type: oneOfAnyOfType.oneOf,
            activeIndex: -1,
        });
        expect(initialOneOfAnyOfWithData.oneOfAnyOf).toEqual({
            type: oneOfAnyOfType.oneOf,
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
