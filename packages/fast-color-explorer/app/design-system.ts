import {
    DesignSystem,
    DesignSystemDefaults,
} from "@microsoft/fast-components-styles-msft";
import {
    accentPaletteConfig,
    createColorPalette,
    neutralPaletteConfig,
} from "@microsoft/fast-components-styles-msft";
import { ColorRGBA64, parseColorHexRGB } from "@microsoft/fast-colors";
import { AccentColors } from "./colors";

/* tslint:disable-next-line */
export interface ColorsDesignSystem extends DesignSystem {}
export const colorsDesignSystem: ColorsDesignSystem = Object.assign(
    {},
    DesignSystemDefaults,
    {
        neutralPalette: createColorPalette(new ColorRGBA64(0.5, 0.5, 0.5, 1)),
        accentPalette: createColorPalette(parseColorHexRGB(
            AccentColors.blue
        ) as ColorRGBA64),
    }
);
