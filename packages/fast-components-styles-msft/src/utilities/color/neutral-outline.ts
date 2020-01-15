import {
    ColorRecipe,
    colorRecipeFactory,
    SwatchFamily,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
} from "./common";
import { offsetsAlgorithm } from "./offsets-algorithm";
import { neutralPalette } from "../../default-palette";
import {
    neutralOutlineActiveDelta,
    neutralOutlineFocusDelta,
    neutralOutlineHoverDelta,
    neutralOutlineRestDelta,
} from "../design-system";

const neutralOutlineAlgorithm: SwatchFamilyResolver = offsetsAlgorithm(
    neutralPalette,
    neutralOutlineRestDelta,
    neutralOutlineHoverDelta,
    neutralOutlineActiveDelta,
    neutralOutlineFocusDelta
);

/**
 * @deprecated
 */
export const neutralOutline: ColorRecipe<SwatchFamily> = colorRecipeFactory(
    neutralOutlineAlgorithm
);

/**
 * @deprecated
 */
export const neutralOutlineRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    neutralOutlineAlgorithm
);
/**
 * @deprecated
 */
export const neutralOutlineHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    neutralOutlineAlgorithm
);
/**
 * @deprecated
 */
export const neutralOutlineActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    neutralOutlineAlgorithm
);
/**
 * @deprecated
 */
export const neutralOutlineFocus: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.focus,
    neutralOutlineAlgorithm
);
