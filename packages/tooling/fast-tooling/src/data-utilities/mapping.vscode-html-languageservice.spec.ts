import { expect } from "chai";
import { SchemaDictionary } from "../message-system";
import { linkedDataSchema } from "../schemas";
import {
    mapVSCodeHTMLAndDataDictionaryToDataDictionary,
    mapVSCodeParsedHTMLToDataDictionary,
} from "./mapping.vscode-html-languageservice";
import { DataType, ReservedElementMappingKeyword } from "./types";

const textSchema = {
    id: "text",
    $id: "text",
    type: "string",
};

const divSchema = {
    id: "div",
    $id: "div",
    type: "object",
    mapsToTagName: "div",
};

const spanSchema = {
    id: "span",
    $id: "span",
    type: "object",
    mapsToTagName: "span",
    properties: {},
};

const inputSchema = {
    id: "input",
    $id: "input",
    type: "object",
    mapsToTagName: "input",
    properties: {
        required: {
            type: DataType.boolean,
        },
        disabled: {
            type: DataType.boolean,
        },
        value: {
            type: DataType.number,
        },
        name: {
            type: DataType.string,
        },
        SlotBar: {
            [ReservedElementMappingKeyword.mapsToSlot]: "bar",
            ...linkedDataSchema,
        },
    },
};

const customSchema = {
    id: "foo-bar",
    $id: "foo-bar",
    type: "object",
    mapsToTagName: "foo-bar",
    properties: {
        SlotFoo: {
            [ReservedElementMappingKeyword.mapsToSlot]: "foo",
            ...linkedDataSchema,
        },
    },
};

describe("mapVSCodeParsedHTMLToDataDictionary", () => {
    it("should not throw an error if the HTML array is empty", () => {
        expect(() => {
            mapVSCodeParsedHTMLToDataDictionary({
                value: [],
                schemaDictionary: {},
            });
        }).not.to.throw();
    });
    it("should return a DataDictionary containing a text node if a text node is passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["foobar"],
            schemaDictionary: {
                [textSchema.id]: textSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).to.deep.equal({
            schemaId: textSchema.id,
            data: "foobar",
        });
    });
    it("should return a DataDictionary containing an HTML element if an HTML element has been passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<div>", "</div>"],
            schemaDictionary: {
                [divSchema.id]: divSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).to.deep.equal({
            schemaId: divSchema.id,
            data: {},
        });
    });
    it("should return a DataDictionary containing an HTML element and ignore newlines", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<div>\n", "</div>"],
            schemaDictionary: {
                [divSchema.id]: divSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).to.deep.equal({
            schemaId: divSchema.id,
            data: {},
        });
    });
    it("should return a DataDictionary containing an HTML element with a string attribute if an HTML element with a string attribute has been passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ['<input id="bar" />'],
            schemaDictionary: {
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).to.deep.equal({
            schemaId: inputSchema.id,
            data: {
                id: "bar",
            },
        });
    });
    it("should return a DataDictionary containing an HTML element without a slot attribute as part of the data if an HTML element with a slot attribute has been passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ['<input slot="bar" />'],
            schemaDictionary: {
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).to.deep.equal({
            schemaId: inputSchema.id,
            data: {},
        });
    });
    it("should return a DataDictionary containing an HTML element with a number attribute if an HTML element with a number attribute has been passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ['<input value="5" />'],
            schemaDictionary: {
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).to.deep.equal({
            schemaId: inputSchema.id,
            data: {
                value: 5,
            },
        });
    });
    it("should return a DataDictionary containing an HTML element with a boolean attribute if an HTML element with a boolean attribute has been passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<input required />"],
            schemaDictionary: {
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).to.deep.equal({
            schemaId: inputSchema.id,
            data: {
                required: true,
            },
        });
    });
    it("should return a DataDictionary containing an HTML element with a string attribute if an HTML element with a string attribute has been passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ['<input name="foo" />'],
            schemaDictionary: {
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).to.deep.equal({
            schemaId: inputSchema.id,
            data: {
                name: "foo",
            },
        });
    });
    it("should return a DataDictionary containing an HTML element with a JSON schema unspecified string attribute if an HTML element with a string attribute has been passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ['<input data-id="foo" />'],
            schemaDictionary: {
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).to.deep.equal({
            schemaId: inputSchema.id,
            data: {
                "data-id": "foo",
            },
        });
    });
    it("should return a DataDictionary containing an HTML element with a JSON schema unspecified null attribute if an HTML element with a null attribute has been passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<input data-id />"],
            schemaDictionary: {
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).to.deep.equal({
            schemaId: inputSchema.id,
            data: {
                "data-id": true,
            },
        });
    });
    it("should return a DataDictionary containing an HTML element with a JSON schema unspecified half written string attribute if an HTML element with an incomplete attribute has been passed", () => {
        expect(() => {
            mapVSCodeParsedHTMLToDataDictionary({
                value: ["<input data-id= bar />"],
                schemaDictionary: {
                    [inputSchema.id]: inputSchema,
                },
            });
        }).not.to.throw();
    });
    it("should return a DataDictionary containing an HTML element nested inside another HTML element", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<div>", "<input />", "</div>"],
            schemaDictionary: {
                [inputSchema.id]: inputSchema,
                [divSchema.id]: divSchema,
            },
        });
        const root: string = value[1];
        const childKey: string = (value[0][root].data as any).Slot[0].id;

        expect(typeof childKey).to.equal("string");
        expect(value[0][childKey].schemaId).to.equal(inputSchema.id);
        expect(value[0][childKey].data).to.deep.equal({});
        expect(value[0][childKey].parent.id).to.equal(root);
        expect(value[0][childKey].parent.dataLocation).to.equal("Slot");
    });
    it("should return a DataDictionary containing an HTML element containing a text node", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<div>", "foobar", "</div>"],
            schemaDictionary: {
                [textSchema.id]: textSchema,
                [divSchema.id]: divSchema,
            },
        });
        const root: string = value[1];
        const childKey: string = (value[0][root].data as any).Slot[0].id;

        expect(typeof childKey).to.equal("string");
        expect(value[0][childKey].schemaId).to.equal(textSchema.id);
        expect(value[0][childKey].data).to.equal("foobar");
        expect(value[0][childKey].parent.id).to.equal(root);
        expect(value[0][childKey].parent.dataLocation).to.equal("Slot");
    });
    it("should return a DataDictionary containing an HTML element containing a text node preceeding an HTML element", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<div>", "foobar", "<input />", "</div>"],
            schemaDictionary: {
                [textSchema.id]: textSchema,
                [divSchema.id]: divSchema,
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        const stringChildKey: string = (value[0][root].data as any).Slot[0].id;
        const inputChildKey: string = (value[0][root].data as any).Slot[1].id;

        expect(typeof stringChildKey).to.equal("string");
        expect(value[0][stringChildKey].schemaId).to.equal(textSchema.id);
        expect(value[0][stringChildKey].data).to.equal("foobar");
        expect(value[0][stringChildKey].parent.id).to.equal(root);
        expect(value[0][stringChildKey].parent.dataLocation).to.equal("Slot");
        expect(typeof inputChildKey).to.equal("string");
        expect(value[0][inputChildKey].schemaId).to.equal(inputSchema.id);
        expect(value[0][inputChildKey].data).to.deep.equal({});
        expect(value[0][inputChildKey].parent.id).to.equal(root);
        expect(value[0][inputChildKey].parent.dataLocation).to.equal("Slot");
    });
    it("should return a DataDictionary containing an HTML element containing a text node following an HTML element", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<div>", "<input />", "foobar", "</div>"],
            schemaDictionary: {
                [textSchema.id]: textSchema,
                [divSchema.id]: divSchema,
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        const inputChildKey: string = (value[0][root].data as any).Slot[0].id;
        const stringChildKey: string = (value[0][root].data as any).Slot[1].id;

        expect(typeof inputChildKey).to.equal("string");
        expect(value[0][inputChildKey].schemaId).to.equal(inputSchema.id);
        expect(value[0][inputChildKey].data).to.deep.equal({});
        expect(value[0][inputChildKey].parent.id).to.equal(root);
        expect(value[0][inputChildKey].parent.dataLocation).to.equal("Slot");
        expect(typeof stringChildKey).to.equal("string");
        expect(value[0][stringChildKey].schemaId).to.equal(textSchema.id);
        expect(value[0][stringChildKey].data).to.equal("foobar");
        expect(value[0][stringChildKey].parent.id).to.equal(root);
        expect(value[0][stringChildKey].parent.dataLocation).to.equal("Slot");
    });
    it("should return a DataDictionary containing an HTML element containing a text node bookended by HTML elements", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<div>", "<input />", "foobar", "<input />", "</div>"],
            schemaDictionary: {
                [textSchema.id]: textSchema,
                [divSchema.id]: divSchema,
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        const inputChildKey1: string = (value[0][root].data as any).Slot[0].id;
        const stringChildKey: string = (value[0][root].data as any).Slot[1].id;
        const inputChildKey2: string = (value[0][root].data as any).Slot[2].id;

        expect(typeof inputChildKey1).to.equal("string");
        expect(value[0][inputChildKey1].schemaId).to.equal(inputSchema.id);
        expect(value[0][inputChildKey1].data).to.deep.equal({});
        expect(value[0][inputChildKey1].parent.id).to.equal(root);
        expect(value[0][inputChildKey1].parent.dataLocation).to.equal("Slot");
        expect(typeof stringChildKey).to.equal("string");
        expect(value[0][stringChildKey].schemaId).to.equal(textSchema.id);
        expect(value[0][stringChildKey].data).to.equal("foobar");
        expect(value[0][stringChildKey].parent.id).to.equal(root);
        expect(value[0][stringChildKey].parent.dataLocation).to.equal("Slot");
        expect(typeof inputChildKey2).to.equal("string");
        expect(value[0][inputChildKey2].schemaId).to.equal(inputSchema.id);
        expect(value[0][inputChildKey2].data).to.deep.equal({});
        expect(value[0][inputChildKey2].parent.id).to.equal(root);
        expect(value[0][inputChildKey2].parent.dataLocation).to.equal("Slot");
    });
    it("should return a DataDictionary containing nested HTML elements and text nodes", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<div>", "<span>", "foobar", "</span>", "</div>"],
            schemaDictionary: {
                [textSchema.id]: textSchema,
                [divSchema.id]: divSchema,
                [inputSchema.id]: inputSchema,
                [spanSchema.id]: spanSchema,
            },
        });

        const root: string = value[1];
        const spanChildKey: string = (value[0][root].data as any).Slot[0].id;
        const textChildKey: string = (value[0][spanChildKey].data as any).Slot[0].id;

        expect(value[0][root].data).to.deep.equal({
            Slot: [
                {
                    id: spanChildKey,
                },
            ],
        });
        expect(value[0][spanChildKey].data).to.deep.equal({
            Slot: [
                {
                    id: textChildKey,
                },
            ],
        });
        expect(value[0][textChildKey].data).to.equal("foobar");
    });
    it("should return a DataDictionary containing nested HTML elements with slot names", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<foo-bar>", '<span slot="foo">', "foobar", "</span>", "</foo-bar>"],
            schemaDictionary: {
                [textSchema.id]: textSchema,
                [divSchema.id]: divSchema,
                [inputSchema.id]: inputSchema,
                [spanSchema.id]: spanSchema,
                [customSchema.id]: customSchema,
            },
        });

        const root: string = value[1];
        const spanChildKey: string = (value[0][root].data as any).SlotFoo[0].id;

        expect(value[0][root].data).to.deep.equal({
            SlotFoo: [
                {
                    id: spanChildKey,
                },
            ],
        });
    });
});

describe("mapVSCodeHTMLAndDataDictionaryToDataDictionary", () => {
    it("should map a parsed HTML value to a data dictionary", () => {
        const html = mapVSCodeHTMLAndDataDictionaryToDataDictionary(
            "",
            "text",
            [
                {
                    root: {
                        schemaId: "div",
                        data: {
                            foo: "bar",
                        },
                    },
                },
                "root",
            ],
            {
                div: {
                    mapsToTagName: "div",
                },
            }
        );

        const keys = Object.keys(html[0]);

        expect(keys).to.have.length(1);
        expect(html[0][html[1]]).to.deep.equal({
            data: "",
            parent: undefined,
            schemaId: "text",
        });
    });
    describe("should map an existing data dictionary item with values to a parsed HTML value", () => {
        it("originating from the message system", () => {
            expect(
                mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                    '<ul id="baz"></ul>',
                    "text",
                    [
                        {
                            root: {
                                schemaId: "div",
                                data: {
                                    foo: "bar",
                                },
                            },
                        },
                        "root",
                    ],
                    {
                        div: {
                            $id: "div",
                            mapsToTagName: "div",
                        },
                        ul: {
                            $id: "ul",
                            mapsToTagName: "ul",
                        },
                    }
                )
            ).to.deep.equal([
                {
                    root: {
                        schemaId: "ul",
                        data: {
                            id: "baz",
                        },
                    },
                },
                "root",
            ]);
        });
    });
    it("should map an existing data dictionary with children to a parsed HTML value with children", () => {
        expect(
            mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                '<div id="baz"><span></span></div>',
                "text",
                [
                    {
                        root: {
                            schemaId: "div",
                            data: {
                                foo: "bar",
                                Slot: [
                                    {
                                        id: "foo",
                                    },
                                ],
                            },
                        },
                        foo: {
                            schemaId: "span",
                            parent: {
                                dataLocation: "Slot",
                                id: "root",
                            },
                            data: {},
                        },
                    },
                    "root",
                ],
                {
                    div: {
                        $id: "div",
                        mapsToTagName: "div",
                        properties: {
                            Slot: {
                                mapsToSlot: "",
                            },
                        },
                    },
                    span: {
                        $id: "span",
                        mapsToTagName: "span",
                        properties: {
                            Slot: {
                                mapsToSlot: "",
                            },
                        },
                    },
                }
            )
        ).to.deep.equal([
            {
                root: {
                    schemaId: "div",
                    data: {
                        id: "baz",
                        Slot: [
                            {
                                id: "foo",
                            },
                        ],
                    },
                },
                foo: {
                    schemaId: "span",
                    parent: {
                        dataLocation: "Slot",
                        id: "root",
                    },
                    data: {},
                },
            },
            "root",
        ]);
    });
    it("should map an existing data dictionary item with children to an existing parsed HTML value without children", () => {
        expect(
            mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                '<div id="baz"></div>',
                "text",
                [
                    {
                        root: {
                            schemaId: "div",
                            data: {
                                foo: "bar",
                                Slot: [
                                    {
                                        id: "foo",
                                    },
                                ],
                            },
                        },
                        foo: {
                            schemaId: "span",
                            parent: {
                                dataLocation: "Slot",
                                id: "root",
                            },
                            data: {},
                        },
                    },
                    "root",
                ],
                {
                    div: {
                        mapsToTagName: "div",
                        properties: {
                            Slot: {
                                mapsToSlot: "",
                            },
                        },
                    },
                }
            )
        ).to.deep.equal([
            {
                root: {
                    schemaId: "div",
                    data: {
                        id: "baz",
                    },
                },
            },
            "root",
        ]);
    });
    it("should map an existing data dictionary item without children to an existing parsed HTML value with a child node", () => {
        const mappedData = mapVSCodeHTMLAndDataDictionaryToDataDictionary(
            '<div id="baz"><span></span></div>',
            "text",
            [
                {
                    root: {
                        schemaId: "div",
                        data: {
                            foo: "bar",
                        },
                    },
                },
                "root",
            ],
            {
                div: {
                    $id: "div",
                    id: "div",
                    mapsToTagName: "div",
                    properties: {
                        Slot: {
                            mapsToSlot: "",
                        },
                    },
                },
                span: {
                    $id: "span",
                    id: "span",
                    mapsToTagName: "span",
                    properties: {
                        Slot: {
                            mapsToSlot: "",
                        },
                    },
                },
            }
        );

        const keys = Object.keys(mappedData[0]);

        expect(keys).to.have.length(2);
        expect((mappedData[0][mappedData[1]].data as any).Slot).to.deep.equal([
            {
                id: keys[1],
            },
        ]);
        expect(mappedData[0][keys[1]]).to.deep.equal({
            schemaId: "span",
            parent: {
                dataLocation: "Slot",
                id: "root",
            },
            data: {},
        });
    });
    it("should map an existing data dictionary item without children to an existing parsed HTML value with multiple child nodes", () => {
        const mappedData = mapVSCodeHTMLAndDataDictionaryToDataDictionary(
            '<div id="baz"><span></span><input /></div>',
            "text",
            [
                {
                    root: {
                        schemaId: "div",
                        data: {
                            foo: "bar",
                        },
                    },
                },
                "root",
            ],
            {
                div: {
                    $id: "div",
                    id: "div",
                    mapsToTagName: "div",
                    properties: {
                        Slot: {
                            mapsToSlot: "",
                        },
                    },
                },
                span: {
                    $id: "span",
                    id: "span",
                    mapsToTagName: "span",
                    properties: {
                        Slot: {
                            mapsToSlot: "",
                        },
                    },
                },
                input: {
                    $id: "input",
                    id: "input",
                    mapsToTagName: "input",
                    properties: {},
                },
            }
        );

        const keys = Object.keys(mappedData[0]);

        expect(keys).to.have.length(3);
        expect((mappedData[0][keys[0]].data as any).Slot).to.deep.equal([
            {
                id: keys[1],
            },
            {
                id: keys[2],
            },
        ]);
    });
    it("should map an existing data dictionary item without children to an existing parsed HTML value with a text node", () => {
        const mappedData = mapVSCodeHTMLAndDataDictionaryToDataDictionary(
            '<div id="baz">FooBar</div>',
            "text",
            [
                {
                    root: {
                        schemaId: "div",
                        data: {
                            foo: "bar",
                        },
                    },
                },
                "root",
            ],
            {
                div: {
                    $id: "div",
                    id: "div",
                    mapsToTagName: "div",
                    properties: {
                        Slot: {
                            mapsToSlot: "",
                        },
                    },
                },
                text: {
                    $id: "text",
                    id: "text",
                    type: "string",
                },
            }
        );

        const keys = Object.keys(mappedData[0]);

        expect(keys).to.have.length(2);
        expect((mappedData[0][keys[0]].data as any).Slot).to.deep.equal([
            {
                id: keys[1],
            },
        ]);
        expect(mappedData[0][keys[1]]).to.deep.equal({
            schemaId: "text",
            parent: {
                id: "root",
                dataLocation: "Slot",
            },
            data: "FooBar",
        });
    });
    it("should map an existing data dictionary with multiple matching children to an existing parsed HTML value with multiple children", () => {
        const schemaDictionary: SchemaDictionary = {
            div: {
                $id: "div",
                id: "div",
                mapsToTagName: "div",
                properties: {
                    Slot: {
                        mapsToSlot: "",
                    },
                },
            },
            span: {
                $id: "span",
                id: "span",
                mapsToTagName: "span",
                properties: {
                    Slot: {
                        mapsToSlot: "",
                    },
                },
            },
            text: {
                $id: "text",
                id: "text",
                type: "string",
            },
        };
        const mappedData1 = mapVSCodeHTMLAndDataDictionaryToDataDictionary(
            '<div id="baz">FooBar<span></span></div>',
            "text",
            [
                {
                    root: {
                        schemaId: "div",
                        data: {
                            foo: "bar",
                            Slot: [
                                {
                                    id: "bar",
                                },
                                {
                                    id: "foo",
                                },
                            ],
                        },
                    },
                    foo: {
                        schemaId: "span",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: {},
                    },
                    bar: {
                        schemaId: "text",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: "FooBar",
                    },
                },
                "root",
            ],
            schemaDictionary
        );
        const keys1 = Object.keys(mappedData1[0]);
        const mappedData2 = mapVSCodeHTMLAndDataDictionaryToDataDictionary(
            '<div id="baz"><span></span>FooBar</div>',
            "text",
            [
                {
                    root: {
                        schemaId: "div",
                        data: {
                            foo: "bar",
                            Slot: [
                                {
                                    id: "foo",
                                },
                                {
                                    id: "bar",
                                },
                            ],
                        },
                    },
                    foo: {
                        schemaId: "span",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: {},
                    },
                    bar: {
                        schemaId: "text",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: "FooBar",
                    },
                },
                "root",
            ],
            schemaDictionary
        );
        const keys2 = Object.keys(mappedData2[0]);

        expect(keys1).to.have.length(3);
        expect(mappedData1).to.deep.equal([
            {
                root: {
                    schemaId: "div",
                    data: {
                        id: "baz",
                        Slot: [
                            {
                                id: "bar",
                            },
                            {
                                id: "foo",
                            },
                        ],
                    },
                },
                foo: {
                    schemaId: "span",
                    parent: {
                        id: "root",
                        dataLocation: "Slot",
                    },
                    data: {},
                },
                bar: {
                    schemaId: "text",
                    parent: {
                        id: "root",
                        dataLocation: "Slot",
                    },
                    data: "FooBar",
                },
            },
            "root",
        ]);
        expect(keys2).to.have.length(3);
        expect(mappedData2).to.deep.equal([
            {
                root: {
                    schemaId: "div",
                    data: {
                        id: "baz",
                        Slot: [
                            {
                                id: "foo",
                            },
                            {
                                id: "bar",
                            },
                        ],
                    },
                },
                foo: {
                    schemaId: "span",
                    parent: {
                        id: "root",
                        dataLocation: "Slot",
                    },
                    data: {},
                },
                bar: {
                    schemaId: "text",
                    parent: {
                        id: "root",
                        dataLocation: "Slot",
                    },
                    data: "FooBar",
                },
            },
            "root",
        ]);
    });
    it("should map an existing data dictionary with multiple children to an existing parsed HTML value with multiple matching children and new children", () => {
        const mappedData = mapVSCodeHTMLAndDataDictionaryToDataDictionary(
            '<div id="baz"><span></span>FooBar<div></div></div>',
            "text",
            [
                {
                    root: {
                        schemaId: "div",
                        data: {
                            foo: "bar",
                            Slot: [
                                {
                                    id: "foo",
                                },
                                {
                                    id: "bar",
                                },
                            ],
                        },
                    },
                    foo: {
                        schemaId: "span",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: {},
                    },
                    bar: {
                        schemaId: "text",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: "FooBar",
                    },
                },
                "root",
            ],
            {
                div: {
                    $id: "div",
                    id: "div",
                    mapsToTagName: "div",
                    properties: {
                        Slot: {
                            mapsToSlot: "",
                        },
                    },
                },
                span: {
                    $id: "span",
                    id: "span",
                    mapsToTagName: "span",
                    properties: {
                        Slot: {
                            mapsToSlot: "",
                        },
                    },
                },
                text: {
                    $id: "text",
                    id: "text",
                    type: "string",
                },
            }
        );

        const keys = Object.keys(mappedData[0]);

        expect(keys).to.have.length(4);
        expect((mappedData[0].root.data as any).Slot).to.have.length(3);
        expect((mappedData[0].root.data as any).Slot[2]).to.deep.equal({
            id: keys[3],
        });
        expect(mappedData[0][keys[3]]).to.deep.equal({
            schemaId: "div",
            parent: {
                id: "root",
                dataLocation: "Slot",
            },
            data: {},
        });
    });
    it("should map an existing data dictionary with multiple matching children to an existing parsed HTML value with multiple children and missing children", () => {
        const mappedData = mapVSCodeHTMLAndDataDictionaryToDataDictionary(
            '<div id="baz"><span></span></div>',
            "text",
            [
                {
                    root: {
                        schemaId: "div",
                        data: {
                            foo: "bar",
                            Slot: [
                                {
                                    id: "foo",
                                },
                                {
                                    id: "bar",
                                },
                            ],
                        },
                    },
                    foo: {
                        schemaId: "span",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: {},
                    },
                    bar: {
                        schemaId: "text",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: "FooBar",
                    },
                },
                "root",
            ],
            {
                div: {
                    $id: "div",
                    id: "div",
                    mapsToTagName: "div",
                    properties: {
                        Slot: {
                            mapsToSlot: "",
                        },
                    },
                },
                span: {
                    $id: "span",
                    id: "span",
                    mapsToTagName: "span",
                    properties: {
                        Slot: {
                            mapsToSlot: "",
                        },
                    },
                },
                text: {
                    $id: "text",
                    id: "text",
                    type: "string",
                },
            }
        );

        expect(mappedData).to.deep.equal([
            {
                root: {
                    schemaId: "div",
                    data: {
                        id: "baz",
                        Slot: [
                            {
                                id: "foo",
                            },
                        ],
                    },
                },
                foo: {
                    schemaId: "span",
                    parent: {
                        id: "root",
                        dataLocation: "Slot",
                    },
                    data: {},
                },
            },
            "root",
        ]);
    });
    it("should map an existing data dictionary with named slots to an existing parsed HTML value with named slots", () => {
        const mappedData = mapVSCodeHTMLAndDataDictionaryToDataDictionary(
            '<div id="baz"><span slot="test"></span></div>',
            "text",
            [
                {
                    root: {
                        schemaId: "div",
                        data: {
                            foo: "bar",
                            SlotTest: [
                                {
                                    id: "foo",
                                },
                            ],
                        },
                    },
                    foo: {
                        schemaId: "span",
                        parent: {
                            id: "root",
                            dataLocation: "SlotTest",
                        },
                        data: {
                            slot: "test",
                        },
                    },
                },
                "root",
            ],
            {
                div: {
                    $id: "div",
                    id: "div",
                    mapsToTagName: "div",
                    properties: {
                        Slot: {
                            mapsToSlot: "",
                        },
                        SlotTest: {
                            mapsToSlot: "test",
                        },
                    },
                },
                span: {
                    $id: "span",
                    id: "span",
                    mapsToTagName: "span",
                    properties: {
                        Slot: {
                            mapsToSlot: "",
                        },
                    },
                },
            }
        );

        expect(mappedData).to.deep.equal([
            {
                root: {
                    schemaId: "div",
                    data: {
                        id: "baz",
                        SlotTest: [
                            {
                                id: "foo",
                            },
                        ],
                    },
                },
                foo: {
                    schemaId: "span",
                    parent: {
                        id: "root",
                        dataLocation: "SlotTest",
                    },
                    data: {
                        slot: "test",
                    },
                },
            },
            "root",
        ]);
    });
    it("should map an existing data dictionary to an existing parsed HTML value with a partial tag", () => {
        const mappedData = mapVSCodeHTMLAndDataDictionaryToDataDictionary(
            '<div id="baz"><</div>',
            "text",
            [
                {
                    root: {
                        schemaId: "div",
                        data: {
                            foo: "bar",
                        },
                    },
                },
                "root",
            ],
            {
                div: {
                    $id: "div",
                    id: "div",
                    mapsToTagName: "div",
                    properties: {
                        Slot: {
                            mapsToSlot: "",
                        },
                    },
                },
            }
        );

        const keys = Object.keys(mappedData[0]);

        expect(keys).to.have.length(2);
        expect(mappedData[0][keys[1]]).to.deep.equal({
            schemaId: "text",
            parent: {
                id: "root",
                dataLocation: "Slot",
            },
            data: "<",
        });
    });
    it("should map an existing data dictionary to an existing parsed HTML value with a partial tag", () => {
        const mappedData = mapVSCodeHTMLAndDataDictionaryToDataDictionary(
            '<div id="baz"><div><</div>',
            "text",
            [
                {
                    root: {
                        schemaId: "div",
                        data: {
                            foo: "bar",
                            Slot: [
                                {
                                    id: "foo",
                                },
                            ],
                        },
                    },
                    foo: {
                        schemaId: "div",
                        parent: {
                            id: "root",
                            dataLocation: "Slot",
                        },
                        data: {},
                    },
                },
                "root",
            ],
            {
                div: {
                    $id: "div",
                    id: "div",
                    mapsToTagName: "div",
                    properties: {
                        Slot: {
                            mapsToSlot: "",
                        },
                        SlotTest: {
                            mapsToSlot: "test",
                        },
                    },
                },
            }
        );

        const keys = Object.keys(mappedData[0]);

        expect(keys).to.have.length(3);
        expect(mappedData[0][keys[1]].data).to.deep.equal({
            Slot: [
                {
                    id: keys[2],
                },
            ],
        });
        expect(mappedData[0][keys[2]]).to.deep.equal({
            schemaId: "text",
            parent: {
                id: "foo",
                dataLocation: "Slot",
            },
            data: "<",
        });
    });
    it("should map an un-parsable attribute without throwing an error", () => {
        let mappedData;

        expect(() => {
            mappedData = mapVSCodeHTMLAndDataDictionaryToDataDictionary(
                '<div id="></div>',
                "text",
                [
                    {
                        root: {
                            schemaId: "div",
                            data: {
                                foo: "bar",
                            },
                        },
                    },
                    "root",
                ],
                {
                    div: {
                        $id: "div",
                        id: "div",
                        mapsToTagName: "div",
                        properties: {
                            Slot: {
                                mapsToSlot: "",
                            },
                        },
                    },
                }
            );
        }).not.to.throw();
        expect(mappedData[0].root).to.deep.equal({
            schemaId: "div",
            data: {
                id: "",
            },
        });
    });
});
