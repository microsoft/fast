import { DesignSystem } from "../../design-system";
import {
    findClosestSwatchIndex,
    getSwatch,
    isDarkMode,
    palette,
    Palette,
    PaletteType,
} from "./palette";
import {
    ColorRecipe,
    colorRecipeFactory,
    Swatch,
    SwatchFamily,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
} from "./common";
import {
    backgroundColor,
    neutralOutlineActiveDelta,
    neutralOutlineHoverDelta,
    neutralOutlineRestDelta,
} from "../design-system";

////////////////////
// Any portion of the code referencing newRecipeOffset is considered experimental
// and will be incorporated permanently or removed upon review. DO NOT use values
// in this range unless you are temporarily evaluation this feature as they will
// no longer produce predictable results once removed.
////////////////////
const newRecipeOffset: number = 100;

const neutralOutlineAlgorithm: SwatchFamilyResolver = (
    designSystem: DesignSystem
): SwatchFamily => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
    const backgroundIndex: number = findClosestSwatchIndex(
        PaletteType.neutral,
        backgroundColor(designSystem)
    )(designSystem);
    const direction: 1 | -1 = isDarkMode(designSystem) ? -1 : 1;

    let restDelta: number = neutralOutlineRestDelta(designSystem);

    if (restDelta >= newRecipeOffset) {
        restDelta -= newRecipeOffset;
        const hoverDelta: number =
            neutralOutlineHoverDelta(designSystem) - newRecipeOffset;
        const activeDelta: number =
            neutralOutlineActiveDelta(designSystem) - newRecipeOffset;
        const restIndex: number = backgroundIndex + direction * restDelta;
        return {
            rest: getSwatch(restIndex, neutralPalette),
            hover: getSwatch(restIndex + hoverDelta - restDelta, neutralPalette),
            active: getSwatch(restIndex + activeDelta - restDelta, neutralPalette),
        };
    }

    return {
        rest: getSwatch(
            backgroundIndex + direction * neutralOutlineRestDelta(designSystem),
            neutralPalette
        ),
        hover: getSwatch(
            backgroundIndex + direction * neutralOutlineHoverDelta(designSystem),
            neutralPalette
        ),
        active: getSwatch(
            backgroundIndex + direction * neutralOutlineActiveDelta(designSystem),
            neutralPalette
        ),
    };
};

export const neutralOutline: ColorRecipe<SwatchFamily> = colorRecipeFactory(
    neutralOutlineAlgorithm
);
export const neutralOutlineRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    neutralOutline
);
export const neutralOutlineHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    neutralOutline
);
export const neutralOutlineActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    neutralOutline
);
