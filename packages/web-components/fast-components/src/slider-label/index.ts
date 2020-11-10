import { customElement } from "@microsoft/fast-element";
import { SliderLabel, SliderLabelTemplate as template } from "@microsoft/fast-foundation";
import {
    SliderLabelStyles as styles,
    horizontalSliderStyles,
    verticalSliderStyles,
} from "./slider-label.styles";
import { Orientation } from "@microsoft/fast-web-utilities";

/**
 * The FAST Slider Label Custom Element. Implements {@link @microsoft/fast-foundation#SliderLabel},
 * {@link @microsoft/fast-foundation#SliderLabelTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-slider-label\>
 */
@customElement({
    name: "fast-slider-label",
    template,
    styles,
})
export class FASTSliderLabel extends SliderLabel {
    protected sliderOrientationChanged(): void {
        if (this.sliderOrientation === Orientation.horizontal) {
            this.$fastController.addStyles(horizontalSliderStyles);
            this.$fastController.removeStyles(verticalSliderStyles);
        } else {
            this.$fastController.addStyles(verticalSliderStyles);
            this.$fastController.removeStyles(horizontalSliderStyles);
        }
    }
}

/**
 * Styles for SliderLabel
 * @public
 */
export const SliderLabelStyles = styles;
