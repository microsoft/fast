import {
    DesignSystem,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";
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
    StatefulSwatch,
    StatefulSwatchToColorRecipeFactory,
    SwatchStates,
} from "./common";
import { clamp } from "lodash-es";

const neutralOutlineAlgorithm: (designSystem: DesignSystem) => StatefulSwatch = (
    designSystem: DesignSystem
): StatefulSwatch => {
    const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
    const backgroundIndex: number = findClosestSwatchIndex(
        PaletteType.neutral,
        designSystem.backgroundColor
    )(designSystem);
    const direction: 1 | -1 = isDarkTheme(designSystem) ? -1 : 1;

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

export function neutralOutline(designSystem: DesignSystem): StatefulSwatch;
export function neutralOutline(
    backgroundResolver: (designSystem: DesignSystem) => Swatch
): (designSystem: DesignSystem) => StatefulSwatch;
export function neutralOutline(arg: any): any {
    if (typeof arg === "function") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): StatefulSwatch => {
                return neutralOutlineAlgorithm(
                    Object.assign({}, designSystem, {
                        backgroundColor: arg(designSystem),
                    })
                );
            }
        );
    } else {
        return neutralOutlineAlgorithm(withDesignSystemDefaults(arg));
    }
}

export const neutralOutlineRest: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.rest,
    neutralOutline
);
export const neutralOutlineHover: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.hover,
    neutralOutline
);
export const neutralOutlineActive: ColorRecipe = StatefulSwatchToColorRecipeFactory(
    SwatchStates.active,
    neutralOutline
);
