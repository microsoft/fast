import { css } from "@microsoft/fast-element";
import checkmarkIcon from "../../../statics/svg/checkmark_16_regular.svg";
import chevronRightIcon from "../../../statics/svg/chevron_right_12_regular.svg";
import circleIcon from "../../../statics/svg/circle_16_filled.svg";
import { FASTMenuItem } from "../menu-item.js";
import { menuItemTemplate } from "../menu-item.template.js";

export const styles = css`
    :host([hidden]) {
        display: none !important;
    }

    :host {
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
        margin: 0 calc(var(--design-unit) * 1px);
        outline: none;
        overflow: visible;
        padding: 0 10px;
        white-space: nowrap;
    }

    :host(:not([disabled]):hover) {
        background: var(--neutral-fill-stealth-hover);
        color: var(--neutral-foreground-rest);
        position: relative;
        z-index: 1;
    }

    :host(:not([disabled]):active) {
        background: var(--neutral-fill-stealth-active);
    }

    :host(:focus-visible) {
        border-color: var(--focus-stroke-outer);
        background: var(--neutral-fill-stealth-focus);
    }

    .content {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :host([disabled]) {
        cursor: var(--disabled-cursor);
        opacity: var(--disabled-opacity);
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

    ::slotted([slot="start"]) {
        margin-inline-end: 6px;
    }

    .checkbox-indicator,
    .radio-indicator,
    .submenu-icon {
        display: flex;
        flex-basis: content;
        align-items: center;
        justify-content: center;
        margin-inline-end: 6px;
        pointer-events: none;
    }

    .submenu-icon {
        margin-inline-start: 6px;
        margin-inline-end: 0;
    }

    ::slotted([slot="end"]:not(svg)) {
        color: var(--neutral-foreground-hint);
    }

    :host(:not([aria-checked="true"])) .checkbox-indicator,
    :host(:not([aria-checked="true"])) .radio-indicator {
        visibility: hidden;
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
        checkboxIndicator: checkmarkIcon,
        radioIndicator: circleIcon,
        submenuIcon: chevronRightIcon,
    }),
    styles,
});
