import { htmlMapper, mapDataDictionary, MapperConfig } from "./mapping";
import { ElementByTagName, ReservedElementMappingKeyword } from "./types";

describe("mapDataDictionary", () => {
    test("should call a passed mapper function on a single data dictionary item", () => {
        const mapper: any = jest.fn();

        mapDataDictionary({
            dataDictionary: {
                "": {
                    schemaId: "foo",
                    data: {},
                },
            },
            dataDictionaryKey: "",
            schemaDictionary: {
                foo: {
                    type: "object",
                },
            },
            mapper,
        });

        expect(mapper).toHaveBeenCalledTimes(1);
    });
    test("should call a passed mapper function on multiple dictionary items", () => {
        const mapper: any = jest.fn();

        mapDataDictionary({
            dataDictionary: {
                "": {
                    schemaId: "foo",
                    data: {
                        a: "b",
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
            dataDictionaryKey: "",
            schemaDictionary: {
                foo: {
                    type: "object",
                },
            },
            mapper,
        });

        expect(mapper).toHaveBeenCalledTimes(2);
    });
    test("should map a single dictionary entry", () => {
        const mapper: any = function(config: MapperConfig<any>): any {
            return config.resolvedData;
        };

        const result: any = mapDataDictionary({
            dataDictionary: {
                "": {
                    schemaId: "foo",
                    data: {
                        a: "b",
                    },
                },
            },
            dataDictionaryKey: "",
            schemaDictionary: {
                foo: {
                    type: "object",
                },
            },
            mapper,
        });

        expect(result).toEqual({
            a: "b",
        });
    });
    test("should map multiple dictionary entries", () => {
        const mapper: any = function(config: MapperConfig<any>): any {
            return config.resolvedData;
        };

        const result: any = mapDataDictionary({
            dataDictionary: {
                "": {
                    schemaId: "foo",
                    data: {
                        a: "b",
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
            dataDictionaryKey: "",
            schemaDictionary: {
                foo: {
                    type: "object",
                },
            },
            mapper,
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
    test("should map a string to data in the data dictionary", () => {
        const textString: string = "Hello world";
        expect(
            htmlMapper({
                version: 1,
            })({
                data: textString,
                resolvedData: textString,
                schema: {
                    id: "text",
                    type: "string",
                },
            })
        ).toEqual(textString);
    });
    test("should map an element to data in the data dictionary", () => {
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
                data: {},
                resolvedData: {},
                schema: {
                    id: "foo",
                    [ReservedElementMappingKeyword.mapsToTagName]: "div",
                    type: "object",
                },
            })
        ).toEqual(document.createElement("div"));
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
                data: {},
                resolvedData: {},
                schema: {
                    id: "foo",
                    [ReservedElementMappingKeyword.mapsToTagName]: "div",
                    type: "string",
                },
            })
        ).toEqual(undefined);
    });
    test("should not map an element when that element is not available", () => {
        expect(
            htmlMapper({
                version: 1,
                tags: [],
            })({
                data: {},
                resolvedData: {},
                schema: {
                    id: "foo",
                    [ReservedElementMappingKeyword.mapsToTagName]: "div",
                    type: "object",
                },
            })
        ).toEqual(undefined);
    });
    test("should map an element with an attribute to the data dictionary", () => {
        const element = {
            id: "foo",
        };

        const mappedElement = document.createElement("div");
        mappedElement.setAttribute("id", "foo");

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
                data: element,
                resolvedData: element,
                schema: {
                    id: "foo",
                    [ReservedElementMappingKeyword.mapsToTagName]: "div",
                    type: "object",
                },
            })
        ).toEqual(mappedElement);
    });
    test("should map an element with a default slot to the data dictionary", () => {
        const element = {
            Slot: "Hello world",
        };

        const mappedElement = document.createElement("button");
        mappedElement.textContent = element.Slot;

        expect(
            htmlMapper({
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
            })({
                data: element,
                resolvedData: element,
                schema: {
                    id: "foo",
                    [ReservedElementMappingKeyword.mapsToTagName]: "button",
                    type: "object",
                    properties: {
                        Slot: {
                            [ReservedElementMappingKeyword.mapsToSlot]: "",
                        },
                    },
                },
            })
        ).toEqual(mappedElement);
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
            dataDictionary: {
                "": {
                    schemaId: "foo",
                    data: {},
                },
                foo: {
                    schemaId: "bar",
                    parent: {
                        id: "",
                        dataLocation: "Slot",
                    },
                    data: {},
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
            dataDictionaryKey: "",
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
            },
            mapper,
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
            dataDictionary: {
                "": {
                    schemaId: "foo",
                    data: {},
                },
                foo: {
                    schemaId: "bar",
                    parent: {
                        id: "",
                        dataLocation: "SlotFoo",
                    },
                    data: {},
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
            dataDictionaryKey: "",
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
        });

        const mappedElement = document.createElement("div");
        const buttonElement = document.createElement("button");
        buttonElement.setAttribute("slot", "foo");
        buttonElement.textContent = "Hello world";
        mappedElement.append(buttonElement);

        expect(result).toEqual(mappedElement);
    });
});
