import { customElement } from "@microsoft/fast-element";
import { Slider } from "./slider";
import { SliderTemplate as template } from "./slider.template";
import { SliderStyles as styles } from "./slider.styles";

@customElement({
    name: "fast-slider",
    template,
    styles,
})
export class FASTSlider extends Slider {}
export * from "./slider.template";
export * from "./slider.styles";
export * from "./slider";
