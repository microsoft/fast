import { Swatch } from "./palette";
import { black, white } from "./color-constants";
import chroma from "chroma-js";
import { memoize } from "lodash";
import { DesignSystem, ensureDesignSystemDefaults } from "../../design-system";
import { accentSwatch } from "./accent";
import { ColorRecipe } from "./common";

/**
 * Function to derive accentForegroundCut from an input background and target contrast ratio
 */
const accentForegroundCutAlgorithm: (
    backgroundColor: Swatch,
    targetContrast: number
) => Swatch = memoize(
    (backgroundColor: Swatch, targetContrast: number): Swatch => {
        return chroma.contrast(white, backgroundColor) >= targetContrast ? white : black;
    },
    (backgroundColor: Swatch, targetContrast: number): string => {
        return backgroundColor.concat(targetContrast.toString());
    }
);

/**
 * Factory to create a accent-foreground-cut function that operates on a target contrast ratio
 */
function accentForegroundCutFactory(contrast: number): ColorRecipe {
    function accentForegroundCutInternal(designSystem: DesignSystem): Swatch;
    function accentForegroundCutInternal(
        backgroundResolver: (d: DesignSystem) => Swatch
    ): (designSystem: DesignSystem) => Swatch;
    function accentForegroundCutInternal(arg: any): any {
        if (typeof arg === "function") {
            return ensureDesignSystemDefaults(
                (designSystem: DesignSystem): Swatch => {
                    return accentForegroundCutAlgorithm(arg(designSystem), contrast);
                }
            );
        } else {
            return accentForegroundCutAlgorithm(accentSwatch(arg), contrast);
        }
    }

    return accentForegroundCutInternal;
}

/**
 * Cut text for normal sized text, less than 18pt normal weight
 */
export const accentForegroundCut: ColorRecipe = accentForegroundCutFactory(4.5);

/**
 * Cut text for large sized text, greater than 18pt or 16pt and bold
 */
export const accentForegroundCutLarge: ColorRecipe = accentForegroundCutFactory(3);
