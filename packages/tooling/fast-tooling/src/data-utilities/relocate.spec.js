import { expect } from "chai";
import {
    getDataUpdatedWithoutSourceData,
    getDataUpdatedWithSourceData,
} from "./relocate";
import { DataType } from "./types";
/**
 * Gets updated data by adding data to a data blob
 */
describe("getDataUpdatedWithSourceData", () => {
    it("should update an undefined target with source data", () => {
        const data = {
            foo: "bar",
        };
        const targetDataLocation = "bat";
        const sourceData = "Hello world";
        const updatedData = getDataUpdatedWithSourceData({
            data,
            targetDataType: DataType.object,
            sourceData,
            targetDataLocation,
        });
        expect(updatedData).to.deep.equal(
            Object.assign(Object.assign({}, data), { [targetDataLocation]: sourceData })
        );
    });
    it("should update a array target with source data", () => {
        const data = {
            foo: ["bar"],
        };
        const targetDataLocation = "foo[0]";
        const sourceData = "Hello world";
        const updatedData = getDataUpdatedWithSourceData({
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
        const data = {
            foo: ["a", "c", "d"],
        };
        const targetDataLocation = "foo[1]";
        const sourceData = "b";
        const updatedData = getDataUpdatedWithSourceData({
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
        const data = {
            foo: void 0,
        };
        const targetDataLocation = "foo[0]";
        const sourceData = "b";
        const updatedData = getDataUpdatedWithSourceData({
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
        const data = void 0;
        const targetDataLocation = "[0]";
        const sourceData = "b";
        const updatedData = getDataUpdatedWithSourceData({
            data,
            sourceData,
            targetDataLocation,
            targetDataType: DataType.array,
        });
        expect(updatedData).to.deep.equal(["b"]);
    });
    it("should update a target below an array item with source data", () => {
        const data = {
            foo: ["a", "b", "d"],
        };
        const targetDataLocation = "foo[2]";
        const sourceData = "c";
        const updatedData = getDataUpdatedWithSourceData({
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
        const data = {
            foo: "bar",
            bar: "foo",
        };
        const sourceDataLocation = "bar";
        const updatedData = getDataUpdatedWithoutSourceData({
            data,
            sourceDataLocation,
        });
        expect(updatedData).to.deep.equal({
            foo: "bar",
        });
    });
    it("should remove source data from an array", () => {
        const data = {
            foo: ["bar", "bat"],
        };
        const sourceDataLocation = "foo[0]";
        const updatedData = getDataUpdatedWithoutSourceData({
            data,
            sourceDataLocation,
        });
        expect(updatedData).to.deep.equal({
            foo: ["bat"],
        });
    });
});
