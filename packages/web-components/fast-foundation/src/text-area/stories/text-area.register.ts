import { css } from "@microsoft/fast-element";
import { FASTTextArea } from "../text-area.js";
import { textAreaTemplate } from "../text-area.template.js";

const styles = css`
    :host {
        display: inline-block;
        font-family: var(--body-font);
        outline: none;
        user-select: none;
    }

    .control {
        box-sizing: border-box;
        position: relative;
        color: var(--neutral-foreground-rest);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-rest);
        height: calc(var(--height-number) * 2px);
        font: inherit;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        padding: calc(var(--design-unit) * 2px + 1px);
        width: 100%;
        resize: none;
    }

    .control:hover:enabled {
        background: var(--neutral-fill-input-hover);
        border-color: var(--accent-fill-hover);
    }

    .control:active:enabled {
        background: var(--neutral-fill-input-active);
        border-color: var(--accent-fill-active);
    }

    .control:hover,
    .control:focus-visible,
    .control:disabled,
    .control:active {
        outline: none;
    }

    :host(:focus-within) .control {
        border-color: var(--focus-stroke-outer);
        box-shadow: 0 0 0 1px var(--focus-stroke-outer) inset;
    }

    :host([appearance="filled"]) .control {
        background: var(--neutral-fill-rest);
    }

    :host([appearance="filled"]:hover:not([disabled])) .control {
        background: var(--neutral-fill-hover);
    }

    :host([resize="both"]) .control {
        resize: both;
    }

    :host([resize="horizontal"]) .control {
        resize: horizontal;
    }

    :host([resize="vertical"]) .control {
        resize: vertical;
    }

    .label {
        display: block;
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: var(--disabled-cursor);
    }
    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }
    :host([disabled]) .control {
        border-color: var(--neutral-stroke-rest);
    }

    :host([cols]) {
        width: initial;
    }

    :host([rows]) .control {
        height: initial;
    }
`;

FASTTextArea.define({
    name: "fast-text-area",
    template: textAreaTemplate(),
    shadowOptions: {
        delegatesFocus: true,
    },
    styles,
});
