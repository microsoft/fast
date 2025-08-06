import { css } from "@microsoft/fast-element";
import { FASTSwitch } from "../switch.js";
import { switchTemplate } from "../switch.template.js";

const styles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        display: inline-flex;
        align-items: center;
        outline: none;
        font-family: var(--body-font);
        margin: calc(var(--design-unit) * 1px) 0;
        user-select: none;
    }

    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: var(--disabled-cursor);
    }

    .control {
        position: relative;
        outline: none;
        box-sizing: border-box;
        width: calc(var(--height-number) * 1px);
        height: calc((var(--height-number) / 2 + var(--design-unit)) * 1px);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-rest);
    }

    :host(:not([disabled]):hover) .control,
    :host(:not([readonly]):hover) .control {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-stroke-hover);
        cursor: pointer;
    }

    :host(:not([disabled]):active) .control {
        background: var(--neutral-fill-input-active);
        border-color: var(--neutral-stroke-active);
    }

    :host(:focus-visible) .control {
        box-shadow: 0 0 0 2px var(--fill-color), 0 0 0 4px var(--focusStrokeOuter);
    }

    .thumb {
        position: absolute;
        top: 5px;
        bottom: 5px;
        background: var(--neutral-foreground-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        transition: all 0.2s ease-in-out;
    }

    :host([disabled]) .control,
    :host([readonly]) .control,
    :host([disabled]) .status-message,
    :host([readonly]) .status-message {
        cursor: var(--disabled-cursor);
    }

    .label {
        color: var(--neutral-foreground-rest);
        margin-inline-end: calc(var(--design-unit) * 2px + 2px);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        cursor: pointer;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    :host([aria-checked="true"]) .thumb {
        background: var(--foreground-on-accent-rest);
    }

    :host([aria-checked="true"]) .control {
        background: var(--accent-fill-rest);
        border-color: var(--accent-fill-rest);
    }

    :host([aria-checked="true"]:not([disabled]):hover) .control {
        background: var(--accent-fill-hover);
        border-color: var(--accent-fill-hover);
    }

    :host([aria-checked="true"]:not([disabled]):hover) .control .thumb {
        background: var(--foreground-on-accent-hover);
    }

    :host([aria-checked="true"]:not([disabled]):active) .control {
        background: var(--accent-fill-active);
        border-color: var(--accentt-fill-active);
    }

    :host([aria-checked="true"]:not([disabled]):active) .control .thumb {
        background: var(--foreground-on-accent-active);
    }

    :host([aria-checked="true"]:focus-visible:not([disabled])) .control {
        box-shadow: 0 0 0 2px var(--fill-color), 0 0 0 4px var(--focus-stroke-outer);
    }

    .thumb {
        left: 5px;
        right: calc(((var(--height-number) / 2) + 1) * 1px);
    }

    :host([aria-checked="true"]) .thumb {
        left: calc(((var(--height-number) / 2) + 1) * 1px);
        right: 5px;
    }
`;

FASTSwitch.define({
    name: "fast-switch",
    template: switchTemplate(),
    styles,
});
