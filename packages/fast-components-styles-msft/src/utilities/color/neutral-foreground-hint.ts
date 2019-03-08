import {
    DesignSystem,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";
import { findSwatchIndex, Palette, palette, PaletteType, Swatch } from "./palette";
import { neutralForegroundRest } from "./neutral-foreground";
import { inRange } from "lodash-es";
import { ColorRecipe, contrast, SwatchResolver } from "./common";

const neutralForegroundHintAlgorithm: (
    designSystem: DesignSystem,
    targetContrast: number
) => Swatch = (designSystem: DesignSystem, targetContrast: number): Swatch => {
    const contrastTarget: number = targetContrast;
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
    const neutralPaletteLength: number = neutralPalette.length;
    const neutralForegroundIndex: number = findSwatchIndex(
        PaletteType.neutral,
        neutralForegroundRest(designSystem)
    )(designSystem);
    const direction: 1 | -1 =
        neutralForegroundIndex <= Math.floor(neutralPaletteLength / 2) ? 1 : -1;
    const background: Swatch = designSystem.backgroundColor;

    let neutralForegroundHintIndex: number =
        direction === 1 ? 0 : neutralPaletteLength - 1;

    while (
        inRange(neutralForegroundHintIndex + direction, 0, neutralPaletteLength) &&
        contrast(background, neutralPalette[neutralForegroundHintIndex + direction]) >
            contrastTarget
    ) {
        neutralForegroundHintIndex = neutralForegroundHintIndex + direction;
    }

    return neutralPalette[neutralForegroundHintIndex];
};

/**
 * Factory to create neutral-foreground-hint functions based on an input contrast target
 */
function neutralForegroundHintFactory(contrastTarget: number): ColorRecipe {
    function neutralForegroundHintInternal(designSystem: DesignSystem): Swatch;
    function neutralForegroundHintInternal(
        backgroundResolver: SwatchResolver
    ): SwatchResolver;
    function neutralForegroundHintInternal(arg: any): any {
        if (typeof arg === "function") {
            return ensureDesignSystemDefaults(
                (designSystem: DesignSystem): Swatch => {
                    return neutralForegroundHintAlgorithm(
                        Object.assign({}, designSystem, {
                            backgroundColor: arg(designSystem),
                        }),
                        contrastTarget
                    );
                }
            );
        } else {
            return neutralForegroundHintAlgorithm(
                withDesignSystemDefaults(arg),
                contrastTarget
            );
        }
    }

    return neutralForegroundHintInternal;
}

/**
 * Hint text for normal sized text, less than 18pt normal weight
 */
export const neutralForegroundHint: ColorRecipe = neutralForegroundHintFactory(4.5);

/**
 * Hint text for large sized text, greater than 18pt or 16pt and bold
 */
export const neutralForegroundHintLarge: ColorRecipe = neutralForegroundHintFactory(3);
