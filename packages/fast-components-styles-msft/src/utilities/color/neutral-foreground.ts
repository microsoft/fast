import { DesignSystem, DesignSystemResolver } from "../../design-system";
import {
    backgroundColor,
    neutralForegroundActiveDelta,
    neutralForegroundHoverDelta,
} from "../design-system";
import {
    colorRecipeFactory,
    Swatch,
    SwatchFamily,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
} from "./common";
import {
    findClosestSwatchIndex,
    findSwatchIndex,
    getSwatch,
    isDarkMode,
    Palette,
    palette,
    PaletteType,
    swatchByContrast,
} from "./palette";

/**
 * Resolves the index that the contrast serach algorithm should start at
 */
function neutralForegroundInitialIndexResolver(
    referenceColor: string,
    sourcePalette: Palette,
    designSystem: DesignSystem
): number {
    return findClosestSwatchIndex(PaletteType.neutral, referenceColor)(designSystem);
}

function contrastTargetFactory(
    targetContrast: number
): (instanceContrast: number) => boolean {
    return (instanceContrast: number): boolean => instanceContrast >= targetContrast;
}

/**
 * Function to derive neutralForeground from color inputs.
 * Performs a simple contrast check against the colors and returns
 * the color that has the most contrast against the background. If contrast
 * cannot be retrieved correctly, function returns black.
 */
function neutralForegroundAlgorithm(): DesignSystemResolver<SwatchFamily> {
    return (designSystem: DesignSystem): SwatchFamily => {
        const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);

        const stateDeltas: any = {
            rest: 0,
            hover: neutralForegroundHoverDelta(designSystem),
            active: neutralForegroundActiveDelta(designSystem),
        };

        const direction: 1 | -1 = isDarkMode(designSystem) ? -1 : 1;

        const accessibleSwatch: Swatch = swatchByContrast(
            backgroundColor // Compare swatches against the background
        )(
            palette(PaletteType.neutral) // Use the neutral palette
        )(
            neutralForegroundInitialIndexResolver // Begin searching based on neutral index, direction, and deltas
        )(
            () => direction // Search direction based on light/dark mode
        )(
            contrastTargetFactory(14) // A swatch is only valid if the contrast is greater than indicated
        )(
            designSystem // Pass the design system
        );

        // One of these will be rest, the other will be hover. Depends on the offsets and the direction.
        const accessibleIndex1: number = findSwatchIndex(
            PaletteType.neutral,
            accessibleSwatch
        )(designSystem);
        const accessibleIndex2: number =
            accessibleIndex1 + direction * Math.abs(stateDeltas.rest - stateDeltas.hover);

        const indexOneIsRestState: boolean =
            direction === 1
                ? stateDeltas.rest < stateDeltas.hover
                : direction * stateDeltas.rest > direction * stateDeltas.hover;

        const restIndex: number = indexOneIsRestState
            ? accessibleIndex1
            : accessibleIndex2;
        const hoverIndex: number = indexOneIsRestState
            ? accessibleIndex2
            : accessibleIndex1;

        const activeIndex: number = restIndex + direction * stateDeltas.active;

        return {
            rest: getSwatch(restIndex, neutralPalette),
            hover: getSwatch(hoverIndex, neutralPalette),
            active: getSwatch(activeIndex, neutralPalette),
        };
    };
}

export const neutralForeground: SwatchFamilyResolver = colorRecipeFactory(
    neutralForegroundAlgorithm()
);

export const neutralForegroundRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    neutralForeground
);
export const neutralForegroundHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    neutralForeground
);
export const neutralForegroundActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    neutralForeground
);
