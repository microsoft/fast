import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";
import {
    FillSwatchFamily,
    Swatch,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
} from "./common";
import { accentSwatch, findAccessibleAccentSwatchIndexs } from "./accent";
import { getSwatch, isDarkMode, Palette, palette, PaletteType } from "./palette";
import { accentForegroundCut } from "./accent-foreground-cut";

/**
 * Derives rest/hover/active active fill colors
 */
export const accentFillAlgorithm: (
    designSystem: DesignSystem,
    contrastTarget: number
) => FillSwatchFamily = (
    designSystem: DesignSystem,
    contrastTarget: number
): FillSwatchFamily => {
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
        rest: designSystem.accentFillRestDelta,
        hover: designSystem.accentFillHoverDelta,
        active: designSystem.accentFillActiveDelta,
    });

    return {
        rest: getSwatch(indexes.rest, accentPalette),
        hover: getSwatch(indexes.hover, accentPalette),
        active: getSwatch(indexes.active, accentPalette),
        selected: getSwatch(
            indexes.rest +
                (isDarkMode(designSystem)
                    ? designSystem.accentFillSelectedDelta * -1
                    : designSystem.accentFillSelectedDelta),
            accentPalette
        ),
    };
};

/**
 * Factory to create accent-fill functions based on an input contrast target
 */
function accentFillFactory(contrast: number): SwatchFamilyResolver<FillSwatchFamily> {
    function accentFillInternal(designSystem: DesignSystem): FillSwatchFamily;
    function accentFillInternal(
        backgroundResolver: DesignSystemResolver<Swatch>
    ): DesignSystemResolver<FillSwatchFamily>;
    function accentFillInternal(arg: any): any {
        if (typeof arg === "function") {
            return ensureDesignSystemDefaults(
                (designSystem: DesignSystem): FillSwatchFamily => {
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

export const accentFill: SwatchFamilyResolver<FillSwatchFamily> = accentFillFactory(4.5);
export const accentFillLarge: SwatchFamilyResolver<FillSwatchFamily> = accentFillFactory(
    3
);

export const accentFillRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.rest, accentFill);
export const accentFillHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.hover, accentFill);
export const accentFillActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.active, accentFill);

export const accentFillSelected: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.selected, accentFill);

export const accentFillLargeRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.rest, accentFillLarge);
export const accentFillLargeHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.hover, accentFillLarge);
export const accentFillLargeActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.active, accentFillLarge);
export const accentFillLargeSelected: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.selected, accentFillLarge);
