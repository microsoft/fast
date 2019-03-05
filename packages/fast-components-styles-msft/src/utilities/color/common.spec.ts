import { colorMatches, contrast, isValidColor } from "./common";

describe("isValidColor", (): void => {
    test("should return true when input is a hex color", (): void => {
        // TODO: https://github.com/Microsoft/fast-dna/issues/1473
        // expect(isValidColor("#000")).toBeTruthy();
        expect(isValidColor("#000000")).toBeTruthy();
    });
    test("should return false when input is not a color", (): void => {
        expect(isValidColor(undefined as any)).toBeFalsy();
        expect(isValidColor(null as any)).toBeFalsy();
        expect(isValidColor("ooggabooga")).toBeFalsy();
    });
});

describe("colorMatches", (): void => {
    test("should return false if arguments are not colors", (): void => {
        expect(colorMatches("dksfjd", "weeeeeeee")).toBeFalsy();
    });

    test("should return true if colors are the same", (): void => {
        // TODO: https://github.com/Microsoft/fast-dna/issues/1473
        // expect(colorMatches("#F00", "rgb(255, 0, 0)")).toBeTruthy();
        // expect(colorMatches("#000", "rgb(0, 0, 0)")).toBeTruthy();
        // expect(colorMatches("#FFF", "rgb(255, 255, 255)")).toBeTruthy();
        expect(colorMatches("#FF0000", "rgb(255, 0, 0)")).toBeTruthy();
        expect(colorMatches("#000000", "rgb(0, 0, 0)")).toBeTruthy();
        expect(colorMatches("#FFFFFF", "rgb(255, 255, 255)")).toBeTruthy();
    });

    test("should return false if colors are not the same", (): void => {
        // TODO: https://github.com/Microsoft/fast-dna/issues/1473
        // expect(colorMatches("#000", "#023")).toBeFalsy();
        // expect(colorMatches("#000", "#001")).toBeFalsy();
        // expect(colorMatches("#F00", "rgb(255, 0, 1)")).toBeFalsy();
        expect(colorMatches("#000000", "#002233")).toBeFalsy();
        expect(colorMatches("#000000", "#000011")).toBeFalsy();
        expect(colorMatches("#FF0000", "rgb(255, 0, 1)")).toBeFalsy();
    });
});

describe("contrast", (): void => {
    test("should return the contrast between two colors", (): void => {
        // TODO: https://github.com/Microsoft/fast-dna/issues/1473
        // expect(contrast("#000", "#FFF")).toBe(21);
        expect(contrast("#000000", "#FFFFFF")).toBe(21);
        expect(contrast("rgb(0, 0, 0)", "rgb(255, 255, 255)")).toBe(21);
    });
    test("should return -1 if either color cannot be converted to a color", (): void => {
        expect(contrast("oogabooga", "#000")).toBe(-1);
        expect(contrast("#000", "oogabooga")).toBe(-1);
    });
});
