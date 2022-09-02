import { css } from "@microsoft/fast-element";
import { FASTTextField } from "../text-field.js";
import { textFieldTemplate } from "../text-field.template.js";

const styles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        display: inline-block;
        font-family: var(--body-font);
        outline: none;
        user-select: none;
    }

    .control {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: var(--neutral-foreground-rest);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-rest);
        height: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
        align-items: center;
    }

    .field {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        height: calc(100% - 4px);
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(var(--design-unit) * 2px + 1px);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
    }

    .field:hover,
    .field:focus-visible,
    .field:disabled,
    .field:active {
        outline: none;
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

    ::slotted([slot="start"]),
    ::slotted([slot="end"]),
    .field {
        align-self: center;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
        margin-inline: 11px;
    }

    :host(:hover:not([disabled])) .control {
        background: var(--neutral-fill-input-hover);
        border-color: var(--accent-fill-hover);
    }

    :host(:active:not([disabled])) .control {
        background: var(--neutral-fill-input-hover);
        border-color: var(--accent-fill-active);
    }

    :host(:focus-within:not([disabled])) .control {
        border-color: var(--focus-stroke-outer);
        box-shadow: 0 0 0 calc(var(--focus-stroke-width) * 1px) var(--focus-stroke-outer)
            inset;
    }

    :host([appearance="filled"]) .control {
        background: var(--neutral-fill-rest);
    }

    :host([appearance="filled"]:hover:not([disabled])) .control {
        background: var(--neutral-fill-hover);
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: not-allowed;
    }

    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }

    :host([disabled]) .control {
        border-color: var(--neutral-stroke-rest);
    }
`;

FASTTextField.define({
    name: "fast-text-field",
    template: textFieldTemplate(),
    shadowOptions: {
        delegatesFocus: true,
    },
    styles,
});
