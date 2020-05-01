import { getLinkedDataDictionary } from "./data";
import { LinkedDataPromise } from "./data.props";

describe("getLinkedDataDictionary", () => {
    test("should get a linked data dictionary", () => {
        const root: string = "rootLocation";
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
                    },
                ],
                dictionaryId: root,
                dataLocation,
            })
        ).toEqual({
            dataDictionary: [
                {
                    fast1: {
                        schemaId,
                        data,
                        parent: {
                            id: root,
                            dataLocation,
                        },
                        items: [],
                    },
                },
                root,
            ],
            linkedDataIds: [
                {
                    id: "fast1",
                },
            ],
        });
    });
    test("should get a linked data dictionary with nested linked data", () => {
        const root: string = "rootLocation";
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
        };
        const nestedLinkedData: LinkedDataPromise = {
            schemaId: "bar",
            data: {
                hello: "pluto",
            },
            linkedData: [nestedNestedLinkedData, nestedNestedLinkedData],
            linkedDataLocation: nestedLinkedDataLocation,
        };

        expect(
            getLinkedDataDictionary({
                linkedData: [
                    {
                        schemaId,
                        data,
                        linkedDataLocation,
                        linkedData: [nestedLinkedData],
                    },
                ],
                dictionaryId: root,
                dataLocation,
            })
        ).toEqual({
            dataDictionary: [
                {
                    fast2: {
                        schemaId,
                        data,
                        parent: {
                            id: root,
                            dataLocation,
                        },
                        items: ["fast3"],
                    },
                    fast3: {
                        schemaId: nestedLinkedData.schemaId,
                        data: nestedLinkedData.data,
                        parent: {
                            id: "fast2",
                            dataLocation: linkedDataLocation,
                        },
                        items: ["fast4", "fast5"],
                    },
                    fast4: {
                        schemaId: nestedNestedLinkedData.schemaId,
                        data: nestedNestedLinkedData.data,
                        parent: {
                            id: "fast3",
                            dataLocation: nestedLinkedDataLocation,
                        },
                        items: [],
                    },
                    fast5: {
                        schemaId: nestedNestedLinkedData.schemaId,
                        data: nestedNestedLinkedData.data,
                        parent: {
                            id: "fast3",
                            dataLocation: nestedLinkedDataLocation,
                        },
                        items: [],
                    },
                },
                root,
            ],
            linkedDataIds: [
                {
                    id: "fast2",
                },
                {
                    id: "fast3",
                },
                {
                    id: "fast4",
                },
                {
                    id: "fast5",
                },
            ],
        });
    });
});
