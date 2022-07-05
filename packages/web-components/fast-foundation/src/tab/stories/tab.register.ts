import { css } from "@microsoft/fast-element";
import { FASTTab } from "../tab.js";
import { tabTemplate } from "../tab.template.js";

const styles = css`
    :host([hidden]) {
        display: none;
    }
    :host {
        align-items: center;
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--stroke-width) * 1px) solid transparent;
        box-sizing: border-box;
        color: var(--neutral-foreground-hint);
        cursor: pointer;
        display: inline-flex;
        fill: currentcolor;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        grid-row: 1;
        height: calc(var(--height-number) * 1px);
        justify-content: center;
        line-height: var(--type-ramp-base-line-height);
        padding: calc(var(--design-unit) * 5px) calc(var(--design-unit) * 4px);
    }
    :host(:hover) {
        color: var(--neutral-foreground-rest);
        fill: currentcolor;
    }
    :host(:active) {
        color: var(--neutral-foreground-rest);
        fill: currentcolor;
    }
    :host([disabled]) {
        cursor: var(--disabled-cursor);
        opacity: var(--disabled-opacity);
    }
    :host([disabled]:hover) {
        color: var(--neutral-foreground-hint);
        background: var(--neutral-fill-stealth-rest);
    }
    :host([aria-selected="true"]) {
        background: var(--neutral-fill-rest);
        color: var(--accent-foreground-rest);
        fill: currentcolor;
    }
    :host([aria-selected="true"]:hover) {
        background: var(--neutral-fill-hover);
        color: var(--accent-foreground-hover);
        fill: currentcolor;
    }
    :host([aria-selected="true"]:active) {
        background: var(--neutral-fill-active);
        color: var(--accent-foreground-active);
        fill: currentcolor;
    }
    :host(:focus-visible) {
        border: calc(var(--stroke-width) * 1px) solid var(--focus-stroke-outer);
        box-shadow: 0 0 0 calc((var(--focus-stroke-width) - var(--stroke-width)) * 1px)
            var(--focus-stroke-outer);
        outline: none;
    }
    :host(:focus) {
        outline: none;
    }
    :host(.vertical) {
        justify-content: end;
        grid-column: 2;
    }
    :host(.vertical[aria-selected="true"]) {
        z-index: 2;
    }
    :host(.vertical:hover) {
        color: var(--neutral-foreground-rest);
    }
    :host(.vertical:active) {
        color: var(--neutral-foreground-rest);
    }
`;

FASTTab.define({
    name: "fast-tab",
    styles,
    template: tabTemplate(),
});
