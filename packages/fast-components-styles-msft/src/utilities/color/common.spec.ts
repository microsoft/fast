import { colorMatches, contrast, isValidColor, parseColorString } from "./common";
import { ColorRGBA64 } from "@microsoft/fast-colors";

describe("isValidColor", (): void => {
    test("should return true when input is a hex color", (): void => {
        expect(isValidColor("#000")).toBeTruthy();
        expect(isValidColor("#000000")).toBeTruthy();
    });
    test("should return false when input is not a color", (): void => {
        expect(isValidColor(undefined as any)).toBeFalsy();
        expect(isValidColor(null as any)).toBeFalsy();
        expect(isValidColor("ooggabooga")).toBeFalsy();
    });
});

describe("colorMatches", (): void => {
    test("should throw arguments are not colors", (): void => {
        expect(
            (): void => {
                colorMatches("dksfjd", "weeeeeeee");
            }
        ).toThrow();
    });

    test("should return true if colors are the same", (): void => {
        expect(colorMatches("#F00", "rgb(255, 0, 0)")).toBeTruthy();
        expect(colorMatches("#000", "rgb(0, 0, 0)")).toBeTruthy();
        expect(colorMatches("#FFF", "rgb(255, 255, 255)")).toBeTruthy();
        expect(colorMatches("#FF0000", "rgb(255, 0, 0)")).toBeTruthy();
        expect(colorMatches("#000000", "rgb(0, 0, 0)")).toBeTruthy();
        expect(colorMatches("#FFFFFF", "rgb(255, 255, 255)")).toBeTruthy();
    });

    test("should return false if colors are not the same", (): void => {
        expect(colorMatches("#000", "#023")).toBeFalsy();
        expect(colorMatches("#000", "#001")).toBeFalsy();
        expect(colorMatches("#F00", "rgb(255, 0, 1)")).toBeFalsy();
        expect(colorMatches("#000000", "#002233")).toBeFalsy();
        expect(colorMatches("#000000", "#000011")).toBeFalsy();
        expect(colorMatches("#FF0000", "rgb(255, 0, 1)")).toBeFalsy();
    });
});

describe("parseColorHexRGB", (): void => {
    test("should parse #RGB color strings", (): void => {
        expect(parseColorString("#FFF") instanceof ColorRGBA64).toBe(true);
    });
    test("should parse #RRGGBB color strings", (): void => {
        expect(parseColorString("#001122") instanceof ColorRGBA64).toBe(true);
    });
    test("should throw if the color is a malformed shothand hex", (): void => {
        expect(
            (): void => {
                parseColorString("#GGG");
            }
        ).toThrow();
    });
    test("should throw if the color is a malformed hex", (): void => {
        expect(
            (): void => {
                parseColorString("#zzzzzz");
            }
        ).toThrow();
    });
    test("should throw if the color is a malformed rgb", (): void => {
        expect(
            (): void => {
                parseColorString("rgb(256, 244, 30)");
            }
        ).toThrow();
    });
    test("should throw if the color is a rgba", (): void => {
        expect(
            (): void => {
                parseColorString("rgba(255, 244, 30, 1)");
            }
        ).toThrow();
    });
});

describe("contrast", (): void => {
    test("should return the contrast between two colors", (): void => {
        expect(contrast("#000", "#FFF")).toBe(21);
        expect(contrast("#000000", "#FFFFFF")).toBe(21);
        expect(contrast("rgb(0, 0, 0)", "rgb(255, 255, 255)")).toBe(21);
    });
    test("should throw if either color cannot be converted to a color", (): void => {
        expect(
            (): void => {
                contrast("oogabooga", "#000");
            }
        ).toThrow();
        expect(
            (): void => {
                contrast("#000", "oogabooga");
            }
        ).toThrow();
    });
});
