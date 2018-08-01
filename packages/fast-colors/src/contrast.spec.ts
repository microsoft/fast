import { contrast } from "./contrast";
import * as Chroma from "chroma-js";

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

        expect(Chroma.contrast(contrast(targetRatio, white, black), black)).toBeGreaterThan(targetRatio);
        expect(Chroma.contrast(contrast(targetRatio, black, white), white)).toBeGreaterThan(targetRatio);
    });
});

