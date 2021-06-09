import { FASTDesignSystem } from "../fast-design-system";
import { black, white } from "./color-constants";
import { contrast, Swatch, SwatchRecipe, SwatchResolver } from "./common";
import { neutralFillToggleRest_DEPRECATED } from "./neutral-fill-toggle";

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
    function neutralForegroundToggleInternal(colorLiteral: string): SwatchResolver;
    function neutralForegroundToggleInternal(arg: any): any {
        return typeof arg === "function" || typeof arg === "string"
            ? (designSystem: FASTDesignSystem): Swatch => {
                  return neutralForegroundToggleAlgorithm(
                      typeof arg === "function" ? arg(designSystem) : arg,
                      targetContrast
                  );
              }
            : neutralForegroundToggleAlgorithm(
                  neutralFillToggleRest_DEPRECATED(arg),
                  targetContrast
              );
    }

    return neutralForegroundToggleInternal;
}

/**
 * Toggle text for normal sized text, less than 18pt normal weight
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralForegroundToggle_DEPRECATED: SwatchRecipe = neutralForegroundToggleFactory(
    4.5
);

/**
 * Toggle text for large sized text, greater than 18pt or 16pt and bold
 * @internal
 * @deprecated - to-be deleted
 */
export const neutralForegroundToggleLarge_DEPRECATED: SwatchRecipe = neutralForegroundToggleFactory(
    3
);
