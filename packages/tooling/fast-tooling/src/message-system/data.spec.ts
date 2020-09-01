import { getLinkedData, getLinkedDataDictionary, getLinkedDataList } from "./data";
import { LinkedDataDictionaryUpdate, LinkedDataPromise } from "./data.props";

describe("getLinkedDataDictionary", () => {
    test("should get a linked data dictionary", () => {
        const dictionaryId: string = "root";
        const dataLocation: string = "foo";
        const schemaId: string = "foobar";
        const data: any = {
            hello: "world",
        };

        expect(
            getLinkedDataDictionary({
                linkedData: [
                    {
                        schemaId,
                        data,
                        dataLocation,
                    },
                ],
                dictionaryId,
                dataLocation: "root-location",
            })
        ).toEqual({
            dataDictionary: [
                {
                    fast1: {
                        schemaId,
                        data,
                        parent: {
                            id: dictionaryId,
                            dataLocation,
                        },
                    },
                },
                "fast1",
            ],
            dictionaryId,
        } as LinkedDataDictionaryUpdate);
    });
    test("should get a linked data dictionary with nested linked data", () => {
        const dictionaryId: string = "root";
        const dataLocation: string = "foo";
        const schemaId: string = "foobar";
        const data: any = {
            hello: "world",
        };
        const linkedDataLocation: string = "greeting";
        const nestedLinkedDataLocation: string = "beep";
        const nestedNestedLinkedData: LinkedDataPromise = {
            schemaId: "bar",
            data: {
                foo: "bar",
            },
            dataLocation: nestedLinkedDataLocation,
        };
        const nestedLinkedData: LinkedDataPromise = {
            schemaId: "bar",
            data: {
                hello: "pluto",
            },
            linkedData: [nestedNestedLinkedData, nestedNestedLinkedData],
            dataLocation: linkedDataLocation,
        };

        expect(
            getLinkedDataDictionary({
                linkedData: [
                    {
                        schemaId,
                        data,
                        dataLocation,
                        linkedData: [nestedLinkedData],
                    },
                ],
                dictionaryId,
                dataLocation: "root-location",
            })
        ).toEqual({
            dataDictionary: [
                {
                    fast2: {
                        schemaId,
                        data: {
                            ...data,
                            [linkedDataLocation]: [
                                {
                                    id: "fast3",
                                },
                            ],
                        },
                        parent: {
                            id: dictionaryId,
                            dataLocation,
                        },
                    },
                    fast3: {
                        schemaId: nestedLinkedData.schemaId,
                        data: {
                            ...(nestedLinkedData.data as any),
                            [nestedLinkedDataLocation]: [
                                {
                                    id: "fast4",
                                },
                                {
                                    id: "fast5",
                                },
                            ],
                        },
                        parent: {
                            id: "fast2",
                            dataLocation: linkedDataLocation,
                        },
                    },
                    fast4: {
                        schemaId: nestedNestedLinkedData.schemaId,
                        data: nestedNestedLinkedData.data,
                        parent: {
                            id: "fast3",
                            dataLocation: nestedLinkedDataLocation,
                        },
                    },
                    fast5: {
                        schemaId: nestedNestedLinkedData.schemaId,
                        data: nestedNestedLinkedData.data,
                        parent: {
                            id: "fast3",
                            dataLocation: nestedLinkedDataLocation,
                        },
                    },
                },
                "fast2",
            ],
            dictionaryId,
        } as LinkedDataDictionaryUpdate);
    });
    test("should get a linked data dictionary with multiple nested linked data", () => {
        const dictionaryId: string = "root";
        const dataLocation: string = "foo";
        const schemaId: string = "foobar";
        const data: any = {
            hello: "world",
        };
        const linkedDataLocation1: string = "a";
        const linkedDataLocation2: string = "b";
        const nestedNestedLinkedData1: LinkedDataPromise = {
            schemaId: "bar",
            data: {
                foo: "bar",
            },
            dataLocation: linkedDataLocation1,
        };
        const nestedNestedLinkedData2: LinkedDataPromise = {
            schemaId: "foo",
            data: {
                foo: "bat",
            },
            dataLocation: linkedDataLocation2,
        };

        expect(
            getLinkedDataDictionary({
                linkedData: [
                    {
                        schemaId,
                        data,
                        dataLocation,
                        linkedData: [nestedNestedLinkedData1, nestedNestedLinkedData2],
                    },
                ],
                dictionaryId,
                dataLocation: "root-location",
            })
        ).toEqual({
            dataDictionary: [
                {
                    fast6: {
                        schemaId,
                        data: {
                            ...data,
                            [linkedDataLocation1]: [
                                {
                                    id: "fast7",
                                },
                            ],
                            [linkedDataLocation2]: [
                                {
                                    id: "fast8",
                                },
                            ],
                        },
                        parent: {
                            id: dictionaryId,
                            dataLocation,
                        },
                    },
                    fast7: {
                        schemaId: nestedNestedLinkedData1.schemaId,
                        data: {
                            ...(nestedNestedLinkedData1.data as any),
                        },
                        parent: {
                            id: "fast6",
                            dataLocation: linkedDataLocation1,
                        },
                    },
                    fast8: {
                        schemaId: nestedNestedLinkedData2.schemaId,
                        data: nestedNestedLinkedData2.data,
                        parent: {
                            id: "fast6",
                            dataLocation: linkedDataLocation2,
                        },
                    },
                },
                "fast6",
            ],
            dictionaryId,
        } as LinkedDataDictionaryUpdate);
    });
});

describe("getLinkedData", () => {
    test("should get a linked data set", () => {
        expect(
            getLinkedData(
                [
                    {
                        root: {
                            schemaId: "foo",
                            data: {},
                        },
                    },
                    "root",
                ],
                ["root"]
            )
        ).toEqual([
            {
                data: {},
                linkedData: [],
                schemaId: "foo",
            },
        ]);
    });
    test("should get a nested linked data set", () => {
        expect(
            getLinkedData(
                [
                    {
                        root: {
                            schemaId: "foo",
                            data: {
                                hello: "world",
                                linkedData: [
                                    {
                                        id: "nestedItem",
                                    },
                                ],
                            },
                        },
                        nestedItem: {
                            parent: {
                                id: "root",
                                dataLocation: "linkedData",
                            },
                            schemaId: "bar",
                            data: {
                                hello: "pluto",
                            },
                        },
                    },
                    "root",
                ],
                ["root"]
            )
        ).toEqual([
            {
                schemaId: "foo",
                data: {
                    hello: "world",
                },
                linkedData: [
                    {
                        schemaId: "bar",
                        data: {
                            hello: "pluto",
                        },
                        linkedData: [],
                    },
                ],
            },
        ]);
    });
});

describe("getLinkedDataList", () => {
    test("should get an empty list if an item does not contain linked data", () => {
        expect(
            getLinkedDataList(
                [
                    {
                        foo: {
                            data: {
                                bat: [
                                    {
                                        id: "bar",
                                    },
                                ],
                            },
                            schemaId: "foo",
                        },
                        bar: {
                            parent: {
                                id: "foo",
                                dataLocation: "bat",
                            },
                            data: {},
                            schemaId: "bar",
                        },
                    },
                    "foo",
                ],
                "bar"
            )
        ).toEqual([]);
    });
    test("should get a single key if the provided dictionary item contains a single linked data item", () => {
        expect(
            getLinkedDataList(
                [
                    {
                        foo: {
                            data: {
                                bat: [
                                    {
                                        id: "bar",
                                    },
                                ],
                            },
                            schemaId: "foo",
                        },
                        bar: {
                            parent: {
                                id: "foo",
                                dataLocation: "bat",
                            },
                            data: {},
                            schemaId: "bar",
                        },
                        bat: {
                            parent: {
                                id: "bar",
                                dataLocation: "bat",
                            },
                            data: {},
                            schemaId: "bar",
                        },
                    },
                    "foo",
                ],
                "bar"
            )
        ).toEqual(["bat"]);
    });
    test("should get multiple keys if the provided dictionary item contains multiple linked data items", () => {
        expect(
            getLinkedDataList(
                [
                    {
                        foo: {
                            data: {
                                bat: [
                                    {
                                        id: "bar",
                                    },
                                ],
                            },
                            schemaId: "foo",
                        },
                        bar: {
                            parent: {
                                id: "foo",
                                dataLocation: "bat",
                            },
                            data: {},
                            schemaId: "bar",
                        },
                        bat: {
                            parent: {
                                id: "bar",
                                dataLocation: "bat",
                            },
                            data: {},
                            schemaId: "bar",
                        },
                        baz: {
                            parent: {
                                id: "bar",
                                dataLocation: "bat",
                            },
                            data: {},
                            schemaId: "bar",
                        },
                    },
                    "foo",
                ],
                "bar"
            )
        ).toEqual(["bat", "baz"]);
    });
    test("should get multiple keys if the provided dictionary item contains a single linked data item that contains another linked data item", () => {
        expect(
            getLinkedDataList(
                [
                    {
                        foo: {
                            data: {
                                bat: [
                                    {
                                        id: "bar",
                                    },
                                ],
                            },
                            schemaId: "foo",
                        },
                        bar: {
                            parent: {
                                id: "foo",
                                dataLocation: "bat",
                            },
                            data: {},
                            schemaId: "bar",
                        },
                        bat: {
                            parent: {
                                id: "bar",
                                dataLocation: "bat",
                            },
                            data: {},
                            schemaId: "bar",
                        },
                        baz: {
                            parent: {
                                id: "bat",
                                dataLocation: "bat",
                            },
                            data: {},
                            schemaId: "bar",
                        },
                    },
                    "foo",
                ],
                "bar"
            )
        ).toEqual(["bat", "baz"]);
    });
});
