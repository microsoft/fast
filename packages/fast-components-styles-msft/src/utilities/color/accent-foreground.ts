import { DesignSystem, DesignSystemResolver } from "../../design-system";
import {
    findClosestSwatchIndex,
    findSwatchIndex,
    getSwatch,
    isDarkMode,
    palette,
    Palette,
    PaletteType,
    swatchByContrast,
} from "./palette";
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
    accentBaseColor,
    accentForegroundActiveDelta,
    accentForegroundHoverDelta,
    accentForegroundRestDelta,
    backgroundColor,
} from "../design-system";

function accentForegroundAlgorithm(
    contrastTarget: number
): DesignSystemResolver<SwatchFamily> {
    return (designSystem: DesignSystem): SwatchFamily => {
        const accentPalette: Palette = palette(PaletteType.accent)(designSystem);
        const paletteLength: number = accentPalette.length;
        const maxIndex: number = paletteLength - 1;

        const accent: Swatch = accentBaseColor(designSystem);
        const accentIndex: number = findClosestSwatchIndex(PaletteType.accent, accent)(
            designSystem
        );

        const stateDeltas: any = {
            rest: accentForegroundRestDelta(designSystem),
            hover: accentForegroundHoverDelta(designSystem),
            active: accentForegroundActiveDelta(designSystem),
        };

        const direction: 1 | -1 = isDarkMode(designSystem) ? -1 : 1;

        const startIndex: number =
            accentIndex +
            (direction === 1
                ? Math.min(stateDeltas.rest, stateDeltas.hover)
                : Math.max(direction * stateDeltas.rest, direction * stateDeltas.hover));

        const accessibleSwatch: Swatch = swatchByContrast(
            backgroundColor // Compare swatches against the background
        )(
            palette(PaletteType.accent) // Use the accent palette
        )(
            () => startIndex // Begin searching based on accent index, direction, and deltas
        )(
            () => direction // Search direction based on light/dark mode
        )(
            (swatchContrast: number) => swatchContrast >= contrastTarget // A swatch is only valid if the contrast is greater than indicated
        )(
            designSystem // Pass the design system
        );

        // One of these will be rest, the other will be hover. Depends on the offsets and the direction.
        const accessibleIndex1: number = findSwatchIndex(
            PaletteType.accent,
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
            rest: getSwatch(restIndex, accentPalette),
            hover: getSwatch(hoverIndex, accentPalette),
            active: getSwatch(activeIndex, accentPalette),
        };
    };
}

export const accentForeground: SwatchFamilyResolver = colorRecipeFactory(
    accentForegroundAlgorithm(4.5)
);
export const accentForegroundLarge: SwatchFamilyResolver = colorRecipeFactory(
    accentForegroundAlgorithm(3)
);

export const accentForegroundRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    accentForeground
);
export const accentForegroundHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    accentForeground
);
export const accentForegroundActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    accentForeground
);

export const accentForegroundLargeRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    accentForegroundLarge
);
export const accentForegroundLargeHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    accentForegroundLarge
);
export const accentForegroundLargeActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    accentForegroundLarge
);
