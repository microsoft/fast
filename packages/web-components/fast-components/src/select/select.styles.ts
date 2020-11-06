import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { elevation } from "../styles/elevation";
import {
    accentFillActiveBehavior,
    accentFillFocusBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundFocusBehavior,
    neutralFillInputActiveBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralFocusInnerAccentBehavior,
    neutralForegroundRestBehavior,
    neutralLayerFloatingBehavior,
    neutralOutlineRestBehavior,
} from "../styles/recipes";
import { heightNumber } from "../styles/size";

export const SelectStyles = css`
    ${display("inline-flex")} :host {
        --elevation: 14;
        color: ${neutralForegroundRestBehavior.var};
        contain: contents;
        position: relative;
        user-select: none;
        min-width: 250px;
    }

    .listbox {
        ${elevation}
        background: ${neutralLayerFloatingBehavior.var};
        border: calc(var(--outline-width) * 1px) solid ${neutralOutlineRestBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        box-sizing: border-box;
        display: inline-flex;
        flex-direction: column;
        left: 0;
        max-height: calc(var(--max-height) - (${heightNumber} * 1px));
        padding: calc(var(--design-unit) * 1px) 0;
        overflow-y: auto;
        position: absolute;
        width: 100%;
        z-index: 1;
    }

    .listbox[hidden] {
        display: none;
    }

    .control {
        align-items: center;
        background: ${neutralFillInputRestBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid ${accentFillRestBehavior.var};
        box-sizing: border-box;
        color: ${neutralForegroundRestBehavior.var};
        cursor: pointer;
        display: flex;
        font-size: var(--type-ramp-base-font-size);
        font: inherit;
        line-height: var(--type-ramp-base-line-height);
        min-height: calc(${heightNumber} * 1px);
        padding: calc(var(--design-unit) * 2.25px);
        width: 100%;
    }

    .control:hover {
        background: ${neutralFillInputHoverBehavior.var};
        border-color: ${accentFillHoverBehavior.var};
    }

    :host(:focus) .control {
        border-color: ${accentFillFocusBehavior.var};
    }

    :host(:${focusVisible}) .control {
        border-color: ${accentFillFocusBehavior.var};
        box-shadow:
            0 0 0 2px var(--background-color),
            0 0 0 4px ${neutralFocusBehavior.var};
    }

    :host(:${focusVisible}) ::slotted(.selected[role="option"]) {
        box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset ${
            neutralFocusInnerAccentBehavior.var
        };
        border-color: ${neutralFocusBehavior.var};
        background: ${accentFillHoverBehavior.var};
        color: ${accentForegroundCutRestBehavior.var};
    }

    :host(.disabled) {
        cursor: ${disabledCursor};
        opacity: var(--disabled-opacity);
    }

    :host(.disabled) .control {
        cursor: ${disabledCursor};
    }

    :host(.disabled:hover) {
        background: ${neutralFillStealthRestBehavior.var};
        color: ${neutralForegroundRestBehavior.var};
        fill: currentcolor;
    }

    :host(:not(.disabled)) .control:active {
        background: ${neutralFillInputActiveBehavior.var};
        border-color: ${accentFillActiveBehavior.var};
    }

    :host(.open.above) .listbox,
    :host(.open.below) .control {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
    }

    :host(.open.above) .control,
    :host(.open.below) .listbox {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    :host(.open.above) .listbox {
        border-bottom: 0;
        bottom: calc(${heightNumber} * 1px);
    }

    :host(.open.below) .listbox {
        border-top: 0;
        top: calc(${heightNumber} * 1px);
    }

    .selected-value {
        flex: 1 1 auto;
        text-align: start;
    }

    .indicator {
        flex: 0 0 auto;
        margin-inline-start: 1em;
    }

    slot[name="listbox"] {
        display: none;
        width: 100%;
    }

    :host(.open) slot[name="listbox"] {
        display: flex;
        position: absolute;
        ${elevation}
    }

    .end {
        margin-inline-start: auto;
    }

    .start,
    .end,
    .indicator,
    ::slotted(svg) {
        ${`` /* Glyph size is temporary - replace when glyph-size var is added */}
        fill: ${neutralForegroundRestBehavior.var};
        height: 1em;
        min-height: calc(var(--design-unit) * 4px);
        min-width: calc(var(--design-unit) * 4px);
        width: 1em;
    }

    ::slotted([role="option"]) {
        flex: 0 0 auto;
    }

`.withBehaviors(
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    accentForegroundCutRestBehavior,
    accentForegroundFocusBehavior,
    forcedColorsStylesheetBehavior(
        css`
            :host([disabled]) {
                opacity: 1;
            }

            .button:disabled {
                background: ${SystemColors.ButtonFace}
            }

            :host(:${focusVisible}) ::slotted(.selected[role="option"]) {
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.ButtonText};
                box-shadow: 0 0 0 calc(var(--focus-outline-width) * 1px) inset ${SystemColors.HighlightText};
                color: ${SystemColors.HighlightText};
                fill: currentcolor;
            }
        `
    ),
    neutralFillInputActiveBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFocusBehavior,
    neutralFocusInnerAccentBehavior,
    neutralForegroundRestBehavior,
    neutralLayerFloatingBehavior,
    neutralOutlineRestBehavior
);
