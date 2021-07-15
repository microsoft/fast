import {
    ColorRGBA64,
    isColorStringHexARGB,
    isColorStringHexRGB,
    isColorStringHexRGBA,
    isColorStringWebRGB,
    isColorStringWebRGBA,
    parseColor,
    parseColorHexARGB,
    parseColorHexRGB,
    parseColorHexRGBA,
    parseColorNamed,
    parseColorWebRGB,
    parseColorWebRGBA,
} from "../src";
import { testData } from "../testData";
const testPrecision = 4;
const hexDigits = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
];
describe("Color parsing and toString", () => {
    test("parseColorHexRGB", () => {
        function testColor(data) {
            let rgb = parseColor(data.hexRGBString);
            expect(rgb).toBeDefined();
            expect(rgb.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgb.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgb.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgb.a).toBe(1);
            rgb = parseColorHexRGB(data.hexRGBString);
            expect(rgb).toBeDefined();
            expect(rgb.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgb.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgb.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgb.a).toBe(1);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
    test("parseColorHexRGB shorthand", () => {
        const rgb = [hexDigits, hexDigits, hexDigits];
        for (const r of rgb[0]) {
            for (const g of rgb[1]) {
                for (const b of rgb[2]) {
                    const hex = `#${r + r + g + g + b + b}`;
                    const shorthandHex = `#${r + g + b}`;
                    const hexColor = parseColorHexRGB(hex);
                    const hexShorthandColor = parseColorHexRGB(shorthandHex);
                    expect(hexColor.r).toBe(hexShorthandColor.r);
                    expect(hexColor.g).toBe(hexShorthandColor.g);
                    expect(hexColor.b).toBe(hexShorthandColor.b);
                }
            }
        }
    });
    test("parseColorHexARGB", () => {
        function testColor(data) {
            let rgba = parseColor(data.hexARGBString);
            expect(rgba).toBeDefined();
            expect(rgba.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgba.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgba.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgba.a).toBeCloseTo(data.rgba.a, testPrecision);
            rgba = parseColor(data.hexARGBString);
            expect(rgba).toBeDefined();
            expect(rgba.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgba.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgba.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgba.a).toBeCloseTo(data.rgba.a, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
    test("parseColorHexARGB shorthand", () => {
        const argb = [hexDigits, hexDigits, hexDigits, hexDigits];
        for (const a of argb[0]) {
            for (const r of argb[1]) {
                for (const g of argb[2]) {
                    for (const b of argb[3]) {
                        const hex = `#${a + a + r + r + g + g + b + b}`;
                        const shorthandHex = `#${a + r + g + b}`;
                        const hexColor = parseColorHexARGB(hex);
                        const hexShorthandColor = parseColorHexARGB(shorthandHex);
                        expect(hexColor.a).toBe(hexShorthandColor.a);
                        expect(hexColor.r).toBe(hexShorthandColor.r);
                        expect(hexColor.g).toBe(hexShorthandColor.g);
                        expect(hexColor.b).toBe(hexShorthandColor.b);
                    }
                }
            }
        }
    });
    test("parseColorHexRGBA", () => {
        function testColor(data) {
            const rgba = parseColorHexRGBA(data.hexRGBAString);
            expect(rgba).toBeDefined();
            expect(rgba.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgba.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgba.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgba.a).toBeCloseTo(data.rgba.a, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
    test("parseColorHexRGBA shorthand", () => {
        const rgba = [hexDigits, hexDigits, hexDigits, hexDigits];
        for (const r of rgba[0]) {
            for (const g of rgba[1]) {
                for (const b of rgba[2]) {
                    for (const a of rgba[3]) {
                        const hex = `#${r + r + g + g + b + b + a + a}`;
                        const shorthandHex = `#${r + g + b + a}`;
                        const hexColor = parseColorHexRGBA(hex);
                        const hexShorthandColor = parseColorHexRGBA(shorthandHex);
                        expect(hexColor.r).toBe(hexShorthandColor.r);
                        expect(hexColor.g).toBe(hexShorthandColor.g);
                        expect(hexColor.b).toBe(hexShorthandColor.b);
                        expect(hexColor.a).toBe(hexShorthandColor.a);
                    }
                }
            }
        }
    });
    test("parseColorWebShort", () => {
        function testColor(data) {
            let rgb = parseColor(data.webRGBString);
            expect(rgb).toBeDefined();
            expect(rgb.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgb.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgb.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgb.a).toBe(1);
            rgb = parseColorWebRGB(data.webRGBString);
            expect(rgb).toBeDefined();
            expect(rgb.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgb.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgb.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgb.a).toBe(1);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
    test("parseColorWebLong", () => {
        function testColor(data) {
            let rgba = parseColor(data.webRGBAString);
            expect(rgba).toBeDefined();
            expect(rgba.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgba.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgba.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgba.a).toBeCloseTo(data.rgba.a, testPrecision);
            rgba = parseColorWebRGBA(data.webRGBAString);
            expect(rgba).toBeDefined();
            expect(rgba.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgba.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgba.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgba.a).toBeCloseTo(data.rgba.a, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
    test("parseColorNamed", () => {
        function testColor(data) {
            let rgba = parseColor(data.name);
            expect(rgba).toBeDefined();
            expect(rgba.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgba.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgba.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgba.a).toBeCloseTo(data.rgba.a, testPrecision);
            rgba = parseColorNamed(data.name);
            expect(rgba).toBeDefined();
            expect(rgba.r).toBeCloseTo(data.rgba.r, testPrecision);
            expect(rgba.g).toBeCloseTo(data.rgba.g, testPrecision);
            expect(rgba.b).toBeCloseTo(data.rgba.b, testPrecision);
            expect(rgba.a).toBeCloseTo(data.rgba.a, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
    test("stringifyColorHexRGB", () => {
        function testColor(data) {
            const c = ColorRGBA64.fromObject(data.rgba);
            expect(c).toBeDefined();
            const str = c.toStringHexRGB();
            expect(str).toBe(data.hexRGBString);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
    test("stringifyColorHexARGB", () => {
        function testColor(data) {
            const c = ColorRGBA64.fromObject(data.rgba);
            expect(c).toBeDefined();
            const str = c.toStringHexARGB();
            expect(str).toBe(data.hexARGBString);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
    test("stringifyColorHexRGBA", () => {
        function testColor(data) {
            const c = ColorRGBA64.fromObject(data.rgba);
            expect(c).toBeDefined();
            const str = c.toStringHexRGBA();
            expect(str).toBe(data.hexRGBAString);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
    test("stringifyColorWebShort", () => {
        function testColor(data) {
            const c = ColorRGBA64.fromObject(data.rgba);
            expect(c).toBeDefined();
            const str = c.toStringWebRGB();
            expect(str).toBe(data.webRGBString);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
    test("stringifyColorWebLong", () => {
        function testColor(data) {
            const c = ColorRGBA64.fromObject(data.rgba);
            expect(c).toBeDefined();
            const str = c.toStringWebRGBA();
            expect(str).toBe(data.webRGBAString);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
});
describe("Color identification", () => {
    describe("isColorStringHexRGB", () => {
        test("should return false when invoked with a HexRGBA color", () => {
            expect(isColorStringHexRGB("#000000FF")).toBe(false);
            expect(isColorStringHexRGB("#000F")).toBe(false);
        });
        test("should return false when invoked with a HexARGB color", () => {
            expect(isColorStringHexRGB("#FF000000")).toBe(false);
            expect(isColorStringHexRGB("#F000")).toBe(false);
        });
        test("should return false when invoked with a WebRGB color", () => {
            expect(isColorStringHexRGB("rgb(255, 255, 255)")).toBe(false);
        });
        test("should return false when invoked with a WebRGBA color", () => {
            expect(isColorStringHexRGB("rgba(255, 255, 255, 1)")).toBe(false);
        });
        test("should return true when invoked with a HexRGB color", () => {
            expect(isColorStringHexRGB("#000000")).toBe(true);
        });
        test("should return true when invoked with three hexidecimal numbers", () => {
            expect(isColorStringHexRGB("#000")).toBe(true);
        });
        test("should return false when invoked with a non-hexidecimal digit", () => {
            expect(isColorStringHexRGB("#00000G")).toBe(false);
        });
    });
    describe("isColorStringHexRGBA", () => {
        test("should return false when invoked with a HexRGB color", () => {
            expect(isColorStringHexRGBA("#000000")).toBe(false);
            expect(isColorStringHexRGBA("#000")).toBe(false);
        });
        test("should return true when invoked with a HexARGB color", () => {
            expect(isColorStringHexRGBA("#FF000000")).toBe(true); // No way to differentiate between HexARGB and HexRGBA
            expect(isColorStringHexRGBA("#F000")).toBe(true); // No way to differentiate between HexARGB and HexRGBA
        });
        test("should return false when invoked with a WebRGB color", () => {
            expect(isColorStringHexRGBA("rgb(255, 255, 255)")).toBe(false);
        });
        test("should return false when invoked with a WebRGBA color", () => {
            expect(isColorStringHexRGBA("rgba(255, 255, 255, 1)")).toBe(false);
        });
        test("should return true when invoked with a HexRGBA color", () => {
            expect(isColorStringHexRGBA("#000000FF")).toBe(true);
        });
        test("should return true when invoked with four hexidecimal numbers", () => {
            expect(isColorStringHexRGBA("#000F")).toBe(true);
        });
        test("should return false when invoked with a non-hexidecimal digit", () => {
            expect(isColorStringHexRGBA("#000G")).toBe(false);
        });
    });
    describe("isColorStringHexARGB", () => {
        test("should return false when invoked with a HexRGB color", () => {
            expect(isColorStringHexARGB("#000000")).toBe(false);
            expect(isColorStringHexARGB("#000")).toBe(false);
        });
        test("should return true when invoked with a HexRGBA color", () => {
            expect(isColorStringHexARGB("#000000FF")).toBe(true); // No way to differentiate between HexARGB and HexRGBA
            expect(isColorStringHexARGB("#000F")).toBe(true); // No way to differentiate between HexARGB and HexRGBA
        });
        test("should return false when invoked with a WebRGB color", () => {
            expect(isColorStringHexARGB("rgb(255, 255, 255)")).toBe(false);
        });
        test("should return false when invoked with a WebRGBA color", () => {
            expect(isColorStringHexARGB("rgba(255, 255, 255, 1)")).toBe(false);
        });
        test("should return true when invoked with a HexARGB color", () => {
            expect(isColorStringHexARGB("#FF000000")).toBe(true);
        });
        test("should return true when invoked with four hexidecimal numbers", () => {
            expect(isColorStringHexRGBA("#F000")).toBe(true);
        });
        test("should return false when invoked with a non-hexidecimal digit", () => {
            expect(isColorStringHexRGBA("#G000")).toBe(false);
        });
    });
    describe("isColorStringWebRGB", () => {
        test("should return false when invoked with a HexRGB color", () => {
            expect(isColorStringWebRGB("#000000")).toBe(false);
        });
        test("should return true when invoked with a HexRGBA color", () => {
            expect(isColorStringWebRGB("#000000FF")).toBe(false);
        });
        test("should return true when invoked with a HexARGB color", () => {
            expect(isColorStringWebRGB("#FF000000")).toBe(false);
        });
        test("should return false when invoked with a WebRGBA color", () => {
            expect(isColorStringWebRGB("rgba(255, 255, 255, 1)")).toBe(false);
        });
        test("should return true when invoked with a WebRGB color", () => {
            expect(isColorStringWebRGB("rgb(255, 255, 255)")).toBe(true);
        });
        test("should return false a color channel is greater than 255 or less than 0", () => {
            expect(isColorStringWebRGB("rgb(256, 255, 255)")).toBe(false);
            expect(isColorStringWebRGB("rgb(-1, 255, 255)")).toBe(false);
        });
    });
    describe("isColorStringWebRGBA", () => {
        test("should return false when invoked with a HexRGB color", () => {
            expect(isColorStringWebRGBA("#000000")).toBe(false);
        });
        test("should return true when invoked with a HexRGBA color", () => {
            expect(isColorStringWebRGBA("#000000FF")).toBe(false);
        });
        test("should return true when invoked with a HexARGB color", () => {
            expect(isColorStringWebRGBA("#FF000000")).toBe(false);
        });
        test("should return true when invoked with a WebRGBA color", () => {
            expect(isColorStringWebRGBA("rgba(255, 255, 255, 1)")).toBe(true);
        });
        test("should return false when invoked with a WebRGB color", () => {
            expect(isColorStringWebRGBA("rgb(255, 255, 255)")).toBe(false);
        });
        test("should return false a color channel is greater than 255 or less than 0", () => {
            expect(isColorStringWebRGBA("rgba(256, 255, 255, 1)")).toBe(false);
            expect(isColorStringWebRGBA("rgba(-1, 255, 255, 1)")).toBe(false);
        });
        test("should return true when invoked with an opacity decimal with a preceding 0", () => {
            expect(isColorStringWebRGBA("rgba(255, 255, 255, 0.1)")).toBe(true);
        });
        test("should return true when invoked with an opacity decimal without a preceding 0", () => {
            expect(isColorStringWebRGBA("rgba(255, 255, 255, .1)")).toBe(true);
        });
        test("should return false when invoked with an opacity value greater than 1", () => {
            expect(isColorStringWebRGBA("rgba(255, 255, 255, 1.2)")).toBe(false);
            expect(isColorStringWebRGBA("rgba(255, 255, 255, 2)")).toBe(false);
            expect(isColorStringWebRGBA("rgba(255, 255, 255, 20)")).toBe(false);
        });
        test("should return false when invoked with an opacity less than 0", () => {
            expect(isColorStringWebRGBA("rgba(255, 255, 255, -.2)")).toBe(false);
            expect(isColorStringWebRGBA("rgba(255, 255, 255, -2)")).toBe(false);
            expect(isColorStringWebRGBA("rgba(255, 255, 255, -20)")).toBe(false);
        });
    });
});
