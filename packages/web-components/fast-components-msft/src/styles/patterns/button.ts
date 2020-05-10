import { css } from "@microsoft/fast-element";
import { display, focusVisible, heightNumber } from "@microsoft/fast-components";

export const BaseButtonStyles = css`
    ${display("inline-block")} :host {
        font-family: var(--body-font);
        outline: none;
    }

    .control {
        ${
            /* Font size is temporary - 
            replace when adaptive typography is figured out */ ""
        } font-size: 14px;
        line-height: 1;
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 0 calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
        height: calc(${heightNumber} * 1px);
        min-width: calc(${heightNumber} * 1px);
        white-space: nowrap;
        outline: none;
        text-decoration: none;
        cursor: pointer;
        border-radius: calc(var(--corner-radius) * 1px);
        background-color: var(--neutral-fill-rest);
        color: var(--neutral-foreground-rest);
        fill: var(--neutral-foreground-rest);
        border: calc(var(--outline-width) * 1px) solid transparent;
    }

    .control:hover {
        background-color: var(--neutral-fill-hover);
    }

    .control:active {
        background-color: var(--neutral-fill-active);
    }

    .control:${focusVisible} {
        border: calc(var(--outline-width) * 1px) solid var(--neutral-focus);
        box-shadow: 0 0 0 calc((var(--focus-outline-width) - var(--outline-width)) * 1px) var(--neutral-focus);
    }

    .control::-moz-focus-inner {
        border: 0;
    }

    :host(.disabled) {
        opacity: var(--disabled-opacity);
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

    .start {
        margin-inline-end: 11px;
    }

    .end {
        margin-inline-start: 11px;
    }
`;

export const AccentButtonStyles = css`
    :host(.accent) .control {
        background: var(--accent-fill-rest);
        color: var(--accent-foreground-cut-rest);  
    }

    :host(.accent) .control:hover {
        background: var(--accent-fill-hover);
    }

    :host(.accent) .control:active {
        background: var(--accent-fill-active);
    }

    :host(.accent) .control:${focusVisible} {
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset var(--neutral-focus-inner-accent);
    }
`;

export const HypertextStyles = css`
    :host(.hypertext) .control {
        padding: 0;
        height: auto;
        border: none;
        box-shadow: none;
        border-radius: 0;
    }

    :host a.control:not(:link) {
        background-color: transparent;
        cursor: default;
    }

    :host(.hypertext) .control:link,
    :host(.hypertext) .control:visited {
        background: transparent;
        color: var(--accent-foreground-rest);
        border-bottom: calc(var(--outline-width) * 1px) solid var(--accent-foreground-rest);
    }

    :host(.hypertext) .control:hover {
        border-bottom-color: var(--accent-foreground-hover);
    }

    :host(.hypertext) .control:active {
        border-bottom-color: var(--accent-foreground-active);
    }

    :host(.hypertext) .control:${focusVisible} {
        border-bottom: calc(var(--focus-outline-width) * 1px) solid var(--neutral-focus);
    }
`;

export const LightweightButtonStyles = css`
    :host(.lightweight) .control {
        padding: 0;
        border: none;
        box-shadow: none;
        border-radius: 0;
        background: transparent;
        color: var(--accent-foreground-rest);
    }

    :host(.lightweight) .control:hover {
        color: var(--accent-foreground-hover);
    }

    :host(.lightweight) .control:active {
        color: var(--accent-foreground-active);
    }

    :host(.lightweight) .content {
        position: relative;
    }

    :host(.lightweight) .content::before {
        content: "";
        display: block;
        height: calc(var(--outline-width) * 1px);
        position: absolute;
        bottom: -3px;
        width: 100%;
    }

    :host(.lightweight) .control:hover .content::before {
        background: var(--accent-foreground-hover);
    }

    :host(.lightweight) .control:active .content::before {
        background: var(--accent-foreground-active);
    }

    :host(.lightweight) .control:${focusVisible} .content::before {
        background: var(--neutral-foreground-rest);
        height: calc(var(--focus-outline-width) * 1px);
    }
`;

export const OutlineButtonStyles = css`
    :host(.outline) .control {
        background: transparent;
        border-color: var(--neutral-outline-rest);
    }

    :host(.outline) .control:hover {
        border-color: var(--neutral-outline-hover);
    }

    :host(.outline) .control:active {
        border-color: var(--neutral-outline-active);
    }
`;

export const StealthButtonStyles = css`
    :host(.stealth) .control {
        background: var(--neutral-fill-stealth-rest);
    }

    :host(.stealth) .control:hover {
        background: var(--neutral-fill-stealth-hover);
    }

    :host(.stealth) .control:active {
        background: var(--neutral-fill-stealth-active);
    }
`;
