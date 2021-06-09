import { inRange } from "lodash-es";
import {
    accentBaseColor,
    accentFillActiveDelta,
    accentFillFocusDelta,
    accentFillHoverDelta,
    accentFillSelectedDelta,
    accentPalette,
    DesignSystemResolver,
    FASTDesignSystem,
    neutralFillActiveDelta,
    neutralFillHoverDelta,
    neutralFillRestDelta,
} from "../fast-design-system";
import { accentForegroundCut_DEPRECATED } from "./accent-foreground-cut";
import {
    colorRecipeFactory,
    contrast,
    designSystemResolverMax,
    FillSwatchFamily,
    Swatch,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
} from "./common";
import {
    findClosestBackgroundIndex,
    findClosestSwatchIndex,
    getSwatch,
    isDarkMode,
    Palette,
} from "./palette";

const neutralFillThreshold: DesignSystemResolver<number> = designSystemResolverMax(
    neutralFillRestDelta,
    neutralFillHoverDelta,
    neutralFillActiveDelta
);

function accentFillAlgorithm(
    contrastTarget: number
): DesignSystemResolver<FillSwatchFamily> {
    return (designSystem: FASTDesignSystem): FillSwatchFamily => {
        const palette: Palette = accentPalette(designSystem);
        const paletteLength: number = palette.length;
        const accent: Swatch = accentBaseColor(designSystem);
        const textColor: Swatch = accentForegroundCut_DEPRECATED(
            Object.assign({}, designSystem, {
                backgroundColor: accent,
            })
        );
        const hoverDelta: number = accentFillHoverDelta(designSystem);

        // Use the hover direction that matches the neutral fill recipe.
        const backgroundIndex: number = findClosestBackgroundIndex(designSystem);
        const swapThreshold: number = neutralFillThreshold(designSystem);
        const direction: 1 | -1 = backgroundIndex >= swapThreshold ? -1 : 1;
        const maxIndex: number = paletteLength - 1;
        const accentIndex: number = findClosestSwatchIndex(
            accentPalette,
            accent
        )(designSystem);

        let accessibleOffset: number = 0;

        // Move the accent color the direction of hover, while maintaining the foreground color.
        while (
            accessibleOffset < direction * hoverDelta &&
            inRange(accentIndex + accessibleOffset + direction, 0, paletteLength) &&
            contrast(palette[accentIndex + accessibleOffset + direction], textColor) >=
                contrastTarget &&
            inRange(accentIndex + accessibleOffset + direction + direction, 0, maxIndex)
        ) {
            accessibleOffset += direction;
        }

        const hoverIndex: number = accentIndex + accessibleOffset;
        const restIndex: number = hoverIndex + direction * -1 * hoverDelta;
        const activeIndex: number =
            restIndex + direction * accentFillActiveDelta(designSystem);
        const focusIndex: number =
            restIndex + direction * accentFillFocusDelta(designSystem);

        return {
            rest: getSwatch(restIndex, palette),
            hover: getSwatch(hoverIndex, palette),
            active: getSwatch(activeIndex, palette),
            focus: getSwatch(focusIndex, palette),
            selected: getSwatch(
                restIndex +
                    (isDarkMode(designSystem)
                        ? accentFillSelectedDelta(designSystem) * -1
                        : accentFillSelectedDelta(designSystem)),
                palette
            ),
        };
    };
}
/**
 * @internal
 */
export const accentFill_DEPRECATED: SwatchFamilyResolver<FillSwatchFamily> = colorRecipeFactory(
    accentFillAlgorithm(4.5)
);

/**
 * @internal
 */
export const accentFillLarge_DEPRECATED: SwatchFamilyResolver<FillSwatchFamily> = colorRecipeFactory(
    accentFillAlgorithm(3)
);

/**
 * @internal
 */
export const accentFillRest_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.rest, accentFill_DEPRECATED);
/**
 * @internal
 */
export const accentFillHover_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.hover, accentFill_DEPRECATED);
/**
 * @internal
 */
export const accentFillActive_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.active, accentFill_DEPRECATED);
/**
 * @internal
 */
export const accentFillFocus_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.focus, accentFill_DEPRECATED);
/**
 * @internal
 */
export const accentFillSelected_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.selected, accentFill_DEPRECATED);
/**
 * @internal
 */
export const accentFillLargeRest_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.rest, accentFillLarge_DEPRECATED);
/**
 * @internal
 */
export const accentFillLargeHover_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.hover, accentFillLarge_DEPRECATED);
/**
 * @internal
 */
export const accentFillLargeActive_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.active, accentFillLarge_DEPRECATED);
/**
 * @internal
 */
export const accentFillLargeFocus_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.focus, accentFillLarge_DEPRECATED);
/**
 * @internal
 */
export const accentFillLargeSelected_DEPRECATED: SwatchRecipe = swatchFamilyToSwatchRecipeFactory<
    FillSwatchFamily
>(SwatchFamilyType.selected, accentFillLarge_DEPRECATED);
