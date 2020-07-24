import { css } from "@microsoft/fast-element";
import { forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import {
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    neutralFillHoverBehavior,
    neutralFillInputActiveBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFillRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineRestBehavior,
} from "../styles/index";

export const TooltipStyles = css`
    :host {
        contain: layout;
        overflow: visible;
        height: 0;
        width: 0;
    }

    .tooltip {
        box-sizing: border-box;
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid ${accentFillActiveBehavior.var};
        border-color: ${neutralFocusBehavior.var};
        box-shadow: 0 0 0 1px ${neutralFocusBehavior.var} inset;
        background: ${neutralFillRestBehavior.var};
        color: ${neutralForegroundRestBehavior.var};
        padding: 4px;
        height: fit-content;
        width: fit-content;
        font: inherit;
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        white-space: nowrap;
        z-index: 10000;
    }

    fast-anchored-region {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: visible;
    }

    :host(.top) fast-anchored-region,
    :host(.bottom) fast-anchored-region {
        flex-direction: row;
    }

    :host(.right) fast-anchored-region,
    :host(.left) fast-anchored-region {
        flex-direction: column;
    }

    :host(.top) .tooltip {
        margin-bottom: 4px;
    }

    :host(.bottom) .tooltip {
        margin-top: 4px;
    }

    :host(.left) .tooltip {
        margin-right: 4px;
    }

    :host(.right) .tooltip {
        margin-left: 4px;
    }
`.withBehaviors(
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    neutralFillHoverBehavior,
    neutralFillInputActiveBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFillRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineRestBehavior,
    forcedColorsStylesheetBehavior(
        css`
            :host([disabled]) {
                opacity: 1;
            }
        `
    )
);
