import { mapVSCodeParsedHTMLToDataDictionary } from "./mapping.vscode-html-languageservice";
import { DataType } from "./types";

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
    },
};

describe("mapVSCodeParsedHTMLToDataDictionary", () => {
    test("should not throw an error if the HTML array is empty", () => {
        expect(() => {
            mapVSCodeParsedHTMLToDataDictionary({
                value: [],
                schemaDictionary: {},
            });
        }).not.toThrow();
    });
    test("should return a DataDictionary containing a text node if a text node is passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["foobar"],
            schemaDictionary: {
                [textSchema.id]: textSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).toEqual({
            schemaId: textSchema.id,
            data: "foobar",
        });
    });
    test("should return a DataDictionary containing an HTML element if an HTML element has been passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<div>", "</div>"],
            schemaDictionary: {
                [divSchema.id]: divSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).toEqual({
            schemaId: divSchema.id,
            data: {},
        });
    });
    test("should return a DataDictionary containing an HTML element and ignore newlines", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<div>\n", "</div>"],
            schemaDictionary: {
                [divSchema.id]: divSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).toEqual({
            schemaId: divSchema.id,
            data: {},
        });
    });
    test("should return a DataDictionary containing an HTML element with a string attribute if an HTML element with a string attribute has been passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ['<input id="bar" />'],
            schemaDictionary: {
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).toEqual({
            schemaId: inputSchema.id,
            data: {
                id: "bar",
            },
        });
    });
    test("should return a DataDictionary containing an HTML element with a number attribute if an HTML element with a number attribute has been passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ['<input value="5" />'],
            schemaDictionary: {
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).toEqual({
            schemaId: inputSchema.id,
            data: {
                value: 5,
            },
        });
    });
    test("should return a DataDictionary containing an HTML element with a boolean attribute if an HTML element with a boolean attribute has been passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<input required />"],
            schemaDictionary: {
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).toEqual({
            schemaId: inputSchema.id,
            data: {
                required: true,
            },
        });
    });
    test("should return a DataDictionary containing an HTML element with a string attribute if an HTML element with a string attribute has been passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ['<input name="foo" />'],
            schemaDictionary: {
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).toEqual({
            schemaId: inputSchema.id,
            data: {
                name: "foo",
            },
        });
    });
    test("should return a DataDictionary containing an HTML element with a JSON schema unspecified string attribute if an HTML element with a string attribute has been passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ['<input data-id="foo" />'],
            schemaDictionary: {
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).toEqual({
            schemaId: inputSchema.id,
            data: {
                "data-id": "foo",
            },
        });
    });
    test("should return a DataDictionary containing an HTML element with a JSON schema unspecified null attribute if an HTML element with a null attribute has been passed", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<input data-id />"],
            schemaDictionary: {
                [inputSchema.id]: inputSchema,
            },
        });
        const root: string = value[1];
        expect(value[0][root]).toEqual({
            schemaId: inputSchema.id,
            data: {
                "data-id": true,
            },
        });
    });
    test("should return a DataDictionary containing an HTML element with a JSON schema unspecified half written string attribute if an HTML element with an incomplete attribute has been passed", () => {
        expect(() => {
            mapVSCodeParsedHTMLToDataDictionary({
                value: ["<input data-id= bar />"],
                schemaDictionary: {
                    [inputSchema.id]: inputSchema,
                },
            });
        }).not.toThrow();
    });
    test("should return a DataDictionary containing an HTML element nested inside another HTML element", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<div>", "<input />", "</div>"],
            schemaDictionary: {
                [inputSchema.id]: inputSchema,
                [divSchema.id]: divSchema,
            },
        });
        const root: string = value[1];
        const childKey: string = (value[0][root].data as any).Slot[0].id;

        expect(typeof childKey).toEqual("string");
        expect(value[0][childKey].schemaId).toEqual(inputSchema.id);
        expect(value[0][childKey].data).toEqual({});
        expect(value[0][childKey].parent.id).toEqual(root);
        expect(value[0][childKey].parent.dataLocation).toEqual("Slot");
    });
    test("should return a DataDictionary containing an HTML element containing a text node", () => {
        const value = mapVSCodeParsedHTMLToDataDictionary({
            value: ["<div>", "foobar", "</div>"],
            schemaDictionary: {
                [textSchema.id]: textSchema,
                [divSchema.id]: divSchema,
            },
        });
        const root: string = value[1];
        const childKey: string = (value[0][root].data as any).Slot[0].id;

        expect(typeof childKey).toEqual("string");
        expect(value[0][childKey].schemaId).toEqual(textSchema.id);
        expect(value[0][childKey].data).toEqual("foobar");
        expect(value[0][childKey].parent.id).toEqual(root);
        expect(value[0][childKey].parent.dataLocation).toEqual("Slot");
    });
    test("should return a DataDictionary containing an HTML element containing a text node preceeding an HTML element", () => {
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

        expect(typeof stringChildKey).toEqual("string");
        expect(value[0][stringChildKey].schemaId).toEqual(textSchema.id);
        expect(value[0][stringChildKey].data).toEqual("foobar");
        expect(value[0][stringChildKey].parent.id).toEqual(root);
        expect(value[0][stringChildKey].parent.dataLocation).toEqual("Slot");
        expect(typeof inputChildKey).toEqual("string");
        expect(value[0][inputChildKey].schemaId).toEqual(inputSchema.id);
        expect(value[0][inputChildKey].data).toEqual({});
        expect(value[0][inputChildKey].parent.id).toEqual(root);
        expect(value[0][inputChildKey].parent.dataLocation).toEqual("Slot");
    });
    test("should return a DataDictionary containing an HTML element containing a text node following an HTML element", () => {
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

        expect(typeof inputChildKey).toEqual("string");
        expect(value[0][inputChildKey].schemaId).toEqual(inputSchema.id);
        expect(value[0][inputChildKey].data).toEqual({});
        expect(value[0][inputChildKey].parent.id).toEqual(root);
        expect(value[0][inputChildKey].parent.dataLocation).toEqual("Slot");
        expect(typeof stringChildKey).toEqual("string");
        expect(value[0][stringChildKey].schemaId).toEqual(textSchema.id);
        expect(value[0][stringChildKey].data).toEqual("foobar");
        expect(value[0][stringChildKey].parent.id).toEqual(root);
        expect(value[0][stringChildKey].parent.dataLocation).toEqual("Slot");
    });
    test("should return a DataDictionary containing an HTML element containing a text node bookended by HTML elements", () => {
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

        expect(typeof inputChildKey1).toEqual("string");
        // expect(value[0][inputChildKey1].schemaId).toEqual(inputSchema.id);
        expect(value[0][inputChildKey1].data).toEqual({});
        expect(value[0][inputChildKey1].parent.id).toEqual(root);
        expect(value[0][inputChildKey1].parent.dataLocation).toEqual("Slot");
        expect(typeof stringChildKey).toEqual("string");
        expect(value[0][stringChildKey].schemaId).toEqual(textSchema.id);
        expect(value[0][stringChildKey].data).toEqual("foobar");
        expect(value[0][stringChildKey].parent.id).toEqual(root);
        expect(value[0][stringChildKey].parent.dataLocation).toEqual("Slot");
        expect(typeof inputChildKey2).toEqual("string");
        expect(value[0][inputChildKey2].schemaId).toEqual(inputSchema.id);
        expect(value[0][inputChildKey2].data).toEqual({});
        expect(value[0][inputChildKey2].parent.id).toEqual(root);
        expect(value[0][inputChildKey2].parent.dataLocation).toEqual("Slot");
    });
});
