import {
    checkDesignSystemResolver,
    DesignSystem,
    DesignSystemResolver,
} from "../../design-system";
import { backgroundColor } from "../design-system";
import { Swatch, SwatchFamily } from "./common";
import {
    findClosestSwatchIndex,
    findSwatchIndex,
    getSwatch,
    isDarkMode,
    Palette,
    swatchByContrast,
} from "./palette";

/**
 * Resolves the index that the contrast search algorithm should start at
 */
function referenceColorInitialIndexResolver(
    referenceColor: string,
    sourcePalette: Palette,
    designSystem: DesignSystem
): number {
    return findClosestSwatchIndex(sourcePalette, referenceColor)(designSystem);
}

function contrastTargetFactory(
    targetContrast: number
): (instanceContrast: number) => boolean {
    return (instanceContrast: number): boolean => instanceContrast >= targetContrast;
}

function indexToSwatchFamily(
    accessibleIndex: number,
    palette: Palette,
    direction: number,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number
): SwatchFamily {
    // One of the indexes will be rest, the other will be hover. Depends on the offsets and the direction.
    const accessibleIndex2: number =
        accessibleIndex + direction * Math.abs(restDelta - hoverDelta);

    const indexOneIsRestState: boolean =
        direction === 1
            ? restDelta < hoverDelta
            : direction * restDelta > direction * hoverDelta;

    const restIndex: number = indexOneIsRestState ? accessibleIndex : accessibleIndex2;
    const hoverIndex: number = indexOneIsRestState ? accessibleIndex2 : accessibleIndex;

    const activeIndex: number = restIndex + direction * activeDelta;

    return {
        rest: getSwatch(restIndex, palette),
        hover: getSwatch(hoverIndex, palette),
        active: getSwatch(activeIndex, palette),
    };
}

/**
 * Function to derive accessible colors from contrast and delta configuration.
 * Performs a simple contrast check against the colors and returns
 * the color that has the most contrast against the background. If contrast
 * cannot be retrieved correctly, function returns black.
 */
export function accessibleAlgorithm(
    palette: Palette | DesignSystemResolver<Palette>,
    minContrast: number | DesignSystemResolver<number>,
    restDelta: number | DesignSystemResolver<number>,
    hoverDelta: number | DesignSystemResolver<number>,
    activeDelta: number | DesignSystemResolver<number>
): DesignSystemResolver<SwatchFamily> {
    return (designSystem: DesignSystem): SwatchFamily => {
        const resolvedPalette: Palette = checkDesignSystemResolver(palette, designSystem);
        const direction: 1 | -1 = isDarkMode(designSystem) ? -1 : 1;

        const accessibleSwatch: Swatch = swatchByContrast(
            backgroundColor // Compare swatches against the background
        )(
            resolvedPalette // Use the provided palette
        )(
            referenceColorInitialIndexResolver // Begin searching from the background color
        )(
            () => direction // Search direction based on light/dark mode
        )(
            contrastTargetFactory(checkDesignSystemResolver(minContrast, designSystem)) // A swatch is only valid if the contrast is greater than indicated
        )(
            designSystem // Pass the design system
        );

        const accessibleIndex: number = findSwatchIndex(palette, accessibleSwatch)(
            designSystem
        );
        const resolvedRest: number = checkDesignSystemResolver(restDelta, designSystem);
        const resolvedHover: number = checkDesignSystemResolver(hoverDelta, designSystem);
        const resolvedActive: number = checkDesignSystemResolver(
            activeDelta,
            designSystem
        );

        return indexToSwatchFamily(
            accessibleIndex,
            resolvedPalette,
            direction,
            resolvedRest,
            resolvedHover,
            resolvedActive
        );
    };
}
