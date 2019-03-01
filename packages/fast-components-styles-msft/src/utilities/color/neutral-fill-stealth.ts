import {
    DesignSystem,
    DesignSystemResolver,
    ensureDesignSystemDefaults,
    withDesignSystemDefaults,
} from "../../design-system";
import { memoize } from "lodash-es";
import {
    findClosestSwatchIndex,
    getPaletteIndex,
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
import {
    neutralFillDeltaActive,
    neutralFillDeltaHover,
    neutralFillDeltaRest,
} from "./neutral-fill";

export const neutralFillStealthDeltaRest: number = 0;
export const neutralFillStealthDeltaHover: number = 3;
export const neutralFillStealthDeltaActive: number = 2;
export const neutralFillStealthDeltaSelected: number = 12;

/**
 * The minimum offset before which we can switch fill directions
 */
const swapThreshold: number = Math.max(
    neutralFillDeltaRest,
    neutralFillDeltaHover,
    neutralFillDeltaActive,
    neutralFillStealthDeltaRest,
    neutralFillStealthDeltaHover,
    neutralFillStealthDeltaActive
);

/**
 * Algorithm for determining stealth fill colors
 */
const neutralFillStealthAlgorithm: DesignSystemResolver<FillSwatch> = memoize(
    (designSystem: DesignSystem): FillSwatch => {
        const neutralPalette: Palette = palette(PaletteType.neutral)(designSystem);
        const backgroundIndex: number = findClosestSwatchIndex(
            PaletteType.neutral,
            designSystem.backgroundColor
        )(designSystem);
        const direction: number = backgroundIndex >= swapThreshold ? -1 : 1;
        const restIndex: number =
            backgroundIndex + direction * neutralFillStealthDeltaRest;

        return {
            rest: getPaletteIndex(restIndex, neutralPalette),
            hover: getPaletteIndex(
                backgroundIndex + direction * neutralFillStealthDeltaHover,
                neutralPalette
            ),
            active: getPaletteIndex(
                backgroundIndex + direction * neutralFillStealthDeltaActive,
                neutralPalette
            ),
            selected: getPaletteIndex(
                restIndex +
                    (isDarkTheme(designSystem)
                        ? neutralFillStealthDeltaSelected * -1
                        : neutralFillStealthDeltaSelected),
                neutralPalette
            ),
        };
    },
    (designSystem: DesignSystem): string => {
        return designSystem.backgroundColor;
    }
);

export function neutralFillStealth(designSystem: DesignSystem): FillSwatch;
export function neutralFillStealth(
    backgroundResolver: (designSystem: DesignSystem) => Swatch
): (designSystem: DesignSystem) => FillSwatch;
export function neutralFillStealth(arg: any): any {
    if (typeof arg === "function") {
        return ensureDesignSystemDefaults(
            (designSystem: DesignSystem): FillSwatch => {
                return neutralFillStealthAlgorithm(
                    Object.assign({}, designSystem, {
                        backgroundColor: arg(designSystem),
                    })
                );
            }
        );
    } else {
        return neutralFillStealthAlgorithm(withDesignSystemDefaults(arg));
    }
}

export const neutralFillStealthRest: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.rest, neutralFillStealth);
export const neutralFillStealthHover: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.hover, neutralFillStealth);
export const neutralFillStealthActive: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.active, neutralFillStealth);
export const neutralFillStealthSelected: ColorRecipe = StatefulSwatchToColorRecipeFactory<
    FillSwatch
>(SwatchStates.selected, neutralFillStealth);
