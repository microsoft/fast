import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";
import { clamp } from "lodash-es";
import {
    findClosestSwatchIndex,
    getSwatch,
    isDarkTheme,
    palette,
    Palette,
    PaletteType,
    Swatch,
} from "./palette";
import {
    ColorRecipe,
    FillSwatch,
    StatefulSwatchToColorRecipeFactory,
    SwatchStates,
} from "./common";

/**
 * Algorithm for determining neutral backplate colors
 */
const neutralFillAlgorithm: DesignSystemResolver<FillSwatch> = (
    designSystem: DesignSystem
): FillSwatch => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
    const backgroundIndex: number = findClosestSwatchIndex(
        PaletteType.neutral,
        designSystem.backgroundColor
    )(designSystem);
    const swapThreshold: number = Math.max(
        designSystem.neutralFillRestDelta,
        designSystem.neutralFillHoverDelta,
        designSystem.neutralFillActiveDelta
    );
    const direction: number = backgroundIndex >= swapThreshold ? -1 : 1;
    const restIndex: number =
        backgroundIndex + direction * designSystem.neutralFillRestDelta;

    return {
        rest: getSwatch(restIndex, neutralPalette),
        hover: getSwatch(
            backgroundIndex + direction * designSystem.neutralFillHoverDelta,
            neutralPalette
        ),
        active: getSwatch(
            backgroundIndex + direction * designSystem.neutralFillActiveDelta,
            neutralPalette
        ),
        selected: getSwatch(
            restIndex +
                (isDarkTheme(designSystem)
                    ? designSystem.neutralFillSelectedDelta * -1
                    : designSystem.neutralFillSelectedDelta),
            neutralPalette
        ),
    };
};

export function neutralFill(designSystem: DesignSystem): FillSwatch;
export function neutralFill(
    backgroundResolver: (designSystem: DesignSystem) => Swatch
): (designSystem: DesignSystem) => FillSwatch;
export function neutralFill(arg: any): any {
    if (typeof arg === "function") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): FillSwatch => {
                return neutralFillAlgorithm(
                    Object.assign({}, designSystem, {
                        backgroundColor: arg(designSystem),
                    })
                );
            }
        );
    } else {
        return neutralFillAlgorithm(withDesignSystemDefaults(arg));
    }
}

export const neutralFillRest: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.rest, neutralFill);
export const neutralFillHover: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.hover, neutralFill);
export const neutralFillActive: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.active, neutralFill);
export const neutralFillSelected: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.selected, neutralFill);
