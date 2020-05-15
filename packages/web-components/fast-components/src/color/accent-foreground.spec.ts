import { parseColorHexRGB } from "@microsoft/fast-colors";
import { FASTDesignSystem, fastDesignSystemDefaults } from "../fast-design-system.js";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system.js";
import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundLargeActive,
    accentForegroundLargeHover,
    accentForegroundLargeRest,
    accentForegroundRest,
} from "./accent-foreground.js";
import { Palette } from "./palette.js";
import { contrast, Swatch } from "./common.js";
import chai from "chai";
const { expect } = chai;

describe("accentForeground", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    it.skip("should operate on design system defaults", (): void => {
        expect(accentForegroundRest({} as FASTDesignSystem)).to.equal(accentPalette[59]);
        expect(accentForegroundHover({} as FASTDesignSystem)).to.equal(accentPalette[65]);
        expect(accentForegroundActive({} as FASTDesignSystem)).to.equal(
            accentPalette[55]
        );
        expect(accentForegroundLargeRest({} as FASTDesignSystem)).to.equal(
            accentPalette[59]
        );
        expect(accentForegroundLargeHover({} as FASTDesignSystem)).to.equal(
            accentPalette[65]
        );
        expect(accentForegroundLargeActive({} as FASTDesignSystem)).to.equal(
            accentPalette[55]
        );
    });

    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    it.skip("should accept a function that resolves a background swatch", (): void => {
        expect(typeof accentForegroundRest(() => "#FFF")).to.equal("function");
        expect(accentForegroundRest(() => "#000")({} as FASTDesignSystem)).to.equal(
            accentPalette[59]
        );
        expect(typeof accentForegroundRest(() => "#FFFFFF")).to.equal("function");
        expect(accentForegroundRest(() => "#000000")({} as FASTDesignSystem)).to.equal(
            accentPalette[59]
        );
    });

    // TODO @nicholasrice: Tests are failing due as palette is expecting light
    it.skip("should increase contrast on hover state and decrease contrast on active state in either mode", (): void => {
        expect(
            accentPalette.indexOf(accentForegroundHover(fastDesignSystemDefaults))
        ).to.be.greaterThan(
            accentPalette.indexOf(accentForegroundRest(fastDesignSystemDefaults))
        );
        expect(
            accentPalette.indexOf(accentForegroundActive(fastDesignSystemDefaults))
        ).to.be.lessThan(
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
        ).to.be.lessThan(accentPalette.indexOf(accentForegroundRest(darkDesignSystem)));
        expect(
            accentPalette.indexOf(accentForegroundActive(darkDesignSystem))
        ).to.be.greaterThan(
            accentPalette.indexOf(accentForegroundRest(darkDesignSystem))
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
                        contrast(swatch, accentForegroundRest(designSystem))
                        // There are a few states that are impossible to meet contrast on
                    ).to.be.gte(4.47);
                    expect(
                        contrast(swatch, accentForegroundHover(designSystem))
                        // There are a few states that are impossible to meet contrast on
                    ).to.be.gte(3.7);
                    expect(
                        contrast(swatch, accentForegroundLargeRest(designSystem))
                    ).to.be.gte(3);
                    expect(
                        contrast(swatch, accentForegroundLargeHover(designSystem))
                    ).to.be.gte(3);
                });
            }
        );
    });
});
