import "jest";
import { getNavigation, getNavigationDictionary } from "./navigation";
import { TreeNavigationConfigDictionary } from "./navigation.props";
import { TreeNavigation, TreeNavigationItem } from "./navigation.props";
import { DataType } from "../data-utilities/types";
import { dictionaryLink } from "@microsoft/fast-tooling";

/**
 * Gets the navigation
 */
describe("getNavigation", () => {
    test("should get a single navigation object from a schema with type object", () => {
        expect(
            getNavigation({
                id: "foo",
                title: "bar",
                type: DataType.object,
            })
        ).toEqual([
            {
                "": {
                    self: "",
                    parent: null,
                    data: undefined,
                    relativeDataLocation: "",
                    schema: {
                        id: "foo",
                        title: "bar",
                        type: "object",
                    },
                    schemaLocation: "",
                    text: "bar",
                    type: DataType.object,
                    items: [],
                } as TreeNavigationItem,
            },
            "",
        ]);
    });
    test("should get a single navigation object from a schema with type boolean", () => {
        expect(
            getNavigation({
                id: "foo",
                title: "bar",
                type: DataType.boolean,
            })
        ).toEqual([
            {
                "": {
                    self: "",
                    parent: null,
                    data: undefined,
                    relativeDataLocation: "",
                    schema: {
                        id: "foo",
                        title: "bar",
                        type: "boolean",
                    },
                    schemaLocation: "",
                    text: "bar",
                    type: DataType.boolean,
                    items: [],
                } as TreeNavigationItem,
            },
            "",
        ]);
    });
    test("should get a single navigation object from a schema with type null", () => {
        expect(
            getNavigation({
                id: "foo",
                title: "bar",
                type: DataType.null,
            })
        ).toEqual([
            {
                "": {
                    self: "",
                    parent: null,
                    data: undefined,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {
                        id: "foo",
                        title: "bar",
                        type: "null",
                    },
                    text: "bar",
                    type: DataType.null,
                    items: [],
                } as TreeNavigationItem,
            },
            "",
        ]);
    });
    test("should get a single navigation object from a schema with type array", () => {
        expect(
            getNavigation({
                id: "foo",
                title: "bar",
                type: DataType.array,
            })
        ).toEqual([
            {
                "": {
                    self: "",
                    parent: null,
                    data: undefined,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {
                        id: "foo",
                        title: "bar",
                        type: DataType.array,
                    },
                    text: "bar",
                    type: DataType.array,
                    items: [],
                } as TreeNavigationItem,
            },
            "",
        ]);
    });
    test("should get a single navigation object from a schema with type string", () => {
        expect(
            getNavigation({
                id: "foo",
                title: "bar",
                type: DataType.string,
            })
        ).toEqual([
            {
                "": {
                    self: "",
                    parent: null,
                    data: undefined,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {
                        id: "foo",
                        title: "bar",
                        type: DataType.string,
                    },
                    text: "bar",
                    type: DataType.string,
                    items: [],
                } as TreeNavigationItem,
            },
            "",
        ]);
    });
    test("should get a navigation object from a schema with type object and properties", () => {
        expect(
            getNavigation({
                id: "foo",
                title: "bar",
                type: DataType.object,
                properties: {
                    bat: {
                        title: "baz",
                        type: DataType.string,
                    },
                },
            })
        ).toEqual([
            {
                "": {
                    self: "",
                    parent: null,
                    data: undefined,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {
                        id: "foo",
                        title: "bar",
                        type: DataType.object,
                        properties: {
                            bat: {
                                title: "baz",
                                type: DataType.string,
                            },
                        },
                    },
                    text: "bar",
                    type: DataType.object,
                    items: ["bat"],
                } as TreeNavigationItem,
                bat: {
                    self: "bat",
                    parent: "",
                    data: undefined,
                    relativeDataLocation: "bat",
                    schemaLocation: "properties.bat",
                    schema: {
                        title: "baz",
                        type: DataType.string,
                    },
                    text: "baz",
                    type: DataType.string,
                    items: [],
                } as TreeNavigationItem,
            },
            "",
        ]);
    });
    test("should get a navigation object from a schema with type array and data", () => {
        expect(
            getNavigation(
                {
                    id: "foo",
                    title: "bar",
                    type: DataType.array,
                    items: {
                        title: "bat",
                        type: DataType.string,
                    },
                },
                ["hello", "world"]
            )
        ).toEqual([
            {
                "": {
                    self: "",
                    data: ["hello", "world"],
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {
                        id: "foo",
                        title: "bar",
                        type: DataType.array,
                        items: {
                            title: "bat",
                            type: DataType.string,
                        },
                    },
                    text: "bar",
                    type: DataType.array,
                    items: ["[0]", "[1]"],
                } as TreeNavigationItem,
                "[0]": {
                    self: "[0]",
                    data: "hello",
                    parent: "",
                    relativeDataLocation: "[0]",
                    schemaLocation: "items",
                    schema: {
                        title: "bat",
                        type: DataType.string,
                    },
                    text: "bat",
                    type: DataType.string,
                    items: [],
                },
                "[1]": {
                    self: "[1]",
                    data: "world",
                    parent: "",
                    relativeDataLocation: "[1]",
                    schemaLocation: "items",
                    schema: {
                        title: "bat",
                        type: DataType.string,
                    },
                    text: "bat",
                    type: DataType.string,
                    items: [],
                },
            },
            "",
        ]);
    });
    test("should get a navigation object from a schema with type array and data containing properties", () => {
        expect(
            getNavigation(
                {
                    id: "foo",
                    title: "bar",
                    type: DataType.array,
                    items: {
                        title: "bat",
                        type: DataType.object,
                        properties: {
                            hello: {
                                title: "Hello world",
                                type: DataType.string,
                            },
                        },
                    },
                },
                [
                    {
                        hello: "world",
                    },
                ]
            )
        ).toEqual([
            {
                "": {
                    self: "",
                    data: [
                        {
                            hello: "world",
                        },
                    ],
                    parent: null,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {
                        id: "foo",
                        title: "bar",
                        type: DataType.array,
                        items: {
                            title: "bat",
                            type: DataType.object,
                            properties: {
                                hello: {
                                    title: "Hello world",
                                    type: DataType.string,
                                },
                            },
                        },
                    },
                    text: "bar",
                    type: DataType.array,
                    items: ["[0]"],
                } as TreeNavigationItem,
                "[0]": {
                    self: "[0]",
                    data: {
                        hello: "world",
                    },
                    parent: "",
                    relativeDataLocation: "[0]",
                    schemaLocation: "items",
                    schema: {
                        title: "bat",
                        type: DataType.object,
                        properties: {
                            hello: {
                                title: "Hello world",
                                type: DataType.string,
                            },
                        },
                    },
                    text: "bat",
                    type: DataType.object,
                    items: ["[0].hello"],
                },
                "[0].hello": {
                    self: "[0].hello",
                    data: "world",
                    parent: "[0]",
                    relativeDataLocation: "[0].hello",
                    schemaLocation: "items.properties.hello",
                    schema: {
                        title: "Hello world",
                        type: DataType.string,
                    },
                    text: "Hello world",
                    type: DataType.string,
                    items: [],
                },
            },
            "",
        ]);
    });
    test("should get a navigation object from a schema with a oneOf keyword", () => {
        expect(
            getNavigation(
                {
                    id: "foo",
                    title: "bar",
                    oneOf: [
                        {
                            title: "string",
                            type: DataType.string,
                        },
                        {
                            title: "number",
                            type: DataType.number,
                        },
                    ],
                },
                42
            )
        ).toEqual([
            {
                "": {
                    self: "",
                    parent: null,
                    data: 42,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {
                        id: "foo",
                        title: "bar",
                        oneOf: [
                            {
                                title: "string",
                                type: DataType.string,
                            },
                            {
                                title: "number",
                                type: DataType.number,
                            },
                        ],
                    },
                    text: "bar",
                    type: DataType.unknown,
                    items: ["oneOf[1]"],
                },
                "oneOf[1]": {
                    self: "oneOf[1]",
                    parent: "",
                    data: 42,
                    relativeDataLocation: "",
                    schemaLocation: "oneOf[1]",
                    schema: {
                        title: "number",
                        type: DataType.number,
                    },
                    text: "number",
                    type: DataType.number,
                    items: [],
                },
            },
            "",
        ]);
    });
});

describe("getNavigationDictionary", () => {
    test("should not throw", () => {
        expect(() =>
            getNavigationDictionary(
                {
                    foo: { id: "foo" },
                },
                [
                    {
                        "": {
                            schemaId: "foo",
                            data: void 0,
                        },
                    },
                    "",
                ]
            )
        ).not.toThrow();
    });
    test("should return a dictionary with a single navigation config", () => {
        const navigation: TreeNavigationConfigDictionary = getNavigationDictionary(
            {
                foo: { id: "foo" },
            },
            [
                {
                    "": {
                        schemaId: "foo",
                        data: void 0,
                    },
                },
                "",
            ]
        );
        const navigationId: string = navigation[1];

        expect(typeof navigationId).toEqual("string");
        expect(Object.keys(navigation[0])).toEqual([navigationId]);
    });
    test("should return a dictionary with multiple navigation configs", () => {
        const navigation: TreeNavigationConfigDictionary = getNavigationDictionary(
            {
                baz: {
                    id: "baz",
                    type: "object",
                    properties: {
                        foo: {
                            [dictionaryLink]: "foo",
                        },
                    },
                },
                bat: {
                    id: "bat",
                    type: "object",
                    properties: {
                        bar: {
                            type: "string",
                        },
                    },
                },
            },
            [
                {
                    abc: {
                        schemaId: "baz",
                        data: {
                            foo: [
                                {
                                    id: "def",
                                },
                            ],
                        },
                    },
                    def: {
                        schemaId: "bat",
                        parent: {
                            id: "abc",
                            dataLocation: "foo",
                        },
                        data: {
                            bar: "hello world",
                        },
                    },
                },
                "abc",
            ]
        );

        expect(Object.keys(navigation[0])).toHaveLength(2);
        expect(
            navigation[0].def[0][navigation[0].def[1]].parentDictionaryItem
        ).not.toEqual(undefined);
        expect(
            navigation[0].def[0][navigation[0].def[1]].parentDictionaryItem.id
        ).toEqual("abc");
        expect(
            navigation[0].def[0][navigation[0].def[1]].parentDictionaryItem.dataLocation
        ).toEqual("foo");
    });
});

// describe("getDragEndUpdatedData", () => {
//     test("should add data into an array", () => {
//         /* tslint:disable */
//         // console.log("begin");
//     });
//     // test("should add data into an undefined location", () => {

//     // });
//     // test("should add data into an object", () => {

//     // });
//     // test("should add data above an item in an array", () => {

//     // });
//     // test("should add data below an item in an array", () => {

//     // });
// });
