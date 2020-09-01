import { FASTDesignSystem } from "../fast-design-system";
import { accentBaseColor } from "../fast-design-system";
import { black, white } from "./color-constants";
import { contrast, Swatch, SwatchRecipe, SwatchResolver } from "./common";

/**
 * Function to derive accentForegroundCut from an input background and target contrast ratio
 */
const accentForegroundCutAlgorithm: (
    backgroundColor: Swatch,
    targetContrast: number
) => Swatch = (backgroundColor: Swatch, targetContrast: number): Swatch => {
    return contrast(white, backgroundColor) >= targetContrast ? white : black;
};

/**
 * Factory to create a accent-foreground-cut function that operates on a target contrast ratio
 */
function accentForegroundCutFactory(targetContrast: number): SwatchRecipe {
    function accentForegroundCutInternal(designSystem: FASTDesignSystem): Swatch;
    function accentForegroundCutInternal(
        backgroundResolver: SwatchResolver
    ): SwatchResolver;
    function accentForegroundCutInternal(colorLiteral: string): SwatchResolver;
    function accentForegroundCutInternal(arg: any): any {
        return typeof arg === "function" || typeof arg === "string"
            ? (designSystem: FASTDesignSystem): Swatch => {
                  return accentForegroundCutAlgorithm(
                      typeof arg === "function" ? arg(designSystem) : arg,
                      targetContrast
                  );
              }
            : accentForegroundCutAlgorithm(accentBaseColor(arg), targetContrast);
    }

    return accentForegroundCutInternal;
}

/**
 * Cut text for normal sized text, less than 18pt normal weight
 * @internal
 */
export const accentForegroundCut: SwatchRecipe = accentForegroundCutFactory(4.5);

/**
 * Cut text for large sized text, greater than 18pt or 16pt and bold
 * @internal
 */
export const accentForegroundCutLarge: SwatchRecipe = accentForegroundCutFactory(3);
