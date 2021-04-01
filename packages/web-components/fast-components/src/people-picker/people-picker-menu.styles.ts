import { css } from "@microsoft/fast-element";
import { forcedColorsStylesheetBehavior } from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    neutralFillHoverBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFillRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
    neutralLayerFloatingBehavior,
    neutralOutlineRestBehavior,
} from "../styles/index";

export const PeoplePickerMenuStyles = css`
    :host {
        background: ${neutralLayerFloatingBehavior.var};
        z-index: 1000;
        display: flex;
        width: 260px;
        max-height: 100%;
        min-height: 58px;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        pointer-events: auto;
    }

    .suggestions-available-alert {
        height: 0;
        opacity: 0;
        overflow: hidden;
    }

    .loading-display {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-items: center;
    }

    .loading-progress {
        width: 42px;
        height: 42px;
    }

    ::slotted([role="listitem"]) {
        width: 100%;
        height: 58px;
    }

    ::slotted([aria-selected="true"][role="listitem"]) {
        background: ${SystemColors.Highlight};
        border-color: ${SystemColors.ButtonText};
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset
            ${SystemColors.HighlightText};
        color: ${SystemColors.HighlightText};
        fill: currentcolor;
    }
    :host([show-options="true"]) .no-options-display {
        display: none;
    }
    :host([show-options="false"]) .options-display {
        display: none;
    }
`.withBehaviors(
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    neutralFillHoverBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFillRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
    neutralLayerFloatingBehavior,
    neutralOutlineRestBehavior,
    forcedColorsStylesheetBehavior(css``)
);
