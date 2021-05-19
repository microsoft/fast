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
    neutralLayerFloatingBehavior,
    neutralOutlineRestBehavior,
} from "../styles/index";

export const PeoplePickerStyles = css`
    :host {
        background: ${neutralFillInputRestBehavior.var};
        display: block;
        width: auto;
        border: calc(var(--outline-width) * 1px) solid ${accentFillRestBehavior.var};
        margin: 0;
        border-radius: calc(var(--corner-radius) * 1px);
        position: relative;
    }

    .region {
        z-index: 1000;
        overflow: hidden;
        display: flex;
    }

    .loaded {
        opacity: 1;
        pointer-events: none;
    }

    .loading-display,
    .no-options-display {
        background: ${neutralLayerFloatingBehavior.var};
        width: 100%;
        height: 120px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-items: center;
        padding: 8px;
    }

    .loading-progress {
        width: 42px;
        height: 42px;
    }

    .bottom {
        flex-direction: column;
    }

    .top {
        flex-direction: column-reverse;
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
