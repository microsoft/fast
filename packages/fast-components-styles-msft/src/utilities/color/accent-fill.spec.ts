import {
    accentFillActive,
    accentFillHover,
    accentFillLargeActive,
    accentFillLargeHover,
    accentFillLargeRest,
    accentFillRest,
} from "./accent-fill";
import designSystemDefaults, { DesignSystem } from "../../design-system";
import { palette, Palette, Palettes, Swatch } from "./palette";
import { contrast } from "./common";
import { accentForegroundCut } from "./accent-foreground-cut";

describe("accentFill", (): void => {
    const neutralPalette: Palette = palette(Palettes.neutral)(designSystemDefaults);
    const accentPalette: Palette = palette(Palettes.accent)(designSystemDefaults);

    test("should opperate on design system defaults", (): void => {
        expect(accentFillRest({} as DesignSystem)).toBe(accentPalette[33]);
        expect(accentFillHover({} as DesignSystem)).toBe(accentPalette[31]);
        expect(accentFillActive({} as DesignSystem)).toBe(accentPalette[29]);
        expect(accentFillLargeRest({} as DesignSystem)).toBe(accentPalette[31]);
        expect(accentFillLargeHover({} as DesignSystem)).toBe(accentPalette[29]);
        expect(accentFillLargeActive({} as DesignSystem)).toBe(accentPalette[27]);
    });

    test("should accept a function that resolves a background swatch", (): void => {
        expect(typeof accentFillRest(() => "#FFF")).toBe("function");
        expect(accentFillRest(() => "#000")({} as DesignSystem)).toBe(accentPalette[31]);
    });

    test("should have states that get lighter in light theme and darker in dark theme", (): void => {
        expect(accentPalette.indexOf(accentFillHover(designSystemDefaults))).toBeLessThan(
            accentPalette.indexOf(
                accentFillHover(
                    Object.assign({}, designSystemDefaults, { backgroundColor: "#000" })
                )
            )
        );
        expect(
            accentPalette.indexOf(accentFillActive(designSystemDefaults))
        ).toBeLessThan(
            accentPalette.indexOf(
                accentFillActive(
                    Object.assign({}, designSystemDefaults, { backgroundColor: "#000" })
                )
            )
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
