import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import { expect } from "chai";
import { PaletteRGB } from "../color-vNext/palette";
import { neutralDivider } from "../color-vNext/recipes/neutral-divider";
import { SwatchRGB } from "../color-vNext/swatch";
import { fastDesignSystemDefaults } from "../fast-design-system";
import { neutralBaseColor } from "./color-constants";
import { neutralDividerRest_DEPRECATED } from "./neutral-divider";

describe("neutralDividerRest", (): void => {
    it("should return a string when invoked with an object", (): void => {
        expect(typeof neutralDividerRest_DEPRECATED(fastDesignSystemDefaults)).to.equal("string");
    });

    it("should return a function when invoked with a function", (): void => {
        expect(typeof neutralDividerRest_DEPRECATED(() => "#FFF")).to.equal("function");
    });
});


describe("ensure parity between old and new recipe implementation", () => {
    const color = (parseColorHexRGB(neutralBaseColor)!)
    const palette = PaletteRGB.create(SwatchRGB.create(color.r, color.g, color.b));
    palette.swatches.forEach(( newSwatch, index ) => {
        it(`should be the same for ${newSwatch.toColorString()}`, () => {
            expect(neutralDivider(palette, newSwatch, fastDesignSystemDefaults.neutralDividerRestDelta).toColorString().toUpperCase()).to.equal(
                neutralDividerRest_DEPRECATED({...fastDesignSystemDefaults, backgroundColor: fastDesignSystemDefaults.neutralPalette[index]})
            )
        })
    })
})