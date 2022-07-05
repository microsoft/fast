import { parseColorHexRGB } from "@microsoft/fast-colors";
import { Palette, Swatch, SwatchRGB } from "../color/index.js";
import { PaletteRGB } from "../color/palette-rgb.js";
import { create, createNonCss } from "./create.js";

/** @public */
export const neutralBaseColor = create<string>("neutral-base-color").withDefault(
    "#808080"
);

/** @public */
export const neutralBaseSwatch = createNonCss<Swatch>(
    "neutral-base-swatch"
).withDefault((element: HTMLElement) =>
    SwatchRGB.from(parseColorHexRGB(neutralBaseColor.getValueFor(element))!)
);

/** @public */
export const neutralPalette = createNonCss<Palette>(
    "neutral-palette"
).withDefault((element: HTMLElement) =>
    PaletteRGB.from(neutralBaseSwatch.getValueFor(element) as SwatchRGB)
);

/** @public */
export const accentBaseColor = create<string>("accent-base-color").withDefault("#0078D4");

/** @public */
export const accentBaseSwatch = createNonCss<Swatch>(
    "accent-base-swatch"
).withDefault((element: HTMLElement) =>
    SwatchRGB.from(parseColorHexRGB(accentBaseColor.getValueFor(element))!)
);

/** @public */
export const accentPalette = createNonCss<Palette>(
    "accent-palette"
).withDefault((element: HTMLElement) =>
    PaletteRGB.from(accentBaseSwatch.getValueFor(element) as SwatchRGB)
);
