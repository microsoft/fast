import { limit, wrapInBounds } from "./numbers";

describe("wrapInBounds", () => {
    test("should not throw if any parameters are null", () => {
        expect(() => {
            wrapInBounds(null, null, null);
        }).not.toThrow();
        expect(() => {
            wrapInBounds(1, null, null);
        }).not.toThrow();
        expect(() => {
            wrapInBounds(1, 2, 3);
        }).not.toThrow();
        expect(() => {
            wrapInBounds(1, null, 3);
        }).not.toThrow();
        expect(() => {
            wrapInBounds(1, 2, null);
        }).not.toThrow();
    });

    test("should return `min` if `value` is greater than `max`", () => {
        expect(wrapInBounds(0, 10, 11)).toBe(0);
        expect(wrapInBounds(-10, 0, 1)).toBe(-10);
        expect(wrapInBounds(-10, 10, 11)).toBe(-10);
        expect(wrapInBounds(10, 20, 30)).toBe(10);
    });

    test("should return `max` if `value` is less than `min`", () => {
        expect(wrapInBounds(0, 10, -10)).toBe(10);
        expect(wrapInBounds(-10, 0, -11)).toBe(0);
        expect(wrapInBounds(-20, -10, -30)).toBe(-10);
        expect(wrapInBounds(-10, 10, -11)).toBe(10);
    });

    test("should return the correct value if both min and max are the same", () => {
        expect(wrapInBounds(0, 0, -1)).toBe(0);
        expect(wrapInBounds(0, 0, 1)).toBe(0);
    });
});

describe("limit", () => {
    test("should not throw if any parameters are null", () => {
        expect(() => {
            limit(null, null, null);
        }).not.toThrow();
        expect(() => {
            limit(0, null, null);
        }).not.toThrow();
        expect(() => {
            limit(0, null, 1);
        }).not.toThrow();
        expect(() => {
            limit(0, 10, null);
        }).not.toThrow();
    });

    test("should return `min` if `value` is equal to `min`", () => {
        expect(limit(0, 10, 0)).toBe(0);
    });

    test("should return `min` if `value` is greater than `min`", () => {
        expect(limit(10, 15, -1)).toBe(10);
    });

    test("should return `max` if `value` is equal to `max`", () => {
        expect(limit(0, 10, 10)).toBe(10);
    });

    test("should return `max` if `value` is greater than `max`", () => {
        expect(limit(0, 10, 11)).toBe(10);
    });

    test("should return the value if `value` is not less min or greater than max", () => {
        expect(limit(0, 10, 5)).toBe(5);
    });
});
