import { set } from "lodash-es";
import { DataDictionary } from "../message-system";
import { linkedDataSchema } from "../schemas";
import {
    htmlMapper,
    htmlResolver,
    mapDataDictionary,
    MapperConfig,
    mapWebComponentDefinitionToJSONSchema,
    ResolverConfig,
} from "./mapping";
import { DataType, ReservedElementMappingKeyword } from "./types";

describe("mapDataDictionary", () => {
    test("should call a passed mapper and resolver function on a single data dictionary item", () => {
        const mapper: any = jest.fn();
        const resolver: any = jest.fn();

        mapDataDictionary({
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {},
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    type: "object",
                },
            },
            mapper,
            resolver,
        });

        expect(mapper).toHaveBeenCalledTimes(1);
        expect(resolver).toHaveBeenCalledTimes(1);
    });
    test("should call a passed mapper and resolver function on multiple dictionary items", () => {
        const mapper: any = jest.fn();
        const resolver: any = jest.fn();

        mapDataDictionary({
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {
                            a: "b",
                            children: [
                                {
                                    id: "foo",
                                },
                            ],
                        },
                    },
                    foo: {
                        schemaId: "foo",
                        parent: {
                            id: "",
                            dataLocation: "children",
                        },
                        data: {
                            c: "d",
                        },
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    type: "object",
                },
            },
            mapper,
            resolver,
        });

        expect(mapper).toHaveBeenCalledTimes(2);
        expect(resolver).toHaveBeenCalledTimes(2);
    });
    test("should map a single dictionary entry", () => {
        const mapper: any = function (config: MapperConfig<any>): any {
            config.dataDictionary[0][config.dictionaryId].data =
                config.dataDictionary[0][config.dictionaryId].data;
        };
        const resolver: any = function (config: ResolverConfig<any>): any {
            const dataBlob = config.dataDictionary[0][config.dataDictionary[1]].data;

            if (config.dataDictionary[0][config.dictionaryId].parent) {
                set(
                    dataBlob as object,
                    config.dataDictionary[0][config.dataDictionary[1]].parent
                        .dataLocation,
                    config.dataDictionary[0][config.parent].data
                );
            }

            return dataBlob;
        };

        const result: any = mapDataDictionary({
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {
                            a: "b",
                        },
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    type: "object",
                },
            },
            mapper,
            resolver,
        });

        expect(result).toEqual({
            a: "b",
        });
    });
    test("should map multiple dictionary entries", () => {
        const mapper: any = function (config: MapperConfig<any>): any {
            config.dataDictionary[0][config.dictionaryId].data =
                config.dataDictionary[0][config.dictionaryId].data;
        };
        const resolver: any = function (config: ResolverConfig<any>): any {
            if (config.dataDictionary[0][config.dictionaryId].parent) {
                set(
                    config.dataDictionary[0][config.parent].data as object,
                    config.dataDictionary[0][config.dictionaryId].parent.dataLocation,
                    config.dataDictionary[0][config.dictionaryId].data
                );

                return config.dataDictionary[0][config.parent].data;
            }

            return config.resolvedData;
        };
        const result: any = mapDataDictionary({
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {
                            a: "b",
                            children: [
                                {
                                    id: "foo",
                                },
                            ],
                        },
                    },
                    foo: {
                        schemaId: "foo",
                        parent: {
                            id: "",
                            dataLocation: "children",
                        },
                        data: {
                            c: "d",
                        },
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    type: "object",
                },
            },
            mapper,
            resolver,
        });

        expect(result).toEqual({
            a: "b",
            children: {
                c: "d",
            },
        });
    });
});

describe("htmlMapper", () => {
    test("should map a string to data", () => {
        const textString = "Hello world";
        const text = document.createTextNode(textString);
        const dataDictionary: DataDictionary<any> = [
            {
                "": {
                    schemaId: "text",
                    data: textString,
                },
            },
            "",
        ];
        htmlMapper({
            version: 1,
        })({
            dataDictionary,
            dictionaryId: "",
            schema: {
                id: "text",
                type: "string",
            },
            mapperPlugins: [],
        });
        expect(dataDictionary[0][""].data).toEqual(text);
    });
    test("should map an element to data", () => {
        const dataDictionary: DataDictionary<any> = [
            {
                "": {
                    schemaId: "foo",
                    data: {},
                },
            },
            "",
        ];
        htmlMapper({
            version: 1,
            tags: [
                {
                    name: "div",
                    description: "foobar",
                    attributes: [],
                    slots: [],
                },
            ],
        })({
            dataDictionary,
            dictionaryId: "",
            schema: {
                id: "foo",
                [ReservedElementMappingKeyword.mapsToTagName]: "div",
                type: "object",
            },
            mapperPlugins: [],
        });
        expect(dataDictionary[0][""].data).toEqual(document.createElement("div"));
    });
    test("should not map an element when that element is not an object", () => {
        expect(
            htmlMapper({
                version: 1,
                tags: [
                    {
                        name: "div",
                        description: "foobar",
                        attributes: [],
                        slots: [],
                    },
                ],
            })({
                dataDictionary: [
                    {
                        "": {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "",
                ],
                dictionaryId: "",
                schema: {
                    id: "foo",
                    [ReservedElementMappingKeyword.mapsToTagName]: "div",
                    type: "string",
                },
                mapperPlugins: [],
            })
        ).toEqual(undefined);
    });
    test("should not map an element when that element is not available", () => {
        expect(
            htmlMapper({
                version: 1,
                tags: [],
            })({
                dataDictionary: [
                    {
                        "": {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "",
                ],
                dictionaryId: "",
                schema: {
                    id: "foo",
                    [ReservedElementMappingKeyword.mapsToTagName]: "div",
                    type: "object",
                },
                mapperPlugins: [],
            })
        ).toEqual(undefined);
    });
    test("should map an element with an attribute", () => {
        const element = {
            id: "foo",
        };

        const mappedElement = document.createElement("div");
        mappedElement.setAttribute("id", "foo");
        const dataDictionary: DataDictionary<any> = [
            {
                "": {
                    schemaId: "foo",
                    data: element,
                },
            },
            "",
        ];
        htmlMapper({
            version: 1,
            tags: [
                {
                    name: "div",
                    description: "foobar",
                    attributes: [],
                    slots: [],
                },
            ],
        })({
            dataDictionary,
            dictionaryId: "",
            schema: {
                id: "foo",
                [ReservedElementMappingKeyword.mapsToTagName]: "div",
                type: "object",
            },
            mapperPlugins: [],
        });

        expect(dataDictionary[0][""].data).toEqual(mappedElement);
    });
    test("should map an element with an attribute and ignore any slots", () => {
        const element = {
            id: "foo",
            Slot: "Hello world",
        };

        const mappedElement = document.createElement("div");
        mappedElement.setAttribute("id", "foo");
        const dataDictionary: DataDictionary<any> = [
            {
                "": {
                    schemaId: "foo",
                    data: element,
                },
            },
            "",
        ];
        htmlMapper({
            version: 1,
            tags: [
                {
                    name: "div",
                    description: "foobar",
                    attributes: [],
                    slots: [
                        {
                            name: "",
                            description: "The default slot",
                        },
                    ],
                },
            ],
        })({
            dataDictionary,
            dictionaryId: "",
            schema: {
                id: "foo",
                [ReservedElementMappingKeyword.mapsToTagName]: "div",
                type: "object",
                properties: {
                    Slot: {
                        [ReservedElementMappingKeyword.mapsToSlot]: "",
                    },
                },
            },
            mapperPlugins: [],
        });
        expect(dataDictionary[0][""].data).toEqual(mappedElement);
    });
    test("should map an element nested within another element with a default slot", () => {
        const mapper = htmlMapper({
            version: 1,
            tags: [
                {
                    name: "button",
                    description: "foobar",
                    attributes: [],
                    slots: [
                        {
                            name: "",
                            description: "The default slot",
                        },
                    ],
                },
                {
                    name: "div",
                    description: "foobar",
                    attributes: [],
                    slots: [
                        {
                            name: "",
                            description: "The default slot",
                        },
                    ],
                },
            ],
        });

        const result: any = mapDataDictionary({
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {
                            Slot: [
                                {
                                    id: "foo",
                                },
                            ],
                        },
                    },
                    foo: {
                        schemaId: "bar",
                        parent: {
                            id: "",
                            dataLocation: "Slot",
                        },
                        data: {
                            Slot: [
                                {
                                    id: "bat",
                                },
                            ],
                        },
                    },
                    bat: {
                        schemaId: "bat",
                        parent: {
                            id: "foo",
                            dataLocation: "Slot",
                        },
                        data: "Hello world",
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    id: "foo",
                    [ReservedElementMappingKeyword.mapsToTagName]: "div",
                    type: "object",
                    properties: {
                        Slot: {
                            [ReservedElementMappingKeyword.mapsToSlot]: "",
                        },
                    },
                },
                bar: {
                    id: "bar",
                    [ReservedElementMappingKeyword.mapsToTagName]: "button",
                    type: "object",
                    properties: {
                        Slot: {
                            [ReservedElementMappingKeyword.mapsToSlot]: "",
                        },
                    },
                },
                bat: {
                    id: "bat",
                    type: "string",
                },
            },
            mapper,
            resolver: htmlResolver,
        });

        const mappedElement = document.createElement("div");
        const buttonElement = document.createElement("button");
        buttonElement.textContent = "Hello world";
        mappedElement.append(buttonElement);

        expect(result).toEqual(mappedElement);
    });
    test("should map an element nested within another element with a named slot", () => {
        const mapper = htmlMapper({
            version: 1,
            tags: [
                {
                    name: "button",
                    description: "foobar",
                    attributes: [],
                    slots: [
                        {
                            name: "",
                            description: "The default slot",
                        },
                    ],
                },
                {
                    name: "div",
                    description: "foobar",
                    attributes: [],
                    slots: [
                        {
                            name: "",
                            description: "The default slot",
                        },
                        {
                            name: "foo",
                            description: "The foo slot",
                        },
                    ],
                },
            ],
        });

        const result: any = mapDataDictionary({
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {
                            SlotFoo: [
                                {
                                    id: "foo",
                                },
                            ],
                        },
                    },
                    foo: {
                        schemaId: "bar",
                        parent: {
                            id: "",
                            dataLocation: "SlotFoo",
                        },
                        data: {
                            Slot: [
                                {
                                    id: "bat",
                                },
                            ],
                        },
                    },
                    bat: {
                        schemaId: "undefined",
                        parent: {
                            id: "foo",
                            dataLocation: "Slot",
                        },
                        data: "Hello world",
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    id: "foo",
                    [ReservedElementMappingKeyword.mapsToTagName]: "div",
                    type: "object",
                    properties: {
                        Slot: {
                            [ReservedElementMappingKeyword.mapsToSlot]: "",
                        },
                        SlotFoo: {
                            [ReservedElementMappingKeyword.mapsToSlot]: "foo",
                        },
                    },
                },
                bar: {
                    id: "bar",
                    [ReservedElementMappingKeyword.mapsToTagName]: "button",
                    type: "object",
                    properties: {
                        Slot: {
                            [ReservedElementMappingKeyword.mapsToSlot]: "",
                        },
                    },
                },
                bat: {
                    id: "bat",
                    type: "string",
                },
            },
            mapper,
            resolver: htmlResolver,
        });

        const mappedElement = document.createElement("div");
        const buttonElement = document.createElement("button");
        buttonElement.setAttribute("slot", "foo");
        buttonElement.textContent = "Hello world";
        mappedElement.append(buttonElement);

        expect(result).toEqual(mappedElement);
    });
    test("should map an element with multiple text strings into a slot", () => {
        const mapper = htmlMapper({
            version: 1,
            tags: [
                {
                    name: "button",
                    description: "foobar",
                    attributes: [],
                    slots: [
                        {
                            name: "",
                            description: "The default slot",
                        },
                    ],
                },
            ],
        });

        const result: any = mapDataDictionary({
            dataDictionary: [
                {
                    "": {
                        schemaId: "foo",
                        data: {
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
                        schemaId: "bar",
                        parent: {
                            id: "",
                            dataLocation: "Slot",
                        },
                        data: "Hello",
                    },
                    bar: {
                        schemaId: "bar",
                        parent: {
                            id: "",
                            dataLocation: "Slot",
                        },
                        data: "world",
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    id: "foo",
                    [ReservedElementMappingKeyword.mapsToTagName]: "button",
                    type: "object",
                    properties: {
                        Slot: {
                            [ReservedElementMappingKeyword.mapsToSlot]: "",
                        },
                    },
                },
                bar: {
                    id: "bar",
                    type: "string",
                },
            },
            mapper,
            resolver: htmlResolver,
        });

        const mappedElement = document.createElement("button");
        const text1 = document.createTextNode("Hello");
        const text2 = document.createTextNode("world");
        mappedElement.append(text1);
        mappedElement.append(text2);

        expect(result).toEqual(mappedElement);
    });
    test("should map an element with mixed text string and element into a slot", () => {
        const mapper = htmlMapper({
            version: 1,
            tags: [
                {
                    name: "button",
                    description: "foobar",
                    attributes: [],
                    slots: [
                        {
                            name: "",
                            description: "The default slot",
                        },
                    ],
                },
                {
                    name: "div",
                    description: "foobar",
                    attributes: [],
                    slots: [
                        {
                            name: "",
                            description: "The default slot",
                        },
                    ],
                },
            ],
        });

        const result: any = mapDataDictionary({
            dataDictionary: [
                {
                    "": {
                        schemaId: "bat",
                        data: {
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
                        schemaId: "bar",
                        parent: {
                            id: "",
                            dataLocation: "Slot",
                        },
                        data: "Hello world",
                    },
                    bar: {
                        schemaId: "foo",
                        parent: {
                            id: "",
                            dataLocation: "Slot",
                        },
                        data: {
                            Slot: [
                                {
                                    id: "bat",
                                },
                            ],
                        },
                    },
                    bat: {
                        schemaId: "bar",
                        parent: {
                            id: "bar",
                            dataLocation: "Slot",
                        },
                        data: "Button",
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    id: "foo",
                    [ReservedElementMappingKeyword.mapsToTagName]: "button",
                    type: "object",
                    properties: {
                        Slot: {
                            [ReservedElementMappingKeyword.mapsToSlot]: "",
                        },
                    },
                },
                bar: {
                    id: "bar",
                    type: "string",
                },
                bat: {
                    id: "bat",
                    [ReservedElementMappingKeyword.mapsToTagName]: "div",
                    type: "object",
                    properties: {
                        Slot: {
                            [ReservedElementMappingKeyword.mapsToSlot]: "",
                        },
                    },
                },
            },
            mapper,
            resolver: htmlResolver,
        });

        const mappedElement = document.createElement("div");
        mappedElement.textContent = "Hello world";
        const buttonElement = document.createElement("button");
        buttonElement.textContent = "Button";
        mappedElement.append(buttonElement);

        expect(result).toEqual(mappedElement);
    });
    test("should map an element with mixed text string and element into a slot", () => {
        const mapper = htmlMapper({
            version: 1,
            tags: [
                {
                    name: "button",
                    description: "foobar",
                    attributes: [],
                    slots: [
                        {
                            name: "",
                            description: "The default slot",
                        },
                    ],
                },
                {
                    name: "div",
                    description: "foobar",
                    attributes: [],
                    slots: [
                        {
                            name: "",
                            description: "The default slot",
                        },
                    ],
                },
            ],
        });

        const result: any = mapDataDictionary({
            dataDictionary: [
                {
                    "": {
                        schemaId: "bat",
                        data: {
                            Slot: [
                                {
                                    id: "foo",
                                },
                                {
                                    id: "bar",
                                },
                                {
                                    id: "bat",
                                },
                            ],
                        },
                    },
                    bar: {
                        schemaId: "foo",
                        parent: {
                            id: "",
                            dataLocation: "Slot",
                        },
                        data: {},
                    },
                    foo: {
                        schemaId: "bar",
                        parent: {
                            id: "",
                            dataLocation: "Slot",
                        },
                        data: "Hello world",
                    },
                    bat: {
                        schemaId: "bar",
                        parent: {
                            id: "",
                            dataLocation: "Slot",
                        },
                        data: "Button",
                    },
                },
                "",
            ],
            schemaDictionary: {
                foo: {
                    id: "foo",
                    [ReservedElementMappingKeyword.mapsToTagName]: "button",
                    type: "object",
                    properties: {
                        Slot: {
                            [ReservedElementMappingKeyword.mapsToSlot]: "",
                        },
                    },
                },
                bar: {
                    id: "bar",
                    type: "string",
                },
                bat: {
                    id: "bat",
                    [ReservedElementMappingKeyword.mapsToTagName]: "div",
                    type: "object",
                    properties: {
                        Slot: {
                            [ReservedElementMappingKeyword.mapsToSlot]: "",
                        },
                    },
                },
            },
            mapper,
            resolver: htmlResolver,
        });

        const mappedElement = document.createElement("div");
        const text1 = document.createTextNode("Hello world");
        const buttonElement = document.createElement("button");
        const text2 = document.createTextNode("Button");
        mappedElement.append(text1);
        mappedElement.append(buttonElement);
        mappedElement.append(text2);

        expect(result).toEqual(mappedElement);
    });
});

describe("mapWebComponentDefinitionToJSONSchema", () => {
    test("should not throw", () => {
        expect(() => mapWebComponentDefinitionToJSONSchema({ version: 1 })).not.toThrow();
    });
    test("should map attributes and slots to the JSON schema", () => {
        const name: string = "foo";
        const description: string = "foo tag";
        const attrName: string = "attr";
        const attrDescription: string = "An attribute";
        const slotName: string = "";
        const slotDescription: string = "Default slot";

        expect(
            mapWebComponentDefinitionToJSONSchema({
                version: 1,
                tags: [
                    {
                        name,
                        description: "foo tag",
                        attributes: [
                            {
                                name: attrName,
                                description: attrDescription,
                                type: DataType.string,
                                default: "foobar",
                                required: false,
                            },
                        ],
                        slots: [
                            {
                                name: slotName,
                                description: slotDescription,
                            },
                        ],
                    },
                ],
            })
        ).toEqual([
            {
                $schema: "http://json-schema.org/schema#",
                $id: name,
                id: name,
                title: description,
                type: "object",
                version: 1,
                required: ["version"],
                [ReservedElementMappingKeyword.mapsToTagName]: name,
                properties: {
                    [attrName]: {
                        [ReservedElementMappingKeyword.mapsToAttribute]: attrName,
                        title: attrDescription,
                        type: DataType.string,
                    },
                    [`Slot${slotName}`]: {
                        [ReservedElementMappingKeyword.mapsToSlot]: slotName,
                        title: slotDescription,
                        ...linkedDataSchema,
                    },
                },
            },
        ]);
    });
});
