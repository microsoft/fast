import designSystemDefaults, { DesignSystem } from "../../design-system";
import { accentBaseColor } from "../design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../design-system";
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
    const neutralPalette: Palette = getNeutralPalette(designSystemDefaults);
    const accentPalette: Palette = getAccentPalette(designSystemDefaults);

    const accentIndex: number = findClosestSwatchIndex(
        getAccentPalette,
        accentBaseColor(designSystemDefaults)
    )(designSystemDefaults);

    test("should operate on design system defaults", (): void => {
        expect(accentFillRest({} as DesignSystem)).toBe(
            accentPalette[accentIndex + designSystemDefaults.accentFillRestDelta]
        );
        expect(accentFillHover({} as DesignSystem)).toBe(
            accentPalette[accentIndex + designSystemDefaults.accentFillHoverDelta]
        );
        expect(accentFillActive({} as DesignSystem)).toBe(
            accentPalette[accentIndex + designSystemDefaults.accentFillActiveDelta]
        );
        expect(accentFillSelected({} as DesignSystem)).toBe(
            accentPalette[accentIndex + designSystemDefaults.accentFillSelectedDelta]
        );
        expect(accentFillLargeRest({} as DesignSystem)).toBe(
            accentPalette[accentIndex + designSystemDefaults.accentFillRestDelta]
        );
        expect(accentFillLargeHover({} as DesignSystem)).toBe(
            accentPalette[accentIndex + designSystemDefaults.accentFillHoverDelta]
        );
        expect(accentFillLargeActive({} as DesignSystem)).toBe(
            accentPalette[accentIndex + designSystemDefaults.accentFillActiveDelta]
        );
        expect(accentFillLargeSelected({} as DesignSystem)).toBe(
            accentPalette[accentIndex + designSystemDefaults.accentFillSelectedDelta]
        );
    });

    test("should accept a function that resolves a background swatch", (): void => {
        expect(typeof accentFillRest(() => "#FFF")).toBe("function");
        expect(accentFillRest(() => "#000")({} as DesignSystem)).toBe(accentPalette[63]);
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
                const designSystem: DesignSystem = Object.assign(
                    {},
                    designSystemDefaults,
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
