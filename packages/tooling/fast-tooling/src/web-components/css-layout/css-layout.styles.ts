import { css } from "@microsoft/fast-element";

const radioBackgroundColor = "#222";
const activeRadioBackgroundColor = "#333";
const numberfieldBorderColor = "#333";
const activeRadioBorderColor = "#282828";
const borderRadius = "3px";

export const cssLayoutStyles = css`
    :host {
        display: flex;
        flex-direction: column;
        margin-bottom: 10px;
    }

    label {
        display: block;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        margin: 10px 0 5px;
    }

    .flexbox-controls {
        display: none;
    }

    .flexbox-controls.active {
        display: block;
    }

    .control-region {
        display: flex;
        flex-direction: column;
    }

    .control-region.row {
        flex-direction: row;
    }

    .css-row-gap,
    .css-column-gap {
        vertical-align: middle;
    }

    .control-numberfield-region {
        display: flex;
        column-gap: 12px;
    }

    .control-numberfield-region .icon {
        position: relative;
        padding: 5px;
        width: 12px;
        height: 12px;
    }

    .control-numberfield-region input {
        background: transparent;
        outline: none;
        border: none;
        width: 40px;
        border-left: 1px solid ${numberfieldBorderColor};
        color: #fff;
    }

    .control-numberfield-region input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    .numberfield-item {
        display: flex;
        border: 1px solid ${numberfieldBorderColor};
        border-radius: ${borderRadius};
    }

    .control-radio-region {
        display: flex;
        column-gap: 2px;
    }

    .control-radio-region > div {
        background: ${radioBackgroundColor};
        border-radius: ${borderRadius};
        border: 3px solid #1b1b1b;
        position: relative;
        height: 24px;
        max-width: 24px;
    }

    .control-radio-region .active {
        background: ${activeRadioBackgroundColor};
        border-color: ${activeRadioBorderColor};
    }

    .control-radio-region > div > input {
        width: 24px;
        height: 24px;
        margin: 0;
        opacity: 0;
    }

    svg {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    svg,
    path,
    rect {
        pointer-events: none;
    }
`;
