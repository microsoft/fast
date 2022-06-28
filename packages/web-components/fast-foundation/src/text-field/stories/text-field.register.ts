import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { TextField } from "../text-field.js";
import { textFieldTemplate as template } from "../text-field.template.js";

const styles = () => css`
    :host([hidden]) {
        display: none;
    }

    :host {
        display: inline-block;
        font-family: var(--body-font);
        outline: none;
        user-select: none;
    }

    .root {
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
        align-items: baseline;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        height: calc(100% - 4px);
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(var(--design-unit) * 2px + 1px);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
    }

    .control:hover,
    .control:focus-visible,
    .control:disabled,
    .control:active {
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

    .start,
    .control,
    .end {
        align-self: center;
    }

    .start,
    .end {
        display: flex;
        margin: auto;
        fill: currentcolor;
    }

    ::slotted(svg) {
        width: 16px;
        height: 16px;
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

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        TextField.compose({
            baseName: "text-field",
            template,
            shadowOptions: {
                delegatesFocus: true,
            },
            styles,
        })()
    );
