import { DesignSystem } from "../../design-system";
import {
    findClosestSwatchIndex,
    findSwatchIndex,
    isDarkMode,
    Palette,
    palette,
    PaletteType,
    swatchByContrast,
} from "./palette";
import { neutralForegroundRest } from "./neutral-foreground";
import { inRange } from "lodash-es";
import {
    colorRecipeFactory,
    contrast,
    Swatch,
    SwatchRecipe,
    SwatchResolver,
} from "./common";
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
    return referenceIndex > Math.ceil(sourcePalette.length / 2) ? -1 : 1;
}

const neutralForegroundHintAlgorithm: ReturnType<
    ReturnType<ReturnType<ReturnType<typeof swatchByContrast>>>
> = swatchByContrast(backgroundColor)(neutralPalette)(
    neutralForegroundHintInitialIndexResolver
)(neturalForegroundHintDirectionResolver);

function contrastTargetFactory(
    targetContrast: number
): (instanceContrast: number) => boolean {
    return (instanceContrast: number): boolean => instanceContrast >= targetContrast;
}

/**
 * Hint text for normal sized text, less than 18pt normal weight
 */
export const neutralForegroundHint: SwatchRecipe = colorRecipeFactory(
    neutralForegroundHintAlgorithm(contrastTargetFactory(4.5))
);

/**
 * Hint text for large sized text, greater than 18pt or 16pt and bold
 */
export const neutralForegroundHintLarge: SwatchRecipe = colorRecipeFactory(
    neutralForegroundHintAlgorithm(contrastTargetFactory(3))
);
