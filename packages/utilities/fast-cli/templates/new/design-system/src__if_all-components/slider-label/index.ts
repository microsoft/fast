import {
    SliderLabel as FoundationSliderLabel,
    sliderLabelTemplate as template,
} from "@microsoft/fast-foundation";
import { Orientation } from "@microsoft/fast-web-utilities";
import {
    horizontalSliderStyles,
    sliderLabelStyles as styles,
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
 * A function that returns a Slider Label registration for configuring the component with a DesignSystem.
 * Implements Slider Label
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-slider-label\>
 */

export const /* @echo namespace */SliderLabel = SliderLabel.compose({
    baseName: "slider-label",
    template,
    styles,
});

/**
 * Styles for SliderLabel
 * @public
 */
export const sliderLabelStyles = styles;
