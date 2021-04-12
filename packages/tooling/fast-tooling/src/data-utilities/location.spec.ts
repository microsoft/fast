import { expect } from "chai";
import { normalizeDataLocationToDotNotation } from "./location";

describe("normalizeDataLocationToDotLocation", () => {
    it("should convert a bracket location to a dot location", () => {
        expect(normalizeDataLocationToDotNotation("[0]")).to.equal("0");
    });
    it("should convert a bracket location to a dot location if the array is a property on an object", () => {
        expect(normalizeDataLocationToDotNotation("foo[0]")).to.equal("foo.0");
    });
    it("should convert a bracket location that is nested in properties to a dot location", () => {
        expect(normalizeDataLocationToDotNotation("foo[0].bar")).to.equal("foo.0.bar");
        expect(normalizeDataLocationToDotNotation("[0].foo.bar")).to.equal("0.foo.bar");
    });
    it("should not perform conversions on locations that are already dot locations", () => {
        expect(normalizeDataLocationToDotNotation("0")).to.equal("0");
        expect(normalizeDataLocationToDotNotation("foo.0")).to.equal("foo.0");
        expect(normalizeDataLocationToDotNotation("foo.0.bar")).to.equal("foo.0.bar");
        expect(normalizeDataLocationToDotNotation("0.foo.bar")).to.equal("0.foo.bar");
    });
});
