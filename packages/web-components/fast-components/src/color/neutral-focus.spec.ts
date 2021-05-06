import { expect } from "chai";
import { accentBaseColor, FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import { neutralFocus, neutralFocusInnerAccent } from "./neutral-focus";
import { contrast } from "./common";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { neutralBaseColor } from "./color-constants";
import { PaletteRGB } from "../color-vNext/palette";
import { SwatchRGB } from "../color-vNext/swatch";
import  {accentBase } from "../color-vNext/utilities/color-constants";
import { neutralFocus as neutralFocusNew } from "../color-vNext/recipes/neutral-focus";
import { neutralFocusInnerAccent as neutralFocusInnerAccentNew } from "../color-vNext/recipes/neutral-focus-inner-accent";

describe("neutralFocus", (): void => {
    it("should return a string when invoked with an object", (): void => {
        expect(typeof neutralFocus(fastDesignSystemDefaults)).to.equal("string");
    });

    it("should return a function when invoked with a function", (): void => {
        expect(typeof neutralFocus(() => "#FFF")).to.equal("function");
    });

    it("should operate on default design system if no design system is supplied", (): void => {
        expect(contrast(neutralFocus({} as FASTDesignSystem), "#FFF")).to.be.gte(3.5);
    });
    describe("ensure parity between old and new recipe implementation", () => {
        const color = (parseColorHexRGB(neutralBaseColor)!)
        const palette = PaletteRGB.create(SwatchRGB.create(color.r, color.g, color.b));
        palette.swatches.forEach(( newSwatch, index ) => {
                it(`should be the same for ${newSwatch}`, () => {
                    expect(neutralFocus({...fastDesignSystemDefaults, backgroundColor: fastDesignSystemDefaults.neutralPalette[index]})).to.be.equal(neutralFocusNew( palette, newSwatch).toColorString().toUpperCase())
            });
        })
    })
});

describe("neutralFocusInnerAccent", () => {
    describe("ensure parity between old and new recipe implementation", () => {
        const neutralBase = (parseColorHexRGB(neutralBaseColor)!)
        const neutralPalette = PaletteRGB.create(SwatchRGB.create(neutralBase.r, neutralBase.g, neutralBase.b));
        const accentPalette = PaletteRGB.create(accentBase);
        neutralPalette.swatches.forEach(( newSwatch, index ) => {
                const neutralFocusColor = neutralFocusNew(neutralPalette, newSwatch);
                it(`should be the same for ${newSwatch}`, () => {
                    expect(neutralFocusInnerAccent(accentBaseColor)({...fastDesignSystemDefaults, backgroundColor: fastDesignSystemDefaults.neutralPalette[index]}))
                    .to.be.equal(neutralFocusInnerAccentNew(
                        accentPalette,
                        newSwatch,
                        neutralFocusColor,
                      ).toColorString().toUpperCase())
            });
        })
    })
})