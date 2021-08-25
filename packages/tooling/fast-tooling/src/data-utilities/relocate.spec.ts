import { Dictionary } from "lodash";
import { expect } from "chai";
import {
    getDataUpdatedWithoutSourceData,
    getDataUpdatedWithSourceData,
    getNextActiveParentDictionaryId,
} from "./relocate";
import { DataType } from "./types";

/**
 * Gets updated data by adding data to a data blob
 */
describe("getDataUpdatedWithSourceData", () => {
    it("should update an undefined target with source data", () => {
        const data: Dictionary<unknown> = {
            foo: "bar",
        };
        const targetDataLocation: string = "bat";
        const sourceData: string = "Hello world";
        const updatedData: unknown = getDataUpdatedWithSourceData({
            data,
            targetDataType: DataType.object,
            sourceData,
            targetDataLocation,
        });

        expect(updatedData).to.deep.equal({
            ...data,
            [targetDataLocation]: sourceData,
        });
    });
    it("should update a array target with source data", () => {
        const data: Dictionary<unknown> = {
            foo: ["bar"],
        };
        const targetDataLocation: string = "foo[0]";
        const sourceData: string = "Hello world";
        const updatedData: unknown = getDataUpdatedWithSourceData({
            data,
            targetDataType: DataType.array,
            sourceData,
            targetDataLocation,
        });

        expect(updatedData).to.deep.equal({
            foo: ["Hello world", "bar"],
        });
    });
    it("should update a target above an array item with source data", () => {
        const data: Dictionary<unknown> = {
            foo: ["a", "c", "d"],
        };
        const targetDataLocation: string = "foo[1]";
        const sourceData: string = "b";
        const updatedData: unknown = getDataUpdatedWithSourceData({
            data,
            sourceData,
            targetDataLocation,
            targetDataType: DataType.array,
        });

        expect(updatedData).to.deep.equal({
            foo: ["a", "b", "c", "d"],
        });
    });
    it("should update a target in an undefined array with source data", () => {
        const data: Dictionary<unknown> = {
            foo: void 0,
        };
        const targetDataLocation: string = "foo[0]";
        const sourceData: string = "b";
        const updatedData: unknown = getDataUpdatedWithSourceData({
            data,
            sourceData,
            targetDataLocation,
            targetDataType: DataType.array,
        });

        expect(updatedData).to.deep.equal({
            foo: ["b"],
        });
    });
    it("should update a target in an array at the root level with source data", () => {
        const data: Dictionary<unknown> = void 0;
        const targetDataLocation: string = "[0]";
        const sourceData: string = "b";
        const updatedData: unknown = getDataUpdatedWithSourceData({
            data,
            sourceData,
            targetDataLocation,
            targetDataType: DataType.array,
        });

        expect(updatedData).to.deep.equal(["b"]);
    });
    it("should update a target below an array item with source data", () => {
        const data: Dictionary<unknown> = {
            foo: ["a", "b", "d"],
        };
        const targetDataLocation: string = "foo[2]";
        const sourceData: string = "c";
        const updatedData: unknown = getDataUpdatedWithSourceData({
            data,
            sourceData,
            targetDataLocation,
            targetDataType: DataType.array,
        });

        expect(updatedData).to.deep.equal({
            foo: ["a", "b", "c", "d"],
        });
    });
});

/**
 * Gets updated data by removing data from a data blob
 */
describe("getDataUpdatedWithoutSourceData", () => {
    it("should remove source data from an object", () => {
        const data: Dictionary<unknown> = {
            foo: "bar",
            bar: "foo",
        };
        const sourceDataLocation: string = "bar";
        const updatedData: unknown = getDataUpdatedWithoutSourceData({
            data,
            sourceDataLocation,
        });

        expect(updatedData).to.deep.equal({
            foo: "bar",
        });
    });
    it("should remove source data from an array", () => {
        const data: Dictionary<unknown> = {
            foo: ["bar", "bat"],
        };
        const sourceDataLocation: string = "foo[0]";
        const updatedData: unknown = getDataUpdatedWithoutSourceData({
            data,
            sourceDataLocation,
        });

        expect(updatedData).to.deep.equal({
            foo: ["bat"],
        });
    });
});

/**
 * Gets the next active dictionary ID when linked data is being removed
 */
describe("getNextActiveParentDictionaryId", () => {
    it("should get the current active dictionary ID if the active dictionary ID is not being removed", () => {
        expect(
            getNextActiveParentDictionaryId(
                "foo",
                ["bat"],
                [
                    {
                        bar: {
                            schemaId: "",
                            data: {
                                Children: [
                                    {
                                        id: "foo",
                                    },
                                    {
                                        id: "bat",
                                    },
                                ],
                            },
                        },
                        foo: {
                            schemaId: "",
                            parent: {
                                id: "bar",
                                dataLocation: "Children",
                            },
                            data: "Hello world",
                        },
                        bat: {
                            schemaId: "",
                            parent: {
                                id: "bar",
                                dataLocation: "Children",
                            },
                            data: "Hello pluto",
                        },
                    },
                    "bar",
                ]
            )
        ).to.equal("foo");
    });
    it("should get the next active parent dictionary ID if the current active dictionary ID's parent is not being removed", () => {
        expect(
            getNextActiveParentDictionaryId(
                "foo",
                ["foo"],
                [
                    {
                        bar: {
                            schemaId: "",
                            data: {
                                Children: [
                                    {
                                        id: "foo",
                                    },
                                ],
                            },
                        },
                        foo: {
                            schemaId: "",
                            parent: {
                                id: "bar",
                                dataLocation: "Children",
                            },
                            data: "Hello world",
                        },
                    },
                    "bar",
                ]
            )
        ).to.equal("bar");
    });
    it("should get the next active parent dictionary ID if the current active dictionary ID's parent is being removed", () => {
        expect(
            getNextActiveParentDictionaryId(
                "foo",
                ["baz", "foo"],
                [
                    {
                        bar: {
                            schemaId: "",
                            data: {
                                Children: [
                                    {
                                        id: "baz",
                                    },
                                ],
                            },
                        },
                        baz: {
                            schemaId: "",
                            parent: {
                                id: "bar",
                                dataLocation: "Children",
                            },
                            data: {
                                Children: [
                                    {
                                        id: "foo",
                                    },
                                ],
                            },
                        },
                        foo: {
                            schemaId: "",
                            parent: {
                                id: "baz",
                                dataLocation: "Children",
                            },
                            data: "Hello world",
                        },
                    },
                    "bar",
                ]
            )
        ).to.equal("bar");
    });
    it("should return the root ID even if it removal of the ID is being attempted", () => {
        expect(
            getNextActiveParentDictionaryId(
                "foo",
                ["bar", "foo"],
                [
                    {
                        bar: {
                            schemaId: "",
                            data: {
                                Children: [
                                    {
                                        id: "foo",
                                    },
                                ],
                            },
                        },
                        foo: {
                            schemaId: "",
                            parent: {
                                id: "bar",
                                dataLocation: "Children",
                            },
                            data: "Hello world",
                        },
                    },
                    "bar",
                ]
            )
        ).to.equal("bar");
    });
});
