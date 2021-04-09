import { expect } from "chai";
import { Orientation } from "./aria";

describe("aria-orientation", () => {
    it("should correctly return orientation values", () => {
        expect(Orientation.horizontal).to.equal("horizontal");
        expect(Orientation.vertical).to.equal("vertical");
    });
});
