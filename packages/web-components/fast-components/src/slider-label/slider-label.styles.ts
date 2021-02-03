import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import { display, forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    heightNumber,
    neutralForegroundRestBehavior,
    neutralOutlineRestBehavior,
} from "../styles/index";

/**
 * Styles for the {@link @microsoft/fast-components#FASTSliderLabel|FASTSliderLabel} component.
 *
 * @public
 * @remarks Horizontal orientation.
 */
export const horizontalSliderStyles: ElementStyles = css`
    :host {
        align-self: start;
        grid-row: 2;
        margin-top: -2px;
        height: calc((${heightNumber} / 2 + var(--design-unit)) * 1px);
        width: auto;
    }
    .container {
        grid-template-rows: auto auto;
        grid-template-columns: 0;
    }
    .label {
        margin: 2px 0;
    }
`;

/**
 * Styles for the {@link @microsoft/fast-components#FASTSliderLabel|FASTSliderLabel} component.
 *
 * @public
 * @remarks Vertical orientation.
 */
export const verticalSliderStyles: ElementStyles = css`
    :host {
        justify-self: start;
        grid-column: 2;
        margin-left: 2px;
        height: auto;
        width: calc((${heightNumber} / 2 + var(--design-unit)) * 1px);
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
    .label {
        margin-left: calc((var(--design-unit) / 2) * 3px);
        align-self: center;
    }
`;

/**
 * Styles for the {@link @microsoft/fast-components#FASTSliderLabel|FASTSliderLabel} component.
 *
 * @public
 */
export const SliderLabelStyles: ElementStyles = css`
    ${display("block")} :host {
        font-family: var(--body-font);
        color: ${neutralForegroundRestBehavior.var};
        fill: currentcolor;
    }
    .root {
        position: absolute;
        display: grid;
    }
    .container {
        display: grid;
        justify-self: center;
    }
    .label {
        justify-self: center;
        align-self: center;
        white-space: nowrap;
        max-width: 30px;
    }
    .mark {
        width: calc((var(--design-unit) / 4) * 1px);
        height: calc(${heightNumber} * 0.25 * 1px);
        background: ${neutralOutlineRestBehavior.var};
        justify-self: center;
    }
    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }
`.withBehaviors(
    neutralForegroundRestBehavior,
    neutralOutlineRestBehavior,
    forcedColorsStylesheetBehavior(
        css`
            .mark {
                forced-color-adjust: none;
                background: ${SystemColors.FieldText};
            }
            :host(.disabled) {
                forced-color-adjust: none;
                opacity: 1;
            }
            :host(.disabled) .label {
                color: ${SystemColors.GrayText};
            }
            :host(.disabled) .mark {
                background: ${SystemColors.GrayText};
            }
        `
    )
);
