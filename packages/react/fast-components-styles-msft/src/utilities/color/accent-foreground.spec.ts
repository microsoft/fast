import { parseColorHexRGB } from "@microsoft/fast-colors";
import designSystemDefaults, { DesignSystem } from "../../design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../design-system";
import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundLargeActive,
    accentForegroundLargeHover,
    accentForegroundLargeRest,
    accentForegroundRest,
} from "./accent-foreground";
import { Palette } from "./palette";
import { contrast, Swatch } from "./common";
import { accentPaletteConfig } from "./color-constants";

describe("accentForeground", (): void => {
    const neutralPalette: Palette = getNeutralPalette(designSystemDefaults);
    const accentPalette: Palette = getAccentPalette(designSystemDefaults);

    test("should operate on design system defaults", (): void => {
        expect(accentForegroundRest({} as DesignSystem)).toBe(accentPalette[59]);
        expect(accentForegroundHover({} as DesignSystem)).toBe(accentPalette[65]);
        expect(accentForegroundActive({} as DesignSystem)).toBe(accentPalette[55]);
        expect(accentForegroundLargeRest({} as DesignSystem)).toBe(accentPalette[59]);
        expect(accentForegroundLargeHover({} as DesignSystem)).toBe(accentPalette[65]);
        expect(accentForegroundLargeActive({} as DesignSystem)).toBe(accentPalette[55]);
    });

    test("should accept a function that resolves a background swatch", (): void => {
        expect(typeof accentForegroundRest(() => "#FFF")).toBe("function");
        expect(accentForegroundRest(() => "#000")({} as DesignSystem)).toBe(
            accentPalette[59]
        );
        expect(typeof accentForegroundRest(() => "#FFFFFF")).toBe("function");
        expect(accentForegroundRest(() => "#000000")({} as DesignSystem)).toBe(
            accentPalette[59]
        );
    });

    test("should increase contrast on hover state and decrease contrast on active state in either mode", (): void => {
        expect(
            accentPalette.indexOf(accentForegroundHover(designSystemDefaults))
        ).toBeGreaterThan(
            accentPalette.indexOf(accentForegroundRest(designSystemDefaults))
        );
        expect(
            accentPalette.indexOf(accentForegroundActive(designSystemDefaults))
        ).toBeLessThan(accentPalette.indexOf(accentForegroundRest(designSystemDefaults)));

        const darkDesignSystem: DesignSystem = Object.assign({}, designSystemDefaults, {
            backgroundColor: "#000",
        });
        expect(
            accentPalette.indexOf(accentForegroundHover(darkDesignSystem))
        ).toBeLessThan(accentPalette.indexOf(accentForegroundRest(darkDesignSystem)));
        expect(
            accentPalette.indexOf(accentForegroundActive(darkDesignSystem))
        ).toBeGreaterThan(accentPalette.indexOf(accentForegroundRest(darkDesignSystem)));
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
            /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
            (accent: Swatch): void => {
                neutralPalette.forEach((swatch: Swatch): void => {
                    const designSystem: DesignSystem = Object.assign(
                        {},
                        designSystemDefaults,
                        {
                            backgroundColor: swatch,
                            accentPaletteConfig: Object.assign({}, accentPaletteConfig, {
                                baseColor: parseColorHexRGB(swatch),
                            }),
                        }
                    );

                    expect(
                        contrast(swatch, accentForegroundRest(designSystem))
                        // There are a few states that are impossible to meet contrast on
                    ).toBeGreaterThanOrEqual(4.47);
                    expect(
                        contrast(swatch, accentForegroundHover(designSystem))
                        // There are a few states that are impossible to meet contrast on
                    ).toBeGreaterThanOrEqual(3.7);
                    expect(
                        contrast(swatch, accentForegroundLargeRest(designSystem))
                    ).toBeGreaterThanOrEqual(3);
                    expect(
                        contrast(swatch, accentForegroundLargeHover(designSystem))
                    ).toBeGreaterThanOrEqual(3);
                });
            }
        );
    });
});
