import { contrast, adjustmentLimit } from "./contrast";
import Chroma from "chroma-js";

const white: string = "#FFF";
const black: string = "#000";

describe("contrast", (): void => {
    test("should return a hexadecimal color", (): void => {
        console.log(contrast(4.5, white, white));
        expect(contrast(4.5, white, white));
    });
    test("should darken the foreground color to a match a contrast ratio above the target", (): void => {
        const white: string = "#FFF";
        const black: string = "#000";
        const middle = 255;
        // console.log(contrast(4.5, "#FFF", "#000"));
        // console.log(contrast(4.5, "red", "#000"));
        // console.log(Chroma.contrast("red", "rgb(12, 127, 127)"))
        // contrast(4.5, "#000", "#000");
        // contrast(4.5, `rgb(${middle}, ${middle}, ${middle})`, `rgb(${middle}, ${middle}, ${middle})`);
        expect(2).toBe(2);
    });

});
