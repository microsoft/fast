import {
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import { createColorPalette } from "@microsoft/fast-components-styles-msft";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import { AccentColors } from "./colors";

export type ColorsDesignSystem = DesignSystem;
export const colorsDesignSystem: ColorsDesignSystem = Object.assign(
    {},
    DesignSystemDefaults,
    {
        neutralPalette: createColorPalette(new ColorRGBA64(0.5, 0.5, 0.5, 1)),
        accentPalette: createColorPalette(parseColorHexRGB(
            AccentColors.blue
        ) as ColorRGBA64),
        accentBaseColor: AccentColors.blue,
    }
);
