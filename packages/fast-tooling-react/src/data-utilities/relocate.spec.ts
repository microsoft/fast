import { Dictionary } from "lodash";
import {
    getDataUpdatedWithoutSourceData,
    getDataUpdatedWithSourceData,
    TargetPosition,
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
            targetPosition: TargetPosition.insert,
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
        const targetDataLocation: string = "foo";
        const sourceData: string = "Hello world";
        const updatedData: unknown = getDataUpdatedWithSourceData({
            data,
            targetDataType: DataType.array,
            targetPosition: TargetPosition.insert,
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
            targetPosition: TargetPosition.prepend,
        });

        expect(updatedData).toEqual({
            foo: ["a", "b", "c", "d"],
        });
    });
    test("should update a target below an array item with source data", () => {
        const data: Dictionary<unknown> = {
            foo: ["a", "b", "d"],
        };
        const targetDataLocation: string = "foo[1]";
        const sourceData: string = "c";
        const updatedData: unknown = getDataUpdatedWithSourceData({
            data,
            sourceData,
            targetDataLocation,
            targetDataType: DataType.array,
            targetPosition: TargetPosition.append,
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
