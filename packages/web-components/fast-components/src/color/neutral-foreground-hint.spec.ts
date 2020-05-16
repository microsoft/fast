import { fastDesignSystemDefaults } from "../fast-design-system.js";
import {
    accentPalette as getAccentPalette,
    neutralPalette as getNeutralPalette,
} from "../fast-design-system.js";
import {
    neutralForegroundHint,
    neutralForegroundHintLarge,
} from "./neutral-foreground-hint.js";
import { Palette } from "./palette.js";
import { contrast, Swatch, SwatchRecipe } from "./common.js";
import { expect } from "chai";

describe("neutralForegroundHint", (): void => {
    const neutralPalette: Palette = getNeutralPalette(fastDesignSystemDefaults);
    const accentPalette: Palette = getAccentPalette(fastDesignSystemDefaults);

    // test("should return a swatch when argument is a ")
    it("should implement design system defaults", (): void => {
        expect(neutralForegroundHint(undefined as any)).to.equal("#838383");
    });

    neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
        it(`${swatch} should resolve a color from the neutral palette`, (): void => {
            expect(
                neutralPalette.indexOf(
                    neutralForegroundHint(
                        Object.assign({}, fastDesignSystemDefaults, {
                            backgroundColor: swatch,
                        })
                    )
                )
            ).not.to.equal(-1);
        });
    });

    it("should return the same color from both methods of setting the reference background", (): void => {
        neutralPalette.concat(accentPalette).forEach((swatch: Swatch): void => {
            expect(
                neutralForegroundHint(
                    Object.assign({}, fastDesignSystemDefaults, {
                        backgroundColor: swatch,
                    })
                )
            ).to.equal(neutralForegroundHint(() => swatch)(fastDesignSystemDefaults));
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
        it(`${swatch} should always be at least 4.5 : 1 against the background`, (): void => {
            expect(
                retrieveContrast(swatch, neutralForegroundHint)
                // Because neutralForegroundHint follows the direction patterns of neutralForeground,
                // a backgroundColor #777777 is impossible to hit 4.5 against.
            ).to.be.gte(swatch === "#777777" ? 4.48 : 4.5);
            expect(retrieveContrast(swatch, neutralForegroundHint)).to.be.lessThan(5);
            expect(retrieveContrast(swatch, neutralForegroundHintLarge)).to.be.gte(3);
            expect(retrieveContrast(swatch, neutralForegroundHintLarge)).to.be.lessThan(
                3.3
            );
        });
    });
});
