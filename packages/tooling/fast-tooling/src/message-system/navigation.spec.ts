import { expect } from "chai";
import { DataType } from "../data-utilities/types";
import { dictionaryLink } from "../schemas";
import { getNavigation, getNavigationDictionary } from "./navigation";
import { NavigationConfigDictionary } from "./navigation.props";
import { TreeNavigationItem } from "./navigation.props";

/**
 * Gets the navigation
 */
describe("getNavigation", () => {
    it("should get a single navigation object from a schema with type object", () => {
        expect(
            getNavigation({
                id: "foo",
                title: "bar",
                type: DataType.object,
            })
        ).to.deep.equal([
            {
                "": {
                    self: "",
                    parent: null,
                    parentDictionaryItem: undefined,
                    data: undefined,
                    relativeDataLocation: "",
                    schema: {
                        id: "foo",
                        title: "bar",
                        type: "object",
                    },
                    disabled: false,
                    schemaLocation: "",
                    text: "bar",
                    type: DataType.object,
                    items: [],
                } as TreeNavigationItem,
            },
            "",
        ]);
    });
    it("should get a single navigation object from a schema with type boolean", () => {
        const navigation = getNavigation({
            id: "foo",
            title: "bar",
            type: DataType.boolean,
        });

        expect(navigation[0][navigation[1]].type).to.equal(DataType.boolean);
        expect(navigation[0][navigation[1]].schema).to.deep.equal({
            id: "foo",
            title: "bar",
            type: "boolean",
        });
    });
    it("should get a single navigation object from a schema with type null", () => {
        const navigation = getNavigation({
            id: "foo",
            title: "bar",
            type: DataType.null,
        });

        expect(navigation[0][navigation[1]].type).to.equal(DataType.null);
        expect(navigation[0][navigation[1]].schema).to.deep.equal({
            id: "foo",
            title: "bar",
            type: DataType.null,
        });
    });
    it("should get a single navigation object from a schema with type array", () => {
        const navigation = getNavigation({
            id: "foo",
            title: "bar",
            type: DataType.array,
        });

        expect(navigation[0][navigation[1]].type).to.equal(DataType.array);
        expect(navigation[0][navigation[1]].schema).to.deep.equal({
            id: "foo",
            title: "bar",
            type: DataType.array,
        });
    });
    it("should get a single navigation object from a schema with type string", () => {
        const navigation = getNavigation({
            id: "foo",
            title: "bar",
            type: DataType.string,
        });

        expect(navigation[0][navigation[1]].type).to.equal(DataType.string);
        expect(navigation[0][navigation[1]].schema).to.deep.equal({
            id: "foo",
            title: "bar",
            type: DataType.string,
        });
    });
    it("should get a navigation object from a schema with type object and properties", () => {
        const navigation = getNavigation({
            id: "foo",
            title: "bar",
            type: DataType.object,
            properties: {
                bat: {
                    title: "baz",
                    type: DataType.string,
                },
            },
        });

        expect(navigation[0][navigation[1]].type).to.equal(DataType.object);
        expect(navigation[0][navigation[1]].schema).to.deep.equal({
            id: "foo",
            title: "bar",
            type: DataType.object,
            properties: {
                bat: {
                    title: "baz",
                    type: DataType.string,
                },
            },
        });
        expect(navigation[0]["bat"].type).to.equal(DataType.string);
        expect(navigation[0]["bat"].schema).to.deep.equal({
            title: "baz",
            type: DataType.string,
        });
    });
    it("should get a navigation object from a schema with type array and data", () => {
        const navigation = getNavigation(
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
        );

        expect(navigation[0][navigation[1]].data).to.have.length(2);
        expect(navigation[0][navigation[1]].data[0]).to.equal("hello");
        expect(navigation[0][navigation[1]].data[1]).to.equal("world");
        expect(navigation[0]["[0]"].data).to.equal("hello");
        expect(navigation[0]["[0]"].type).to.equal(DataType.string);
        expect(navigation[0]["[1]"].data).to.equal("world");
        expect(navigation[0]["[1]"].type).to.equal(DataType.string);
    });
    it("should get a navigation object from a schema with a nested array", () => {
        expect(
            getNavigation(
                {
                    id: "foo",
                    title: "bar",
                    type: DataType.object,
                    properties: {
                        foo: {
                            type: DataType.array,
                            items: {
                                title: "bat",
                                type: DataType.string,
                            },
                        },
                    },
                },
                { foo: ["hello", "world"] }
            )
        ).to.deep.equal([
            {
                "": {
                    self: "",
                    parent: null,
                    parentDictionaryItem: undefined,
                    data: { foo: ["hello", "world"] },
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {
                        id: "foo",
                        title: "bar",
                        type: DataType.object,
                        properties: {
                            foo: {
                                type: DataType.array,
                                items: {
                                    title: "bat",
                                    type: DataType.string,
                                },
                            },
                        },
                    },
                    disabled: false,
                    text: "bar",
                    type: DataType.object,
                    items: ["foo"],
                },
                foo: {
                    self: "foo",
                    parent: "",
                    parentDictionaryItem: undefined,
                    data: ["hello", "world"],
                    relativeDataLocation: "foo",
                    schemaLocation: "properties.foo",
                    schema: {
                        type: DataType.array,
                        items: {
                            title: "bat",
                            type: DataType.string,
                        },
                    },
                    disabled: false,
                    text: undefined,
                    type: DataType.array,
                    items: ["foo[0]", "foo[1]"],
                },
                "foo[0]": {
                    self: "foo[0]",
                    parent: "foo",
                    parentDictionaryItem: undefined,
                    data: "hello",
                    relativeDataLocation: "foo[0]",
                    schemaLocation: "properties.foo.items",
                    schema: {
                        title: "bat",
                        type: DataType.string,
                    },
                    disabled: false,
                    text: "bat",
                    type: DataType.string,
                    items: [],
                },
                "foo[1]": {
                    self: "foo[1]",
                    parent: "foo",
                    parentDictionaryItem: undefined,
                    data: "world",
                    relativeDataLocation: "foo[1]",
                    schemaLocation: "properties.foo.items",
                    schema: {
                        title: "bat",
                        type: DataType.string,
                    },
                    disabled: false,
                    text: "bat",
                    type: DataType.string,
                    items: [],
                },
            },
            "",
        ]);
    });
    it("should get a navigation object from a schema with type array and data containing properties", () => {
        const navigation = getNavigation(
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
        );

        expect(navigation[0]["[0].hello"].data).to.equal("world");
        expect(navigation[0]["[0].hello"].schemaLocation).to.equal(
            "items.properties.hello"
        );
        expect(navigation[0]["[0].hello"].schema).to.deep.equal({
            title: "Hello world",
            type: DataType.string,
        });
        expect(navigation[0]["[0].hello"].text).to.equal("Hello world");
    });
    it("should get a navigation object from a schema with a oneOf keyword", () => {
        const navigation = getNavigation(
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
        );

        expect(navigation[0]["{oneOf[0]}"].schemaLocation).to.equal("oneOf[0]");
        expect(navigation[0]["{oneOf[0]}"].schema).to.deep.equal({
            title: "string",
            type: DataType.string,
        });
        expect(navigation[0]["{oneOf[0]}"].data).to.equal(42);
        expect(navigation[0]["{oneOf[1]}"].schemaLocation).to.equal("oneOf[1]");
        expect(navigation[0]["{oneOf[1]}"].schema).to.deep.equal({
            title: "number",
            type: DataType.number,
        });
        expect(navigation[0]["{oneOf[1]}"].data).to.equal(42);
    });
    it("should get a navigation object from a schema with a oneOf keyword with no data defined", () => {
        expect(
            getNavigation({
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
            })
        ).to.deep.equal([
            {
                "": {
                    self: "",
                    parent: null,
                    parentDictionaryItem: undefined,
                    data: undefined,
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
                    disabled: false,
                    text: "bar",
                    type: DataType.unknown,
                    items: ["{oneOf[0]}", "{oneOf[1]}"],
                },
                "{oneOf[0]}": {
                    self: "{oneOf[0]}",
                    parent: "",
                    parentDictionaryItem: undefined,
                    data: undefined,
                    relativeDataLocation: "",
                    schemaLocation: "oneOf[0]",
                    schema: {
                        title: "string",
                        type: DataType.string,
                    },
                    disabled: false,
                    text: "string",
                    type: DataType.string,
                    items: [],
                },
                "{oneOf[1]}": {
                    self: "{oneOf[1]}",
                    parent: "",
                    parentDictionaryItem: undefined,
                    data: undefined,
                    relativeDataLocation: "",
                    schemaLocation: "oneOf[1]",
                    schema: {
                        title: "number",
                        type: DataType.number,
                    },
                    disabled: false,
                    text: "number",
                    type: DataType.number,
                    items: [],
                },
            },
            "",
        ]);
    });
    it("should get a navigation object from a schema with nested oneOf keywords", () => {
        const schema: any = {
            id: "foo",
            title: "bar",
            oneOf: [
                {
                    oneOf: [
                        {
                            title: "string",
                            type: DataType.string,
                        },
                        {
                            title: "boolean",
                            type: DataType.boolean,
                        },
                    ],
                },
                {
                    title: "number",
                    type: DataType.number,
                },
            ],
        };
        expect(getNavigation(schema, "foo")).to.deep.equal([
            {
                "": {
                    self: "",
                    parent: null,
                    parentDictionaryItem: void 0,
                    data: "foo",
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema,
                    disabled: false,
                    text: "bar",
                    type: DataType.unknown,
                    items: ["{oneOf[0]}", "{oneOf[1]}"],
                },
                "{oneOf[0]}": {
                    self: "{oneOf[0]}",
                    parent: "",
                    parentDictionaryItem: void 0,
                    data: "foo",
                    relativeDataLocation: "",
                    schemaLocation: "oneOf[0]",
                    schema: schema.oneOf[0],
                    disabled: false,
                    text: undefined,
                    type: DataType.unknown,
                    items: ["{oneOf[0].oneOf[0]}", "{oneOf[0].oneOf[1]}"],
                },
                "{oneOf[0].oneOf[0]}": {
                    self: "{oneOf[0].oneOf[0]}",
                    parent: "{oneOf[0]}",
                    parentDictionaryItem: void 0,
                    data: "foo",
                    relativeDataLocation: "",
                    schemaLocation: "oneOf[0].oneOf[0]",
                    schema: schema.oneOf[0].oneOf[0],
                    disabled: false,
                    text: "string",
                    type: DataType.string,
                    items: [],
                },
                "{oneOf[0].oneOf[1]}": {
                    self: "{oneOf[0].oneOf[1]}",
                    parent: "{oneOf[0]}",
                    parentDictionaryItem: void 0,
                    data: "foo",
                    relativeDataLocation: "",
                    schemaLocation: "oneOf[0].oneOf[1]",
                    schema: schema.oneOf[0].oneOf[1],
                    disabled: false,
                    text: "boolean",
                    type: DataType.boolean,
                    items: [],
                },
                "{oneOf[1]}": {
                    self: "{oneOf[1]}",
                    parent: "",
                    parentDictionaryItem: void 0,
                    data: "foo",
                    relativeDataLocation: "",
                    schemaLocation: "oneOf[1]",
                    schema: schema.oneOf[1],
                    disabled: false,
                    text: "number",
                    type: DataType.number,
                    items: [],
                },
            },
            "",
        ]);
    });
    it("should get a navigation object from a schema with a anyOf keyword", () => {
        expect(
            getNavigation(
                {
                    id: "foo",
                    title: "bar",
                    anyOf: [
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
        ).to.deep.equal([
            {
                "": {
                    self: "",
                    parent: null,
                    parentDictionaryItem: void 0,
                    data: 42,
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {
                        id: "foo",
                        title: "bar",
                        anyOf: [
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
                    disabled: false,
                    text: "bar",
                    type: DataType.unknown,
                    items: ["{anyOf[0]}", "{anyOf[1]}"],
                },
                "{anyOf[0]}": {
                    self: "{anyOf[0]}",
                    parent: "",
                    parentDictionaryItem: void 0,
                    data: 42,
                    relativeDataLocation: "",
                    schemaLocation: "anyOf[0]",
                    schema: {
                        title: "string",
                        type: DataType.string,
                    },
                    disabled: false,
                    text: "string",
                    type: DataType.string,
                    items: [],
                },
                "{anyOf[1]}": {
                    self: "{anyOf[1]}",
                    parent: "",
                    parentDictionaryItem: void 0,
                    data: 42,
                    relativeDataLocation: "",
                    schemaLocation: "anyOf[1]",
                    schema: {
                        title: "number",
                        type: DataType.number,
                    },
                    disabled: false,
                    text: "number",
                    type: DataType.number,
                    items: [],
                },
            },
            "",
        ]);
    });
    it("should get a navigation object from a schema with a nested oneOf keyword", () => {
        expect(
            getNavigation(
                {
                    id: "foo",
                    title: "bar",
                    type: "object",
                    properties: {
                        foo: {
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
                    },
                },
                {
                    foo: 42,
                }
            )
        ).to.deep.equal([
            {
                "": {
                    self: "",
                    parent: null,
                    parentDictionaryItem: void 0,
                    data: {
                        foo: 42,
                    },
                    relativeDataLocation: "",
                    schemaLocation: "",
                    schema: {
                        id: "foo",
                        title: "bar",
                        type: "object",
                        properties: {
                            foo: {
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
                        },
                    },
                    disabled: false,
                    text: "bar",
                    type: DataType.object,
                    items: ["foo"],
                },
                foo: {
                    self: "foo",
                    parent: "",
                    parentDictionaryItem: void 0,
                    data: 42,
                    relativeDataLocation: "foo",
                    schemaLocation: "properties.foo",
                    schema: {
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
                    disabled: false,
                    text: void 0,
                    type: DataType.unknown,
                    items: [
                        "foo{properties.foo.oneOf[0]}",
                        "foo{properties.foo.oneOf[1]}",
                    ],
                },
                "foo{properties.foo.oneOf[0]}": {
                    self: "foo{properties.foo.oneOf[0]}",
                    parent: "foo",
                    parentDictionaryItem: void 0,
                    data: 42,
                    relativeDataLocation: "foo",
                    schemaLocation: "properties.foo.oneOf[0]",
                    schema: {
                        title: "string",
                        type: DataType.string,
                    },
                    disabled: false,
                    text: "string",
                    type: DataType.string,
                    items: [],
                },
                "foo{properties.foo.oneOf[1]}": {
                    self: "foo{properties.foo.oneOf[1]}",
                    parent: "foo",
                    parentDictionaryItem: void 0,
                    data: 42,
                    relativeDataLocation: "foo",
                    schemaLocation: "properties.foo.oneOf[1]",
                    schema: {
                        title: "number",
                        type: DataType.number,
                    },
                    disabled: false,
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
    it("should not throw", () => {
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
        ).not.to.throw();
    });
    it("should return a dictionary with a single navigation config", () => {
        const navigation: NavigationConfigDictionary = getNavigationDictionary(
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

        expect(typeof navigationId).to.equal("string");
        expect(Object.keys(navigation[0])).to.deep.equal([navigationId]);
    });
    it("should return a dictionary with multiple navigation configs", () => {
        const navigation: NavigationConfigDictionary = getNavigationDictionary(
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

        expect(Object.keys(navigation[0])).to.have.length(2);
        expect(
            navigation[0].def[0][navigation[0].def[1]].parentDictionaryItem
        ).not.to.equal(undefined);
        expect(
            navigation[0].def[0][navigation[0].def[1]].parentDictionaryItem.id
        ).to.equal("abc");
        expect(
            navigation[0].def[0][navigation[0].def[1]].parentDictionaryItem.dataLocation
        ).to.equal("foo");
    });
    it("should use text from a data location if displayTextDataLocation has been specified", () => {
        const navigation: NavigationConfigDictionary = getNavigationDictionary(
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
                            displayText: "test1",
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
                            displayText: "test2",
                        },
                    },
                },
                "abc",
            ],
            "displayText"
        );

        expect(navigation[0]["abc"][0][""].text).to.equal("test1");
        expect(navigation[0]["def"][0][""].text).to.equal("test2");
    });
});
