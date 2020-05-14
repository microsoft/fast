import { parseColorHexRGB } from "@microsoft/fast-colors";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system";
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

describe("accentForeground", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    test("should operate on design system defaults", (): void => {
        expect(accentForegroundRest({} as FASTDesignSystem)).toBe(accentPalette[59]);
        expect(accentForegroundHover({} as FASTDesignSystem)).toBe(accentPalette[65]);
        expect(accentForegroundActive({} as FASTDesignSystem)).toBe(accentPalette[55]);
        expect(accentForegroundLargeRest({} as FASTDesignSystem)).toBe(accentPalette[59]);
        expect(accentForegroundLargeHover({} as FASTDesignSystem)).toBe(
            accentPalette[65]
        );
        expect(accentForegroundLargeActive({} as FASTDesignSystem)).toBe(
            accentPalette[55]
        );
    });

    test("should accept a function that resolves a background swatch", (): void => {
        expect(typeof accentForegroundRest(() => "#FFF")).toBe("function");
        expect(accentForegroundRest(() => "#000")({} as FASTDesignSystem)).toBe(
            accentPalette[59]
        );
        expect(typeof accentForegroundRest(() => "#FFFFFF")).toBe("function");
        expect(accentForegroundRest(() => "#000000")({} as FASTDesignSystem)).toBe(
            accentPalette[59]
        );
    });

    test("should increase contrast on hover state and decrease contrast on active state in either mode", (): void => {
        expect(
            accentPalette.indexOf(accentForegroundHover(fastDesignSystemDefaults))
        ).toBeGreaterThan(
            accentPalette.indexOf(accentForegroundRest(fastDesignSystemDefaults))
        );
        expect(
            accentPalette.indexOf(accentForegroundActive(fastDesignSystemDefaults))
        ).toBeLessThan(
            accentPalette.indexOf(accentForegroundRest(fastDesignSystemDefaults))
        );

        const darkDesignSystem: FASTDesignSystem = Object.assign(
            {},
            fastDesignSystemDefaults,
            {
                backgroundColor: "#000",
            }
        );
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
                    const designSystem: FASTDesignSystem = Object.assign(
                        {},
                        fastDesignSystemDefaults,
                        {
                            backgroundColor: swatch,
                            accentPaletteConfig: Object.assign(
                                {
                                    steps: 94,
                                    clipLight: 0,
                                    clipDark: 0,
                                },
                                {
                                    baseColor: parseColorHexRGB(swatch),
                                }
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
