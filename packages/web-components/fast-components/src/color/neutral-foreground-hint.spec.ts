import { fastDesignSystemDefaults } from "../fast-design-system";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system";
import {
    neutralForegroundHint,
    neutralForegroundHintLarge,
} from "./neutral-foreground-hint";
import { Palette } from "./palette";
import { contrast, Swatch, SwatchRecipe } from "./common";
describe("neutralForegroundHint", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    // test("should return a swatch when argument is a ")
    test("should implement design system defaults", (): void => {
        expect(neutralForegroundHint(undefined as any)).toBe("#838383");
    });

    neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
        test(`${swatch} should resolve a color from the neutral palette`, (): void => {
            expect(
                neutralPalette.indexOf(
                    neutralForegroundHint(
                        Object.assign({}, fastDesignSystemDefaults, {
                            backgroundColor: swatch,
                        })
                    )
                )
            ).not.toBe(-1);
        });
    });

    test("should return the same color from both methods of setting the reference background", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(
                neutralForegroundHint(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            ).toBe(neutralForegroundHint(() => swatch)(fastDesignSystemDefaults));
        });
    });

    function retrieveContrast(resolvedSwatch: Swatch, fn: SwatchRecipe): number {
        return parseFloat(
            contrast(
                fn(() => resolvedSwatch)(fastDesignSystemDefaults),
                resolvedSwatch
            ).toPrecision(3)
        );
    }
    neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
        test(`${swatch} should always be at least 4.5 : 1 against the background`, (): void => {
            expect(
                retrieveContrast(swatch, neutralForegroundHint)
                // Because neutralForegroundHint follows the direction patterns of neutralForeground,
                // a backgroundColor #777777 is impossible to hit 4.5 against.
            ).toBeGreaterThanOrEqual(swatch === "#777777" ? 4.48 : 4.5);
            expect(retrieveContrast(swatch, neutralForegroundHint)).toBeLessThan(5);
            expect(
                retrieveContrast(swatch, neutralForegroundHintLarge)
            ).toBeGreaterThanOrEqual(3);
            expect(retrieveContrast(swatch, neutralForegroundHintLarge)).toBeLessThan(
                3.3
            );
        });
    });
});
