import {
    Slider,
    SliderOptions,
    sliderTemplate as template,
} from "@microsoft/fast-foundation";
import { sliderStyles as styles } from "./slider.styles";

/**
 * The FAST Slider Custom Element. Implements {@link @microsoft/fast-foundation#(Slider:class)},
 * {@link @microsoft/fast-foundation#sliderTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-slider\>
 */
export const fastSlider = Slider.compose<SliderOptions>({
    baseName: "slider",
    template,
    styles,
    thumb: `
        <div class="thumb-cursor"></div>
    `,
});

/**
 * Styles for Slider
 * @public
 */
export const sliderStyles = styles;
