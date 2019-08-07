import { classNames } from "./class-names";

describe("classNames", (): void => {
    test("should return a string when invalid values are provided", (): void => {
        expect(classNames()).toBe("");
        expect(classNames(undefined as any)).toBe("");
        expect(classNames(null as any)).toBe("");
        expect(classNames(NaN as any)).toBe("");
        expect(classNames(Infinity as any)).toBe("");
        expect(classNames(new Date() as any)).toBe("");
        expect(classNames(1 as any)).toBe("");
    });

    test("should return a single string argument unmodified", (): void => {
        expect(classNames("hello")).toBe("hello")
    });

    test("should join multiple string arguments together", (): void => {
        expect(classNames("hello", "world")).toBe("hello world");
    });

    test("should return a single object key when truthy", (): void => {
        expect(classNames({foo: true})).toBe("foo");
    });

    test("should join multiple object keys when all keys are true", (): void => {
        expect(classNames({foo: true, bar: true})).toBe("foo bar");
    });

    test("should omit any false object key", (): void => {
        expect(classNames({foo: true, bar: false, bat: true})).toBe("foo bat");
    });

    test("should join string arguments and object keys", (): void => {
        expect(classNames("hello", {foo: true, bar: false, bat: true}, "world")).toBe("hello foo bat world");
    });
});
