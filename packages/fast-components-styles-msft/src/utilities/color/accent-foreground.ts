import defaultDesignSystem, {
    DesignSystem,
    DesignSystemResolver,
} from "../../design-system";
import { findAccessibleAccentSwatchIndexs } from "./accent";
import { getSwatch, palette, Palette, PaletteType } from "./palette";
import {
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

const accentForegroundAlgorithm: (
    designSystem: DesignSystem,
    contrastTarget: number
) => SwatchFamily = (
    designSystem: DesignSystem,
    contrastTarget: number
): SwatchFamily => {
    designSystem = Boolean(designSystem) ? designSystem : defaultDesignSystem;

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

function accentForegroundFactory(contrast: number): SwatchFamilyResolver {
    function accentForegroundInternal(designSystem: DesignSystem): SwatchFamily;
    function accentForegroundInternal(
        backgroundResolver: SwatchResolver
    ): DesignSystemResolver<SwatchFamily>;
    function accentForegroundInternal(arg: any): any {
        if (typeof arg === "function") {
            return (designSystem: DesignSystem): SwatchFamily => {
                return accentForegroundAlgorithm(
                    Object.assign({}, designSystem, {
                        backgroundColor: arg(designSystem),
                    }),
                    contrast
                );
            };
        } else {
            return accentForegroundAlgorithm(arg, contrast);
        }
    }

    return accentForegroundInternal;
}

export const accentForeground: SwatchFamilyResolver = accentForegroundFactory(4.5);
export const accentForegroundLarge: SwatchFamilyResolver = accentForegroundFactory(3);

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
