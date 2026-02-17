import { css } from "@microsoft/fast-element";
import { SliderOrientation } from "../../slider/slider.options.js";
import { FASTSliderLabel } from "../slider-label.js";
import { sliderLabelTemplate } from "../slider-label.template.js";

const styles = css`
    :host {
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        fill: currentcolor;
    }

    .container {
        position: absolute;
        display: grid;
        justify-self: center;
    }

    .content {
        justify-self: center;
        align-self: center;
        white-space: nowrap;
        max-width: 30px;
    }

    .mark {
        width: calc((var(--design-unit) / 4) * 1px);
        height: calc(var(--height-number) * 0.25 * 1px);
        background: var(--neutral-stroke-rest);
        justify-self: center;
    }

    :host([aria-disabled="true"]) {
        opacity: var(--disabled-opacity);
    }
`;

const horizontalSliderLabelStyles = css`
    :host {
        align-self: start;
        grid-row: 2;
        margin-top: -2px;
        height: calc((var(--height-number) / 2 + var(--design-unit)) * 1px);
        width: auto;
    }

    .container {
        grid-template-rows: auto auto;
        grid-template-columns: 0;
    }

    .content {
        margin: 2px 0;
    }
`;

const verticalSliderLabelStyles = css`
    :host {
        justify-self: start;
        grid-column: 2;
        margin-left: 2px;
        height: auto;
        width: calc((var(--height-number) / 2 + var(--design-unit)) * 1px);
    }

    .container {
        grid-template-columns: auto auto;
        grid-template-rows: 0;
        min-width: calc(var(--thumb-size) * 1px);
        height: calc(var(--thumb-size) * 1px);
    }

    .mark {
        transform: rotate(90deg);
        align-self: center;
    }

    .content {
        margin-left: calc((var(--design-unit) / 2) * 3px);
        align-self: center;
    }
`;

class SliderLabel extends FASTSliderLabel {
    protected orientationChanged(
        prev?: SliderOrientation,
        next?: SliderOrientation
    ): void {
        switch (next) {
            case SliderOrientation.horizontal: {
                this.$fastController.addStyles(horizontalSliderLabelStyles);
                this.$fastController.removeStyles(verticalSliderLabelStyles);
                break;
            }

            case SliderOrientation.vertical: {
                this.$fastController.addStyles(verticalSliderLabelStyles);
                this.$fastController.removeStyles(horizontalSliderLabelStyles);
            }
        }
    }
}

SliderLabel.define({
    name: "fast-slider-label",
    template: sliderLabelTemplate(),
    styles,
});
