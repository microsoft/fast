import { css } from "@microsoft/fast-element";
import { display, focusVisible } from "@microsoft/fast-foundation";
import {
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundFocusBehavior,
    neutralFillStealthHoverBehavior,
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
        height: calc(${heightNumber} * 1px);
        padding: calc(var(--design-unit) * 2px + 1px);
        position: relative;
    }

    :host(:${focusVisible}),
    :host(.selected) {
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset ${
            neutralFocusInnerAccentBehavior.var
        };
        border-color: ${neutralFocusBehavior.var};
        background: ${accentFillHoverBehavior.var};
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

    /* :host(.selected) {
        color: ${accentForegroundFocusBehavior.var};
    } */
`.withBehaviors(
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundFocusBehavior,
    neutralFillStealthHoverBehavior,
    neutralFocusBehavior,
    neutralFocusInnerAccentBehavior,
    neutralForegroundRestBehavior,
    neutralLayerL1Behavior
);
