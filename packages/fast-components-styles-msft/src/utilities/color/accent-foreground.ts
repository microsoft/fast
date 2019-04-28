import defaultDesignSystem, {
    DesignSystem,
    DesignSystemResolver,
} from "../../design-system";
import { findAccessibleAccentSwatchIndexs } from "./accent";
import { getSwatch, palette, Palette, PaletteType } from "./palette";
import {
    colorRecipeFactory,
    SwatchFamily,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
    SwatchResolver,
} from "./common";
import {
    accentForegroundActiveDelta,
    accentForegroundHoverDelta,
    accentForegroundRestDelta,
    backgroundColor,
} from "../design-system";

function accentForegroundAlgorithm(
    contrastTarget: number
): DesignSystemResolver<SwatchFamily> {
    return (designSystem: DesignSystem): SwatchFamily => {
        const accentPalette: Palette = palette(PaletteType.accent)(designSystem);
        const indexes: {
            rest: number;
            hover: number;
            active: number;
        } = findAccessibleAccentSwatchIndexs(
            designSystem,
            contrastTarget,
            backgroundColor(designSystem),
            {
                rest: accentForegroundRestDelta(designSystem),
                hover: accentForegroundHoverDelta(designSystem),
                active: accentForegroundActiveDelta(designSystem),
            }
        );

        return {
            rest: getSwatch(indexes.rest, accentPalette),
            hover: getSwatch(indexes.hover, accentPalette),
            active: getSwatch(indexes.active, accentPalette),
        };
    };
}

export const accentForeground: SwatchFamilyResolver = colorRecipeFactory(
    accentForegroundAlgorithm(4.5)
);
export const accentForegroundLarge: SwatchFamilyResolver = colorRecipeFactory(
    accentForegroundAlgorithm(3)
);

export const accentForegroundRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    accentForeground
);
export const accentForegroundHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    accentForeground
);
export const accentForegroundActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    accentForeground
);

export const accentForegroundLargeRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    accentForegroundLarge
);
export const accentForegroundLargeHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    accentForegroundLarge
);
export const accentForegroundLargeActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    accentForegroundLarge
);
