import { css } from "@microsoft/fast-element";
import { display } from "../display";
import { focusVisible } from "../focus";

export const BaseButtonStyles = css`
    ${display("inline-block")} :host {
        font-family: var(--body-font);
        outline: none;

        --fast-button-corner-radius: calc(var(--corner-radius) * 1px);
        --fast-button-fill-rest: var(--neutral-fill-rest);
        --fast-button-fill-hover: var(--neutral-fill-hover);
        --fast-button-fill-active: var(--neutral-fill-active);

        --fast-button-foreground-rest: var(--neutral-foreground-rest);
        --fast-button-foreground-hover: var(--fast-button-foreground-rest);
        --fast-button-foreground-active: var(--fast-button-foreground-rest);

        --fast-button-border-rest-color: transparent;
        --fast-button-border-rest-style: solid;
        --fast-button-border-rest-width: calc(var(--outline-width) * 1px);
        
        --fast-button-border-hover-color: var(--fast-button-border-rest-color);
        --fast-button-border-hover-style: var(--fast-button-border-rest-style);
        --fast-button-border-hover-width: var(--fast-button-border-rest-width);
        
        --fast-button-border-active-color: var(--fast-button-border-hover-color);
        --fast-button-border-active-style: var(--fast-button-border-hover-style);
        --fast-button-border-active-width: var(--fast-button-border-hover-width);

        --fast-button-border-focus-color: var(--neutral-focus);
        --fast-button-border-focus-style: var(--fast-button-border-rest-style);

        --fast-button-border-rest: var(--fast-button-border-rest-width) var(--fast-button-border-rest-style) var(--fast-button-border-rest-color);
        --fast-button-border-hover: var(--fast-button-border-hover-width) var(--fast-button-border-hover-style) var(--fast-button-border-hover-color);
        --fast-button-border-active: var(--fast-button-border-active-width) var(--fast-button-border-active-style) var(--fast-button-border-active-color);
        --fast-button-border-focus: var(--fast-button-border-rest-width) var(--fast-button-border-focus-style) var(--fast-button-border-focus-color);
    }

    .control {
        ${
            /* Font size is temporary - 
            replace when adaptive typography is figured out */ ""
        } font-size: 14px;
        line-height: 20px;
        line-height: 1;
        box-sizing: border-box;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        padding: 0 calc((6 + (var(--design-unit) * 2 * var(--density))) * 1px);
        height: calc(var(--height-number) * 1px);
        min-width: calc(var(--height-number) * 1px);
        max-width: calc(var(--design-unit) * 94.5px));
        white-space: nowrap;
        outline: none;
        text-decoration: none;
        border-radius: var(--fast-button-corner-radius);
        background-color: var(--fast-button-fill-rest);
        color: var(--fast-button-foreground-rest);
        fill: var(--fast-button-foreground-rest);
        border: var(--fast-button-border-rest);
    }

    .control:hover {
        background-color: var(--fast-button-fill-hover);
        color: var(--fast-button-foreground-hover);
        fill: var(--fast-button-foreground-hover);
        border: var(--fast-button-border-hover);
    }

    .control:active {
        background-color: var(--fast-button-fill-active);
        color: var(--fast-button-foreground-active);
        fill: var(--fast-button-foreground-active);
        border: var(--fast-button-border-active);
    }

    .control:${focusVisible} {
        border: var(--fast-button-border-focus);
        box-shadow: 0 0 0 calc((var(--focus-outline-width) - var(--outline-width)) * 1px) var(--fast-button-border-focus-color);
    }

    .control::-moz-focus-inner {
        border: 0;
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
    :host(.accent) {
        --fast-button-fill-rest: var(--accent-fill-rest);
        --fast-button-fill-hover: var(--accent-fill-hover);
        --fast-button-fill-active: var(--accent-fill-active);
    
        --fast-button-foreground-rest: var(--accent-foreground-cut-rest);
        --fast-button-foreground-hover: var(--fast-button-foreground-rest);
        --fast-button-foreground-active: var(--fast-button-foreground-rest);    
    }

    :host(.accent) .control:${focusVisible} {
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset var(--neutral-focus-inner-accent);
    }
`;

export const HypertextStyles = css`
    :host(.hypertext) {
        --fast-button-fill-rest: transparent;
        --fast-button-fill-hover: transparent;
        --fast-button-fill-active: transparent;

        --fast-button-corner-radius: none;
    }

    :host(.hypertext) .control {
        padding: 0;
        height: auto;
        border: none;
        box-shadow: none;
    }

    :host(.hypertext) .control:link,
    :host(.hypertext) .control:visited {
        --fast-button-foreground-rest: var(--accent-foreground-rest);
        --fast-button-foreground-hover: var(--accent-foreground-hover);
        --fast-button-foreground-active: var(--accent-foreground-active);

        --fast-button-border-rest: transparent;
        --fast-button-border-hover: transparent;
        --fast-button-border-active: transparent;

        --fast-button-border-focus-width: calc(var(--focus-outline-width) * 1px);

        border-bottom: var(--fast-button-border-rest-width) var(--fast-button-border-rest-style) var(--fast-button-foreground-rest);
    }

    :host(.hypertext) .control:hover {
        border-bottom-color: var(--fast-button-foreground-hover);
    }

    :host(.hypertext) .control:active {
        border-bottom-color: var(--fast-button-foreground-active);
    }

    :host(.hypertext) .control:${focusVisible} {
        border-bottom: var(--fast-button-border-focus-width) var(--fast-button-border-focus-style) var(--neutral-focus);
    }
`;

export const LightweightButtonStyles = css`
    :host(.lightweight) {
        --fast-button-fill-rest: transparent;
        --fast-button-fill-hover: transparent;
        --fast-button-fill-active: transparent;

        --fast-button-foreground-rest: var(--accent-foreground-rest);
        --fast-button-foreground-hover: var(--accent-foreground-hover);
        --fast-button-foreground-active: var(--accent-foreground-active);

        --fast-button-border-rest: transparent;
        --fast-button-border-hover: transparent;
        --fast-button-border-active: transparent;

        --fast-button-corner-radius: none;
    }

    :host(.lightweight) .control {
        padding: 0;
        border: none;
        box-shadow: none;
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
        background: var(--fast-button-foreground-hover);
    }

    :host(.lightweight) .control:active .content::before {
        background: var(--fast-button-foreground-active);
    }

    :host(.lightweight) .control:${focusVisible} .content::before {
        background: var(--neutral-foreground-rest);
        height: calc(var(--focus-outline-width) * 1px);
    }
`;

export const OutlineButtonStyles = css`
    :host(.outline) {
        --fast-button-fill-rest: transparent;
        --fast-button-fill-hover: transparent;
        --fast-button-fill-active: transparent;

        --fast-button-border-rest-color: var(--neutral-outline-rest);
        --fast-button-border-rest-hover: var(--neutral-outline-hover);
        --fast-button-border-rest-active: var(--neutral-outline-active);
    }
`;

export const StealthButtonStyles = css`
    :host(.stealth) {
        --fast-button-fill-rest: var(--neutral-fill-stealth-rest);
        --fast-button-fill-hover: var(--neutral-fill-stealth-hover);
        --fast-button-fill-active: var(--neutral-fill-stealth-active);
    }
`;
