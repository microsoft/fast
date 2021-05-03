import { css } from "@microsoft/fast-element";
import {
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import {
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    accentForegroundRestBehavior,
    neutralForegroundRestBehavior,
    heightNumber,
} from "../styles/index";
import { SystemColors } from "@microsoft/fast-web-utilities";

export const BreadcrumbItemStyles = css`
    ${display("inline-flex")} :host {
        background: transparent;
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        fill: currentColor;
        line-height: var(--type-ramp-base-line-height);
        min-width: calc(${heightNumber} * 1px);
        outline: none;
    }

    .listitem {
        display: flex;
        align-items: center;
        width: max-content;
    }

    .separator {
        margin: 0 6px;
    }

    .control {
        align-items: center;
        box-sizing: border-box;
        color: ${accentForegroundRestBehavior.var};
        cursor: pointer;
        display: flex;
        fill: inherit;
        outline: none;
        text-decoration: none;
        white-space: nowrap;
    }

    .control:hover {
        color: ${accentForegroundHoverBehavior.var};
    }

    .control:active {
        color: ${accentForegroundActiveBehavior.var};
    }

    .control .content {
        position: relative;
    }

    .control .content::before {
        content: "";
        display: block;
        height: calc(var(--outline-width) * 1px);
        left: 0;
        position: absolute;
        right: 0;
        top: calc(1em + 4px);
        width: 100%;
    }

    .control:hover .content::before {
        background: ${accentForegroundHoverBehavior.var};
    }

    .control:active .content::before {
        background: ${accentForegroundActiveBehavior.var};
    }

    .control:${focusVisible} .content::before {
        background: ${neutralForegroundRestBehavior.var};
        height: calc(var(--focus-outline-width) * 1px);
    }

    .control:not([href]) {
        color: ${neutralForegroundRestBehavior.var};
        cursor: default;
    }

    .control:not([href]) .content::before {
        background: none;
    }

    .start,
    .end {
        display: flex;
    }

    ::slotted(svg) {
        ${
            /* Glyph size and margin-left is temporary - 
            replace when adaptive typography is figured out */ ""
        } width: 16px;
        height: 16px;
    }

    .start {
        margin-inline-end: 6px;
    }

    .end {
        margin-inline-start: 6px;
    }
`.withBehaviors(
    accentForegroundRestBehavior,
    accentForegroundHoverBehavior,
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    neutralForegroundRestBehavior,
    forcedColorsStylesheetBehavior(
        css`
            .control:hover .content::before {
                background: ${SystemColors.LinkText};
            }
        `
    )
);
