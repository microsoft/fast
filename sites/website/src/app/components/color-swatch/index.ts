import { customElement } from "@microsoft/fast-element";
import { ColorSwatch } from "./color-swatch";
import { ColorSwatchTemplate as template } from "./color-swatch.template";
import { ColorSwatchStyles as styles } from "./color-swatch.styles";

@customElement({
    name: "site-color-swatch",
    template,
    styles,
})
export class SiteColorSwatch extends ColorSwatch {}
export * from "./color-swatch.template";
export * from "./color-swatch.styles";
export * from "./color-swatch";
