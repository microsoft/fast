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
        expect(classNames([undefined as any, true])).toBe("");
        expect(classNames([null as any, true])).toBe("");
        expect(classNames([NaN as any, true])).toBe("");
        expect(classNames([Infinity as any, true])).toBe("");
        expect(classNames([new Date() as any, true])).toBe("");
        expect(classNames([1 as any, true])).toBe("");
    });

    test("should return a single string argument unmodified", (): void => {
        expect(classNames("hello")).toBe("hello");
    });

    test("should join multiple string arguments together", (): void => {
        expect(classNames("hello", "world")).toBe("hello world");
    });

    test("should return the return value of a single function", (): void => {
        expect(classNames(() => "hello")).toBe("hello");
    });

    test("should join the return value of a multiple functions", (): void => {
        expect(
            classNames(
                () => "hello",
                () => "world"
            )
        ).toBe("hello world");
    });

    test("should return a the first index of an array arg when the second index is truthy", (): void => {
        expect(classNames(["foo", true])).toBe("foo");
    });

    test("should return a single function return value of an array arg when the second index is truthy", (): void => {
        expect(classNames([(): string => "foo", true])).toBe("foo");
    });

    test("should join multiple array index when all second indexes are true", (): void => {
        expect(classNames(["foo", true], ["bar", true])).toBe("foo bar");
    });

    test("should omit first indexes of an array argument when the second index is falsey", (): void => {
        expect(classNames(["foo", true], ["bar", false], ["bat", true])).toBe("foo bat");
    });

    test("should join string, function, and object arguments", (): void => {
        expect(
            classNames(
                "hello",
                ["foo", true],
                ["bar", false],
                [(): string => "bat", true],
                "world",
                () => "earth"
            )
        ).toBe("hello foo bat world earth");
    });
});
