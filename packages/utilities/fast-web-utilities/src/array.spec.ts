import { expect } from "chai";
import { findLastIndex } from "./array.js";

describe("findLastIndex", (): void => {
    it("should return -1 when array is empty", (): void => {
        expect(findLastIndex([], () => true)).to.equal(-1);
    });

    it("should return the last valid item that matches the predicate", (): void => {
        const array = [
            { value: true },
            { value: false },
            { value: true },
            { value: false },
        ];

        expect(findLastIndex(array, v => v.value)).to.equal(2);
    });

    it("should return -1 when no items match the predicate", (): void => {
        const array = [
            { value: false },
            { value: false },
            { value: false },
            { value: false },
        ];

        expect(findLastIndex(array, v => v.value)).to.equal(-1);
    });
});
