import { html } from "@microsoft/fast-element";
import { css } from "@microsoft/fast-element";
import { FASTMenuItem } from "../menu-item.js";
import { menuItemTemplate } from "../menu-item.template.js";

export const styles = css`
    :host([hidden]) {
        display: none !important;
    }

    :host {
        --icon-col: minmax(42px, auto);
        align-items: center;
        background: var(--neutral-fill-stealth-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--focus-stroke-width) * 1px) solid transparent;
        box-sizing: border-box;
        color: var(--neutral-foreground-rest);
        cursor: pointer;
        display: flex;
        fill: currentcolor;
        font: var(--type-ramp-base-font-size) / var(--type-ramp-base-line-height)
            var(--body-font);
        height: calc(var(--height-number) * 1px);
        justify-items: start;
        margin: 0 calc(var(--design-unit) * 1px);
        outline: none;
        overflow: visible;
        padding: 0;
        white-space: nowrap;
    }

    :host(:hover) {
        background: var(--neutral-fill-stealth-hover);
        color: var(--neutral-foreground-rest);
    }

    :host(:active) {
        background: var(--neutral-fill-stealth-active);
    }

    :host(:focus-visible) {
        border-color: var(--focus-stroke-outer);
        background: var(--neutral-fill-stealth-focus);
        color: var(--neutral-foreground-rest);
    }

    :host([role="menuitem"]) .content {
        padding: 0 10px;
    }

    .content {
        justify-self: start;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :host([aria-checked="true"]),
    :host(.expanded) {
        background: var(--neutral-fill-rest);
        color: var(--neutral-foreground-rest);
    }
    :host([disabled]) {
        cursor: var(--disabled-cursor);
        opacity: var(--disabled-opacity);
    }

    :host([disabled]:hover) {
        color: var(--neutral-foreground-rest);
        fill: currentcolor;
        background: var(--neutral-fill-stealth-rest);
    }

    :host([disabled]:hover) ::slotted([slot="start"]),
    :host([disabled]:hover) ::slotted([slot="end"]),
    :host([disabled]:hover)::slotted(svg) {
        fill: var(--neutral-foreground-rest);
    }

    .expand-collapse-glyph {
        width: 16px;
        height: 16px;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }

    ::slotted([slot="start"]) {
        margin-inline-start: 10px;
    }

    ::slotted([slot="end"]) {
        margin-inline-end: 10px;
    }

    :host(:hover) ::slotted([slot="start"]),
    :host(:hover) ::slotted([slot="end"]),
    :host(:hover)::slotted(svg),
    :host(:active) ::slotted([slot="start"]),
    :host(:active) ::slotted([slot="end"]),
    :host(:active)::slotted(svg) {
        fill: var(--neutral-foreground-rest);
    }

    .input-container,
    .expand-collapse-glyph-container {
        display: none;
    }

    .expand-collapse-glyph-container {
        margin-inline-start: auto;
    }

    :host([aria-haspopup="menu"]) .expand-collapse-glyph-container,
    :host([role="menuitemcheckbox"]) .input-container,
    :host([role="menuitemradio"]) .input-container {
        display: grid;
        margin-inline-end: 10px;
    }

    .expand-collapse,
    .checkbox,
    .radio {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 20px;
        height: 20px;
        box-sizing: border-box;
        outline: none;
        margin-inline-start: 10px;
    }

    .checkbox,
    .radio {
        border: calc(var(--stroke-width) * 1px) solid var(--neutral-foreground-rest);
    }

    :host([aria-checked="true"]) .checkbox,
    :host([aria-checked="true"]) .radio {
        background: var(--accent-fill-rest);
        border-color: var(--accent-fill-rest);
    }

    .checkbox {
        border-radius: calc(var(--control-corner-radius) * 1px);
    }

    .radio {
        border-radius: 999px;
    }

    .checkbox-indicator,
    .radio-indicator,
    .expand-collapse-indicator,
    ::slotted([slot="checkbox-indicator"]),
    ::slotted([slot="radio-indicator"]),
    ::slotted([slot="expand-collapse-indicator"]) {
        display: none;
    }

    ::slotted([slot="end"]:not(svg)) {
        color: var(--neutral-foreground-hint);
        margin-inline-end: 10px;
    }

    :host([aria-checked="true"]) .checkbox-indicator,
    :host([aria-checked="true"]) ::slotted([slot="checkbox-indicator"]) {
        display: block;
        fill: var(--foreground-on-accent-rest);
        height: 100%;
        pointer-events: none;
        width: 100%;
    }

    :host([aria-checked="true"]) .radio-indicator {
        background: var(--foreground-on-accent-rest);
        border-radius: 999px;
        bottom: 4px;
        display: block;
        left: 4px;
        pointer-events: none;
        position: absolute;
        right: 4px;
        top: 4px;
    }

    :host([aria-checked="true"]) ::slotted([slot="radio-indicator"]) {
        display: block;
        pointer-events: none;
    }

    .submenu-container {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
    }
`;

FASTMenuItem.define({
    name: "fast-menu-item",
    template: menuItemTemplate({
        checkboxIndicator: /* html */ html`
            <svg
                part="checkbox-indicator"
                class="checkbox-indicator"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="m8.1 12.7 7.1-8.2 1.6 1.4-8.6 9.9-4.4-4.5 1.5-1.5L8 12.7Z"
                />
            </svg>
        `,
        expandCollapseGlyph: /* html */ html`
            <svg
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                class="expand-collapse-glyph"
                part="expand-collapse-glyph"
            >
                <path
                    d="M5 12.3a1 1 0 0 0 1.6.8L11 8.8a1.5 1.5 0 0 0 0-2.3L6.6 2.2A1 1 0 0 0 5 3v9.3Z"
                />
            </svg>
        `,
        radioIndicator: /* html */ html`
            <span part="radio-indicator" class="radio-indicator"></span>
        `,
    }),
    styles,
});
