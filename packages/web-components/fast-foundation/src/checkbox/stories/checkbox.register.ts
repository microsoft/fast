import { css } from "@microsoft/fast-element";
import { checkboxIcon, subtractIcon } from "../../icons.js";
import { FASTCheckbox } from "../checkbox.js";
import { checkboxTemplate } from "../checkbox.template.js";

const styles = css`
    :host {
        align-items: center;
        display: inline-flex;
        outline: none;
        user-select: none;
        vertical-align: middle;
    }

    .control {
        --size: calc((var(--height-number) / 2 + var(--design-unit)) * 1px);
        position: relative;
        width: var(--size);
        height: var(--size);
        box-sizing: border-box;
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-rest);
        background: var(--neutral-fill-input-rest);
        color: var(--neutral-foreground-rest);
        outline: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .label {
        font-family: var(--body-font);
        color: var(--neutral-foreground-rest);
        padding-inline-start: calc(var(--design-unit) * 2px + 2px);
        cursor: pointer;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    slot[name="checked-indicator"] *,
    slot[name="indeterminate-indicator"] * {
        position: absolute;
        fill: currentcolor;
        opacity: 0;
        pointer-events: none;
    }

    :host(:not([disabled]):hover) .control {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-stroke-hover);
    }

    :host(:not([disabled]):active) .control {
        background: var(--neutral-fill-input-active);
        border-color: var(--neutral-stroke-active);
    }

    :host(:focus-visible) .control {
        box-shadow: 0 0 0 2px var(--fill-color), 0 0 0 4px var(--focus-stroke-outer);
    }

    :host([aria-checked="true"]) .control {
        background: var(--accent-fill-rest);
        border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-rest);
        color: var(--foreground-on-accent-rest);
    }

    :host([aria-checked="true"]:not([disabled]):hover) .control {
        background: var(--accent-fill-hover);
        border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-hover);
        color: var(--foreground-on-accent-hover);
    }

    :host([aria-checked="true"]:not([disabled]):active) .control {
        background: var(--accent-fill-active);
        border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-active);
        color: var(--foreground-on-accent-active);
    }

    :host([aria-checked="true"]:focus-visible:not([disabled])) .control {
        box-shadow: 0 0 0 2px var(--fill-color), 0 0 0 4px var(--focus-stroke-outer);
    }

    :host([disabled]) .label,
    :host([readonly]) .label,
    :host([readonly]) .control,
    :host([disabled]) .control {
        cursor: var(--disabled-cursor);
    }

    :host([aria-checked="true"]:not(.indeterminate)) slot[name="checked-indicator"] *,
    :host(.indeterminate) slot[name="indeterminate-indicator"] * {
        opacity: 1;
    }

    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }
`;

FASTCheckbox.define({
    name: "fast-checkbox",
    template: checkboxTemplate({
        checkedIndicator: checkboxIcon,
        indeterminateIndicator: subtractIcon,
    }),
    styles,
});
