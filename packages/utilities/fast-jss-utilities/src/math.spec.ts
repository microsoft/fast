import { add, divide, multiply, subtract } from "./math";

describe("multiply", (): void => {
    test("should return a function", (): void => {
        expect(typeof multiply(2, 4)).toBe("function");
    });

    test("should return the argument if only supplied with one argument", (): void => {
        expect(multiply(10)()).toBe(10);
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
        expect(multiply(10, (conf: number): number => conf, 2)(8)).toBe(160);
    });
});

describe("divide", (): void => {
    test("should return a function", (): void => {
        expect(typeof divide(2, 4)).toBe("function");
    });

    test("should return the argument if only supplied with one argument", (): void => {
        expect(divide(10)()).toBe(10);
    });

    test("should divide two numbers", (): void => {
        expect(divide(4, 2)(undefined)).toBe(2);
    });

    test("should accept any number of arguments", (): void => {
        expect(divide(2, 1, 1, 1, 1, 1)()).toBe(2);
    });

    test("should accept a function that resolves to a number", (): void => {
        expect(divide((): number => 2, 2)()).toBe(1);
    });

    test("should invoke function arguments with input config", (): void => {
        expect(divide((conf: number): number => conf, 10)(1000)).toBe(100);
        expect(divide(1000, (conf: number): number => conf, 10)(2)).toBe(50);
    });
});

describe("add", (): void => {
    test("should return a function", (): void => {
        expect(typeof add(2, 4)).toBe("function");
    });

    test("should return the argument if only supplied with one argument", (): void => {
        expect(add(10)()).toBe(10);
    });

    test("should add two numbers", (): void => {
        expect(add(4, 2)(undefined)).toBe(6);
    });

    test("should accept any number of arguments", (): void => {
        expect(add(2, 1, 1, 1, 1, 1)()).toBe(7);
    });

    test("should accept a function that resolves to a number", (): void => {
        expect(add((): number => 2, 2)()).toBe(4);
    });

    test("should invoke function arguments with input config", (): void => {
        expect(add((conf: number): number => conf, 10)(1000)).toBe(1010);
        expect(add(20, (conf: number): number => conf, 10)(1000)).toBe(1030);
    });
});

describe("subtract", (): void => {
    test("should return a function", (): void => {
        expect(typeof subtract(2, 4)).toBe("function");
    });

    test("should return the argument if only supplied with one argument", (): void => {
        expect(subtract(10)()).toBe(10);
    });

    test("should subtract two numbers", (): void => {
        expect(subtract(2, 4)(undefined)).toBe(-2);
    });

    test("should accept any number of arguments", (): void => {
        expect(subtract(12, 1, 1, 1, 1, 1)()).toBe(7);
    });

    test("should accept a function that resolves to a number", (): void => {
        expect(subtract((): number => 2, 2)()).toBe(0);
    });

    test("should invoke function arguments with input config", (): void => {
        expect(subtract((conf: number): number => conf, 10)(1000)).toBe(990);
        expect(subtract(10, (conf: number): number => conf, 10)(1000)).toBe(-1000);
    });
});
