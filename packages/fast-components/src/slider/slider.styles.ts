import { css } from "@microsoft/fast-element";
import { disabledCursor, display } from "../styles";

export const SliderStyles = css`
    :host {
        --thumb-size: calc(var(--height-number) * 0.5);
        --thumb-translate: calc(var(--thumb-size) * 0.5);
        display: block;
    }
    :host([hidden]) {
        display: none;
    }

    ${display("inline-flex")} :host {
        align-items: center;
        outline: none;
        width: 100%;
        margin: calc(var(--design-unit) * 1px) 0;
        ${/*
           * Chromium likes to select label text or the default slot when
           * the checkbox is clicked. Maybe there is a better solution here?
           */ ""} user-select: none;
    }
    .slider {
        position: relative;
        width: 100%;
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
    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .checkbox,
    :host(.disabled) .checkbox {
        cursor: ${disabledCursor};
    }
    :host(.disabled) {
        opacity: var(--disabled-opacity);
    }
`;
