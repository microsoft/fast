import { css } from "@microsoft/fast-element";
import { FASTMenuItem } from "../menu-item.js";
import { menuItemTemplate } from "../menu-item.template.js";

const styles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        --icon-col: minmax(42px, auto);
        align-items: center;
        background: var(--neutral-fill-stealth-rest);
        border-radius: calc(var(--control-corner-radius) * 1px);
        border: calc(var(--focus-stroke-width) * 1px) solid transparent;
        box-sizing: border-box;
        color: var(--neutral-foreground-rest);
        contain: layout;
        cursor: pointer;
        display: grid;
        fill: currentcolor;
        font: var(--type-ramp-base-font-size) / var(--type-ramp-base-line-height)
            var(--body-font);
        grid-template-columns: var(--icon-col) 1fr var(--icon-col);
        grid-template-rows: auto;
        height: calc(var(--height-number) * 1px);
        justify-items: center;
        margin: 0 calc(var(--design-unit) * 1px);
        outline: none;
        overflow: visible;
        padding: 0;
        white-space: nowrap;
    }

    :host(:hover) {
        background: var(--neutral-fill-stealth-hover);
        color: var(--neutral-foreground-rest);
        position: relative;
        z-index: 1;
    }

    :host(:active) {
        background: var(--neutral-fill-stealth-active);
    }

    :host(:focus-visible) {
        border-color: var(--focus-stroke-outer);
        background: var(--neutral-fill-stealth-focus);
        color: var(--neutral-foreground-rest);
    }

    .content {
        grid-column-start: 2;
        justify-self: start;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :host(.indent-0) {
        grid-template-columns: auto 1fr var(--icon-col);
    }

    :host(.indent-0) .content {
        grid-column: 1;
        grid-row: 1;
        margin-inline-start: 10px;
    }

    :host(.indent-0) .expand-collapse-glyph-container {
        grid-column: 5;
        grid-row: 1;
    }

    :host(.indent-2) {
        grid-template-columns:
            var(--icon-col) var(--icon-col) 1fr var(--icon-col)
            var(--icon-col);
    }

    :host(.indent-2) .content {
        grid-column: 3;
        grid-row: 1;
        margin-inline-start: 10px;
    }

    :host(.indent-2) .expand-collapse-glyph-container {
        grid-column: 5;
        grid-row: 1;
    }

    :host(.indent-2) .start {
        grid-column: 2;
    }

    :host(.indent-2) .end {
        grid-column: 4;
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

    :host([disabled]:hover) .start,
    :host([disabled]:hover) .end,
    :host([disabled]:hover)::slotted(svg) {
        fill: var(--neutral-foreground-rest);
    }

    .expand-collapse-glyph,
    ::slotted(svg) {
        width: 16px;
        height: 16px;
    }

    ::slotted(svg) {
        fill: currentcolor;
    }

    .start,
    .end {
        display: flex;
        justify-content: center;
    }

    :host(:hover) .start,
    :host(:hover) .end,
    :host(:hover)::slotted(svg),
    :host(:active) .start,
    :host(:active) .end,
    :host(:active)::slotted(svg) {
        fill: var(--neutral-foreground-rest);
    }

    :host(.indent-0[aria-haspopup="menu"]),
    :host(.indent-1[aria-haspopup="menu"]),
    :host(.indent-1[role="menuitemcheckbox"]),
    :host(.indent-1[role="menuitemradio"]) {
        align-items: center;
        display: grid;
        grid-template-columns: var(--icon-col) auto 1fr var(--icon-col) var(--icon-col);
        min-height: 32px;
    }

    :host(.indent-2:not([aria-haspopup="menu"])) .end {
        grid-column: 5;
    }

    .input-container,
    .expand-collapse-glyph-container {
        display: none;
    }

    :host([aria-haspopup="menu"]) .expand-collapse-glyph-container,
    :host([role="menuitemcheckbox"]) .input-container,
    :host([role="menuitemradio"]) .input-container {
        display: grid;
        margin-inline-end: 10px;
    }

    :host([aria-haspopup="menu"]) .content,
    :host([role="menuitemcheckbox"]) .content,
    :host([role="menuitemradio"]) .content {
        grid-column-start: 3;
    }

    :host([aria-haspopup="menu"].indent-0) .content {
        grid-column-start: 1;
    }

    :host([aria-haspopup="menu"]) .end,
    :host([role="menuitemcheckbox"]) .end,
    :host([role="menuitemradio"]) .end {
        grid-column-start: 4;
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
`;

FASTMenuItem.define({
    name: "fast-menu-item",
    template: menuItemTemplate({
        anchoredRegion: "fast-anchored-region",
        checkboxIndicator: /* html */ `
            <svg
                part="checkbox-indicator"
                class="checkbox-indicator"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path fill-rule="evenodd" clip-rule="evenodd" d="m8.1 12.7 7.1-8.2 1.6 1.4-8.6 9.9-4.4-4.5 1.5-1.5L8 12.7Z"/>
            </svg>
        `,
        expandCollapseGlyph: /* html */ `
            <svg
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
                class="expand-collapse-glyph"
                part="expand-collapse-glyph"
            >
                <path d="M5 12.3a1 1 0 0 0 1.6.8L11 8.8a1.5 1.5 0 0 0 0-2.3L6.6 2.2A1 1 0 0 0 5 3v9.3Z"/>
            </svg>
        `,
        radioIndicator: /* html */ `
            <span part="radio-indicator" class="radio-indicator"></span>
        `,
    }),
    styles,
});
