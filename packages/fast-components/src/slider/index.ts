import { customElement } from "@microsoft/fast-element";
import { Slider } from "./slider";
import { SliderTemplate as template } from "./slider.template";
import { SliderStyles as styles } from "./slider.styles";
import { Direction } from "@microsoft/fast-web-utilities";
import { designSystemConsumer } from "../design-system-consumer";
import {
    neutralForegroundActive,
    neutralForegroundHover,
    neutralForegroundRest,
    neutralOutlineRest,
} from "../styles/recipes";

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
}

@customElement({
    name: "fast-slider",
    template,
    styles,
})
@designSystemConsumer({
    recipes: [
        neutralForegroundActive,
        neutralForegroundHover,
        neutralForegroundRest,
        neutralOutlineRest,
    ],
})
export class FASTSlider extends Slider {}
export * from "./slider.template";
export * from "./slider.styles";
export * from "./slider";
