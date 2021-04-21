import { expect } from "chai";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system";
import {
    accentFill,
    accentFillActive,
    accentFillHover,
    accentFillLargeActive,
    accentFillLargeHover,
    accentFillLargeRest,
    accentFillLargeSelected,
    accentFillRest,
    accentFillSelected,
} from "./accent-fill";
import { findClosestSwatchIndex, Palette } from "./palette";
import { contrast, Swatch } from "./common";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { neutralBaseColor, accentBaseColor } from "./color-constants";
import { PaletteRGB } from "../color-2/palette";
import { SwatchRGB } from "../color-2/swatch";
import { accentFill as accentFillNew } from "../color-2/recipes/accent-fill";
import { accentForegroundCut as accentForegroundCutNew  } from '../color-2/recipes/accent-foreground-cut';
import { accentForegroundCut } from "./accent-foreground-cut";

describe("accentFill", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    const accentIndex: number = findClosestSwatchIndex(
        getAccentPalette,
        accentBaseColor
    )(fastDesignSystemDefaults);

    it("should operate on design system defaults", (): void => {
        [
            accentFillActive,
            accentFillHover,
            accentFillLargeActive,
            accentFillLargeHover,
            accentFillLargeRest,
            accentFillLargeSelected,
            accentFillRest,
            accentFillSelected,
        ].forEach(fn => {
            expect(accentPalette).to.include(fn({} as FASTDesignSystem));
        });
    });

    it("should accept a function that resolves a background swatch", (): void => {
        expect(typeof accentFillRest(() => "#FFF")).to.equal("function");
        expect(accentPalette).to.include(
            accentFillRest(() => "#000")({} as FASTDesignSystem)
        );
    });

    it("should have accessible rest and hover colors against accentForegroundCut", (): void => {
        const accentColors: Swatch[] = [
            "#0078D4",
            "#107C10",
            "#5C2D91",
            "#D83B01",
            "#F2C812",
        ];

        accentColors.forEach((accent: Swatch): void => {
            neutralPalette.forEach((swatch: Swatch): void => {
                const designSystem: FASTDesignSystem = Object.assign(
                    {},
                    fastDesignSystemDefaults,
                    {
                        backgroundColor: swatch,
                        accentPaletteSource: ["#FFF", accent, "#000"],
                    }
                );

                const accentForegroundCutColor: Swatch = accentForegroundCut(
                    designSystem
                );

                expect(
                    contrast(accentForegroundCutColor, accentFillRest(designSystem))
                ).to.be.gte(4.5);
                expect(
                    contrast(accentForegroundCutColor, accentFillHover(designSystem))
                ).to.be.gte(4.5);
                expect(
                    contrast(accentForegroundCutColor, accentFillLargeRest(designSystem))
                ).to.be.gte(3);
                expect(
                    contrast(accentForegroundCutColor, accentFillLargeHover(designSystem))
                ).to.be.gte(3);
            });
        });
    });
});
describe("ensure parity between old and new recipe implementation", () => {
    const neutralColor = (parseColorHexRGB(neutralBaseColor)!)
    const neutralPalette = new PaletteRGB(new SwatchRGB(neutralColor.r, neutralColor.g, neutralColor.b));
    const accentColor = (parseColorHexRGB(accentBaseColor)!)
    const accentPalette = new PaletteRGB(new SwatchRGB(accentColor.r, accentColor.g, accentColor.b));
    neutralPalette.swatches.forEach(( newSwatch, index ) => {
        const {
            accentFillHoverDelta,
            accentFillActiveDelta,
            accentFillFocusDelta,
            accentFillSelectedDelta,
            neutralFillRestDelta,
            neutralFillHoverDelta,
            neutralFillActiveDelta,
        } = fastDesignSystemDefaults;
           
        const oldValues = accentFill({...fastDesignSystemDefaults, backgroundColor: fastDesignSystemDefaults.neutralPalette[index]});
        const textColor = accentForegroundCutNew(accentPalette.source, 4.5);
        const newValues = accentFillNew(
            accentPalette,
            neutralPalette,
            newSwatch, 
            textColor, 
            4.5, 
            accentFillHoverDelta, 
            accentFillActiveDelta, 
            accentFillFocusDelta, 
            accentFillSelectedDelta,
            neutralFillRestDelta,
            neutralFillHoverDelta,
            neutralFillActiveDelta
            )

            for (let key in oldValues) {
                it(`${newSwatch.toColorString()}old value for ${key} at ${oldValues[key]} should be equal to new value`, () => {
                    expect(oldValues[key]).to.equal(newValues[key].toColorString().toUpperCase())
                } ) 
            }
    })
})