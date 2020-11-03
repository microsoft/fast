import { css } from "@microsoft/fast-element";
import { disabledCursor, display, focusVisible } from "@microsoft/fast-foundation";
import {
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundFocusBehavior,
    neutralFillStealthHoverBehavior,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralFocusInnerAccentBehavior,
    neutralForegroundRestBehavior,
    neutralLayerL1Behavior,
} from "../styles/recipes";
import { heightNumber } from "../styles/size";

export const OptionStyles = css`
    ${display("flex")} :host {
        align-items: center;
        box-sizing: border-box;
        color: ${neutralForegroundRestBehavior.var};
        cursor: pointer;
        min-height: calc(${heightNumber} * 1px);
        padding: calc(var(--design-unit) * 2px + 1px);
        position: relative;
        user-select: none;
    }

    :host(:${focusVisible}) {
        background: ${accentFillHoverBehavior.var};
        border-color: ${neutralFocusBehavior.var};
        box-shadow:
            0 0 0 calc(var(--focus-outline-width) * 1px) inset
            ${neutralFocusInnerAccentBehavior.var};

        color: ${accentForegroundCutRestBehavior.var};
    }

    :host(:hover) {
        background: ${accentFillHoverBehavior.var};
        color: ${accentForegroundCutRestBehavior.var};
    }

    :host(:active),
    :host(.selected) {
        background: ${accentFillActiveBehavior.var};
        color: ${accentForegroundCutRestBehavior.var};
    }

    :host(.disabled) {
        cursor: ${disabledCursor};
        opacity: var(--disabled-opacity);
    }

    :host(.disabled:hover) {
        color: ${neutralForegroundRestBehavior.var};
        fill: currentcolor;
        background: ${neutralFillStealthRestBehavior.var}
    }

    .content {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 100%;
    }
`.withBehaviors(
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundFocusBehavior,
    neutralFillStealthHoverBehavior,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralFocusInnerAccentBehavior,
    neutralForegroundRestBehavior,
    neutralLayerL1Behavior
);
