import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";
import { accentSwatch, findAccessibleAccentSwatchIndexs } from "./accent";
import { getSwatch, palette, Palette, PaletteType } from "./palette";
import {
    ColorRecipe,
    Swatch,
    SwatchFamily,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
    SwatchResolver,
} from "./common";

const accentForegroundAlgorithm: (
    designSystem: DesignSystem,
    contrastTarget: number
) => SwatchFamily = (
    designSystem: DesignSystem,
    contrastTarget: number
): SwatchFamily => {
    const accentPalette: Palette = palette(PaletteType.accent)(designSystem);
    const indexes: {
        rest: number;
        hover: number;
        active: number;
    } = findAccessibleAccentSwatchIndexs(
        designSystem,
        contrastTarget,
        designSystem.backgroundColor,
        {
            rest: designSystem.accentForegroundRestDelta,
            hover: designSystem.accentForegroundHoverDelta,
            active: designSystem.accentForegroundActiveDelta,
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
            return ensureDesignSystemDefaults(
                (designSystem: DesignSystem): SwatchFamily => {
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
