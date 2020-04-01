import { css } from "@microsoft/fast-element";
import { SystemColors } from "../styles/system-colors";

export const SliderLabelStyles = css`
    :host {
        --half-thumb-size: calc(var(--height-number) * 0.25);
        display: block;
    }
    .slider-label {
        position: absolute;
        display: grid;
    }
    .slider-label-horizontal {
        align-self: start;
        grid-row: 2;
        margin-top: -2px;
    }
    .slider-label-vertical {
        justify-self: start;
        grid-column: 2;
        margin-left: -2px;
    }
    .container {
        display: grid;
        justify-self: center;
    }
    .slider-label-horizontal .container {
        grid-template-rows: auto auto;
        grid-template-columns: 0;
    }
    .slider-label-vertical .container {
        grid-template-columns: auto auto;
        grid-template-rows: 0;
    }
    .label {
        max-width: 18px;
        justify-self: center;
        align-self: center;
        white-space: nowrap;
    }
    .label-positioner {
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
