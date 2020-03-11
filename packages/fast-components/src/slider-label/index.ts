import { customElement } from "@microsoft/fast-element";
import { SliderLabel } from "./slider-label";
import { SliderLabelTemplate as template } from "./slider-label.template";
import { SliderLabelStyles as styles } from "./slider-label.styles";

@customElement({
    name: "fast-slider-label",
    template,
    styles,
})
export class FASTSliderLabel extends SliderLabel {}
export * from "./slider-label.template";
export * from "./slider-label.styles";
export * from "./slider-label";
