import { css } from "@microsoft/fast-element";
import { display, focusVisible } from "@microsoft/fast-foundation";
import {
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    accentForegroundRestBehavior,
    neutralForegroundRestBehavior,
} from "../styles/index";

export const BreadcrumbItemStyles = css`
    ${display("inline-block")} :host {
        background: transparent;
        box-sizing: border-box;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        fill: currentColor;
        line-height: var(--type-ramp-base-line-height);
        outline: none;
    }

    .listitem {
        align-items: center;
        display: flex;
    }

    .separator {
        margin: 0 12px;
    }

    .control {
        background: transparent;
        box-sizing: border-box;
        color: ${accentForegroundRestBehavior.var};
        cursor: pointer;
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
        position: absolute;
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
        margin-inline-end: 4px;
    }

    .end {
        margin-inline-start: 4px;
    }
`.withBehaviors(
    accentForegroundRestBehavior,
    accentForegroundHoverBehavior,
    accentForegroundActiveBehavior,
    accentForegroundHoverBehavior,
    neutralForegroundRestBehavior
);
