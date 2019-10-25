import {
    DesignSystem,
    DesignSystemDefaults,
    Palette,
} from "@microsoft/fast-components-styles-msft";
import { createColorPalette } from "@microsoft/fast-components-styles-msft";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import { defaultAccentColor, defaultNeutralColor } from "./colors";
import { StandardLuminance } from "@microsoft/fast-components-styles-msft/dist/utilities/color/neutral-layer";

const neutralPalette: Palette = createColorPalette(parseColorHexRGB(
    defaultNeutralColor
) as ColorRGBA64);

export type ColorsDesignSystem = DesignSystem;
export const colorsDesignSystem: ColorsDesignSystem = Object.assign(
    {},
    DesignSystemDefaults,
    {
        baseLayerLuminance: StandardLuminance.DarkMode,
        neutralPalette,
        accentPalette: createColorPalette(parseColorHexRGB(
            defaultAccentColor
        ) as ColorRGBA64),
        accentBaseColor: defaultAccentColor,
    }
);
