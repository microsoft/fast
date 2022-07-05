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

    .root {
        align-items: baseline;
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

    .control {
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
        width: 100%;
    }

    .control:hover,
    .control:focus-visible,
    .control:disabled,
    .control:active {
        outline: none;
    }

    .controls {
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

    .start,
    .control,
    .controls,
    .end {
        align-self: center;
    }

    .start,
    .end {
        fill: currentcolor;
        margin: auto;
    }

    .step-up-glyph,
    .step-down-glyph {
        cursor: pointer;
        display: block;
        padding: 4px 10px;
    }

    .step-up-glyph:before,
    .step-down-glyph:before {
        border: solid transparent 6px;
        content: "";
        display: block;
    }

    .step-up-glyph:before {
        border-bottom-color: var(--neutral-foreground-rest);
    }

    .step-down-glyph:before {
        border-top-color: var(--neutral-foreground-rest);
    }

    ::slotted(svg) {
        height: 16px;
        width: 16px;
    }

    .start {
        margin-inline-start: 11px;
    }

    .end {
        margin-inline-end: 11px;
    }

    :host(:hover:not([disabled])) .root {
        background: var(--neutral-fill-input-hover);
        border-color: var(--accent-fill-hover);
    }

    :host(:active:not([disabled])) .root {
        background: var(--neutral-fill-input-hover);
        border-color: var(--accent-fill-active);
    }

    :host(:focus-within:not([disabled])) .root {
        border-color: var(--focus-stroke-outer);
        box-shadow: 0 0 0 calc(var(--focus-stroke-width) * 1px) var(--focus-stroke-outer)
            inset;
    }

    :host(:hover:not([disabled])) .controls,
    :host(:focus-within:not([disabled])) .controls {
        opacity: 1;
    }

    :host([appearance="filled"]) .root {
        background: var(--neutral-fill-rest);
    }

    :host([appearance="filled"]:hover:not([disabled])) .root {
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

FASTNumberField.define({
    name: "fast-number-field",
    styles,
    template: numberFieldTemplate({
        stepDownGlyph: /* html */ `<span class="step-down-glyph" part="step-down-glyph"></span>`,
        stepUpGlyph: /* html */ `<span class="step-up-glyph" part="step-up-glyph"></span>`,
    }),
    shadowOptions: {
        delegatesFocus: true,
    },
});
