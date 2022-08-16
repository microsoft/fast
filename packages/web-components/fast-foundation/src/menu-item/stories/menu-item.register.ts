import { css } from "@microsoft/fast-element";
import { FASTMenuItem } from "../menu-item.js";
import { menuItemTemplate } from "../menu-item.template.js";

const styles = css`
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

    :host(.indent-0) .submenu-icon {
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

    :host(.indent-2) .submenu-icon {
        grid-column: 5;
        grid-row: 1;
    }

    :host(.indent-2) slot[name="start"] {
        grid-column: 2;
    }

    :host(.indent-2) slot[name="end"] {
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

    :host([disabled]:hover) slot[name="start"],
    :host([disabled]:hover) slot[name="end"],
    :host([disabled]:hover)::slotted(svg) {
        fill: var(--neutral-foreground-rest);
    }

    ::slotted(svg) {
        fill: currentcolor;
    }

    slot[name="start"],
    slot[name="end"] {
        display: flex;
        justify-content: center;
    }

    :host(:hover) slot[name="start"],
    :host(:hover) slot[name="end"],
    :host(:hover)::slotted(svg),
    :host(:active) slot[name="start"],
    :host(:active) slot[name="end"],
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

    :host(.indent-2:not([aria-haspopup="menu"])) slot[name="end"] {
        grid-column: 5;
    }

    :host([aria-haspopup="menu"]) .content,
    :host([role="menuitemcheckbox"]) .content,
    :host([role="menuitemradio"]) .content {
        grid-column-start: 3;
    }

    :host([aria-haspopup="menu"].indent-0) .content {
        grid-column-start: 1;
    }

    :host([aria-haspopup="menu"]) slot[name="end"],
    :host([role="menuitemcheckbox"]) slot[name="end"],
    :host([role="menuitemradio"]) slot[name="end"] {
        grid-column-start: 4;
    }

    .checkbox-indicator,
    .radio-indicator,
    .submenu-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        box-sizing: border-box;
        margin-inline: 10px;
        height: 100%;
        pointer-events: none;
        width: 100%;
    }

    ::slotted([slot="end"]:not(svg)) {
        color: var(--neutral-foreground-hint);
        margin-inline-end: 10px;
    }

    .checkbox-indicator,
    .radio-indicator {
        display: none;
    }

    :host([aria-checked="true"]) .checkbox-indicator,
    :host([aria-checked="true"]) .radio-indicator {
        display: flex;
    }
`;

FASTMenuItem.define({
    name: "fast-menu-item",
    template: menuItemTemplate({
        anchoredRegion: "fast-anchored-region",
    }),
    styles,
});
