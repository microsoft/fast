import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillRest,
    neutralFillInputRest,
    neutralLayerFloating,
} from "../design-tokens";

export const peoplePickerStyles = css`
    ::slotted([aria-selected="true"][role="listitem"]) {
        background: ${SystemColors.Highlight};
        border-color: ${SystemColors.ButtonText};
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset
            ${SystemColors.HighlightText};
        color: ${SystemColors.HighlightText};
        fill: currentcolor;
    }
`.withBehaviors(forcedColorsStylesheetBehavior(css``));
