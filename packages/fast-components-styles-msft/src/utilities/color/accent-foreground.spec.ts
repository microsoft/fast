import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundLargeActive,
    accentForegroundLargeHover,
    accentForegroundLargeRest,
    accentForegroundRest,
} from "./accent-foreground";
import designSystemDefaults, { DesignSystem } from "../../design-system";
import { palette, Palette, PaletteType, Swatch } from "./palette";
import { contrast } from "./common";
import { accentPaletteConfig } from "./color-constants";
import { parseColorHexRGB } from "@microsoft/fast-colors";

describe("accentForeground", (): void => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystemDefaults);
    const accentPalette: Palette = palette(PaletteType.accent)(designSystemDefaults);

    test("should opperate on design system defaults", (): void => {
        expect(accentForegroundRest({} as DesignSystem)).toBe(accentPalette[32]);
        expect(accentForegroundHover({} as DesignSystem)).toBe(accentPalette[31]);
        expect(accentForegroundActive({} as DesignSystem)).toBe(accentPalette[30]);
        expect(accentForegroundLargeRest({} as DesignSystem)).toBe(accentPalette[31]);
        expect(accentForegroundLargeHover({} as DesignSystem)).toBe(accentPalette[30]);
        expect(accentForegroundLargeActive({} as DesignSystem)).toBe(accentPalette[29]);
    });

    test("should accept a function that resolves a background swatch", (): void => {
        expect(typeof accentForegroundRest(() => "#FFF")).toBe("function");
        expect(accentForegroundRest(() => "#000")({} as DesignSystem)).toBe(
            accentPalette[30]
        );
    });

    test("should have states that get lighter in light theme and darker in dark theme", (): void => {
        expect(
            accentPalette.indexOf(accentForegroundHover(designSystemDefaults))
        ).toBeLessThanOrEqual(
            accentPalette.indexOf(
                accentForegroundHover(
                    Object.assign({}, designSystemDefaults, { backgroundColor: "#000" })
                )
            )
        );
        expect(
            accentPalette.indexOf(accentForegroundActive(designSystemDefaults))
        ).toBeLessThan(
            accentPalette.indexOf(
                accentForegroundActive(
                    Object.assign({}, designSystemDefaults, { backgroundColor: "#000" })
                )
            )
        );
    });

    test("should have accessible rest and hover colors against the background color", (): void => {
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
                                accentPaletteConfig: Object.assign(
                                    {},
                                    accentPaletteConfig,
                                    { baseColor: parseColorHexRGB(swatch) }
                                ),
                            }
                        );

                        expect(
                            contrast(swatch, accentForegroundRest(designSystem))
                            // There are a few states that are impossible to meet contrast on
                        ).toBeGreaterThanOrEqual(4.47);
                        expect(
                            contrast(swatch, accentForegroundHover(designSystem))
                            // There are a few states that are impossible to meet contrast on
                        ).toBeGreaterThanOrEqual(4.2);
                        expect(
                            contrast(swatch, accentForegroundLargeRest(designSystem))
                        ).toBeGreaterThanOrEqual(3);
                        expect(
                            contrast(swatch, accentForegroundLargeHover(designSystem))
                        ).toBeGreaterThanOrEqual(3);
                    }
                );
            }
        );
    });
});
