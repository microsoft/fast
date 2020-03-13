import { css } from "@microsoft/fast-element";

export const SliderStyles = css`
    :host([hidden]) {
        display: none;
    }
    .slider {
        position: relative;
        width: 400px;
        height: 30px;
        margin: 10px 2px;
        box-sizing: border-box;
        border-radius: calc(var(--corner-radius) * 1px);
        background: white;
        outline: none;
        cursor: pointer;
    }
    .background-track {
        background: #bebebe;
        position: absolute;
        right: -2px;
        left: -2px;
        align-self: start;
        margin-top: 6px;
        height: 4px;
    }
    .layout-region {
        position: relative;
        margin: 0 8px;
        display: grid;
        grid-template-rows: 16px 1fr;
    }
    .track {
    }
    .thumb {
        position: absolute;
        right: 50%;
        height: 16px;
        width: 16px;
        border: none;
        background: #2b2b2b;
        border-radius: 50%;
        transition: "all 0.2s ease";
        "&:hover": {
            background: red;
        }
        "&:active": {
            background: green;
        }
    }
`;
