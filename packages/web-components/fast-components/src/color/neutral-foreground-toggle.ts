import { FASTDesignSystem } from "../fast-design-system.js";
import { black, white } from "./color-constants.js";
import { contrast, Swatch, SwatchRecipe, SwatchResolver } from "./common.js";
import { neutralFillToggleRest } from "./neutral-fill-toggle.js";

/**
 * Function to derive neutralForegroundToggle from an input background and target contrast ratio
 */
const neutralForegroundToggleAlgorithm: (
    backgroundColor: Swatch,
    targetContrast: number
) => Swatch = (backgroundColor: Swatch, targetContrast: number): Swatch => {
    return contrast(white, backgroundColor) >= targetContrast ? white : black;
};

/**
 * Factory to create a neutral-foreground-toggle function that operates on a target contrast ratio
 */
function neutralForegroundToggleFactory(targetContrast: number): SwatchRecipe {
    function neutralForegroundToggleInternal(designSystem: FASTDesignSystem): Swatch;
    function neutralForegroundToggleInternal(
        backgroundResolver: SwatchResolver
    ): SwatchResolver;
    function neutralForegroundToggleInternal(arg: any): any {
        return typeof arg === "function"
            ? (designSystem: FASTDesignSystem): Swatch => {
                  return neutralForegroundToggleAlgorithm(
                      arg(designSystem),
                      targetContrast
                  );
              }
            : neutralForegroundToggleAlgorithm(
                  neutralFillToggleRest(arg),
                  targetContrast
              );
    }

    return neutralForegroundToggleInternal;
}

/**
 * Toggle text for normal sized text, less than 18pt normal weight
 */
export const neutralForegroundToggle: SwatchRecipe = neutralForegroundToggleFactory(4.5);

/**
 * Toggle text for large sized text, greater than 18pt or 16pt and bold
 */
export const neutralForegroundToggleLarge: SwatchRecipe = neutralForegroundToggleFactory(
    3
);
