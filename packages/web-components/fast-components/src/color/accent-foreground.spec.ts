import { parseColorHexRGB } from "@microsoft/fast-colors";
import { expect } from "chai";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system";
import {
    accentForegroundActive_DEPRECATED,
    accentForegroundHover_DEPRECATED,
    accentForegroundLargeActive_DEPRECATED,
    accentForegroundLargeHover_DEPRECATED,
    accentForegroundLargeRest_DEPRECATED,
    accentForegroundRest_DEPRECATED,
    accentForeground_DEPRECATED
} from "./accent-foreground";
import { Palette } from "./palette";
import { contrast, Swatch } from "./common";
import { accentBaseColor, neutralBaseColor } from "./color-constants";
import { PaletteRGB } from "../color-vNext/palette";
import { SwatchRGB } from "../color-vNext/swatch";
import { accentForeground as accentForegroundNew } from "../color-vNext/recipes/accent-foreground";

describe("accentForeground", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    it("should operate on design system defaults", (): void => {
        [
            accentForegroundActive_DEPRECATED,
            accentForegroundHover_DEPRECATED,
            accentForegroundLargeActive_DEPRECATED,
            accentForegroundLargeHover_DEPRECATED,
            accentForegroundLargeRest_DEPRECATED,
            accentForegroundRest_DEPRECATED,
        ].forEach(fn => {
            expect(accentPalette).to.include(fn({} as FASTDesignSystem));
        });
    });

    it("should accept a function that resolves a background swatch", (): void => {
        expect(typeof accentForegroundRest_DEPRECATED(() => "#FFF")).to.equal("function");
        expect(accentPalette).to.include(
            accentForegroundRest_DEPRECATED(() => "#000")({} as FASTDesignSystem)
        );
    });

    it("should increase contrast on hover state and decrease contrast on active state in either mode", (): void => {
        const darkDesignSystem: FASTDesignSystem = {
            ...fastDesignSystemDefaults,
            backgroundColor: "#000000",
        };

        expect(
            contrast(
                accentForegroundHover_DEPRECATED(fastDesignSystemDefaults),
                fastDesignSystemDefaults.backgroundColor
            )
        ).to.be.greaterThan(
            contrast(
                accentForegroundRest_DEPRECATED(fastDesignSystemDefaults),
                fastDesignSystemDefaults.backgroundColor
            )
        );

        expect(
            contrast(
                accentForegroundHover_DEPRECATED(darkDesignSystem),
                darkDesignSystem.backgroundColor
            )
        ).to.be.greaterThan(
            contrast(
                accentForegroundRest_DEPRECATED(darkDesignSystem),
                darkDesignSystem.backgroundColor
            )
        );
    });

    it("should have accessible rest and hover colors against the background color", (): void => {
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
                        contrast(swatch, accentForegroundRest_DEPRECATED(designSystem))
                        // There are a few states that are impossible to meet contrast on
                    ).to.be.gte(4.47);
                    expect(
                        contrast(swatch, accentForegroundHover_DEPRECATED(designSystem))
                        // There are a few states that are impossible to meet contrast on
                    ).to.be.gte(3.7);
                    expect(
                        contrast(swatch, accentForegroundLargeRest_DEPRECATED(designSystem))
                    ).to.be.gte(3);
                    expect(
                        contrast(swatch, accentForegroundLargeHover_DEPRECATED(designSystem))
                    ).to.be.gte(3);
                });
            }
        );
    });
});

describe("ensure parity between old and new recipe implementation", () => {
    const neutralBase = parseColorHexRGB(neutralBaseColor)!;
    const accentBase = parseColorHexRGB(accentBaseColor)!;

    const neutralPalette = PaletteRGB.create(SwatchRGB.create(neutralBase.r, neutralBase.g, neutralBase.b));
    const accentPalette = PaletteRGB.create(SwatchRGB.create(accentBase.r, accentBase.g, accentBase.b));
    
    neutralPalette.swatches.forEach((newSwatch, index) => {
        const {
            accentForegroundRestDelta,
            accentForegroundFocusDelta,
            accentForegroundActiveDelta,
            accentForegroundHoverDelta
        } = fastDesignSystemDefaults;
        const oldValues = accentForeground_DEPRECATED({
            ...fastDesignSystemDefaults,
            backgroundColor: fastDesignSystemDefaults.neutralPalette[index],
        });
        const newValues = accentForegroundNew(
            accentPalette,
            newSwatch,
            4.5,
            accentForegroundRestDelta,
            accentForegroundHoverDelta,
            accentForegroundActiveDelta,
            accentForegroundFocusDelta,
        );
        it(`should be the same for ${newSwatch.toColorString()}`, () => {
            for (let key in newValues) {
                expect(oldValues[key]).to.equal(
                    newValues[key].toColorString().toUpperCase()
                );
            }
        });
    });
});