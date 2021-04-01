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

export const PeoplePickerListStyles = css`
    :host {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        z-index: 1000;
    }

    ::slotted(.input-element) {
        box-sizing: border-box;
        background: ${neutralFillInputRestBehavior.var};
        color: ${neutralForegroundRestBehavior.var};
        border-width: 0;
        outline: 0;
        min-width: 260px;
        width: auto;
        height: 58px;
        margin: 0 8px;
    }
    
    ::slotted([role="listitem"]) {
        min-width: 260px;
        min-height: 58px;
    }

    ::slotted(:${focusVisible}[role="listitem"]) {
        background: ${SystemColors.Highlight};
        border-color: ${SystemColors.ButtonText};
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset ${SystemColors.HighlightText};
        color: ${SystemColors.HighlightText};
        fill: currentcolor;
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
