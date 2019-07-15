import { findClosestSwatchIndex, PaletteType, swatchByMode } from "./palette";
import {
    ColorRecipe,
    colorRecipeFactory,
    designSystemResolverMax,
    Swatch,
    SwatchResolver,
} from "./common";
import {
    neutralFillActiveDelta,
    neutralFillCardDelta,
    neutralFillHoverDelta,
    neutralFillRestDelta,
} from "../design-system";
import { add, multiply, subtract } from "@microsoft/fast-jss-utilities";
import { DesignSystem, DesignSystemResolver } from "src/design-system";
import { ColorRGBA64 } from "@microsoft/fast-colors";
/**
 * @deprecated Use the recipes because they can be more dynamic for different ramps
 */
export enum NeutralPaletteLightModeLayers {
    L1 = 0,
    L1Alt = 3,
    L2 = 10,
    L3 = 13,
    L4 = 16,
}

/**
 * @deprecated Use the recipes because they can be more dynamic for different ramps
 */
export enum NeutralPaletteDarkModeLayers {
    L1 = 76,
    L1Alt = 76,
    L2 = 79,
    L3 = 82,
    L4 = 85,
}

const darkNeutralLayerL4: DesignSystemResolver<number> = (
    designSystem: DesignSystem
): number => {
    const darkLum: number = 0.14;
    const darkColor: ColorRGBA64 = new ColorRGBA64(darkLum, darkLum, darkLum, 1);
    const darkRefIndex: number = findClosestSwatchIndex(
        PaletteType.neutral,
        darkColor.toStringHexRGB()
    )(designSystem);
    return darkRefIndex;
};

export const neutralLayerL1: ColorRecipe<Swatch> = colorRecipeFactory(
    swatchByMode(PaletteType.neutral)(
        0,
        subtract(darkNeutralLayerL4, multiply(neutralFillCardDelta, 3))
    )
);

export const neutralLayerL1Alt: ColorRecipe<Swatch> = colorRecipeFactory(
    swatchByMode(PaletteType.neutral)(
        neutralFillCardDelta,
        subtract(darkNeutralLayerL4, multiply(neutralFillCardDelta, 3))
    )
);

export const neutralLayerL2: ColorRecipe<Swatch> = colorRecipeFactory(
    swatchByMode(PaletteType.neutral)(
        designSystemResolverMax(
            neutralFillRestDelta,
            neutralFillHoverDelta,
            neutralFillActiveDelta
        ),
        subtract(darkNeutralLayerL4, multiply(neutralFillCardDelta, 2))
    )
);

export const neutralLayerL3: ColorRecipe<Swatch> = colorRecipeFactory(
    swatchByMode(PaletteType.neutral)(
        add(
            designSystemResolverMax(
                neutralFillRestDelta,
                neutralFillHoverDelta,
                neutralFillActiveDelta
            ),
            neutralFillCardDelta
        ),
        subtract(darkNeutralLayerL4, neutralFillCardDelta)
    )
);

export const neutralLayerL4: ColorRecipe<Swatch> = colorRecipeFactory(
    swatchByMode(PaletteType.neutral)(
        add(
            designSystemResolverMax(
                neutralFillRestDelta,
                neutralFillHoverDelta,
                neutralFillActiveDelta
            ),
            multiply(neutralFillCardDelta, 2)
        ),
        darkNeutralLayerL4
    )
);
