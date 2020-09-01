import { expect } from "chai";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import {
    accentBaseColor,
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system";
import {
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
import { accentForegroundCut } from "./accent-foreground-cut";

describe("accentFill", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    const accentIndex: number = findClosestSwatchIndex(
        getAccentPalette,
        accentBaseColor(fastDesignSystemDefaults)
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
