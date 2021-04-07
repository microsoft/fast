import { expect } from "chai";
import { getLinkedData, getLinkedDataDictionary, getLinkedDataList } from "./data";
import { Data, LinkedDataPromise } from "./data.props";

describe("getLinkedDataDictionary", () => {
    it("should get a linked data dictionary", () => {
        const dictionaryId: string = "root";
        const dataLocation: string = "foo";
        const schemaId: string = "foobar";
        const data: any = {
            hello: "world",
        };
        const linkedDataDictionary = getLinkedDataDictionary({
            linkedData: [
                {
                    schemaId,
                    data,
                    dataLocation,
                },
            ],
            dictionaryId,
            dataLocation: "root-location",
        });
        const linkedDataDictionaryKeys = Object.keys(
            linkedDataDictionary.dataDictionary[0]
        );

        expect(linkedDataDictionaryKeys).to.have.length(1);
        expect(linkedDataDictionary.dictionaryId).to.equal(dictionaryId);
        expect(
            linkedDataDictionary.dataDictionary[0][linkedDataDictionary.dataDictionary[1]]
        ).to.deep.equal({
            schemaId,
            data,
            parent: {
                id: dictionaryId,
                dataLocation,
            },
        } as Data<unknown>);
    });
    it("should get a linked data dictionary with nested linked data", () => {
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
        const linkedDataDictionary = getLinkedDataDictionary({
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
        });
        const linkedDataDictionaryKeys = Object.keys(
            linkedDataDictionary.dataDictionary[0]
        );

        expect(linkedDataDictionaryKeys).to.have.length(4);
        expect(linkedDataDictionary.dictionaryId).to.equal(dictionaryId);
    });
    it("should get a linked data dictionary with multiple nested linked data", () => {
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
        const linkedDataDictionary = getLinkedDataDictionary({
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
        });
        const linkedDataDictionaryKeys = Object.keys(
            linkedDataDictionary.dataDictionary[0]
        );

        expect(linkedDataDictionaryKeys).to.have.length(3);
    });
});

describe("getLinkedData", () => {
    it("should get a linked data set", () => {
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
        ).to.deep.equal([
            {
                data: {},
                linkedData: [],
                schemaId: "foo",
            },
        ]);
    });
    it("should get a nested linked data set", () => {
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
        ).to.deep.equal([
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
    it("should get an empty list if an item does not contain linked data", () => {
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
        ).to.deep.equal([]);
    });
    it("should get a single key if the provided dictionary item contains a single linked data item", () => {
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
        ).to.deep.equal(["bat"]);
    });
    it("should get multiple keys if the provided dictionary item contains multiple linked data items", () => {
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
        ).to.deep.equal(["bat", "baz"]);
    });
    it("should get multiple keys if the provided dictionary item contains a single linked data item that contains another linked data item", () => {
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
        ).to.deep.equal(["bat", "baz"]);
    });
});
