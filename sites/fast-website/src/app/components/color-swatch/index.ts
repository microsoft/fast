import { customElement } from "@microsoft/fast-element";
import { ColorSwatch } from "./color-swatch";
import { ColorSwatchTemplate as template } from "./color-swatch.template";
import { ColorSwatchStyles as styles } from "./color-swatch.styles";

export const siteColorSwatch = ColorSwatch.compose({
    baseName: "color-swatch",
    template,
    styles,
});
export * from "./color-swatch.template";
export * from "./color-swatch.styles";
export * from "./color-swatch";
