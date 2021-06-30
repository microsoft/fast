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
    :host {
        background: ${neutralFillInputRest};
        display: block;
        width: auto;
        border: calc(var(--outline-width) * 1px) solid ${accentFillRest};
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
        background: ${neutralLayerFloating};
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
`.withBehaviors(forcedColorsStylesheetBehavior(css``));
