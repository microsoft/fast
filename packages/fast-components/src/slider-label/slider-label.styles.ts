import { css } from "@microsoft/fast-element";

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
    .slider-label-container {
        display: grid;
        justify-self: center;
    }
    .slider-label-horizontal .slider-label-container {
        grid-template-rows: auto auto;
        grid-template-columns: 0;
    }
    .slider-label-vertical .slider-label-container {
        grid-template-columns: auto auto;
        grid-template-rows: 0;
    }
    .label {
        width: 18px;
        justify-self: center;
    }
    .label-positioner {
        justify-self: center;
        width: 18px;
        margin: 2px 0;
    }
    .mark {
        width: 2px;
        height: calc(var(--half-thumb-size) * 1px);
        background: var(--neutral-outline-rest);
        justify-self: center;
    }
`;
