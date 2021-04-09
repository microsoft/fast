import { expect } from "chai";
import { isInArray } from "./array";

/**
 * Checks that the data is in an array
 */
describe("isInArray", () => {
    it("should return false when data is not an array and the data location is the root", () => {
        expect(isInArray({}, "")).to.equal(false);
    });
    it("should return false when data is not an array and the data location is in a sub location", () => {
        expect(
            isInArray(
                {
                    foo: {},
                },
                "foo"
            )
        ).to.equal(false);
    });
    it("should return true when data is an array and the data location is in a sub location", () => {
        expect(isInArray(["foo"], "[0]")).to.equal(false);
    });
});
