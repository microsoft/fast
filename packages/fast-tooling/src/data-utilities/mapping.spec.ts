import { mapDataDictionary, MapperConfig } from "./mapping";

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
