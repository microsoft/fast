import chai from "chai";
import { test } from "mocha";
import { testData } from "./__test__/testData.js";
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
} from "./index.js";
const expect = chai.expect;

const testPrecision: number = 4;
const hexDigits: string[] = [
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

describe("Color parsing and toString", (): void => {
    test("parseColorHexRGB", () => {
        function testColor(data: any): void {
            let rgb: ColorRGBA64 | null = parseColor(data.hexRGBString);

            expect(rgb).not.to.be.undefined;
            expect(rgb!.r).to.be.closeTo(data.rgba.r, testPrecision);
            expect(rgb!.g).to.be.closeTo(data.rgba.g, testPrecision);
            expect(rgb!.b).to.be.closeTo(data.rgba.b, testPrecision);
            expect(rgb!.a).to.equal(1);

            rgb = parseColorHexRGB(data.hexRGBString);
            expect(rgb).not.to.be.undefined;
            expect(rgb!.r).to.be.closeTo(data.rgba.r, testPrecision);
            expect(rgb!.g).to.be.closeTo(data.rgba.g, testPrecision);
            expect(rgb!.b).to.be.closeTo(data.rgba.b, testPrecision);
            expect(rgb!.a).to.equal(1);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("parseColorHexRGB shorthand", () => {
        const rgb: string[][] = [hexDigits, hexDigits, hexDigits];

        for (const r of rgb[0]) {
            for (const g of rgb[1]) {
                for (const b of rgb[2]) {
                    const hex: string = `#${r + r + g + g + b + b}`;
                    const shorthandHex: string = `#${r + g + b}`;

                    const hexColor: ColorRGBA64 = parseColorHexRGB(hex);
                    const hexShorthandColor: ColorRGBA64 = parseColorHexRGB(shorthandHex);

                    expect(hexColor!.r).to.equal(hexShorthandColor!.r);
                    expect(hexColor!.g).to.equal(hexShorthandColor!.g);
                    expect(hexColor!.b).to.equal(hexShorthandColor!.b);
                }
            }
        }
    });

    test("parseColorHexARGB", () => {
        function testColor(data: any): void {
            let rgba: ColorRGBA64 | null = parseColor(data.hexARGBString);

            expect(rgba).not.to.be.undefined;
            expect(rgba!.r).to.be.closeTo(data.rgba.r, testPrecision);
            expect(rgba!.g).to.be.closeTo(data.rgba.g, testPrecision);
            expect(rgba!.b).to.be.closeTo(data.rgba.b, testPrecision);
            expect(rgba!.a).to.be.closeTo(data.rgba.a, testPrecision);

            rgba = parseColor(data.hexARGBString);

            expect(rgba).not.to.be.undefined;
            expect(rgba!.r).to.be.closeTo(data.rgba.r, testPrecision);
            expect(rgba!.g).to.be.closeTo(data.rgba.g, testPrecision);
            expect(rgba!.b).to.be.closeTo(data.rgba.b, testPrecision);
            expect(rgba!.a).to.be.closeTo(data.rgba.a, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("parseColorHexARGB shorthand", () => {
        const argb: string[][] = [hexDigits, hexDigits, hexDigits, hexDigits];

        for (const a of argb[0]) {
            for (const r of argb[1]) {
                for (const g of argb[2]) {
                    for (const b of argb[3]) {
                        const hex: string = `#${a + a + r + r + g + g + b + b}`;
                        const shorthandHex: string = `#${a + r + g + b}`;

                        const hexColor: ColorRGBA64 = parseColorHexARGB(hex);
                        const hexShorthandColor: ColorRGBA64 =
                            parseColorHexARGB(shorthandHex);

                        expect(hexColor!.a).to.equal(hexShorthandColor!.a);
                        expect(hexColor!.r).to.equal(hexShorthandColor!.r);
                        expect(hexColor!.g).to.equal(hexShorthandColor!.g);
                        expect(hexColor!.b).to.equal(hexShorthandColor!.b);
                    }
                }
            }
        }
    });

    test("parseColorHexRGBA", () => {
        function testColor(data: any): void {
            const rgba: ColorRGBA64 | null = parseColorHexRGBA(data.hexRGBAString);

            expect(rgba).not.to.be.undefined;
            expect(rgba!.r).to.be.closeTo(data.rgba.r, testPrecision);
            expect(rgba!.g).to.be.closeTo(data.rgba.g, testPrecision);
            expect(rgba!.b).to.be.closeTo(data.rgba.b, testPrecision);
            expect(rgba!.a).to.be.closeTo(data.rgba.a, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("parseColorHexRGBA shorthand", () => {
        const rgba: string[][] = [hexDigits, hexDigits, hexDigits, hexDigits];

        for (const r of rgba[0]) {
            for (const g of rgba[1]) {
                for (const b of rgba[2]) {
                    for (const a of rgba[3]) {
                        const hex: string = `#${r + r + g + g + b + b + a + a}`;
                        const shorthandHex: string = `#${r + g + b + a}`;

                        const hexColor: ColorRGBA64 = parseColorHexRGBA(hex);
                        const hexShorthandColor: ColorRGBA64 =
                            parseColorHexRGBA(shorthandHex);

                        expect(hexColor!.r).to.equal(hexShorthandColor!.r);
                        expect(hexColor!.g).to.equal(hexShorthandColor!.g);
                        expect(hexColor!.b).to.equal(hexShorthandColor!.b);
                        expect(hexColor!.a).to.equal(hexShorthandColor!.a);
                    }
                }
            }
        }
    });

    test("parseColorWebShort", () => {
        function testColor(data: any): void {
            let rgb: ColorRGBA64 | null = parseColor(data.webRGBString);

            expect(rgb).not.to.be.undefined;
            expect(rgb!.r).to.be.closeTo(data.rgba.r, testPrecision);
            expect(rgb!.g).to.be.closeTo(data.rgba.g, testPrecision);
            expect(rgb!.b).to.be.closeTo(data.rgba.b, testPrecision);
            expect(rgb!.a).to.equal(1);

            rgb = parseColorWebRGB(data.webRGBString);
            expect(rgb).not.to.be.undefined;
            expect(rgb!.r).to.be.closeTo(data.rgba.r, testPrecision);
            expect(rgb!.g).to.be.closeTo(data.rgba.g, testPrecision);
            expect(rgb!.b).to.be.closeTo(data.rgba.b, testPrecision);
            expect(rgb!.a).to.equal(1);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("parseColorWebLong", () => {
        function testColor(data: any): void {
            let rgba: ColorRGBA64 | null = parseColor(data.webRGBAString);

            expect(rgba).not.to.be.undefined;
            expect(rgba!.r).to.be.closeTo(data.rgba.r, testPrecision);
            expect(rgba!.g).to.be.closeTo(data.rgba.g, testPrecision);
            expect(rgba!.b).to.be.closeTo(data.rgba.b, testPrecision);
            expect(rgba!.a).to.be.closeTo(data.rgba.a, testPrecision);

            rgba = parseColorWebRGBA(data.webRGBAString);
            expect(rgba).not.to.be.undefined;
            expect(rgba!.r).to.be.closeTo(data.rgba.r, testPrecision);
            expect(rgba!.g).to.be.closeTo(data.rgba.g, testPrecision);
            expect(rgba!.b).to.be.closeTo(data.rgba.b, testPrecision);
            expect(rgba!.a).to.be.closeTo(data.rgba.a, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("parseColorNamed", () => {
        function testColor(data: any): void {
            let rgba: ColorRGBA64 | null = parseColor(data.name);

            expect(rgba).not.to.be.undefined;
            expect(rgba!.r).to.be.closeTo(data.rgba.r, testPrecision);
            expect(rgba!.g).to.be.closeTo(data.rgba.g, testPrecision);
            expect(rgba!.b).to.be.closeTo(data.rgba.b, testPrecision);
            expect(rgba!.a).to.be.closeTo(data.rgba.a, testPrecision);

            rgba = parseColorNamed(data.name);
            expect(rgba).not.to.be.undefined;
            expect(rgba!.r).to.be.closeTo(data.rgba.r, testPrecision);
            expect(rgba!.g).to.be.closeTo(data.rgba.g, testPrecision);
            expect(rgba!.b).to.be.closeTo(data.rgba.b, testPrecision);
            expect(rgba!.a).to.be.closeTo(data.rgba.a, testPrecision);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("stringifyColorHexRGB", () => {
        function testColor(data: any): void {
            const c: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(c).not.to.be.undefined;
            const str: string = c!.toStringHexRGB();
            expect(str).to.equal(data.hexRGBString);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("stringifyColorHexARGB", () => {
        function testColor(data: any): void {
            const c: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(c).not.to.be.undefined;
            const str: string = c!.toStringHexARGB();
            expect(str).to.equal(data.hexARGBString);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("stringifyColorHexRGBA", () => {
        function testColor(data: any): void {
            const c: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(c).not.to.be.undefined;
            const str: string = c!.toStringHexRGBA();
            expect(str).to.equal(data.hexRGBAString);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("stringifyColorWebShort", () => {
        function testColor(data: any): void {
            const c: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(c).not.to.be.undefined;
            const str: string = c!.toStringWebRGB();
            expect(str).to.equal(data.webRGBString);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });

    test("stringifyColorWebLong", () => {
        function testColor(data: any): void {
            const c: ColorRGBA64 | null = ColorRGBA64.fromObject(data.rgba);
            expect(c).not.to.be.undefined;
            const str: string = c!.toStringWebRGBA();
            expect(str).to.equal(data.webRGBAString);
        }
        for (const data of testData.namedColors) {
            testColor(data);
        }
    });
});

describe("Color identification", (): void => {
    describe("isColorStringHexRGB", (): void => {
        test("should return false when invoked with a HexRGBA color", (): void => {
            expect(isColorStringHexRGB("#000000FF")).to.equal(false);
            expect(isColorStringHexRGB("#000F")).to.equal(false);
        });

        test("should return false when invoked with a HexARGB color", (): void => {
            expect(isColorStringHexRGB("#FF000000")).to.equal(false);
            expect(isColorStringHexRGB("#F000")).to.equal(false);
        });

        test("should return false when invoked with a WebRGB color", (): void => {
            expect(isColorStringHexRGB("rgb(255, 255, 255)")).to.equal(false);
        });

        test("should return false when invoked with a WebRGBA color", (): void => {
            expect(isColorStringHexRGB("rgba(255, 255, 255, 1)")).to.equal(false);
        });

        test("should return true when invoked with a HexRGB color", (): void => {
            expect(isColorStringHexRGB("#000000")).to.equal(true);
        });

        test("should return true when invoked with three hexidecimal numbers", (): void => {
            expect(isColorStringHexRGB("#000")).to.equal(true);
        });

        test("should return false when invoked with a non-hexidecimal digit", (): void => {
            expect(isColorStringHexRGB("#00000G")).to.equal(false);
        });
    });

    describe("isColorStringHexRGBA", (): void => {
        test("should return false when invoked with a HexRGB color", (): void => {
            expect(isColorStringHexRGBA("#000000")).to.equal(false);
            expect(isColorStringHexRGBA("#000")).to.equal(false);
        });

        test("should return true when invoked with a HexARGB color", (): void => {
            expect(isColorStringHexRGBA("#FF000000")).to.equal(true); // No way to differentiate between HexARGB and HexRGBA
            expect(isColorStringHexRGBA("#F000")).to.equal(true); // No way to differentiate between HexARGB and HexRGBA
        });

        test("should return false when invoked with a WebRGB color", (): void => {
            expect(isColorStringHexRGBA("rgb(255, 255, 255)")).to.equal(false);
        });

        test("should return false when invoked with a WebRGBA color", (): void => {
            expect(isColorStringHexRGBA("rgba(255, 255, 255, 1)")).to.equal(false);
        });

        test("should return true when invoked with a HexRGBA color", (): void => {
            expect(isColorStringHexRGBA("#000000FF")).to.equal(true);
        });

        test("should return true when invoked with four hexidecimal numbers", (): void => {
            expect(isColorStringHexRGBA("#000F")).to.equal(true);
        });

        test("should return false when invoked with a non-hexidecimal digit", (): void => {
            expect(isColorStringHexRGBA("#000G")).to.equal(false);
        });
    });

    describe("isColorStringHexARGB", (): void => {
        test("should return false when invoked with a HexRGB color", (): void => {
            expect(isColorStringHexARGB("#000000")).to.equal(false);
            expect(isColorStringHexARGB("#000")).to.equal(false);
        });

        test("should return true when invoked with a HexRGBA color", (): void => {
            expect(isColorStringHexARGB("#000000FF")).to.equal(true); // No way to differentiate between HexARGB and HexRGBA
            expect(isColorStringHexARGB("#000F")).to.equal(true); // No way to differentiate between HexARGB and HexRGBA
        });

        test("should return false when invoked with a WebRGB color", (): void => {
            expect(isColorStringHexARGB("rgb(255, 255, 255)")).to.equal(false);
        });

        test("should return false when invoked with a WebRGBA color", (): void => {
            expect(isColorStringHexARGB("rgba(255, 255, 255, 1)")).to.equal(false);
        });

        test("should return true when invoked with a HexARGB color", (): void => {
            expect(isColorStringHexARGB("#FF000000")).to.equal(true);
        });

        test("should return true when invoked with four hexidecimal numbers", (): void => {
            expect(isColorStringHexRGBA("#F000")).to.equal(true);
        });

        test("should return false when invoked with a non-hexidecimal digit", (): void => {
            expect(isColorStringHexRGBA("#G000")).to.equal(false);
        });
    });
    describe("isColorStringWebRGB", (): void => {
        test("should return false when invoked with a HexRGB color", (): void => {
            expect(isColorStringWebRGB("#000000")).to.equal(false);
        });

        test("should return true when invoked with a HexRGBA color", (): void => {
            expect(isColorStringWebRGB("#000000FF")).to.equal(false);
        });

        test("should return true when invoked with a HexARGB color", (): void => {
            expect(isColorStringWebRGB("#FF000000")).to.equal(false);
        });

        test("should return false when invoked with a WebRGBA color", (): void => {
            expect(isColorStringWebRGB("rgba(255, 255, 255, 1)")).to.equal(false);
        });

        test("should return true when invoked with a WebRGB color", (): void => {
            expect(isColorStringWebRGB("rgb(255, 255, 255)")).to.equal(true);
        });

        test("should return false a color channel is greater than 255 or less than 0", (): void => {
            expect(isColorStringWebRGB("rgb(256, 255, 255)")).to.equal(false);
            expect(isColorStringWebRGB("rgb(-1, 255, 255)")).to.equal(false);
        });
    });
    describe("isColorStringWebRGBA", (): void => {
        test("should return false when invoked with a HexRGB color", (): void => {
            expect(isColorStringWebRGBA("#000000")).to.equal(false);
        });

        test("should return true when invoked with a HexRGBA color", (): void => {
            expect(isColorStringWebRGBA("#000000FF")).to.equal(false);
        });

        test("should return true when invoked with a HexARGB color", (): void => {
            expect(isColorStringWebRGBA("#FF000000")).to.equal(false);
        });

        test("should return true when invoked with a WebRGBA color", (): void => {
            expect(isColorStringWebRGBA("rgba(255, 255, 255, 1)")).to.equal(true);
        });

        test("should return false when invoked with a WebRGB color", (): void => {
            expect(isColorStringWebRGBA("rgb(255, 255, 255)")).to.equal(false);
        });

        test("should return false a color channel is greater than 255 or less than 0", (): void => {
            expect(isColorStringWebRGBA("rgba(256, 255, 255, 1)")).to.equal(false);
            expect(isColorStringWebRGBA("rgba(-1, 255, 255, 1)")).to.equal(false);
        });

        test("should return true when invoked with an opacity decimal with a preceding 0", (): void => {
            expect(isColorStringWebRGBA("rgba(255, 255, 255, 0.1)")).to.equal(true);
        });

        test("should return true when invoked with an opacity decimal without a preceding 0", (): void => {
            expect(isColorStringWebRGBA("rgba(255, 255, 255, .1)")).to.equal(true);
        });

        test("should return false when invoked with an opacity value greater than 1", (): void => {
            expect(isColorStringWebRGBA("rgba(255, 255, 255, 1.2)")).to.equal(false);
            expect(isColorStringWebRGBA("rgba(255, 255, 255, 2)")).to.equal(false);
            expect(isColorStringWebRGBA("rgba(255, 255, 255, 20)")).to.equal(false);
        });

        test("should return false when invoked with an opacity less than 0", (): void => {
            expect(isColorStringWebRGBA("rgba(255, 255, 255, -.2)")).to.equal(false);
            expect(isColorStringWebRGBA("rgba(255, 255, 255, -2)")).to.equal(false);
            expect(isColorStringWebRGBA("rgba(255, 255, 255, -20)")).to.equal(false);
        });
    });
});
