import {
    DesignSystem,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";
import {
    ColorRecipe,
    StatefulSwatch,
    StatefulSwatchResolver,
    StatefulSwatchToColorRecipeFactory,
} from "./common";
import { accentSwatch, findAccessibleAccentSwatchIndexs } from "./accent";
import { isDarkTheme, Palette, palette, Palettes, Swatch } from "./palette";
import { accentForegroundCut } from "./accent-foreground-cut";
import { memoize } from "lodash";

/**
 * Deltas to derive state swatches from the background
 */
export const accentFillDeltaRest: number = 0;
export const accentFillDeltaHover: number = 2;
export const accentFillDeltaActive: number = 4;

export const accentFillAlgorithm: (
    designSystem: DesignSystem,
    contrastTarget: number
) => StatefulSwatch = memoize(
    (designSystem: DesignSystem, contrastTarget: number): StatefulSwatch => {
        const accentPalette: Palette = palette(Palettes.accent)(designSystem);
        const accent: Swatch = accentSwatch(designSystem);
        const textColor: Swatch = accentForegroundCut(
            Object.assign({}, designSystem, {
                backgroundColor: accent,
            })
        );
        const indexes: {
            rest: number;
            hover: number;
            active: number;
        } = findAccessibleAccentSwatchIndexs(designSystem, contrastTarget, textColor, {
            rest: accentFillDeltaRest,
            hover: accentFillDeltaHover,
            active: accentFillDeltaActive,
        });

        return {
            rest: accentPalette[indexes.rest],
            hover: accentPalette[indexes.hover],
            active: accentPalette[indexes.active],
        };
    },
    (designSystem: DesignSystem, contrastTarget: number): string => {
        return accentSwatch(designSystem)
            .concat(contrastTarget.toString())
            .concat(isDarkTheme(designSystem) ? "dark" : "light");
    }
);

function accentFillFactory(contrast: number): StatefulSwatchResolver {
    function accentFillInternal(designSystem: DesignSystem): StatefulSwatch;
    function accentFillInternal(
        backgroundResolver: (designSystem: DesignSystem) => Swatch
    ): (designSystem: DesignSystem) => StatefulSwatch;
    function accentFillInternal(arg: any): any {
        if (typeof arg === "function") {
            return ensureDesignSystemDefaults(
                (designSystem: DesignSystem): StatefulSwatch => {
                    return accentFillAlgorithm(
                        Object.assign({}, designSystem, {
                            backgroundColor: arg(designSystem),
                        }),
                        contrast
                    );
                }
            );
        } else {
            return accentFillAlgorithm(withDesignSystemDefaults(arg), contrast);
        }
    }

    return accentFillInternal;
}

export const accentFill: StatefulSwatchResolver = accentFillFactory(4.5);
export const accentFillLarge: StatefulSwatchResolver = accentFillFactory(3);

export const accentFillRest: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    "rest",
    accentFill
);
export const accentFillHover: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    "hover",
    accentFill
);
export const accentFillActive: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    "active",
    accentFill
);

export const accentFillLargeRest: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    "rest",
    accentFillLarge
);
export const accentFillLargeHover: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    "hover",
    accentFillLarge
);
export const accentFillLargeActive: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    "active",
    accentFillLarge
);
