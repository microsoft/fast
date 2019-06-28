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
import designSystemDefaults, { DesignSystem } from "../../design-system";
import { findClosestSwatchIndex, palette, Palette, PaletteType } from "./palette";
import { contrast, Swatch } from "./common";
import { accentForegroundCut } from "./accent-foreground-cut";
import { accentBaseColor } from "../design-system";

describe("accentFill", (): void => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystemDefaults);
    const accentPalette: Palette = palette(PaletteType.accent)(designSystemDefaults);

    const accentIndex: number = findClosestSwatchIndex(
        PaletteType.accent,
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

        accentColors.forEach(
            (accent: Swatch): void => {
                neutralPalette.forEach(
                    (swatch: Swatch): void => {
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
                            contrast(
                                accentForegroundCutColor,
                                accentFillRest(designSystem)
                            )
                        ).toBeGreaterThanOrEqual(4.5);
                        expect(
                            contrast(
                                accentForegroundCutColor,
                                accentFillHover(designSystem)
                            )
                        ).toBeGreaterThanOrEqual(4.5);
                        expect(
                            contrast(
                                accentForegroundCutColor,
                                accentFillLargeRest(designSystem)
                            )
                        ).toBeGreaterThanOrEqual(3);
                        expect(
                            contrast(
                                accentForegroundCutColor,
                                accentFillLargeHover(designSystem)
                            )
                        ).toBeGreaterThanOrEqual(3);
                    }
                );
            }
        );
    });
});
