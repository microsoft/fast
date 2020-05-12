import { customElement } from "@microsoft/fast-element";
import { Slider, SliderTemplate as template } from "@microsoft/fast-components";
import { SliderStyles as styles } from "./slider.styles.js";

@customElement({
    name: "msft-slider",
    template,
    styles,
})
export class MSFTSlider extends Slider {}
