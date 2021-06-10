import { expect } from "chai";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system";
import {
    neutralFillStealth_DEPRECATED,
    neutralFillStealthActive_DEPRECATED,
    neutralFillStealthFocus_DEPRECATED,
    neutralFillStealthHover_DEPRECATED,
    neutralFillStealthRest_DEPRECATED,
    neutralFillStealthSelected_DEPRECATED,
} from "./neutral-fill-stealth";
import { Palette } from "./palette";
import { FillSwatchFamily, Swatch } from "./common";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { PaletteRGB } from "../color-vNext/palette";
import { SwatchRGB } from "../color-vNext/swatch";
import { neutralBaseColor } from "./color-constants";
import { neutralFillStealth as neutralFillStealthNew } from "../color-vNext/recipes/neutral-fill-stealth";

describe("neutralFillStealth", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    it("should operate on design system defaults", (): void => {
        [
            neutralFillStealthActive_DEPRECATED,
            neutralFillStealthFocus_DEPRECATED,
            neutralFillStealthHover_DEPRECATED,
            neutralFillStealthRest_DEPRECATED,
            neutralFillStealthSelected_DEPRECATED,
        ].forEach(fn => {
            expect(neutralPalette).to.include(fn({} as FASTDesignSystem));
        });
    });

    it("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(
                neutralFillStealthRest_DEPRECATED(() => swatch)(fastDesignSystemDefaults)
            ).to.equal(
                neutralFillStealthRest_DEPRECATED(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(
                neutralFillStealthHover_DEPRECATED(() => swatch)(fastDesignSystemDefaults)
            ).to.equal(
                neutralFillStealthHover_DEPRECATED(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(
                neutralFillStealthActive_DEPRECATED(() => swatch)(fastDesignSystemDefaults)
            ).to.equal(
                neutralFillStealthActive_DEPRECATED(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(
                neutralFillStealthFocus_DEPRECATED(() => swatch)(fastDesignSystemDefaults)
            ).to.equal(
                neutralFillStealthFocus_DEPRECATED(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(
                neutralFillStealthSelected_DEPRECATED(() => swatch)(fastDesignSystemDefaults)
            ).to.equal(
                neutralFillStealthSelected_DEPRECATED(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
        });
    });

    it("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            const backplates: FillSwatchFamily = neutralFillStealth_DEPRECATED(() => swatch)(
                fastDesignSystemDefaults
            );
            const rest: Swatch = neutralFillStealthRest_DEPRECATED(() => swatch)(
                fastDesignSystemDefaults
            );
            const hover: Swatch = neutralFillStealthHover_DEPRECATED(() => swatch)(
                fastDesignSystemDefaults
            );
            const active: Swatch = neutralFillStealthActive_DEPRECATED(() => swatch)(
                fastDesignSystemDefaults
            );
            const focus: Swatch = neutralFillStealthFocus_DEPRECATED(() => swatch)(
                fastDesignSystemDefaults
            );
            const selected: Swatch = neutralFillStealthSelected_DEPRECATED(() => swatch)(
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
        const {
            neutralFillStealthRestDelta,
            neutralFillStealthHoverDelta,
            neutralFillStealthActiveDelta,
            neutralFillStealthFocusDelta,
            neutralFillStealthSelectedDelta,
            neutralFillRestDelta,
            neutralFillHoverDelta,
            neutralFillActiveDelta,
            neutralFillFocusDelta
        } = fastDesignSystemDefaults;
        const oldValues = neutralFillStealth_DEPRECATED({...fastDesignSystemDefaults, backgroundColor: fastDesignSystemDefaults.neutralPalette[index]});
        const newValues = neutralFillStealthNew(
            palette,
            newSwatch,
            neutralFillStealthRestDelta,
            neutralFillStealthHoverDelta,
            neutralFillStealthActiveDelta,
            neutralFillStealthFocusDelta,
            neutralFillRestDelta,
            neutralFillHoverDelta,
            neutralFillActiveDelta,
            neutralFillFocusDelta
        );
            it(`should be the same for ${newSwatch.toColorString()}`, () => {
                for (let key in oldValues) {
                    if (key !== "selected") {
                        expect(oldValues[key]).to.equal(newValues[key].toColorString().toUpperCase())
                    }
                }
        });
    })
})