import { findClosestSwatchIndex, swatchByMode } from "./palette";
import {
    ColorRecipe,
    colorRecipeFactory,
    designSystemResolverMax,
    Swatch,
} from "./common";
import {
    neutralFillActiveDelta,
    neutralFillCardDelta,
    neutralFillHoverDelta,
    neutralFillRestDelta,
    neutralPalette,
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

/**
 * Light mode L2 is significant because it happens at the same point as the neutral fill flip.
 */
const lightNeutralLayerL2: DesignSystemResolver<number> = designSystemResolverMax(
    neutralFillRestDelta,
    neutralFillHoverDelta,
    neutralFillActiveDelta
);

/**
 * Dark mode L4 is the darkest recommended background in the standard guidance, which is
 * calculated based on luminance to work with variable sized ramps.
 */
const darkNeutralLayerL4: DesignSystemResolver<number> = (
    designSystem: DesignSystem
): number => {
    const darkLum: number = 0.14;
    const darkColor: ColorRGBA64 = new ColorRGBA64(darkLum, darkLum, darkLum, 1);
    const darkRefIndex: number = findClosestSwatchIndex(
        neutralPalette,
        darkColor.toStringHexRGB()
    )(designSystem);
    return darkRefIndex;
};

/**
 * Used as the background color for floating layers like context menus and flyouts.
 */
export const neutralLayerFloating: ColorRecipe<Swatch> = colorRecipeFactory(
    swatchByMode(neutralPalette)(
        0,
        subtract(darkNeutralLayerL4, multiply(neutralFillCardDelta, 5))
    )
);

/**
 * Used as the background color for cards. Pair with neutralLayerCardContainer for the container background.
 */
export const neutralLayerCard: ColorRecipe<Swatch> = colorRecipeFactory(
    swatchByMode(neutralPalette)(
        0,
        subtract(darkNeutralLayerL4, multiply(neutralFillCardDelta, 4))
    )
);

/**
 * Used as the background color for card containers. Pair with neutralLayerCard for the card backgrounds.
 */
export const neutralLayerCardContainer: ColorRecipe<Swatch> = colorRecipeFactory(
    swatchByMode(neutralPalette)(
        neutralFillCardDelta,
        subtract(darkNeutralLayerL4, multiply(neutralFillCardDelta, 3))
    )
);

/**
 * Used as the background color for the primary content layer (L1).
 */
export const neutralLayerL1: ColorRecipe<Swatch> = colorRecipeFactory(
    swatchByMode(neutralPalette)(
        0,
        subtract(darkNeutralLayerL4, multiply(neutralFillCardDelta, 3))
    )
);

/**
 * Previously used as the background color for card containers.
 *
 * @deprecated Use neutralLayerCardContainer instead.
 */
export const neutralLayerL1Alt: ColorRecipe<Swatch> = neutralLayerCardContainer;

/**
 * Used as the background for the top command surface, logically below L1.
 */
export const neutralLayerL2: ColorRecipe<Swatch> = colorRecipeFactory(
    swatchByMode(neutralPalette)(
        lightNeutralLayerL2,
        subtract(darkNeutralLayerL4, multiply(neutralFillCardDelta, 2))
    )
);

/**
 * Used as the background for secondary command surfaces, logically below L2.
 */
export const neutralLayerL3: ColorRecipe<Swatch> = colorRecipeFactory(
    swatchByMode(neutralPalette)(
        add(lightNeutralLayerL2, neutralFillCardDelta),
        subtract(darkNeutralLayerL4, neutralFillCardDelta)
    )
);

/**
 * Used as the background for the lowest command surface or title bar, logically below L3.
 */
export const neutralLayerL4: ColorRecipe<Swatch> = colorRecipeFactory(
    swatchByMode(neutralPalette)(
        add(lightNeutralLayerL2, multiply(neutralFillCardDelta, 2)),
        darkNeutralLayerL4
    )
);
