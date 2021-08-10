import { expect } from "chai";
import { linkedDataSchema } from "../schemas";
import { mapDataDictionaryToMonacoEditorHTML } from "./monaco";
import { ReservedElementMappingKeyword } from "./types";

describe("mapDataDictionaryToMonacoEditorHTML", () => {
    it("should not map a data dictionary if no schema dictionaries conform to entries", () => {
        const text = "Hello world";
        expect(
            mapDataDictionaryToMonacoEditorHTML(
                [
                    {
                        root: {
                            schemaId: "text",
                            data: text,
                        },
                    },
                    "root",
                ],
                {}
            )
        ).to.equal("");
    });
    it("should map a data dictionary with a single string entry", () => {
        const text = "Hello world";
        expect(
            mapDataDictionaryToMonacoEditorHTML(
                [
                    {
                        root: {
                            schemaId: "text",
                            data: text,
                        },
                    },
                    "root",
                ],
                {
                    text: {
                        id: "text",
                        type: "string",
                    },
                }
            )
        ).to.equal(text);
    });
    it("should not map a data dictionary with no mapsToTagName", () => {
        const text = "";
        expect(
            mapDataDictionaryToMonacoEditorHTML(
                [
                    {
                        root: {
                            schemaId: "input",
                            data: {},
                        },
                    },
                    "root",
                ],
                {
                    input: {
                        id: "input",
                        type: "object",
                    },
                }
            )
        ).to.equal(text);
    });
    it("should map a data dictionary with a single self closing entry", () => {
        const text = "<input />";
        expect(
            mapDataDictionaryToMonacoEditorHTML(
                [
                    {
                        root: {
                            schemaId: "input",
                            data: {},
                        },
                    },
                    "root",
                ],
                {
                    input: {
                        id: "input",
                        type: "object",
                        [ReservedElementMappingKeyword.mapsToTagName]: "input",
                    },
                }
            )
        ).to.equal(text);
    });
    it("should map a data dictionary with a single element entry", () => {
        const text = "<div></div>";
        expect(
            mapDataDictionaryToMonacoEditorHTML(
                [
                    {
                        root: {
                            schemaId: "div",
                            data: {},
                        },
                    },
                    "root",
                ],
                {
                    div: {
                        id: "div",
                        type: "object",
                        [ReservedElementMappingKeyword.mapsToTagName]: "div",
                    },
                }
            )
        ).to.equal(text);
    });
    it("should map a data dictionary with nested entries", () => {
        const text = "<div>Hello world</div>";
        expect(
            mapDataDictionaryToMonacoEditorHTML(
                [
                    {
                        root: {
                            schemaId: "div",
                            data: {
                                Slot: [
                                    {
                                        id: "text",
                                    },
                                ],
                            },
                        },
                        text: {
                            schemaId: "text",
                            parent: {
                                id: "root",
                                dataLocation: "Slot",
                            },
                            data: "Hello world",
                        },
                    },
                    "root",
                ],
                {
                    div: {
                        id: "div",
                        type: "object",
                        [ReservedElementMappingKeyword.mapsToTagName]: "div",
                    },
                    text: {
                        id: "text",
                        type: "string",
                    },
                }
            )
        ).to.equal(text);
    });
    it("should map a data dictionary with multiple nested entries", () => {
        const text = "<div><span>Hello world</span></div>";
        expect(
            mapDataDictionaryToMonacoEditorHTML(
                [
                    {
                        root: {
                            schemaId: "div",
                            data: {
                                Slot: [
                                    {
                                        id: "span",
                                    },
                                ],
                            },
                        },
                        span: {
                            schemaId: "span",
                            parent: {
                                id: "root",
                                dataLocation: "Slot",
                            },
                            data: {
                                Slot: [
                                    {
                                        id: "text",
                                    },
                                ],
                            },
                        },
                        text: {
                            schemaId: "text",
                            parent: {
                                id: "span",
                                dataLocation: "Slot",
                            },
                            data: "Hello world",
                        },
                    },
                    "root",
                ],
                {
                    div: {
                        id: "div",
                        type: "object",
                        [ReservedElementMappingKeyword.mapsToTagName]: "div",
                    },
                    span: {
                        id: "span",
                        type: "object",
                        [ReservedElementMappingKeyword.mapsToTagName]: "span",
                    },
                    text: {
                        id: "text",
                        type: "string",
                    },
                }
            )
        ).to.equal(text);
    });
    it("should map a data dictionary with named and unnamed slotted nested entries", () => {
        const text = '<div><span slot="foo">Hello world</span></div>';
        expect(
            mapDataDictionaryToMonacoEditorHTML(
                [
                    {
                        root: {
                            schemaId: "div",
                            data: {
                                SlotFoo: [
                                    {
                                        id: "span",
                                    },
                                ],
                            },
                        },
                        span: {
                            schemaId: "span",
                            parent: {
                                id: "root",
                                dataLocation: "SlotFoo",
                            },
                            data: {
                                Slot: [
                                    {
                                        id: "text",
                                    },
                                ],
                            },
                        },
                        text: {
                            schemaId: "text",
                            parent: {
                                id: "span",
                                dataLocation: "Slot",
                            },
                            data: "Hello world",
                        },
                    },
                    "root",
                ],
                {
                    div: {
                        id: "div",
                        type: "object",
                        [ReservedElementMappingKeyword.mapsToTagName]: "div",
                        properties: {
                            SlotFoo: {
                                [ReservedElementMappingKeyword.mapsToSlot]: "foo",
                                ...linkedDataSchema,
                            },
                        },
                    },
                    span: {
                        id: "span",
                        type: "object",
                        [ReservedElementMappingKeyword.mapsToTagName]: "span",
                    },
                    text: {
                        id: "text",
                        type: "string",
                    },
                }
            )
        ).to.equal(text);
    });
    it("should map a data dictionary with multiple named slotted entries", () => {
        const text =
            '<div><span slot="foo">Hello world</span><span slot="foo">Hello pluto</span></div>';
        expect(
            mapDataDictionaryToMonacoEditorHTML(
                [
                    {
                        root: {
                            schemaId: "div",
                            data: {
                                SlotFoo: [
                                    {
                                        id: "span1",
                                    },
                                    {
                                        id: "span2",
                                    },
                                ],
                            },
                        },
                        span1: {
                            schemaId: "span",
                            parent: {
                                id: "root",
                                dataLocation: "SlotFoo",
                            },
                            data: {
                                Slot: [
                                    {
                                        id: "text1",
                                    },
                                ],
                            },
                        },
                        text1: {
                            schemaId: "text",
                            parent: {
                                id: "span1",
                                dataLocation: "Slot",
                            },
                            data: "Hello world",
                        },
                        span2: {
                            schemaId: "span",
                            parent: {
                                id: "root",
                                dataLocation: "SlotFoo",
                            },
                            data: {
                                Slot: [
                                    {
                                        id: "text2",
                                    },
                                ],
                            },
                        },
                        text2: {
                            schemaId: "text",
                            parent: {
                                id: "span2",
                                dataLocation: "Slot",
                            },
                            data: "Hello pluto",
                        },
                    },
                    "root",
                ],
                {
                    div: {
                        id: "div",
                        type: "object",
                        [ReservedElementMappingKeyword.mapsToTagName]: "div",
                        properties: {
                            SlotFoo: {
                                [ReservedElementMappingKeyword.mapsToSlot]: "foo",
                                ...linkedDataSchema,
                            },
                        },
                    },
                    span: {
                        id: "span",
                        type: "object",
                        [ReservedElementMappingKeyword.mapsToTagName]: "span",
                    },
                    text: {
                        id: "text",
                        type: "string",
                    },
                }
            )
        ).to.equal(text);
    });
    it("should map a data dictionary with multiple different named slotted entries", () => {
        const text =
            '<div><span slot="foo">Hello world</span><span id="foo1" title="foo2" slot="bar">Hello pluto</span></div>';
        expect(
            mapDataDictionaryToMonacoEditorHTML(
                [
                    {
                        root: {
                            schemaId: "div",
                            data: {
                                SlotFoo: [
                                    {
                                        id: "span1",
                                    },
                                ],
                                SlotBar: [
                                    {
                                        id: "span2",
                                    },
                                ],
                            },
                        },
                        span1: {
                            schemaId: "span",
                            parent: {
                                id: "root",
                                dataLocation: "SlotFoo",
                            },
                            data: {
                                Slot: [
                                    {
                                        id: "text1",
                                    },
                                ],
                            },
                        },
                        text1: {
                            schemaId: "text",
                            parent: {
                                id: "span1",
                                dataLocation: "Slot",
                            },
                            data: "Hello world",
                        },
                        span2: {
                            schemaId: "span",
                            parent: {
                                id: "root",
                                dataLocation: "SlotBar",
                            },
                            data: {
                                id: "foo1",
                                title: "foo2",
                                Slot: [
                                    {
                                        id: "text2",
                                    },
                                ],
                            },
                        },
                        text2: {
                            schemaId: "text",
                            parent: {
                                id: "span2",
                                dataLocation: "Slot",
                            },
                            data: "Hello pluto",
                        },
                    },
                    "root",
                ],
                {
                    div: {
                        id: "div",
                        type: "object",
                        [ReservedElementMappingKeyword.mapsToTagName]: "div",
                        properties: {
                            SlotFoo: {
                                [ReservedElementMappingKeyword.mapsToSlot]: "foo",
                                ...linkedDataSchema,
                            },
                            SlotBar: {
                                [ReservedElementMappingKeyword.mapsToSlot]: "bar",
                                ...linkedDataSchema,
                            },
                        },
                    },
                    span: {
                        id: "span",
                        type: "object",
                        [ReservedElementMappingKeyword.mapsToTagName]: "span",
                        properties: {
                            id: {
                                type: "string",
                            },
                            title: {
                                type: "string",
                            },
                        },
                    },
                    text: {
                        id: "text",
                        type: "string",
                    },
                }
            )
        ).to.equal(text);
    });
    it("should map a data dictionary with attributes with a single self closing entry", () => {
        const text = '<input title="foo" disabled count="5" />';
        expect(
            mapDataDictionaryToMonacoEditorHTML(
                [
                    {
                        root: {
                            schemaId: "input",
                            data: {
                                title: "foo",
                                required: false,
                                disabled: true,
                                count: 5,
                            },
                        },
                    },
                    "root",
                ],
                {
                    input: {
                        id: "input",
                        type: "object",
                        [ReservedElementMappingKeyword.mapsToTagName]: "input",
                    },
                }
            )
        ).to.equal(text);
    });
    it("should map a data dictionary with attributes with a single element entry", () => {
        const text = '<div id="foo"></div>';
        expect(
            mapDataDictionaryToMonacoEditorHTML(
                [
                    {
                        root: {
                            schemaId: "div",
                            data: {
                                id: "foo",
                            },
                        },
                    },
                    "root",
                ],
                {
                    div: {
                        id: "div",
                        type: "object",
                        [ReservedElementMappingKeyword.mapsToTagName]: "div",
                    },
                }
            )
        ).to.equal(text);
    });
    it("should map a data dictionary with multiple out of order nested entries at the same level", () => {
        const text = "<div><span>Hello world</span><div>Hello pluto</div></div>";
        expect(
            mapDataDictionaryToMonacoEditorHTML(
                [
                    {
                        root: {
                            schemaId: "div",
                            data: {
                                Slot: [
                                    {
                                        id: "span",
                                    },
                                    {
                                        id: "div",
                                    },
                                ],
                            },
                        },
                        div: {
                            schemaId: "div",
                            parent: {
                                id: "root",
                                dataLocation: "Slot",
                            },
                            data: {
                                Slot: [
                                    {
                                        id: "text2",
                                    },
                                ],
                            },
                        },
                        span: {
                            schemaId: "span",
                            parent: {
                                id: "root",
                                dataLocation: "Slot",
                            },
                            data: {
                                Slot: [
                                    {
                                        id: "text",
                                    },
                                ],
                            },
                        },
                        text2: {
                            schemaId: "text",
                            parent: {
                                id: "div",
                                dataLocation: "Slot",
                            },
                            data: "Hello pluto",
                        },
                        text: {
                            schemaId: "text",
                            parent: {
                                id: "span",
                                dataLocation: "Slot",
                            },
                            data: "Hello world",
                        },
                    },
                    "root",
                ],
                {
                    div: {
                        id: "div",
                        type: "object",
                        [ReservedElementMappingKeyword.mapsToTagName]: "div",
                    },
                    span: {
                        id: "span",
                        type: "object",
                        [ReservedElementMappingKeyword.mapsToTagName]: "span",
                    },
                    text: {
                        id: "text",
                        type: "string",
                    },
                }
            )
        ).to.equal(text);
    });
});
