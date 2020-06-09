import { css } from "@microsoft/fast-element";
import { display, focusVisible } from "@microsoft/fast-foundation";
import { heightNumber } from "../size";

export const BaseButtonStyles = css`
    ${display("inline-block")} :host {
        font-family: var(--body-font);
        outline: none;
    }

    .control {
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
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
        background-color: ${neutralFillRestBehavior.var};
        color: ${neutralForegroundRestBehavior.var};
        fill: ${neutralForegroundRestBehavior.var};
        border: calc(var(--outline-width) * 1px) solid transparent;
    }

    .control:hover {
        background-color: ${neutralFillHoverBehavior.var};
    }

    .control:active {
        background-color: ${neutralFillActiveBehavior.var};
    }

    .control:${focusVisible} {
        border: calc(var(--outline-width) * 1px) solid ${neutralFocusBehavior.var};
        box-shadow: 0 0 0 calc((var(--focus-outline-width) - var(--outline-width)) * 1px) ${
            neutralFocusBehavior.var
        };
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
        background: ${accentFillRestBehavior.var};
        color: ${accentForegroundCutRestBehavior.var};  
    }

    :host(.accent) .control:hover {
        background: ${accentFillHoverBehavior.var};
    }

    :host(.accent) .control:active {
        background: ${accentFillActiveBehavior.var};
    }

    :host(.accent) .control:${focusVisible} {
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset ${neutralFocusInnerAccentBehavior.var};
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
        color: ${accentForegroundRestBehavior.var};
        border-bottom: calc(var(--outline-width) * 1px) solid ${accentForegroundRestBehavior.var};
    }

    :host(.hypertext) .control:hover {
        border-bottom-color: ${accentForegroundHoverBehavior.var};
    }

    :host(.hypertext) .control:active {
        border-bottom-color: ${accentForegroundActiveBehavior.var};
    }

    :host(.hypertext) .control:${focusVisible} {
        border-bottom: calc(var(--focus-outline-width) * 1px) solid ${neutralFocusBehavior.var};
    }
`;

export const LightweightButtonStyles = css`
    :host(.lightweight) .control {
        padding: 0;
        border: none;
        box-shadow: none;
        border-radius: 0;
        background: transparent;
        color: ${accentForegroundRestBehavior.var};
    }

    :host(.lightweight) .control:hover {
        color: ${accentForegroundHoverBehavior.var};
    }

    :host(.lightweight) .control:active {
        color: ${accentForegroundActiveBehavior.var};
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
        background: ${accentForegroundHoverBehavior.var};
    }

    :host(.lightweight) .control:active .content::before {
        background: ${accentForegroundActiveBehavior.var};
    }

    :host(.lightweight) .control:${focusVisible} .content::before {
        background: ${neutralForegroundRestBehavior.var};
        height: calc(var(--focus-outline-width) * 1px);
    }
`;

export const OutlineButtonStyles = css`
    :host(.outline) .control {
        background: transparent;
        border-color: ${neutralOutlineRestBehavior.var};
    }

    :host(.outline) .control:hover {
        border-color: ${neutralOutlineHoverBehavior.var};
    }

    :host(.outline) .control:active {
        border-color: ${neutralOutlineActiveBehavior.var};
    }
`;

export const StealthButtonStyles = css`
    :host(.stealth) .control {
        background: ${neutralFillStealthRestBehavior.var};
    }

    :host(.stealth) .control:hover {
        background: ${neutralFillStealthHoverBehavior.var};
    }

    :host(.stealth) .control:active {
        background: ${neutralFillStealthActiveBehavior.var};
    }
`;
