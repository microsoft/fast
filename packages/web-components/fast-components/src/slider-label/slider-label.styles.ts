import { css } from "@microsoft/fast-element";
import { display, forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    heightNumber,
    neutralForegroundRestBehavior,
    neutralOutlineRestBehavior,
} from "../styles/index";

export const SliderLabelStyles = css`
    ${display("block")} :host {
        color: ${neutralForegroundRestBehavior.var};
        fill: ${neutralForegroundRestBehavior.var};
    }
    .root {
        position: absolute;
        display: grid;
    }
    :host(.horizontal) {
        align-self: start;
        grid-row: 2;
        margin-top: -2px;
        height: calc((${heightNumber} / 2 + var(--design-unit)) * 1px);
        width: auto;
    }
    :host(.vertical) {
        justify-self: start;
        grid-column: 2;
        margin-left: 2px;
        height: auto;
        width: calc((${heightNumber} / 2 + var(--design-unit)) * 1px);
    }
    .container {
        display: grid;
        justify-self: center;
    }
    :host(.horizontal) .container {
        grid-template-rows: auto auto;
        grid-template-columns: 0;
    }
    :host(.vertical) .container {
        grid-template-columns: auto auto;
        grid-template-rows: 0;
        min-width: calc(var(--thumb-size) * 1px);
        height: calc(var(--thumb-size) * 1px);
    }
    .label {
        justify-self: center;
        align-self: center;
        white-space: nowrap;
        justify-self: center;
        max-width: 30px;
        margin: 2px 0;
    }
    .mark {
        width: calc((var(--design-unit) / 4) * 1px);
        height: calc(${heightNumber} * 0.25 * 1px);
        background: ${neutralOutlineRestBehavior.var};
        justify-self: center;
    }
    :host(.vertical) .mark {
        transform: rotate(90deg);
        align-self: center;
    }
    :host(.vertical) .label {
        margin-left: calc((var(--design-unit) / 2) * 2px);
        align-self: center;
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
