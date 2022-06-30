import { css } from "@microsoft/fast-element";
import { FASTListboxOption } from "../listbox-option.js";
import { listboxOptionTemplate } from "../listbox-option.template.js";

const styles = css`
    :host {
        align-items: center;
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--focus-stroke-width) * 1px) solid var(--neutral-layer-floating);
        box-sizing: border-box;
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        display: inline-flex;
        fill: currentcolor;
        flex: 0 0 auto;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        height: calc(
            (var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px
        );
        line-height: var(--type-ramp-base-line-height);
        margin: 0 calc((var(--design-unit) - var(--focus-stroke-width)) * 1px);
        outline: none;
        overflow: hidden;
        padding: 0 1ch;
        user-select: none;
        white-space: nowrap;
    }

    :host(:focus-visible) {
        background: var(--accent-fill-focus);
        border-color: var(--focus-stroke-outer);
        box-shadow: 0 0 0 calc(var(--focus-stroke-width) * 1px) inset
            var(--focus-stroke-inner);
        color: var(--foreground-on-accent-focus);
    }

    :host([aria-selected="true"]) {
        background: var(--accent-fill-rest);
        color: var(--foreground-on-accent-rest);
    }

    :host(:hover) {
        background: var(--accent-fill-hover);
        color: var(--foreground-on-accent-hover);
    }

    :host(:active) {
        background: var(--accent-fill-active);
        color: var(--foreground-on-accent-active);
    }

    :host(:not([aria-selected="true"]):hover),
    :host(:not([aria-selected="true"]):active) {
        background: var(--neutral-fill-hover);
        color: var(--neutral-foreground-rest);
    }

    :host([disabled]) {
        cursor: not-allowed;
        opacity: var(--disabled-opacity);
    }

    :host([disabled]:hover) {
        background-color: inherit;
    }

    .content {
        grid-column-start: 2;
        justify-self: start;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .start,
    .end,
    ::slotted(svg) {
        display: flex;
    }

    ::slotted(svg) {
        height: calc(var(--design-unit) * 4px);
        width: calc(var(--design-unit) * 4px);
    }

    ::slotted([slot="end"]) {
        margin-inline-start: 1ch;
    }

    ::slotted([slot="start"]) {
        margin-inline-end: 1ch;
    }

    :host([aria-checked="true"][aria-selected="false"]) {
        border-color: var(--neutral-stroke-rest);
        background: var(--neutral-layer-3);
        color: var(--neutral-foreground-rest);
    }

    :host([aria-checked="true"][aria-selected="false"]:not([disabled]):hover) {
        background: var(--neutral-fill-hover);
    }

    :host([aria-checked="true"][aria-selected="true"]) {
        border-color: var(--focus-stroke-outer);
        background: var(--accent-fill-focus);
        color: var(--foreground-on-accent-focus);
    }

    :host([aria-checked="true"][aria-selected="true"]:hover) {
        background: var(--accent-fill-hover);
        color: var(--foreground-on-accent-hover);
    }
`;

FASTListboxOption.define({
    name: "fast-option",
    template: listboxOptionTemplate(),
    styles,
});
