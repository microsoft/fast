import {
    findClosestSwatchIndex,
    isDarkMode,
    Palette,
    PaletteType,
    swatchByContrast,
} from "./palette";
import { Swatch, SwatchResolver } from "./common";
import { DesignSystem, DesignSystemResolver } from "../../design-system";
import { accentPalette, backgroundColor, neutralPalette } from "../design-system";

const targetRatio: number = 3.5;

function neutralFocusIndexResolver(
    referenceColor: string,
    palette: Palette,
    designSystem: DesignSystem
): number {
    return findClosestSwatchIndex(PaletteType.neutral, referenceColor)(designSystem);
}

function neutralFocusDirectionResolver(
    index: number,
    palette: Palette,
    designSystem: DesignSystem
): 1 | -1 {
    return isDarkMode(designSystem) ? -1 : 1;
}

function neutralFocusContrastCondition(contrastRatio: number): boolean {
    return contrastRatio > targetRatio;
}

const neutralFocusAlgorithm: SwatchResolver = swatchByContrast(backgroundColor)(
    neutralPalette
)(neutralFocusIndexResolver)(neutralFocusDirectionResolver)(
    neutralFocusContrastCondition
);

export function neutralFocus(designSystem: DesignSystem): Swatch;
export function neutralFocus(backgroundResolver: SwatchResolver): SwatchResolver;
export function neutralFocus(arg: any): any {
    if (typeof arg === "function") {
        return (designSystem: DesignSystem): Swatch => {
            const bgColor: Swatch = arg(designSystem);
            return neutralFocusAlgorithm(
                Object.assign({}, designSystem, {
                    backgroundColor: bgColor,
                })
            );
        };
    } else {
        return neutralFocusAlgorithm(arg);
    }
}

function neutralFocusInnerAccentIndexResolver(
    accentFillColor: DesignSystemResolver<string>
): (
    referenceColor: string,
    sourcePalette: Palette,
    designSystem: DesignSystem
) => number {
    return (
        referenceColor: string,
        sourcePalette: Palette,
        designSystem: DesignSystem
    ): number => {
        return sourcePalette.indexOf(accentFillColor(designSystem));
    };
}

function neutralFocusInnerAccentDirectionResolver(
    referenceIndex: number,
    palette: string[],
    designSystem: DesignSystem
): 1 | -1 {
    return isDarkMode({
        ...designSystem,
        backgroundColor: palette[referenceIndex],
    })
        ? -1
        : 1;
}

export function neutralFocusInnerAccent(
    accentFillColor: DesignSystemResolver<string>
): DesignSystemResolver<string> {
    return swatchByContrast(neutralFocus)(accentPalette)(
        neutralFocusInnerAccentIndexResolver(accentFillColor)
    )(neutralFocusInnerAccentDirectionResolver)(neutralFocusContrastCondition);
}
