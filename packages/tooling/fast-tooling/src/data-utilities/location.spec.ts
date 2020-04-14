import { normalizeDataLocationToDotNotation } from "./location";

describe("normalizeDataLocationToDotLocation", () => {
    test("should convert a bracket location to a dot location", () => {
        expect(normalizeDataLocationToDotNotation("[0]")).toEqual("0");
    });
    test("should convert a bracket location to a dot location if the array is a property on an object", () => {
        expect(normalizeDataLocationToDotNotation("foo[0]")).toEqual("foo.0");
    });
    test("should convert a bracket location that is nested in properties to a dot location", () => {
        expect(normalizeDataLocationToDotNotation("foo[0].bar")).toEqual("foo.0.bar");
        expect(normalizeDataLocationToDotNotation("[0].foo.bar")).toEqual("0.foo.bar");
    });
    test("should not perform conversions on locations that are already dot locations", () => {
        expect(normalizeDataLocationToDotNotation("0")).toEqual("0");
        expect(normalizeDataLocationToDotNotation("foo.0")).toEqual("foo.0");
        expect(normalizeDataLocationToDotNotation("foo.0.bar")).toEqual("foo.0.bar");
        expect(normalizeDataLocationToDotNotation("0.foo.bar")).toEqual("0.foo.bar");
    });
});
