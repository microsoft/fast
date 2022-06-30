import { css } from "@microsoft/fast-element";
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
        /* Chromium likes to select label text or the default slot when
            the radio is clicked. Maybe there is a better solution here? */
        outline: none;
        position: relative;
        transition: all 0.2s ease-in-out;
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
        outline: none;
        cursor: pointer;
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

    .control,
    .checked-indicator {
        flex-shrink: 0;
    }

    .checked-indicator {
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        border-radius: 100%;
        display: inline-block;
        background: var(--foreground-on-accent-rest);
        fill: var(--foreground-on-accent-rest);
        opacity: 0;
        pointer-events: none;
    }

    :host(:not([disabled])) .control:hover {
        background: var(--neutral-fill-input-hover);
        border-color: var(--neutral-stroke-hover);
    }

    :host(:not([disabled])) .control:active {
        background: var(--neutral-fill-input-active);
        border-color: var(--neutral-stroke-active);
    }

    :host(:focus-visible) .control {
        box-shadow: 0 0 0 2px var(--fill-color), 0 0 0 4px var(--focus-stroke-outer);
    }

    :host([aria-checked="true"]) .control {
        background: var(--accent-fill-rest);
        border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-rest);
    }

    :host([aria-checked="true"]:not([disabled])) .control:hover {
        background: var(--accent-fill-hover);
        border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-hover);
    }

    :host([aria-checked="true"]:not([disabled])) .control:hover .checked-indicator {
        background: var(--foreground-on-accent-hover);
        fill: var(--foreground-on-accent-hover);
    }

    :host([aria-checked="true"]:not([disabled])) .control:active {
        background: var(--accent-fill-active);
        border: calc(var(--stroke-width) * 1px) solid var(--accent-fill-active);
    }

    :host([aria-checked="true"]:not([disabled])) .control:active .checked-indicator {
        background: var(--foreground-on-accent-active);
        fill: var(--foreground-on-accent-active);
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

    :host([aria-checked="true"]) .checked-indicator {
        opacity: 1;
    }

    :host([disabled]) {
        opacity: var(--disabled-opacity);
    }
`;

FASTRadio.define({
    name: "fast-radio",
    template: radioTemplate({
        checkedIndicator: /* html */ `
            <div part="checked-indicator" class="checked-indicator"></div>
        `,
    }),
    styles,
});
