import type { SyntheticViewTemplate } from "@microsoft/fast-element";
import type { Direction, Orientation } from "@microsoft/fast-web-utilities";

/**
 * The selection modes of a {@link @microsoft/fast-foundation#(FASTSlider:class)}.
 * @public
 */
export const SliderMode = {
    singleValue: "single-value",
} as const;

/**
 * The types for the selection mode of the slider
 * @public
 */
export type SliderMode = typeof SliderMode[keyof typeof SliderMode];

/**
 * The configuration structure of {@link @microsoft/fast-foundation#(FASTSlider:class)}.
 * @public
 */
export interface SliderConfiguration {
    max: number;
    min: number;
    orientation?: Orientation;
    direction?: Direction;
    disabled?: boolean;
}

/**
 * Slider configuration options
 * @public
 */
export type SliderOptions = {
    thumb: string | SyntheticViewTemplate;
};
