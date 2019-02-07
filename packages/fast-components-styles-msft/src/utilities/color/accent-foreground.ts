import {
    DesignSystem,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "./design-system";
import { memoize } from "lodash";
import { accentSwatch, findAccessibleAccentSwatchIndexs } from "./accent";
import { palette, Palette, Palettes, Swatch } from "./palette";
import {
    StatefulSwatch,
    StatefulSwatchResolver,
    StatefulSwatchToColorRecipeFactory,
    ColorRecipe,
} from "./common";

/**
 * Deltas to derive state swatches from the background
 */
export const accentForegroundDeltaRest: number = 0;
export const accentForegroundDeltaHover: number = 1;
export const accentForegroundDeltaActive: number = 2;

const accentForegroundAlgorithm = memoize(
    (designSystem: DesignSystem, contrastTarget: number): StatefulSwatch => {
        const accentPalette: Palette = palette(Palettes.accent)(designSystem);
        const indexes: {
            rest: number;
            hover: number;
            active: number;
        } = findAccessibleAccentSwatchIndexs(
            designSystem,
            contrastTarget,
            designSystem.backgroundColor,
            {
                rest: accentForegroundDeltaRest,
                hover: accentForegroundDeltaHover,
                active: accentForegroundDeltaActive,
            }
        );

        return {
            rest: accentPalette[indexes.rest],
            hover: accentPalette[indexes.hover],
            active: accentPalette[indexes.active],
        };
    },
    (designSystem: DesignSystem, contrastTarget: number): string => {
        return accentSwatch(designSystem)
            .concat(contrastTarget.toString())
            .concat(designSystem.backgroundColor);
    }
);

function accentForegroundFactory(contrast: number): StatefulSwatchResolver {
    function accentForeground(designSystem: DesignSystem): StatefulSwatch;
    function accentForeground(
        backgroundResolver: (designSystem: DesignSystem) => Swatch
    ): (designSystem: DesignSystem) => StatefulSwatch;
    function accentForeground(arg: any): any {
        if (typeof arg === "function") {
            return ensureDesignSystemDefaults(
                (designSystem: DesignSystem): StatefulSwatch => {
                    return accentForegroundAlgorithm(
                        Object.assign({}, designSystem, {
                            backgroundColor: arg(designSystem),
                        }),
                        contrast
                    );
                }
            );
        } else {
            return accentForegroundAlgorithm(withDesignSystemDefaults(arg), contrast);
        }
    }

    return accentForeground;
}

export const accentForeground: StatefulSwatchResolver = accentForegroundFactory(4.5);
export const accentForegroundLarge: StatefulSwatchResolver = accentForegroundFactory(3);

export const accentForegroundRest: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    "rest",
    accentForeground
);
export const accentForegroundHover: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    "hover",
    accentForeground
);
export const accentForegroundActive: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    "active",
    accentForeground
);

export const accentForegroundLargeRest: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    "rest",
    accentForegroundLarge
);
export const accentForegroundLargeHover: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    "hover",
    accentForegroundLarge
);
export const accentForegroundLargeActive: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    "active",
    accentForegroundLarge
);
