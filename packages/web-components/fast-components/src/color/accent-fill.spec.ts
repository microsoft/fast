import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system.js";
import {
    accentBaseColor,
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system.js";
import {
    accentFillActive,
    accentFillHover,
    accentFillLargeActive,
    accentFillLargeHover,
    accentFillLargeRest,
    accentFillLargeSelected,
    accentFillRest,
    accentFillSelected,
} from "./accent-fill.js";
import { findClosestSwatchIndex, Palette } from "./palette.js";
import { contrast, Swatch } from "./common.js";
import { accentForegroundCut } from "./accent-foreground-cut.js";
import { expect } from "chai";

describe("accentFill", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    const accentIndex: number = findClosestSwatchIndex(
        getAccentPalette,
        accentBaseColor(fastDesignSystemDefaults)
    )(fastDesignSystemDefaults);

    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    it.skip("should operate on design system defaults", (): void => {
        expect(accentFillRest({} as FASTDesignSystem)).to.equal(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillRestDelta]
        );
        expect(accentFillHover({} as FASTDesignSystem)).to.equal(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillHoverDelta]
        );
        expect(accentFillActive({} as FASTDesignSystem)).to.equal(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillActiveDelta]
        );
        expect(accentFillSelected({} as FASTDesignSystem)).to.equal(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillSelectedDelta]
        );
        expect(accentFillLargeRest({} as FASTDesignSystem)).to.equal(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillRestDelta]
        );
        expect(accentFillLargeHover({} as FASTDesignSystem)).to.equal(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillHoverDelta]
        );
        expect(accentFillLargeActive({} as FASTDesignSystem)).to.equal(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillActiveDelta]
        );
        expect(accentFillLargeSelected({} as FASTDesignSystem)).to.equal(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillSelectedDelta]
        );
    });

    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    it.skip("should accept a function that resolves a background swatch", (): void => {
        expect(typeof accentFillRest(() => "#FFF")).to.equal("function");
        expect(accentFillRest(() => "#000")({} as FASTDesignSystem)).to.equal(
            accentPalette[63]
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
