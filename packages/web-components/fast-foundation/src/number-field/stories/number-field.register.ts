import { css } from "@microsoft/fast-element";
import { chevronDownIcon, chevronUpIcon } from "../../icons.js";
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

    .field {
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

    .field:hover,
    .field:focus-visible,
    .field:disabled,
    .field:active {
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
    .field,
    .step-buttons {
        align-self: center;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
        margin-inline: 11px;
    }

    .field.icon-only {
        line-height: 0;
        padding: 0;
    }

    .step-up,
    .step-down {
        cursor: pointer;
        display: flex;
        padding: 4px;
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
    :host([readonly]) .field,
    :host([disabled]) .field {
        cursor: not-allowed;
    }

    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }

    :host([disabled]) .field {
        border-color: var(--neutral-stroke-rest);
    }
`;

FASTNumberField.define({
    name: "fast-number-field",
    styles,
    template: numberFieldTemplate({
        stepDownIcon: chevronDownIcon,
        stepUpIcon: chevronUpIcon,
    }),
    shadowOptions: {
        delegatesFocus: true,
    },
});
