import { css } from "@microsoft/fast-element";
import { FASTAnchor } from "../anchor.js";
import { anchorTemplate } from "../anchor.template.js";

const styles = css`
    :host {
        --shadow-spread: calc((var(--focus-stroke-width) - var(--stroke-width)) * 1px);
        --base-size: calc((var(--base-height-multiplier)) * var(--design-unit) * 1px);
        background-color: var(--neutral-fill-rest);
        background: var(--accent-fill-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        color: var(--foreground-on-accent-rest);
        cursor: pointer;
        display: inline-flex;
        fill: currentcolor;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        height: var(--base-size);
        min-width: var(--base-size);
        line-height: var(--type-ramp-base-line-height);
        outline: none;
    }

    .control {
        all: inherit;
        background: transparent;
        flex-grow: 1;
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: baseline;
        padding: 0 10px;
        white-space: nowrap;
        outline: none;
        text-decoration: none;
        border: calc(var(--stroke-width) * 1px) solid transparent;
    }

    :host(:hover) {
        background-color: var(--neutral-fill-hover);
    }

    :host(:active) {
        background-color: var(--neutral-fill-active);
    }

    .control:focus-visible {
        border-color: var(--focus-stroke-outer);
        box-shadow: 0 0 0 var(--shadow-spread) var(--focus-stroke-outer) inset;
    }

    .control::-moz-focus-inner {
        border: 0;
    }

    .start,
    .content,
    .end {
        align-self: center;
    }

    .start,
    .end {
        display: flex;
    }

    .control.icon-only {
        line-height: 0;
        padding: 0;
    }

    ::slotted(svg) {
        height: 16px;
        pointer-events: none;
        width: 16px;
    }

    .start {
        margin-inline-end: 11px;
    }

    .end {
        margin-inline-start: 11px;
    }

    :host(:hover) {
        background: var(--accent-fill-hover);
        color: var(--foreground-on-accent-hover);
    }

    :host(:active) .control:active {
        background: var(--accent-fill-active);
        color: var(--foreground-on-accent-active);
    }
`;

FASTAnchor.define({
    name: "fast-anchor",
    template: anchorTemplate(),
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
