import "jest";
import "../../../__tests__/mocks/match-media";
import { CombiningKeyword, MessageSystem } from "@microsoft/fast-tooling";
import {
    childrenSchema,
    mergedOneOfSchema,
    textFieldSchema,
} from "../../../__tests__/schemas";
import { InitialOneOfAnyOfState } from "../control.section.props";
import {
    getErrorFromDataLocation,
    getSchemaByDataLocation,
    updateControlSectionState,
} from "./form";

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
        new MessageSystem({
            webWorker: "",
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: void 0,
                    },
                },
                "",
            ],
            schemaDictionary: {},
        });
        const initialOneOfAnyOfNoData: InitialOneOfAnyOfState = updateControlSectionState(
            {
                schema: mergedOneOfSchema.properties.foo,
                navigationConfigId: "foo",
                navigation: {
                    foo: {
                        schema: mergedOneOfSchema.properties.foo,
                    },
                } as any,
            } as any
        );

        expect(initialOneOfAnyOfNoData.oneOfAnyOf).toEqual({
            type: CombiningKeyword.oneOf,
            activeIndex: -1,
        });
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
        expect(
            getErrorFromDataLocation("", [
                {
                    dataLocation: "",
                    invalidMessage: "should be object",
                },
            ])
        ).toEqual("should be object");
    });
    test("should get an error nested inside a data location", () => {
        expect(
            getErrorFromDataLocation("foo", [
                {
                    dataLocation: "foo",
                    invalidMessage: "should be equal to constant",
                },
            ])
        ).toEqual("should be equal to constant");
    });
});
