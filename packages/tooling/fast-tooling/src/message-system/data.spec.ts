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
        const nestedLinkedData: LinkedDataPromise = {
            schemaId: "bar",
            data: {
                hello: "pluto",
            },
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
                        items: [],
                    },
                },
                root,
            ],
            linkedDataIds: [
                {
                    id: "fast2",
                },
            ],
        });
    });
});
