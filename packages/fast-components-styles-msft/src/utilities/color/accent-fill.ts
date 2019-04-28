import { DesignSystem, DesignSystemResolver } from "../../design-system";
import {
    colorRecipeFactory,
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
import {
    accentFillActiveDelta,
    accentFillHoverDelta,
    accentFillRestDelta,
    accentFillSelectedDelta,
} from "../design-system";

function accentFillAlgorithm(contrast: number): DesignSystemResolver<FillSwatchFamily> {
    return (designSystem: DesignSystem): FillSwatchFamily => {
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
        } = findAccessibleAccentSwatchIndexs(designSystem, contrast, textColor, {
            rest: accentFillRestDelta(designSystem),
            hover: accentFillHoverDelta(designSystem),
            active: accentFillActiveDelta(designSystem),
        });

        return {
            rest: getSwatch(indexes.rest, accentPalette),
            hover: getSwatch(indexes.hover, accentPalette),
            active: getSwatch(indexes.active, accentPalette),
            selected: getSwatch(
                indexes.rest +
                    (isDarkMode(designSystem)
                        ? accentFillSelectedDelta(designSystem) * -1
                        : accentFillSelectedDelta(designSystem)),
                accentPalette
            ),
        };
    };
}

export const accentFill: SwatchFamilyResolver<FillSwatchFamily> = colorRecipeFactory(
    accentFillAlgorithm(4.5)
);
export const accentFillLarge: SwatchFamilyResolver<FillSwatchFamily> = colorRecipeFactory(
    accentFillAlgorithm(3)
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
