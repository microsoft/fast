import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    heightNumber,
    neutralFillStealthActiveBehavior,
    neutralFillStealthHoverBehavior,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
} from "../styles";

export const MenuItemStyles = css`
    ${display("grid")} :host {
        position: relative;
        outline: none;
        box-sizing: border-box;
        height: calc(${heightNumber} * 1px);
        ${
            /* grid-template-columns:  calc(var(--design-unit) * 1px) auto calc(var(--design-unit) * 1px); */ ""
        }
        grid-template-columns: 42px auto 42px;
        grid-template-rows: auto;
        justify-items: center;
        align-items: center;
        padding: 0;
        margin: 0 calc(var(--design-unit) * 1px);
        white-space: nowrap;
        overflow: hidden;
        color: var(--neutral-foreground-rest);
        fill: var(--neutral-foreground-rest);
        cursor: pointer;
        ${
            /* Font size and line height are temporary - 
            replace when adaptive typography is figured out */ ""
        } font-size: 14px;
        line-height: 20px;
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--focus-outline-width) * 1px) solid transparent;
    }

    :host(:${focusVisible}) {
        border-color: var(--neutral-focus);
    }

    :host(:hover) {
        background: var(--neutral-fill-stealth-hover);
    }

    :host(:active) {
        background: var(--neutral-fill-stealth-active);
    }

    :host(.disabled) {
        cursor: ${disabledCursor};
        opacity: var(--disabled-opacity);
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
        ${
            /* Glyph size and margin-left is temporary - 
            replace when adaptive typography is figured out */ ""
        } width: 16px;
        height: 16px;
    }

    .menu {
        display: none;
    }

    .expanded {
        display: block;
    }
`.withBehaviors(
    neutralFillStealthActiveBehavior,
    neutralFillStealthHoverBehavior,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior
);
