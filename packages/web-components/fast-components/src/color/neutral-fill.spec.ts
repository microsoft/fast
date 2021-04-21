import { expect } from "chai";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system";
import {
    neutralFill,
    neutralFillActive,
    neutralFillFocus,
    neutralFillHover,
    neutralFillRest,
    neutralFillSelected,
} from "./neutral-fill";
import { Palette } from "./palette";
import { FillSwatchFamily, Swatch } from "./common";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { neutralBaseColor } from "./color-constants";
import { SwatchRGB } from "../color-2/swatch";
import { PaletteRGB } from "../color-2/palette";
import { neutralFill as neutralFillNew } from "../color-2/recipes/neutral-fill"

describe("neutralFill", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    it("should operate on design system defaults", (): void => {
        [
            neutralFillActive,
            neutralFillFocus,
            neutralFillHover,
            neutralFillRest,
            neutralFillSelected,
        ].forEach(fn => {
            expect(neutralPalette).to.include(fn({} as FASTDesignSystem));
        });
    });

    it("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(neutralFillRest(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillRest(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillHover(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillHover(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillActive(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillActive(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillFocus(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillFocus(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillSelected(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillSelected(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
        });
    });

    it("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            const backplates: FillSwatchFamily = neutralFill(() => swatch)(
                fastDesignSystemDefaults
            );
            const rest: Swatch = neutralFillRest(() => swatch)(fastDesignSystemDefaults);
            const hover: Swatch = neutralFillHover(() => swatch)(
                fastDesignSystemDefaults
            );
            const active: Swatch = neutralFillActive(() => swatch)(
                fastDesignSystemDefaults
            );
            const focus: Swatch = neutralFillFocus(() => swatch)(
                fastDesignSystemDefaults
            );
            const selected: Swatch = neutralFillSelected(() => swatch)(
                fastDesignSystemDefaults
            );

            expect(backplates.rest).to.equal(rest);
            expect(backplates.hover).to.equal(hover);
            expect(backplates.active).to.equal(active);
            expect(backplates.focus).to.equal(focus);
            expect(backplates.selected).to.equal(selected);
        });
    });
});
describe("ensure parity between old and new recipe implementation", () => {
    const color = (parseColorHexRGB(neutralBaseColor)!)
    const palette = new PaletteRGB(new SwatchRGB(color.r, color.g, color.b));
    palette.swatches.forEach(( newSwatch, index ) => {
        const { neutralFillRestDelta, neutralFillHoverDelta, neutralFillActiveDelta, neutralFillFocusDelta, neutralFillSelectedDelta } = fastDesignSystemDefaults;
        const oldValues = neutralFill({...fastDesignSystemDefaults, backgroundColor: fastDesignSystemDefaults.neutralPalette[index]});
        const newValues = neutralFillNew(palette, newSwatch, neutralFillRestDelta, neutralFillHoverDelta, neutralFillActiveDelta, neutralFillFocusDelta, neutralFillSelectedDelta );
            it(`should be the same for ${newSwatch}`, () => {
                for (let key in oldValues) {
                    expect(oldValues[key]).to.equal(newValues[key].toColorString().toUpperCase())
                }
        });
    })
})