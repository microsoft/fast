import { css } from "@microsoft/fast-element";
import { disabledCursor, display, focusVisible } from "@microsoft/fast-foundation";
import {
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentForegroundCutRestBehavior,
    heightNumber,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
} from "../styles";

export const MenuItemStyles = css`
    ${display("grid")} :host {
        outline: none;
        box-sizing: border-box;
        height: calc(${heightNumber} * 1px);
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
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--focus-outline-width) * 1px) solid transparent;
    }

    :host(:${focusVisible}) {
        border-color: var(--neutral-focus);
        background: var(--accent-fill-hover);
        color: var(--accent-foreground-cut-rest);
    }

    :host(:hover) {
        background: var(--accent-fill-hover);
        color: var(--accent-foreground-cut-rest);
    }

    :host(:active) {
        background: var(--accent-fill-active);
        color: var(--accent-foreground-cut-rest);
    }

    :host(.disabled) {
        cursor: ${disabledCursor};
        opacity: var(--disabled-opacity);
    }

    :host(.disabled:hover) {
        color: var(--neutral-foreground-rest);
        fill: var(--neutral-foreground-rest);
        background: var(--neutral-fill-stealth-rest)
    }

    :host(.disabled:hover) .start,
    :host(.disabled:hover) .end,
    :host(.disabled:hover)::slotted(svg) {
        fill: var(--neutral-foreground-rest);
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

    :host(:hover) .start,
    :host(:hover) .end,
    :host(:hover)::slotted(svg){
        fill: var(--accent-foreground-cut-rest);
    }

    :host(:active) .start,
    :host(:active) .end,
    :host(:active)::slotted(svg) {
        fill: var(--accent-foreground-cut-rest);
    }
`.withBehaviors(
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentForegroundCutRestBehavior,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior
);
