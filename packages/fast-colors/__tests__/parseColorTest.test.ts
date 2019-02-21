// tslint:disable:no-string-literal
// tslint:disable:no-console

import { ColorRGBA64, parseColor } from "../src/colorlib";

import { testData } from "../testData";

const testPrecision: number = 4;

describe("Color parsing and toString", () => {
    test("parseColorHexShort", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 | null = parseColor(data.hexRGBString);

            expect(rgb).toBeDefined();

            expect(rgb!.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgb!.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgb!.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgb!.a).toBe(1);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("parseColorHexLong", () => {
        function testColor(data: any): void {
            const rgba: ColorRGBA64 | null = parseColor(data.hexARGBString);

            expect(rgba).toBeDefined();

            expect(rgba!.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgba!.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgba!.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgba!.a).toBeCloseTo(data.rgba.a, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("parseColorWebShort", () => {
        function testColor(data: any): void {
            const rgb: ColorRGBA64 | null = parseColor(data.webRGBString);

            expect(rgb).toBeDefined();

            expect(rgb!.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgb!.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgb!.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgb!.a).toBe(1);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("parseColorWebLong", () => {
        function testColor(data: any): void {
            const rgba: ColorRGBA64 | null = parseColor(data.webRGBAString);

            expect(rgba).toBeDefined();

            expect(rgba!.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgba!.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgba!.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgba!.a).toBeCloseTo(data.rgba.a, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("parseColorNamed", () => {
        function testColor(data: any): void {
            const rgba: ColorRGBA64 | null = parseColor(data.name);

            expect(rgba).toBeDefined();

            expect(rgba!.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgba!.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgba!.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgba!.a).toBeCloseTo(data.rgba.a, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("stringifyColorHexRGB", () => {
        function testColor(data: any): void {
            const c: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(c).toBeDefined();
            const str: string = c!.toStringHexRGB();
            expect(str).toBe(data.hexRGBString);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("stringifyColorHexARGB", () => {
        function testColor(data: any): void {
            const c: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(c).toBeDefined();
            const str: string = c!.toStringHexARGB();
            expect(str).toBe(data.hexARGBString);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("stringifyColorHexRGBA", () => {
        function testColor(data: any): void {
            const c: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(c).toBeDefined();
            const str: string = c!.toStringHexRGBA();
            expect(str).toBe(data.hexRGBAString);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("stringifyColorWebShort", () => {
        function testColor(data: any): void {
            const c: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(c).toBeDefined();
            const str: string = c!.toStringWebRGB();
            expect(str).toBe(data.webRGBString);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("stringifyColorWebLong", () => {
        function testColor(data: any): void {
            const c: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(c).toBeDefined();
            const str: string = c!.toStringWebRGBA();
            expect(str).toBe(data.webRGBAString);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
});
