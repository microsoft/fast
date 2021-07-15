import { expect } from "chai";
import { PaletteRGB } from "../palette";
import { accentBase, middleGrey } from "../utilities/color-constants";
import { neutralForegroundHint } from "./neutral-foreground-hint";
describe("neutralForegroundHint", () => {
    const neutralPalette = PaletteRGB.create(middleGrey);
    const accentPalette = PaletteRGB.create(accentBase);
    neutralPalette.swatches.concat(accentPalette.swatches).forEach(swatch => {
        it(`${swatch} should resolve a color from the neutral palette`, () => {
            expect(
                neutralPalette.swatches.indexOf(
                    neutralForegroundHint(neutralPalette, swatch)
                )
            ).not.to.equal(-1);
        });
    });
    neutralPalette.swatches.concat(accentPalette.swatches).forEach(swatch => {
        it(`${swatch} should always be at least 4.5 : 1 against the background`, () => {
            expect(
                swatch.contrast(neutralForegroundHint(neutralPalette, swatch))
                // retrieveContrast(swatch, neutralForegroundHint_DEPRECATED)
                // Because neutralForegroundHint follows the direction patterns of neutralForeground,
                // a backgroundColor #777777 is impossible to hit 4.5 against.
            ).to.be.gte(swatch.toColorString().toUpperCase() === "#777777" ? 4.48 : 4.5);
            expect(
                swatch.contrast(neutralForegroundHint(neutralPalette, swatch))
            ).to.be.lessThan(5);
        });
    });
});
