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
        border: calc(var(--outline-width) * 1px) solid ${neutralFocusBehavior.var};
        box-shadow: 0 0 0 1px ${neutralFocusBehavior.var} inset;
        background: ${neutralFillRestBehavior.var};
        color: ${neutralForegroundRestBehavior.var};
        padding: 4px;
        height: fit-content;
        width: fit-content;
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        line-height: var(--type-ramp-base-line-height);
        white-space: nowrap;
        ${/* TODO: a mechanism to manage z-index across components
            https://github.com/microsoft/fast/issues/3813 */ ""}
        z-index: 10000;
    }

    fast-anchored-region {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: visible;
        flex-direction: row;
    }

    fast-anchored-region.right,
    fast-anchored-region.left {
        flex-direction: column;
    }

    fast-anchored-region.top .tooltip {
        margin-bottom: 4px;
    }

    fast-anchored-region.bottom .tooltip {
        margin-top: 4px;
    }

    fast-anchored-region.left .tooltip {
        margin-right: 4px;
    }

    fast-anchored-region.right .tooltip {
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
