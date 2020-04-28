import { customElement } from "@microsoft/fast-element";
import { Direction } from "@microsoft/fast-web-utilities";
import { Slider } from "./slider";
import { SliderTemplate as template } from "./slider.template";
import { SliderStyles as styles } from "./slider.styles";

export enum SliderMode {
    singleValue = "single-value",
}

export enum SliderOrientation {
    horizontal = "horizontal",
    vertical = "vertical",
}

export interface SliderConfiguration {
    max: number;
    min: number;
    orientation?: SliderOrientation;
    direction?: Direction;
    disabled?: boolean;
}

@customElement({
    name: "fast-slider",
    template,
    styles,
})
export class FASTSlider extends Slider {}
export * from "./slider.template";
export * from "./slider.styles";
export * from "./slider";
