import { getLinkedDataDictionary } from "./data";
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
