import { css } from "@microsoft/fast-element";
import { radioIcon } from "../../icons.js";
import { FASTRadio } from "../radio.js";
import { radioTemplate } from "../radio.template.js";

const styles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        --input-size: calc(
            ((var(--base-height-multiplier) + var(--density)) * var(--design-unit) / 2) +
                var(--design-unit)
        );
        align-items: center;
        display: inline-flex;
        flex-direction: row;
        margin: calc(var(--design-unit) * 1px) 0;
        outline: none;
        position: relative;
        user-select: none;
    }

    .control {
        --size: calc(
            (
                    (var(--base-height-multiplier)) * var(--design-unit) / 2 +
                        var(--design-unit)
                ) * 1px
        );
        position: relative;
        width: var(--size);
        height: var(--size);
        box-sizing: border-box;
        border-radius: 100%;
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
        --spacing: calc(var(--design-unit) * 2px + 2px);
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        font: var(--type-ramp-base-font-size) / var(--type-ramp-base-line-height)
            var(--body-font);
        margin-inline-end: var(--spacing);
        padding-inline-start: var(--spacing);
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    slot[name="checked-indicator"] * {
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
        cursor: not-allowed;
    }

    :host([aria-checked="true"]) slot[name="checked-indicator"] * {
        opacity: 1;
    }

    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }
`;

FASTRadio.define({
    name: "fast-radio",
    template: radioTemplate({
        checkedIndicator: radioIcon,
    }),
    styles,
});
