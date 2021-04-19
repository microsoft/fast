import {
    SliderLabel as FoundationSliderLabel,
    SliderLabelTemplate as template,
} from "@microsoft/fast-foundation";
import { Orientation } from "@microsoft/fast-web-utilities";
import {
    horizontalSliderStyles,
    SliderLabelStyles as styles,
    verticalSliderStyles,
} from "./slider-label.styles";

/**
 * @internal
 */
export class SliderLabel extends FoundationSliderLabel {
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
 * The FAST Slider Label Custom Element. Implements {@link @microsoft/fast-foundation#(SliderLabel:class)},
 * {@link @microsoft/fast-foundation#SliderLabelTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-slider-label\>
 */

export const fastSliderLabel = SliderLabel.compose({
    baseName: "slider-label",
    template,
    styles,
});

/**
 * Styles for SliderLabel
 * @public
 */
export const SliderLabelStyles = styles;
