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

export const accentColors: string[] = [
    "#0078d4",
    "#107c10",
    "#5c2d91",
    "#d83b01",
    "#f2c812",
];

/* tslint:disable-next-line */
export interface ColorsDesignSystem extends DesignSystem {}
export const colorsDesignSystem: ColorsDesignSystem = Object.assign(
    {},
    DesignSystemDefaults,
    {
        neutralPalette: createColorPalette(new ColorRGBA64(0.5, 0.5, 0.5, 1)),
        accentPalette: createColorPalette(parseColorHexRGB("#0078D4") as ColorRGBA64),
    }
);
