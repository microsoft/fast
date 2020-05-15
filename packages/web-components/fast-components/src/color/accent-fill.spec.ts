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

    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    xtest("should operate on design system defaults", (): void => {
        expect(accentFillRest({} as FASTDesignSystem)).toBe(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillRestDelta]
        );
        expect(accentFillHover({} as FASTDesignSystem)).toBe(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillHoverDelta]
        );
        expect(accentFillActive({} as FASTDesignSystem)).toBe(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillActiveDelta]
        );
        expect(accentFillSelected({} as FASTDesignSystem)).toBe(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillSelectedDelta]
        );
        expect(accentFillLargeRest({} as FASTDesignSystem)).toBe(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillRestDelta]
        );
        expect(accentFillLargeHover({} as FASTDesignSystem)).toBe(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillHoverDelta]
        );
        expect(accentFillLargeActive({} as FASTDesignSystem)).toBe(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillActiveDelta]
        );
        expect(accentFillLargeSelected({} as FASTDesignSystem)).toBe(
            accentPalette[accentIndex + fastDesignSystemDefaults.accentFillSelectedDelta]
        );
    });

    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    xtest("should accept a function that resolves a background swatch", (): void => {
        expect(typeof accentFillRest(() => "#FFF")).toBe("function");
        expect(accentFillRest(() => "#000")({} as FASTDesignSystem)).toBe(
            accentPalette[63]
        );
    });

    test("should have accessible rest and hover colors against accentForegroundCut", (): void => {
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
                ).toBeGreaterThanOrEqual(4.5);
                expect(
                    contrast(accentForegroundCutColor, accentFillHover(designSystem))
                ).toBeGreaterThanOrEqual(4.5);
                expect(
                    contrast(accentForegroundCutColor, accentFillLargeRest(designSystem))
                ).toBeGreaterThanOrEqual(3);
                expect(
                    contrast(accentForegroundCutColor, accentFillLargeHover(designSystem))
                ).toBeGreaterThanOrEqual(3);
            });
        });
    });
});
