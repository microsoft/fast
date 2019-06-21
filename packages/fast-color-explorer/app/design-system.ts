import {
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import { createColorPalette } from "@microsoft/fast-components-styles-msft";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import { defaultAccentColor, defaultNeutralColor } from "./colors";

export type ColorsDesignSystem = DesignSystem;
export const colorsDesignSystem: ColorsDesignSystem = Object.assign(
    {},
    DesignSystemDefaults,
    {
        neutralPalette: createColorPalette(parseColorHexRGB(
            defaultNeutralColor
        ) as ColorRGBA64),
        accentPalette: createColorPalette(parseColorHexRGB(
            defaultAccentColor
        ) as ColorRGBA64),
        accentBaseColor: defaultAccentColor,
    }
);
