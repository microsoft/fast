import { DesignSystem } from "../../design-system";
import {
    findClosestSwatchIndex,
    findSwatchIndex,
    Palette,
    palette,
    PaletteType,
    swatchByContrast,
} from "./palette";
import { neutralForegroundRest } from "./neutral-foreground";
import { inRange } from "lodash-es";
import { contrast, Swatch, SwatchRecipe, SwatchResolver } from "./common";
import { backgroundColor, neutralPalette } from "../design-system";

/**
 * Resolves the index that the contrast serach algorithm should start at
 */
function neutralForegroundHintInitialIndexResolver(
    referenceColor: string,
    sourcePalette: Palette,
    designSystem: DesignSystem
): number {
    return findClosestSwatchIndex(PaletteType.neutral, referenceColor)(designSystem);
}

/**
 * resolves the direction to look for accessible swatches
 */
function neturalForegroundHintDirectionResolver(
    referenceIndex: number,
    sourcePalette: Palette
): 1 | -1 {
    return referenceIndex >= Math.floor(sourcePalette.length / 2) ? -1 : 1;
}

const neutralForegroundHintAlgorithm: ReturnType<
    ReturnType<ReturnType<ReturnType<typeof swatchByContrast>>>
> = swatchByContrast(backgroundColor)(neutralPalette)(
    neutralForegroundHintInitialIndexResolver
)(neturalForegroundHintDirectionResolver);

/**
 * Factory to create neutral-foreground-hint functions based on an input contrast target
 */
function neutralForegroundHintFactory(contrastTarget: number): SwatchRecipe {
    function neutralForegroundHintInternal(designSystem: DesignSystem): Swatch;
    function neutralForegroundHintInternal(
        backgroundResolver: SwatchResolver
    ): SwatchResolver;
    function neutralForegroundHintInternal(arg: any): any {
        const algorithm: ReturnType<
            typeof neutralForegroundHintAlgorithm
        > = neutralForegroundHintAlgorithm(
            (instanceContrast: number): boolean => {
                return instanceContrast >= contrastTarget;
            }
        );

        if (typeof arg === "function") {
            return (designSystem: DesignSystem): Swatch => {
                return algorithm(
                    Object.assign({}, designSystem, {
                        backgroundColor: arg(designSystem),
                    })
                );
            };
        } else {
            return algorithm(arg);
        }
    }

    return neutralForegroundHintInternal;
}

/**
 * Hint text for normal sized text, less than 18pt normal weight
 */
export const neutralForegroundHint: SwatchRecipe = neutralForegroundHintFactory(4.5);

/**
 * Hint text for large sized text, greater than 18pt or 16pt and bold
 */
export const neutralForegroundHintLarge: SwatchRecipe = neutralForegroundHintFactory(3);
