import {
    SliderLabel as FoundationSliderLabel,
    sliderLabelTemplate as template,
} from "@microsoft/fast-foundation";
import { Orientation } from "@microsoft/fast-web-utilities";
import {
    horizontalSliderLabelStyles,
    sliderLabelStyles as styles,
    verticalSliderLabelStyles,
} from "./slider-label.styles.js";

/**
 * @internal
 */
export class SliderLabel extends FoundationSliderLabel {
    protected sliderOrientationChanged(): void {
        if (this.sliderOrientation === Orientation.horizontal) {
            this.$fastController.addStyles(horizontalSliderLabelStyles);
            this.$fastController.removeStyles(verticalSliderLabelStyles);
        } else {
            this.$fastController.addStyles(verticalSliderLabelStyles);
            this.$fastController.removeStyles(horizontalSliderLabelStyles);
        }
    }
}

/**
 * A function that returns a {@link @microsoft/fast-foundation#SliderLabel} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#sliderLabelTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: `<fast-slider-label>`
 */

export const fastSliderLabel = SliderLabel.compose({
    baseName: "slider-label",
    baseClass: FoundationSliderLabel,
    template,
    styles,
});

export {
    horizontalSliderLabelStyles,
    styles as sliderLabelStyles,
    verticalSliderLabelStyles,
};
