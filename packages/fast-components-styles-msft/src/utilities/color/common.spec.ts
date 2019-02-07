import { isValidColor, colorMatches, contrast } from "./common";

describe("isValidColor", (): void => {
    test("should return true when input is a color", (): void => {
        expect(isValidColor("red")).toBeTruthy();
        expect(isValidColor("#000")).toBeTruthy();
    });
    test("should return false when input is not a color", (): void => {
        expect(isValidColor(undefined as any)).toBeFalsy();
        expect(isValidColor(null as any)).toBeFalsy();
        expect(isValidColor(["red"] as any)).toBeFalsy();
        expect(isValidColor("ooggabooga")).toBeFalsy();
    });
});

describe("colorMatches", (): void => {
    test("should return false if arguments are not colors", (): void => {
        expect(colorMatches(1, 2)).toBeFalsy();
        expect(colorMatches("dksfjd", "weeeeeeee")).toBeFalsy();
    });

    test("should return true if colors are the same", (): void => {
        expect(colorMatches("red", "rgb(255, 0, 0)")).toBeTruthy();
        expect(colorMatches("#000", "rgb(0, 0, 0)")).toBeTruthy();
        expect(colorMatches("#FFF", "rgb(255, 255, 255)")).toBeTruthy();
    });

    test("should return false if colors are not the same", (): void => {
        expect(colorMatches("#000", "#023")).toBeFalsy();
        expect(colorMatches("#000", "#001")).toBeFalsy();
        expect(colorMatches("red", "rgb(255, 0, 1)")).toBeFalsy();
    });
});

describe("contrast", (): void => {
    test("should return the contrast between two colors", (): void => {
        expect(contrast("#000", "#FFF")).toBe(21);
    });
    test("should return 0 if either color cannot be converted to a color", (): void => {
        expect(contrast("oogabooga", "#000")).toBe(0);
        expect(contrast("#000", "oogabooga")).toBe(0);
    });
});
