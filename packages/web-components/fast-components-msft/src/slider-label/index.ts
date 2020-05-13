import { customElement } from "@microsoft/fast-element";
import { SliderLabel, SliderLabelTemplate as template } from "@microsoft/fast-components";
import { SliderLabelStyles as styles } from "./slider-label.styles";

@customElement({
    name: "fast-slider-label",
    template,
    styles,
})
export class FASTSliderLabel extends SliderLabel {}
