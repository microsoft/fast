import { contrast, luminanceSwitch } from "./contrast";
import Chroma from "chroma-js";

const white: string = "#FFF";
const black: string = "#000";

describe("contrast", (): void => {
    test("should return a hexadecimal color", (): void => {
        const hexregex = /\#[A-Fa-f0-9]{3,6}/;
        expect(contrast(4.5, white, black)).toMatch(hexregex);
        expect(contrast(4.5, black, white)).toMatch(hexregex);
    });
    test("should return a color that excedes the contrast ratio of the target contrast ratio", (): void => {
        const targetRatio: number = 4.5;
        const foreground: string = white;
        const background: string = black;

        expect(Chroma.contrast(contrast(4.5, foreground, background), background)).toBeGreaterThan(targetRatio);
        expect(Chroma.contrast(contrast(4.5, background, foreground), foreground)).toBeGreaterThan(targetRatio);
    });
});

describe("luminanceSwitch", (): void => {
    test("should always return a function", (): void => {
        expect(typeof luminanceSwitch(0, 1)).toBe("function");
        expect(typeof luminanceSwitch(1, 0)).toBe("function");
    });
    test("should return a function that returns the first argument when the foreground luminance is greater than the background luminance", (): void => {
        expect(luminanceSwitch(1, 0)(true, false)).toBe(true);
    });
    test("should return a function that returns the second argument when the foreground luminance is less than the background luminance", (): void => {
        expect(luminanceSwitch(0, 1)(true, false)).toBe(false);
    });
    test("should return a function that returns the second argument when the foreground luminance is equal to background luminance and both are greater than .5", (): void => {
        expect(luminanceSwitch(.51, .51)(true, false)).toBe(false);
        expect(luminanceSwitch(.51, .51)(true, false)).toBe(false);
    });
    test("should return a function that returns the second argument when the foreground luminance is equal to background luminance and both are .5 or less", (): void => {
        expect(luminanceSwitch(.5, .5)(true, false)).toBe(true);
        expect(luminanceSwitch(0, 0)(true, false)).toBe(true);
    });
});
