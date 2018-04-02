import {isEmptyObject} from "./object";

describe("isEmptyObject", () => {
    test("should return false if passed undefined", () => {
        expect(isEmptyObject(undefined)).toBe(false);
    });
    test("should return false if passed null", () => {
        expect(isEmptyObject(null)).toBe(false);
    });
    test("should return false if passed a number", () => {
        expect(isEmptyObject(1)).toBe(false);
    });
    test("should return false if passed a Infinity", () => {
        expect(isEmptyObject(Infinity)).toBe(false);
    });
    test("should return false if passed a NaN", () => {
        expect(isEmptyObject(NaN)).toBe(false);
    });
    test("should return false if passed a boolean", () => {
        expect(isEmptyObject(true)).toBe(false);
        expect(isEmptyObject(false)).toBe(false);
    });
    test("should return false if passed a string", () => {
        expect(isEmptyObject("hello world")).toBe(false);
    });
    test("should return false if passed a function", () => {
        expect(isEmptyObject(() => void 0)).toBe(false);
    });
    test("should return false if passed an array", () => {
        expect(isEmptyObject([0, 1])).toBe(false);
    });
    test("should return false if passed a class", () => {
        expect(isEmptyObject(class Test {})).toBe(false);
    });
    test("should return false if passed a non-empty object", () => {
        expect(isEmptyObject({ key: "value" })).toBe(false);
    });
    test("should return true if passed a empty object", () => {
        expect(isEmptyObject({})).toBe(true);
    });
});
