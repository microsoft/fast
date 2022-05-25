import chai from "chai";
import { PaletteRGB } from "./palette-rgb.js";
import { SwatchRGB } from "./swatch.js";

const { expect } = chai;

const test: SwatchRGB = new SwatchRGB(0, 0, 0);

describe("PaletteRGB.from", () => {
    it("should create a palette from the provided swatch if it matches a SwatchRGB implementation", () => {
        const palette = PaletteRGB.from(test);

        expect(palette.source === test).to.be.true;
    });
});
