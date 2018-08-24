import { adjustContrast, contrast, ensureContrast } from "./contrast";
import * as Chroma from "chroma-js";

const white: string = "#FFF";
const black: string = "#000";

describe("contrast", (): void => {
    test("should return a hexadecimal color", (): void => {
        const hexregex: RegExp = /\#[A-Fa-f0-9]{3,6}/;

        expect(contrast(4.5, white, black)).toMatch(hexregex);
        expect(contrast(4.5, black, white)).toMatch(hexregex);
    });
    test("should return a color that excedes the contrast ratio of the target contrast ratio", (): void => {
        const targetRatio: number = 4.5;

        expect(Chroma.contrast(contrast(targetRatio, white, black), black)).toBeGreaterThan(targetRatio);
        expect(Chroma.contrast(contrast(targetRatio, black, white), white)).toBeGreaterThan(targetRatio);
    });
});

describe("ensureContrast", (): void => {
    // Cast ensureContrast as an any value so TypeScript doesn't fail to compile
    const ensureContrastCast: any = ensureContrast;

    test("should not throw", (): void => {
        expect(() => {
            ensureContrastCast();
        }).not.toThrow();
    });
    test("should return the opperand value if arguments are not valid", (): void => {
        expect(ensureContrastCast()).toBe(undefined);
        expect(ensureContrastCast(1)).toBe(undefined);
        expect(ensureContrastCast(1, "red")).toBe("red");
        expect(ensureContrastCast(1, 1)).toBe(1);
    });
    test("should only adjust the operand color if contrast higher than the target ratio", (): void => {
        expect(ensureContrast(4.5, "#757575", "#000")).toBe("#757575"); // Contrast of 4.55
        expect(ensureContrast(5.5, "#757575", "#000")).toBe("#838383");
    });
});
describe("adjustContrast", (): void => {
    // Cast adjustContrastCast as an any value so TypeScript doesn't fail to compile
    const adjustContrastCast: any = ensureContrast;

    test("should not throw", (): void => {
        expect(() => {
            adjustContrastCast();
        }).not.toThrow();
    });
    test("should return the opperand value if arguments are not valid", (): void => {
        expect(adjustContrastCast()).toBe(undefined);
        expect(adjustContrastCast(1)).toBe(undefined);
        expect(adjustContrastCast(1, "red")).toBe("red");
        expect(adjustContrastCast(1, 1)).toBe(1);
    });
    test("should only adjust the operand color if contrast higher than the target ratio", (): void => {
        const foreground: string = "#CCC";
        const background: string = "#000";
        const adjustment: number = 4;
        const actualContrast: number = Chroma.contrast(
                adjustContrast(adjustment, foreground, background),
                background
            );
        const targetContrast: number = Chroma.contrast(foreground, background) + adjustment;

        expect(actualContrast).toBeGreaterThanOrEqual(
            // Due to rounding the contrast usually does not align perfectly so we should just ensure that it is greater
            targetContrast
        );

        expect(Math.ceil(actualContrast)).toBe(Math.ceil(targetContrast));
    });
});
