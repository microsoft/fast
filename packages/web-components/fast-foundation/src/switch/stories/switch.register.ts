import { css } from "@microsoft/fast-element";
import { DesignSystem } from "../../design-system/design-system.js";
import { Switch, SwitchOptions } from "../switch.js";
import { switchTemplate as template } from "../switch.template.js";

const styles = () => css`
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
    :host([readonly]) .switch,
    :host([disabled]) .switch {
        cursor: var(--disabled-cursor);
    }
    .switch {
        position: relative;
        outline: none;
        box-sizing: border-box;
        width: calc(var(--height-number) * 1px);
        height: calc((var(--height-number) / 2 + var(--design-unit)) * 1px);
        background: var(--neutral-fill-input-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-rest);
    }
    .switch:hover {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutralStrokeHover);
        cursor: pointer;
    }
    host([disabled]) .switch:hover,
    host([readonly]) .switch:hover {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-stroke-hover);
        cursor: var(--disabled-cursor);
    }
    :host(:not([disabled])) .switch:active {
        background: var(--neutral-fill-input-active);
        border-color: var(--neutral-stroke-active);
    }
    :host(:focus-visible) .switch {
        box-shadow: 0 0 0 2px var(--fill-color), 0 0 0 4px var(--focusStrokeOuter);
    }
    .checked-indicator {
        position: absolute;
        top: 5px;
        bottom: 5px;
        background: var(--neutral-foreground-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        transition: all 0.2s ease-in-out;
    }
    .status-message {
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--typeRamp-base-line-height);
    }
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
    ::slotted([slot="checked-message"]),
    ::slotted([slot="unchecked-message"]) {
        margin-inline-start: calc(var(--design-unit) * 2px + 2px);
    }
    :host([aria-checked="true"]) .checked-indicator {
        background: var(--foreground-on-accent-rest);
    }
    :host([aria-checked="true"]) .switch {
        background: var(--accent-fill-rest);
        border-color: var(--accent-fill-rest);
    }
    :host([aria-checked="true"]:not([disabled])) .switch:hover {
        background: var(--accent-fill-hover);
        border-color: var(--accent-fill-hover);
    }
    :host([aria-checked="true"]:not([disabled])) .switch:hover .checked-indicator {
        background: var(--foreground-on-accent-hover);
    }
    :host([aria-checked="true"]:not([disabled])) .switch:active {
        background: var(--accent-fill-active);
        border-color: var(--accentt-fill-active);
    }
    :host([aria-checked="true"]:not([disabled])) .switch:active .checked-indicator {
        background: var(--foreground-on-accent-active);
    }
    :host([aria-checked="true"]:focus-visible:not([disabled])) .switch {
        box-shadow: 0 0 0 2px var(--fill-color), 0 0 0 4px var(--focus-stroke-outer);
    }
    .unchecked-message {
        display: block;
    }
    .checked-message {
        display: none;
    }
    :host([aria-checked="true"]) .unchecked-message {
        display: none;
    }
    :host([aria-checked="true"]) .checked-message {
        display: block;
    }

    .checked-indicator {
        left: 5px;
        right: calc(((var(--height-number) / 2) + 1) * 1px);
    }
    :host([aria-checked="true"]) .checked-indicator {
        left: calc(((var(--height-number) / 2) + 1) * 1px);
        right: 5px;
    }
`;

DesignSystem.getOrCreate()
    .withPrefix("fast")
    .register(
        Switch.compose<SwitchOptions>({
            baseName: "switch",
            template,
            styles,
            switch: /* html */ `
                <span class="checked-indicator" part="checked-indicator"></span>
            `,
        })()
    );
