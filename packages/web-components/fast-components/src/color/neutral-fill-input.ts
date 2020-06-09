import { DesignSystemResolver, FASTDesignSystem } from "../fast-design-system";
import {
    neutralFillInputActiveDelta,
    neutralFillInputFocusDelta,
    neutralFillInputHoverDelta,
    neutralFillInputRestDelta,
    neutralFillInputSelectedDelta,
    neutralPalette,
} from "../fast-design-system";
import { findClosestBackgroundIndex, getSwatch, isDarkMode } from "./palette";
import { colorRecipeFactory, FillSwatchFamily, Swatch } from "./common";

/**
 * Algorithm for determining neutral backplate colors
 */
function neutralFillInputAlgorithm(
    indexResolver: DesignSystemResolver<number>
): DesignSystemResolver<Swatch> {
    return (designSystem: FASTDesignSystem): Swatch => {
        const direction: 1 | -1 = isDarkMode(designSystem) ? -1 : 1;
        return getSwatch(
            findClosestBackgroundIndex(designSystem) -
                indexResolver(designSystem) * direction,
            neutralPalette(designSystem)
        );
    };
}

/**
 * @internal
 */
export const neutralFillInputRest = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputRestDelta)
);
/**
 * @internal
 */
export const neutralFillInputHover = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputHoverDelta)
);
/**
 * @internal
 */
export const neutralFillInputActive = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputActiveDelta)
);
/**
 * @internal
 */
export const neutralFillInputFocus = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputFocusDelta)
);
/**
 * @internal
 */
export const neutralFillInputSelected = colorRecipeFactory(
    neutralFillInputAlgorithm(neutralFillInputSelectedDelta)
);
/**
 * @internal
 */
export const neutralFillInput = colorRecipeFactory(
    (designSystem: FASTDesignSystem): FillSwatchFamily => {
        return {
            rest: neutralFillInputRest(designSystem),
            hover: neutralFillInputHover(designSystem),
            active: neutralFillInputActive(designSystem),
            focus: neutralFillInputFocus(designSystem),
            selected: neutralFillInputSelected(designSystem),
        };
    }
);
