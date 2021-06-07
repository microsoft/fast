import {
    createColorPalette,
    FASTDesignSystem,
    fastDesignSystemDefaults,
    Palette,
    StandardLuminance,
} from "@microsoft/fast-components";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import { DesignSystemResolver } from "@microsoft/fast-components/dist/esm/fast-design-system";
import { PaletteRGB } from "@microsoft/fast-components/dist/esm/color-vNext/palette";
import { SwatchRGB } from "@microsoft/fast-components/dist/esm/color-vNext/swatch";
import { defaultAccentColor, defaultNeutralColor } from "./colors";

const neutralPalette: Palette = createColorPalette(
    parseColorHexRGB(defaultNeutralColor) as ColorRGBA64
);

/**
 * Bridge recipes between React and web component implementations.
 *
 * @param recipe
 * @returns
 */
export const bridge = (recipe: DesignSystemResolver<string>): any => {
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
        accentPalette: createColorPalette(
            parseColorHexRGB(defaultAccentColor) as ColorRGBA64
        ),
        accentBaseColor: defaultAccentColor,

        neutralPaletteRGB: PaletteRGB.create(swatchToSwatchRGB(defaultNeutralColor)),
        accentPaletteRGB: PaletteRGB.create(swatchToSwatchRGB(defaultAccentColor)),
    }
);
