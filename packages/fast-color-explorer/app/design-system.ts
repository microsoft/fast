import {
    DesignSystem,
    DesignSystemDefaults,
    Palette,
} from "@microsoft/fast-components-styles-msft";
import { createColorPalette } from "@microsoft/fast-components-styles-msft";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import { defaultAccentColor, defaultNeutralColor } from "./colors";

const neutralPalette: Palette = createColorPalette(parseColorHexRGB(
    defaultNeutralColor
) as ColorRGBA64);

export type ColorsDesignSystem = DesignSystem;
export const colorsDesignSystem: ColorsDesignSystem = Object.assign(
    {},
    DesignSystemDefaults,
    {
        backgroundColor: neutralPalette[neutralPalette.length - 1],
        neutralPalette,
        accentPalette: createColorPalette(parseColorHexRGB(
            defaultAccentColor
        ) as ColorRGBA64),
        accentBaseColor: defaultAccentColor,
    }
);
