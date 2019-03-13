import {
    DesignSystem,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";
import { accentSwatch, findAccessibleAccentSwatchIndexs } from "./accent";
import { getSwatch, palette, Palette, PaletteType, Swatch } from "./palette";
import {
    ColorRecipe,
    StatefulSwatch,
    StatefulSwatchResolver,
    StatefulSwatchToColorRecipeFactory,
    SwatchStates,
} from "./common";

/**
 * Deltas to derive state swatches from the background
 */
export const accentForegroundDeltaRest: number = 0;
export const accentForegroundDeltaHover: number = 1;
export const accentForegroundDeltaActive: number = 2;

const accentForegroundAlgorithm: (
    designSystem: DesignSystem,
    contrastTarget: number
) => StatefulSwatch = (
    designSystem: DesignSystem,
    contrastTarget: number
): StatefulSwatch => {
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
            rest: accentForegroundDeltaRest,
            hover: accentForegroundDeltaHover,
            active: accentForegroundDeltaActive,
        }
    );

    return {
        rest: getSwatch(indexes.rest, accentPalette),
        hover: getSwatch(indexes.hover, accentPalette),
        active: getSwatch(indexes.active, accentPalette),
    };
};

function accentForegroundFactory(contrast: number): StatefulSwatchResolver {
    function accentForegroundInternal(designSystem: DesignSystem): StatefulSwatch;
    function accentForegroundInternal(
        backgroundResolver: (designSystem: DesignSystem) => Swatch
    ): (designSystem: DesignSystem) => StatefulSwatch;
    function accentForegroundInternal(arg: any): any {
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

    return accentForegroundInternal;
}

export const accentForeground: StatefulSwatchResolver = accentForegroundFactory(4.5);
export const accentForegroundLarge: StatefulSwatchResolver = accentForegroundFactory(3);

export const accentForegroundRest: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.rest,
    accentForeground
);
export const accentForegroundHover: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.hover,
    accentForeground
);
export const accentForegroundActive: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.active,
    accentForeground
);

export const accentForegroundLargeRest: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.rest,
    accentForegroundLarge
);
export const accentForegroundLargeHover: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.hover,
    accentForegroundLarge
);
export const accentForegroundLargeActive: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.active,
    accentForegroundLarge
);
