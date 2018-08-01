import { luminanceSwitch, luminance } from "./luminosity";
import * as Chroma from "chroma-js";

describe("luminance", (): void => {
    test("should adjust a color to an approximate luminance value", (): void => {
        const targetLuminance = .5;

        expect(parseFloat(Chroma(luminance(targetLuminance, Chroma("#FFF"))).luminance().toPrecision(2))).toBe(targetLuminance);
        expect(parseFloat(Chroma(luminance(targetLuminance, Chroma("#000"))).luminance().toPrecision(2))).toBe(targetLuminance);
        expect(parseFloat(Chroma(luminance(targetLuminance, Chroma("#067983"))).luminance().toPrecision(2))).toBe(targetLuminance);
        expect(parseFloat(Chroma(luminance(targetLuminance, Chroma("red"))).luminance().toPrecision(2))).toBe(targetLuminance);
        expect(parseFloat(Chroma(luminance(targetLuminance, Chroma("green"))).luminance().toPrecision(2))).toBe(targetLuminance);
        expect(parseFloat(Chroma(luminance(targetLuminance, Chroma("blue"))).luminance().toPrecision(2))).toBe(targetLuminance);
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
