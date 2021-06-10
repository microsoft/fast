import { expect } from "chai";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system";
import {
    neutralFill_DEPRECATED,
    neutralFillActive_DEPRECATED,
    neutralFillFocus_DEPRECATED,
    neutralFillHover_DEPRECATED,
    neutralFillRest_DEPRECATED,
    neutralFillSelected_DEPRECATED,
} from "./neutral-fill";
import { Palette } from "./palette";
import { FillSwatchFamily, Swatch } from "./common";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { neutralBaseColor } from "./color-constants";
import { SwatchRGB } from "../color-vNext/swatch";
import { PaletteRGB } from "../color-vNext/palette";
import { neutralFill as neutralFillNew } from "../color-vNext/recipes/neutral-fill"

describe("neutralFill", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    it("should operate on design system defaults", (): void => {
        [
            neutralFillActive_DEPRECATED,
            neutralFillFocus_DEPRECATED,
            neutralFillHover_DEPRECATED,
            neutralFillRest_DEPRECATED,
        ].forEach(fn => {
            expect(neutralPalette).to.include(fn({} as FASTDesignSystem));
        });
    });

    it("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(neutralFillRest_DEPRECATED(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillRest_DEPRECATED(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillHover_DEPRECATED(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillHover_DEPRECATED(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillActive_DEPRECATED(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillActive_DEPRECATED(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillFocus_DEPRECATED(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillFocus_DEPRECATED(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralFillSelected_DEPRECATED(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralFillSelected_DEPRECATED(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
        });
    });

    it("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            const backplates: FillSwatchFamily = neutralFill_DEPRECATED(() => swatch)(
                fastDesignSystemDefaults
            );
            const rest: Swatch = neutralFillRest_DEPRECATED(() => swatch)(fastDesignSystemDefaults);
            const hover: Swatch = neutralFillHover_DEPRECATED(() => swatch)(
                fastDesignSystemDefaults
            );
            const active: Swatch = neutralFillActive_DEPRECATED(() => swatch)(
                fastDesignSystemDefaults
            );
            const focus: Swatch = neutralFillFocus_DEPRECATED(() => swatch)(
                fastDesignSystemDefaults
            );
            const selected: Swatch = neutralFillSelected_DEPRECATED(() => swatch)(
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
    const palette = PaletteRGB.create(SwatchRGB.create(color.r, color.g, color.b));
    palette.swatches.forEach(( newSwatch, index ) => {
        const { neutralFillRestDelta, neutralFillHoverDelta, neutralFillActiveDelta, neutralFillFocusDelta } = fastDesignSystemDefaults;
        const oldValues = neutralFill_DEPRECATED({...fastDesignSystemDefaults, backgroundColor: fastDesignSystemDefaults.neutralPalette[index]});
        const newValues = neutralFillNew(palette, newSwatch, neutralFillRestDelta, neutralFillHoverDelta, neutralFillActiveDelta, neutralFillFocusDelta );
            it(`should be the same for ${newSwatch.toColorString()}`, () => {
                for (let key in oldValues) {
                    if (key !== "selected") {
                        expect(oldValues[key]).to.equal(newValues[key].toColorString().toUpperCase())
                    }
                }
        });
    })
})