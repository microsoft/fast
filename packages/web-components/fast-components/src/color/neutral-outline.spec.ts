import { isColorStringHexRGB, parseColorHexRGB } from "@microsoft/fast-colors";
import { expect } from "chai";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system";
import {
    neutralOutline_DEPRECATED,
    neutralOutlineActive_DEPRECATED,
    neutralOutlineFocus_DEPRECATED,
    neutralOutlineHover_DEPRECATED,
    neutralOutlineRest_DEPRECATED,
} from "./neutral-outline";
import { Palette } from "./palette";
import { Swatch, SwatchFamily } from "./common";
import { neutralBaseColor } from "./color-constants";
import { PaletteRGB } from "../color-vNext/palette";
import { SwatchRGB } from "../color-vNext/swatch";
import { neutralStroke as neutralStrokeNew } from "../color-vNext/recipes/neutral-stroke"

describe("neutralOutline", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    it("should return by default", (): void => {
        [
            neutralOutlineActive_DEPRECATED,
            neutralOutlineFocus_DEPRECATED,
            neutralOutlineHover_DEPRECATED,
            neutralOutlineRest_DEPRECATED,
        ].forEach(fn => {
            expect(neutralPalette).to.include(fn({} as FASTDesignSystem));
        });
    });

    it("should always return a color", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(
                isColorStringHexRGB(
                    neutralOutlineRest_DEPRECATED(() => swatch)({} as FASTDesignSystem)
                )
            ).to.equal(true);
        });
    });

    it("should return the same color from both implementations", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(neutralOutlineRest_DEPRECATED(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralOutlineRest_DEPRECATED(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralOutlineHover_DEPRECATED(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralOutlineHover_DEPRECATED(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralOutlineActive_DEPRECATED(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralOutlineActive_DEPRECATED(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
            expect(neutralOutlineFocus_DEPRECATED(() => swatch)(fastDesignSystemDefaults)).to.equal(
                neutralOutlineFocus_DEPRECATED(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            );
        });
    });

    it("should have consistent return values", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            const backplates: SwatchFamily = neutralOutline_DEPRECATED(() => swatch)(
                fastDesignSystemDefaults
            );
            const rest: Swatch = neutralOutlineRest_DEPRECATED(() => swatch)(
                fastDesignSystemDefaults
            );
            const hover: Swatch = neutralOutlineHover_DEPRECATED(() => swatch)(
                fastDesignSystemDefaults
            );
            const active: Swatch = neutralOutlineActive_DEPRECATED(() => swatch)(
                fastDesignSystemDefaults
            );
            const focus: Swatch = neutralOutlineFocus_DEPRECATED(() => swatch)(
                fastDesignSystemDefaults
            );

            expect(backplates.rest).to.equal(rest);
            expect(backplates.hover).to.equal(hover);
            expect(backplates.active).to.equal(active);
            expect(backplates.focus).to.equal(focus);
        });
    });
});

describe("ensure parity between old and new recipe implementation", () => {
    const color = (parseColorHexRGB(neutralBaseColor)!)
    const palette = PaletteRGB.create(SwatchRGB.create(color.r, color.g, color.b));
    palette.swatches.forEach(( newSwatch, index ) => {
        const { neutralOutlineRestDelta, neutralOutlineHoverDelta, neutralOutlineFocusDelta, neutralOutlineActiveDelta } = fastDesignSystemDefaults;
        const oldValues = neutralOutline_DEPRECATED({...fastDesignSystemDefaults, backgroundColor: fastDesignSystemDefaults.neutralPalette[index]});
        const newValues = neutralStrokeNew(
            palette,
            newSwatch,
            neutralOutlineRestDelta,
            neutralOutlineHoverDelta,
            neutralOutlineActiveDelta,
            neutralOutlineFocusDelta,
        );
            it(`should be the same for ${newSwatch.toColorString()}`, () => {
                for (let key in oldValues) {
                    expect(oldValues[key]).to.equal(newValues[key].toColorString().toUpperCase())
                }
        });
    })
})