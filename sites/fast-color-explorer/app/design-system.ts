import {
    FASTDesignSystem,
    fastDesignSystemDefaults,
    StandardLuminance,
} from "@microsoft/fast-components";
import { ColorRGBA64, parseColor, parseColorHexRGB } from "@microsoft/fast-colors";
import { PaletteRGB, SwatchRGB } from "@microsoft/fast-components";
import { defaultAccentColor, defaultNeutralColor } from "./colors";

const neutralPalette = PaletteRGB.create(
    SwatchRGB.create(0.5, 0.5, 0.5)
).swatches.map((x: SwatchRGB) => x.toColorString());
const accentColor = parseColor(defaultAccentColor)!;
const accentPalette = PaletteRGB.create(
    SwatchRGB.create(accentColor.r, accentColor.g, accentColor.b)
).swatches.map((x: SwatchRGB) => x.toColorString());

/**
 * Bridge recipes between React and web component implementations.
 *
 * @param recipe
 * @returns
 */
export const bridge = (recipe: any): any => {
    return (d?: FASTDesignSystem): any => recipe(d || fastDesignSystemDefaults);
};

export type ColorsDesignSystem = FASTDesignSystem & {
    // Bring these back from the old DesignSystem for use with React components
    contrast: number;
    neutralForegroundDarkIndex: number;
    neutralForegroundLightIndex: number;

    neutralPaletteRGB: PaletteRGB;
    accentPaletteRGB: PaletteRGB;
};

export const swatchToSwatchRGB = (swatch: string): SwatchRGB => {
    const color = parseColorHexRGB(swatch) as ColorRGBA64;
    return SwatchRGB.create(color.r, color.g, color.b);
};

export const colorsDesignSystem: ColorsDesignSystem = Object.assign(
    {},
    fastDesignSystemDefaults,
    {
        // These three are only for legacy React component support
        contrast: 0,
        neutralForegroundDarkIndex: 0,
        neutralForegroundLightIndex: 0,

        baseHeightMultiplier: 8,
        baseLayerLuminance: StandardLuminance.DarkMode,
        neutralPalette,
        accentPalette,
        accentBaseColor: defaultAccentColor,

        neutralPaletteRGB: PaletteRGB.create(swatchToSwatchRGB(defaultNeutralColor)),
        accentPaletteRGB: PaletteRGB.create(swatchToSwatchRGB(defaultAccentColor)),
    }
);
