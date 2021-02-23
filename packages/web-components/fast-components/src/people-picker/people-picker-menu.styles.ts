import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    heightNumber,
    neutralFillHoverBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFillRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
    neutralOutlineRestBehavior,
} from "../styles/index";

export const PeoplePickerMenuStyles = css`
    :host {
        z-index: 1000;
        display: flex;
        width: 308px;
        max-height: 100%;
        background: purple;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .suggestions-available-alert,
    .no-suggestions-available-alert {
        height: 0;
        opacity: 0;
        overflow: hidden;
    }

    ::slotted([role="listitem"]) {
        width: 100%;
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
    neutralOutlineRestBehavior,
    forcedColorsStylesheetBehavior(css``)
);
