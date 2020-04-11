import { Dictionary } from "lodash";
import {
    getDataUpdatedWithoutSourceData,
    getDataUpdatedWithSourceData,
} from "./relocate";
import { DataType } from "./types";

/**
 * Gets updated data by adding data to a data blob
 */
describe("getDataUpdatedWithSourceData", () => {
    test("should update an undefined target with source data", () => {
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

        expect(updatedData).toEqual({
            ...data,
            [targetDataLocation]: sourceData,
        });
    });
    test("should update a array target with source data", () => {
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

        expect(updatedData).toEqual({
            foo: ["Hello world", "bar"],
        });
    });
    test("should update a target above an array item with source data", () => {
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

        expect(updatedData).toEqual({
            foo: ["a", "b", "c", "d"],
        });
    });
    test("should update a target in an undefined array with source data", () => {
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

        expect(updatedData).toEqual({
            foo: ["b"],
        });
    });
    test("should update a target in an array at the root level with source data", () => {
        const data: Dictionary<unknown> = void 0;
        const targetDataLocation: string = "[0]";
        const sourceData: string = "b";
        const updatedData: unknown = getDataUpdatedWithSourceData({
            data,
            sourceData,
            targetDataLocation,
            targetDataType: DataType.array,
        });

        expect(updatedData).toEqual(["b"]);
    });
    test("should update a target below an array item with source data", () => {
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

        expect(updatedData).toEqual({
            foo: ["a", "b", "c", "d"],
        });
    });
});

/**
 * Gets updated data by removing data from a data blob
 */
describe("getDataUpdatedWithoutSourceData", () => {
    test("should remove source data from an object", () => {
        const data: Dictionary<unknown> = {
            foo: "bar",
            bar: "foo",
        };
        const sourceDataLocation: string = "bar";
        const updatedData: unknown = getDataUpdatedWithoutSourceData({
            data,
            sourceDataLocation,
        });

        expect(updatedData).toEqual({
            foo: "bar",
        });
    });
    test("should remove source data from an array", () => {
        const data: Dictionary<unknown> = {
            foo: ["bar", "bat"],
        };
        const sourceDataLocation: string = "foo[0]";
        const updatedData: unknown = getDataUpdatedWithoutSourceData({
            data,
            sourceDataLocation,
        });

        expect(updatedData).toEqual({
            foo: ["bat"],
        });
    });
});
