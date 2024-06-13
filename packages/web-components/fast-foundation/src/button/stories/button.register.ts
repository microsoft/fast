import { css } from "@microsoft/fast-element";
import { FASTButton } from "../button.js";
import { buttonTemplate } from "../button.template.js";

const styles = css`
    :host {
        display: inline-flex;
        font-family: var(--body-font);
        outline: none;
        user-select: none;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        height: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
        min-width: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
        background-color: var(--neutral-fill-rest);
        color: var(--neutral-foreground-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        fill: currentcolor;
        cursor: pointer;
    }

    :host([hidden]) {
        display: none;
    }

    .control {
        background: transparent;
        height: inherit;
        flex-grow: 1;
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 0 calc((10 + (var(--design-unit) * 2 * var(--density))) * 1px);
        white-space: nowrap;
        outline: none;
        text-decoration: none;
        border: calc(var(--stroke-width) * 1px) solid transparent;
        color: inherit;
        border-radius: inherit;
        fill: inherit;
        cursor: inherit;
        font-weight: inherit;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    :host(:hover) {
        background-color: var(--neutral-fill-hover);
    }

    :host(:active) {
        background-color: var(--neutral-fill-active);
    }

    .control:focus-visible {
        border-color: var(--focus-stroke-outer);
        box-shadow: 0 0 0 calc((var(--focus-stroke-width) - var(--stroke-width)) * 1px)
            var(--focus-stroke-outer) inset;
    }

    .control::-moz-focus-inner {
        border: 0;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="content"]),
    ::slotted([slot="end"]),
    .content {
        display: flex;
    }

    .control.icon-only {
        line-height: 0;
        padding: 0;
    }

    ::slotted([slot="start"]) {
        margin-inline-end: 11px;
    }

    ::slotted([slot="end"]) {
        margin-inline-start: 11px;
    }
`;

FASTButton.define({
    name: "fast-button",
    template: buttonTemplate(),
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
