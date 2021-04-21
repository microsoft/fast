import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import { expect } from "chai";
import { PaletteRGB } from "../color-2/palette";
import { neutralDivider } from "../color-2/recipes/neutral-divider";
import { SwatchRGB } from "../color-2/swatch";
import { fastDesignSystemDefaults } from "../fast-design-system";
import { neutralBaseColor } from "./color-constants";
import { neutralDividerRest } from "./neutral-divider";

describe("neutralDividerRest", (): void => {
    it("should return a string when invoked with an object", (): void => {
        expect(typeof neutralDividerRest(fastDesignSystemDefaults)).to.equal("string");
    });

    it("should return a function when invoked with a function", (): void => {
        expect(typeof neutralDividerRest(() => "#FFF")).to.equal("function");
    });
});


describe("ensure parity between old and new recipe implementation", () => {
    const color = (parseColorHexRGB(neutralBaseColor)!)
    const palette = new PaletteRGB(new SwatchRGB(color.r, color.g, color.b));
    palette.swatches.forEach(( newSwatch, index ) => {
        it(`should be the same for ${newSwatch}`, () => {
            expect(neutralDivider(palette, newSwatch, fastDesignSystemDefaults.neutralDividerRestDelta).toColorString().toUpperCase()).to.equal(
                neutralDividerRest({...fastDesignSystemDefaults, backgroundColor: fastDesignSystemDefaults.neutralPalette[index]})
            )
        })
    })
})