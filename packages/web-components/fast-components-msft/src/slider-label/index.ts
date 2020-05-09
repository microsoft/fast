import { customElement } from "@microsoft/fast-element";
import {
    SliderLabel,
    SliderLabelTemplate as template,
} from "@microsoft/fast-components/dist/slider-label";
import { SliderLabelStyles as styles } from "./slider-label.styles";

@customElement({
    name: "msft-slider-label",
    template,
    styles,
})
export class MSFTSliderLabel extends SliderLabel {}
