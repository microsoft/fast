// tslint:disable:no-string-literal
// tslint:disable:no-console

import {
    ColorRGBA64,
    isColorStringHexARGB,
    isColorStringHexRGB,
    isColorStringHexRGBA,
    isColorStringWebRGB,
    isColorStringWebRGBA,
    parseColor,
    parseColorHexRGB,
    parseColorHexRGBA,
    parseColorNamed,
    parseColorWebRGB,
    parseColorWebRGBA,
} from "../src/colorlib";

import { testData } from "../testData";

const testPrecision: number = 4;

describe("Color parsing and toString", (): void => {
    test("parseColorHexRGB", () => {
        function testColor(data: any): void {
            let rgb: ColorRGBA64 | null = parseColor(data.hexRGBString);

            expect(rgb).toBeDefined();
            expect(rgb!.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgb!.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgb!.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgb!.a).toBe(1);

            rgb = parseColorHexRGB(data.hexRGBString);
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

    test("parseColorHexARGB", () => {
        function testColor(data: any): void {
            let rgba: ColorRGBA64 | null = parseColor(data.hexARGBString);

            expect(rgba).toBeDefined();
            expect(rgba!.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgba!.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgba!.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgba!.a).toBeCloseTo(data.rgba.a, testPrecision);

            rgba = parseColor(data.hexARGBString);

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

    test("parseColorHexRGBA", () => {
        function testColor(data: any): void {
            const rgba: ColorRGBA64 | null = parseColorHexRGBA(data.hexRGBAString);

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
            let rgb: ColorRGBA64 | null = parseColor(data.webRGBString);

            expect(rgb).toBeDefined();
            expect(rgb!.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgb!.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgb!.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgb!.a).toBe(1);

            rgb = parseColorWebRGB(data.webRGBString);
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
            let rgba: ColorRGBA64 | null = parseColor(data.webRGBAString);

            expect(rgba).toBeDefined();
            expect(rgba!.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgba!.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgba!.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgba!.a).toBeCloseTo(data.rgba.a, testPrecision);

            rgba = parseColorWebRGBA(data.webRGBAString);
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
            let rgba: ColorRGBA64 | null = parseColor(data.name);

            expect(rgba).toBeDefined();
            expect(rgba!.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgba!.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgba!.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgba!.a).toBeCloseTo(data.rgba.a, testPrecision);

            rgba = parseColorNamed(data.name);
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

describe("Color identification", (): void => {
    describe("isColorStringHexRGB", (): void => {
        test("should return false when invoked with a HexRGBA color", (): void => {
            expect(isColorStringHexRGB("#000000FF")).toBe(false);
        });

        test("should return false when invoked with a HexARGB color", (): void => {
            expect(isColorStringHexRGB("#FF000000")).toBe(false);
        });

        test("should return false when invoked with a WebRGB color", (): void => {
            expect(isColorStringHexRGB("rgb(255, 255, 255)")).toBe(false);
        });

        test("should return false when invoked with a WebRGBA color", (): void => {
            expect(isColorStringHexRGB("rgba(255, 255, 255, 1)")).toBe(false);
        });

        test("should return true when invoked with a HexRGB color", (): void => {
            expect(isColorStringHexRGB("#000000")).toBe(true);
        });
    });

    describe("isColorStringHexRGBA", (): void => {
        test("should return false when invoked with a HexRGB color", (): void => {
            expect(isColorStringHexRGBA("#000000")).toBe(false);
        });

        test("should return true when invoked with a HexARGB color", (): void => {
            expect(isColorStringHexRGBA("#FF000000")).toBe(true); // No way to differentiate between HexARGB and HexRGBA
        });

        test("should return false when invoked with a WebRGB color", (): void => {
            expect(isColorStringHexRGBA("rgb(255, 255, 255)")).toBe(false);
        });

        test("should return false when invoked with a WebRGBA color", (): void => {
            expect(isColorStringHexRGBA("rgba(255, 255, 255, 1)")).toBe(false);
        });

        test("should return true when invoked with a HexRGBA color", (): void => {
            expect(isColorStringHexRGBA("#000000FF")).toBe(true);
        });
    });

    describe("isColorStringHexARGB", (): void => {
        test("should return false when invoked with a HexRGB color", (): void => {
            expect(isColorStringHexARGB("#000000")).toBe(false);
        });

        test("should return true when invoked with a HexRGBA color", (): void => {
            expect(isColorStringHexARGB("#000000FF")).toBe(true); // No way to differentiate between HexARGB and HexRGBA
        });

        test("should return false when invoked with a WebRGB color", (): void => {
            expect(isColorStringHexARGB("rgb(255, 255, 255)")).toBe(false);
        });

        test("should return false when invoked with a WebRGBA color", (): void => {
            expect(isColorStringHexARGB("rgba(255, 255, 255, 1)")).toBe(false);
        });

        test("should return true when invoked with a HexARGB color", (): void => {
            expect(isColorStringHexARGB("#FF000000")).toBe(true);
        });
    });
    describe("isColorStringWebRGB", (): void => {
        test("should return false when invoked with a HexRGB color", (): void => {
            expect(isColorStringWebRGB("#000000")).toBe(false);
        });

        test("should return true when invoked with a HexRGBA color", (): void => {
            expect(isColorStringWebRGB("#000000FF")).toBe(false);
        });

        test("should return true when invoked with a HexARGB color", (): void => {
            expect(isColorStringWebRGB("#FF000000")).toBe(false);
        });

        test("should return false when invoked with a WebRGBA color", (): void => {
            expect(isColorStringWebRGB("rgba(255, 255, 255, 1)")).toBe(false);
        });

        test("should return true when invoked with a WebRGB color", (): void => {
            expect(isColorStringWebRGB("rgb(255, 255, 255)")).toBe(true);
        });
    });
    describe("isColorStringWebRGBA", (): void => {
        test("should return false when invoked with a HexRGB color", (): void => {
            expect(isColorStringWebRGBA("#000000")).toBe(false);
        });

        test("should return true when invoked with a HexRGBA color", (): void => {
            expect(isColorStringWebRGBA("#000000FF")).toBe(false);
        });

        test("should return true when invoked with a HexARGB color", (): void => {
            expect(isColorStringWebRGBA("#FF000000")).toBe(false);
        });

        test("should return true when invoked with a WebRGBA color", (): void => {
            expect(isColorStringWebRGBA("rgba(255, 255, 255, 1)")).toBe(true);
        });

        test("should return false when invoked with a WebRGB color", (): void => {
            expect(isColorStringWebRGBA("rgb(255, 255, 255)")).toBe(false);
        });
    });
});
