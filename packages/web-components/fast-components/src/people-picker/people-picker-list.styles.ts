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
