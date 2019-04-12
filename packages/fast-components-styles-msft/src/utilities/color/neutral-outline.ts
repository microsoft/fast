import { DesignSystem } from "../../design-system";
import {
    findClosestSwatchIndex,
    getSwatch,
    isDarkMode,
    palette,
    Palette,
    PaletteType,
} from "./palette";
import {
    Swatch,
    SwatchFamily,
    SwatchFamilyResolver,
    swatchFamilyToSwatchRecipeFactory,
    SwatchFamilyType,
    SwatchRecipe,
} from "./common";

const neutralOutlineAlgorithm: SwatchFamilyResolver = (
    designSystem: DesignSystem
): SwatchFamily => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
    const backgroundIndex: number = findClosestSwatchIndex(
        PaletteType.neutral,
        designSystem.backgroundColor
    )(designSystem);
    const direction: 1 | -1 = isDarkMode(designSystem) ? -1 : 1;

    return {
        rest: getSwatch(
            backgroundIndex + direction * designSystem.neutralOutlineRestDelta,
            neutralPalette
        ),
        hover: getSwatch(
            backgroundIndex + direction * designSystem.neutralOutlineHoverDelta,
            neutralPalette
        ),
        active: getSwatch(
            backgroundIndex + direction * designSystem.neutralOutlineActiveDelta,
            neutralPalette
        ),
    };
};

export function neutralOutline(designSystem: DesignSystem): SwatchFamily;
export function neutralOutline(
    backgroundResolver: (designSystem: DesignSystem) => Swatch
): (designSystem: DesignSystem) => SwatchFamily;
export function neutralOutline(arg: any): any {
    if (typeof arg === "function") {
        return;
        (designSystem: DesignSystem): SwatchFamily => {
            return neutralOutlineAlgorithm(
                Object.assign({}, designSystem, {
                    backgroundColor: arg(designSystem),
                })
            );
        };
    } else {
        return neutralOutlineAlgorithm(arg);
    }
}

export const neutralOutlineRest: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.rest,
    neutralOutline
);
export const neutralOutlineHover: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.hover,
    neutralOutline
);
export const neutralOutlineActive: SwatchRecipe = swatchFamilyToSwatchRecipeFactory(
    SwatchFamilyType.active,
    neutralOutline
);
