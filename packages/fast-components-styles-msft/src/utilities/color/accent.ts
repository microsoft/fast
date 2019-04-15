import { DesignSystem } from "../../design-system";
import { Palette, palette, PaletteType } from "./palette";
import { accent } from "./color-constants";
import { findClosestSwatchIndex, isDarkMode } from "./palette";
import { contrast, Swatch, SwatchResolver } from "./common";
import { clamp, inRange } from "lodash-es";

/**
 * Returns a swatch from the middle of the accent palette
 */
export const accentSwatch: SwatchResolver = (designSystem: DesignSystem): Swatch => {
    const accentPalette: Palette | null = palette(PaletteType.accent)(designSystem);

    return accentPalette === null
        ? accent
        : accentPalette[Math.floor(accentPalette.length / 2)];
};

/**
 * Returns indexes for accent UI states that are accessible against an input reference color.
 */
export function findAccessibleAccentSwatchIndexs(
    designSystem: DesignSystem,
    contrastTarget: number,
    referenceColor: Swatch,
    stateDeltas: {
        rest: number;
        hover: number;
        active: number;
    }
): {
    rest: number;
    hover: number;
    active: number;
} {
    const accentColor: Swatch = accentSwatch(designSystem);
    const accentPalette: Palette = palette(PaletteType.accent)(designSystem);
    const darkTheme: boolean = isDarkMode(designSystem);
    const stateDirection: 1 | -1 = darkTheme ? 1 : -1;
    const accessibleTextDirection: 1 | -1 = darkTheme ? -1 : 1;
    const maxIndex: number = accentPalette.length - 1;
    let accessibleAccentIndex: number = findClosestSwatchIndex(
        PaletteType.accent,
        accentColor
    )(designSystem);

    while (
        contrast(
            accentPalette[accessibleAccentIndex + stateDirection * stateDeltas.hover],
            referenceColor
        ) < contrastTarget &&
        inRange(accessibleAccentIndex + accessibleTextDirection, 0, maxIndex)
    ) {
        accessibleAccentIndex += accessibleTextDirection;
    }

    return {
        rest: clamp(
            accessibleAccentIndex + stateDirection * stateDeltas.rest,
            0,
            maxIndex
        ),
        hover: clamp(
            accessibleAccentIndex + stateDirection * stateDeltas.hover,
            0,
            maxIndex
        ),
        active: clamp(
            accessibleAccentIndex + stateDirection * stateDeltas.active,
            0,
            maxIndex
        ),
    };
}
