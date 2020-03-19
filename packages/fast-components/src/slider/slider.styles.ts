import { css } from "@microsoft/fast-element";

export const SliderStyles = css`
    :host {
        --thumb-size: calc(var(--height-number) * 0.5);
        --thumb-translate: calc(var(--thumb-size) * 0.5);
        --track-offset: 12;
        display: block;
    }
    :host([hidden]) {
        display: none;
    }
    .slider {
        position: relative;
        margin: 40px 4px;
        box-sizing: border-box;
        border-radius: calc(var(--corner-radius) * 1px);
        outline: none;
        cursor: pointer;
    }
    .background-track {
        background: var(--neutral-outline-rest);
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
    .thumb-container {
        position: absolute;
        right: 50%;
        height: calc(var(--thumb-size) * 1px);
        width: calc(var(--thumb-size) * 1px);
        transform: translateX(calc(var(--thumb-translate) * 1px));
    }
    .thumb-cursor {
        border: none;
        width: calc(var(--thumb-size) * 1px);
        height: calc(var(--thumb-size) * 1px);
        position: relative;
        background: var(--neutral-foreground-rest);
        border-radius: 50%;
        transition: "all 0.2s ease";
        "&:hover": {
            background: var(--neutral-foreground-hover);
        }
        "&:active": {
            background: var(--neutral-foreground-active);
        }
    }
`;
