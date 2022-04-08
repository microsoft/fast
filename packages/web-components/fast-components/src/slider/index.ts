import {
    Slider,
    SliderOptions,
    sliderTemplate as template,
} from "@microsoft/fast-foundation";
import { sliderStyles as styles } from "./slider.styles.js";

/**
 * A function that returns a {@link @microsoft/fast-foundation#Slider} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#sliderTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-slider>`
 */
export const fastSlider = Slider.compose<SliderOptions>({
    baseName: "slider",
    template,
    styles,
    thumb: /* html */ `
        <div class="thumb-cursor"></div>
    `,
});

/**
 * Base class for Slider
 * @public
 */
export { Slider };

export { styles as sliderStyles };
