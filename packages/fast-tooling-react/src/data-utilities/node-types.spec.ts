import { isPrimitiveReactNode } from "./node-types";

describe("node types", () => {
    test("should return true if provided a string", () => {
        expect(isPrimitiveReactNode("")).toBe(true);
    });
    test("should return true if provided a number", () => {
        expect(isPrimitiveReactNode(0)).toBe(true);
    });
    test("should be false if provided any other data structure besides from string or number", () => {
        expect(isPrimitiveReactNode({})).toBe(false);
        expect(isPrimitiveReactNode([])).toBe(false);
        expect(isPrimitiveReactNode(new Date())).toBe(false);
        expect(isPrimitiveReactNode(null)).toBe(false);
        expect(isPrimitiveReactNode(undefined)).toBe(false);
    });
});
