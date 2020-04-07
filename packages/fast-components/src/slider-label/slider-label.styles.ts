import { css } from "@microsoft/fast-element";
import { disabledCursor, display } from "../styles";
import { SystemColors } from "../styles/system-colors";
import { heightNumber } from "../styles/size";

export const SliderLabelStyles = css`
    ${display("block")} :host {
        --half-thumb-size: calc(${heightNumber} * 0.25);
    }
    .slider-label {
    }
    :host {
        position: absolute;
        display: grid;
    }
    :host(.slider-label-horizontal) {
        align-self: start;
        grid-row: 2;
        margin-top: -2px;
    }
    :host(.slider-label-vertical) {
        justify-self: start;
        grid-column: 2;
        margin-left: -2px;
    }
    .container {
        display: grid;
        justify-self: center;
    }
    :host(.slider-label-horizontal) .container {
        grid-template-rows: auto auto;
        grid-template-columns: 0;
    }
    :host(.slider-label-vertical) .container {
        grid-template-columns: auto auto;
        grid-template-rows: 0;
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
        width: calc((var(--design-unit) / 2) * 1px);
        height: calc(var(--half-thumb-size) * 1px);
        background: var(--neutral-outline-rest);
        justify-self: center;
    }
    @media (forced-colors: active) {
        .mark {
            forced-color-adjust: none;
            background: ${SystemColors.FieldText};
        }
    }
`;
