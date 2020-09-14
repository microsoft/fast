import { css } from "@microsoft/fast-element";
import { display, focusVisible } from '@microsoft/fast-foundation';
import { accentFillActiveBehavior, accentFillHoverBehavior, accentFillRestBehavior, neutralFillInputActiveBehavior, neutralFillInputHoverBehavior, neutralFillInputRestBehavior, neutralFocusBehavior, neutralForegroundRestBehavior } from '..';
import { heightNumber, elevation } from '../styles';

export const SelectStyles = css`
    ${display("inline-block")} :host {
        position: relative;
        width: 250px;
        color: ${neutralForegroundRestBehavior.var};
        --elevation: 14;
    }

    :host(:${focusVisible}) .button {
        box-shadow: 0 0 0 2px var(--background-color), 0 0 0 4px ${
            neutralFocusBehavior.var
        };
        border-color: ${neutralFocusBehavior.var};
    }

    .button {
        background: ${neutralFillInputRestBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid ${accentFillRestBehavior.var};
        height: calc(${heightNumber} * 1px);
        font: inherit;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        padding: calc(var(--design-unit) * 2px + 1px);
        color: ${neutralForegroundRestBehavior.var};
        width: 100%;
        display: flex;
    }

    .button:hover {
        background: ${neutralFillInputHoverBehavior.var};
        border-color: ${accentFillHoverBehavior.var};
    }

    .button:active {
        background: ${neutralFillInputActiveBehavior.var};
        border-color: ${accentFillActiveBehavior.var};
    }

    :host slot[name="listbox"] {
        display: none;
        width: 100%;
    }

    :host([open]) slot[name="listbox"] {
        display: flex;
        position: absolute;
        ${elevation}
    }

    :host .end {
        margin-inline-start: auto;
    }

    :host .start,
    :host .end,
    :host ::slotted(svg) {
        fill: ${neutralForegroundRestBehavior.var};
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

`.withBehaviors(
    accentFillActiveBehavior, accentFillHoverBehavior, accentFillRestBehavior, neutralFillInputActiveBehavior, neutralFillInputHoverBehavior, neutralFillInputRestBehavior, neutralFocusBehavior, neutralForegroundRestBehavior
);
