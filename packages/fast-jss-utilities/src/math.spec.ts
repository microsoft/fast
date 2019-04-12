import { multiply } from "./math";

describe("multiply", (): void => {
    test("should return a function", (): void => {
        expect(typeof multiply(2, 4)).toBe("function");
    });

    test("should multiply two numbers", (): void => {
        expect(multiply(2, 2)(undefined)).toBe(4);
    });

    test("should accept any number of arguments", (): void => {
        expect(multiply(2, 1, 1, 1, 1, 1)()).toBe(2);
    });

    test("should accept a function that resolves to a number", (): void => {
        expect(multiply((): number => 2, 2)()).toBe(4);
    });

    test("should invoke function arguments with input config", (): void => {
        expect(multiply((conf: number): number => conf, 2)(8)).toBe(16);
    });
});
