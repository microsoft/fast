import {
    DesignSystem,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";
import {
    ColorRecipe,
    FillSwatch,
    FillSwatchResolver,
    StatefulSwatchToColorRecipeFactory,
    SwatchStates,
} from "./common";
import { accentSwatch, findAccessibleAccentSwatchIndexs } from "./accent";
import {
    getPaletteIndex,
    isDarkTheme,
    Palette,
    palette,
    PaletteType,
    Swatch,
} from "./palette";
import { accentForegroundCut } from "./accent-foreground-cut";
import { memoize } from "lodash-es";

/**
 * Deltas to derive state swatches from the background
 */
export const accentFillDeltaRest: number = 0;
export const accentFillDeltaHover: number = 2;
export const accentFillDeltaActive: number = 4;
export const accentFillDeltaSelected: number = 12;

/**
 * Derives rest/hover/active active fill colors
 */
export const accentFillAlgorithm: (
    designSystem: DesignSystem,
    contrastTarget: number
) => FillSwatch = memoize(
    (designSystem: DesignSystem, contrastTarget: number): FillSwatch => {
        const accentPalette: Palette = palette(PaletteType.accent)(designSystem);
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
            rest: getPaletteIndex(indexes.rest, accentPalette),
            hover: getPaletteIndex(indexes.hover, accentPalette),
            active: getPaletteIndex(indexes.active, accentPalette),
            selected: getPaletteIndex(
                indexes.rest +
                    (isDarkTheme(designSystem)
                        ? accentFillDeltaSelected * -1
                        : accentFillDeltaSelected),
                accentPalette
            ),
        };
    },
    (designSystem: DesignSystem, contrastTarget: number): string => {
        return accentSwatch(designSystem)
            .concat(contrastTarget.toString())
            .concat(isDarkTheme(designSystem) ? "dark" : "light");
    }
);

/**
 * Factory to create accent-fill functions based on an input contrast target
 */
function accentFillFactory(contrast: number): FillSwatchResolver {
    function accentFillInternal(designSystem: DesignSystem): FillSwatch;
    function accentFillInternal(
        backgroundResolver: (designSystem: DesignSystem) => Swatch
    ): (designSystem: DesignSystem) => FillSwatch;
    function accentFillInternal(arg: any): any {
        if (typeof arg === "function") {
            return ensureDesignSystemDefaults(
                (designSystem: DesignSystem): FillSwatch => {
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

export const accentFill: FillSwatchResolver = accentFillFactory(4.5);
export const accentFillLarge: FillSwatchResolver = accentFillFactory(3);

export const accentFillRest: ColorRecipe = StatefulSwatchToColorRecipeFactory<FillSwatch>(
    SwatchStates.rest,
    accentFill
);
export const accentFillHover: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.hover, accentFill);
export const accentFillActive: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.active, accentFill);

export const accentFillSelected: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.selected, accentFill);

export const accentFillLargeRest: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.rest, accentFillLarge);
export const accentFillLargeHover: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.hover, accentFillLarge);
export const accentFillLargeActive: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.active, accentFillLarge);
export const accentFillLargeSelected: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.selected, accentFillLarge);
