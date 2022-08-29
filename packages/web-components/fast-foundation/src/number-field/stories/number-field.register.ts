import { css } from "@microsoft/fast-element";
import { FASTNumberField } from "../number-field.js";
import { numberFieldTemplate } from "../number-field.template.js";

const styles = css`
    :host {
        display: inline-block;
        font: var(--type-ramp-base-font-size) / var(--type-ramp-base-line-height)
            var(--body-font);
        outline: none;
        user-select: none;
    }

    :host([hidden]) {
        display: none;
    }

    .control {
        align-items: center;
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-rest);
        box-sizing: border-box;
        color: var(--neutral-foreground-rest);
        display: flex;
        flex-direction: row;
        height: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
        position: relative;
    }

    .input {
        appearance: none;
        background: transparent;
        border: 0;
        border: none;
        color: inherit;
        font: inherit;
        height: calc(100% - 4px);
        margin-bottom: auto;
        margin-top: auto;
        padding: 0 calc(var(--design-unit) * 2px + 1px);
    }

    .input:hover,
    .input:focus-visible,
    .input:disabled,
    .input:active {
        outline: none;
    }

    .step-buttons {
        opacity: 0;
    }

    .label {
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        display: block;
        font: inherit;
        margin-bottom: 4px;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]),
    .input,
    .step-buttons {
        align-self: center;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
        margin-inline: 11px;
    }

    .input.icon-only {
        line-height: 0;
        padding: 0;
    }

    .step-up-icon,
    .step-down-icon {
        cursor: pointer;
        display: block;
        padding: 4px 10px;
    }

    .step-up-icon:before,
    .step-down-icon:before {
        border: solid transparent 6px;
        content: "";
        display: block;
    }

    .step-up-icon:before {
        border-bottom-color: var(--neutral-foreground-rest);
    }

    .step-down-icon:before {
        border-top-color: var(--neutral-foreground-rest);
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

    :host(:hover:not([disabled])) .step-buttons,
    :host(:focus-within:not([disabled])) .step-buttons {
        opacity: 1;
    }

    :host([appearance="filled"]) .control {
        background: var(--neutral-fill-rest);
    }

    :host([appearance="filled"]:hover:not([disabled])) .control {
        background: var(--neutral-fill-hover);
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .input,
    :host([disabled]) .input {
        cursor: not-allowed;
    }

    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }

    :host([disabled]) .input {
        border-color: var(--neutral-stroke-rest);
    }
`;

FASTNumberField.define({
    name: "fast-number-field",
    styles,
    template: numberFieldTemplate({
        stepDownIcon: /* html */ `<span class="step-down-icon" part="step-down-icon"></span>`,
        stepUpIcon: /* html */ `<span class="step-up-icon" part="step-up-icon"></span>`,
    }),
    shadowOptions: {
        delegatesFocus: true,
    },
});
