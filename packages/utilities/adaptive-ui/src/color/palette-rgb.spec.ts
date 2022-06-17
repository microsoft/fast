import { parseColorHexRGB } from "@microsoft/fast-colors";
import chai from "chai";
import { PaletteRGB, PaletteRGBOptions } from "./palette-rgb.js";
import { SwatchRGB } from "./swatch.js";
import { contrast } from "./utilities/relative-luminance.js";

const { expect } = chai;

const grey: SwatchRGB = SwatchRGB.from(parseColorHexRGB("#808080")!);

describe("PaletteRGB.from", () => {
    it("should create a palette from the provided swatch", () => {
        const palette = PaletteRGB.from(grey);

        expect(palette.source === grey).to.be.true;
    });

    it("should create a palette with increased contrast", () => {
        const options: Partial<PaletteRGBOptions> = {
            stepContrast: 1.07,
            stepContrastRamp: 0,
        };
        const palette = PaletteRGB.from(grey, options);

        expect(
            contrast(palette.swatches[0], palette.swatches[1]),
            "at least 1.07:1 between 0 and 1"
        ).to.be.gte(1.07);
        expect(
            contrast(palette.swatches[20], palette.swatches[21]),
            "at least 1.07:1 between 20 and 21"
        ).to.be.gte(1.07);
    });

    // TODO: Fix with https://github.com/microsoft/fast/issues/5852
    // it("should create a palette with preserved source", () => {
    //     const options: Partial<PaletteRGBOptions> = {
    //             preserveSource: true,
    //     };
    //     const palette = PaletteRGB.from(grey, options);

    //     expect(contrast(palette.swatches[0], palette.swatches[1]), "at least 1.05:1 between 0 and 1").to.be.gte(1.05);
    //     expect(contrast(palette.swatches[20], palette.swatches[21]), "at least 1.05:1 between 0 and 1").to.be.gte(1.05);
    // });
});
