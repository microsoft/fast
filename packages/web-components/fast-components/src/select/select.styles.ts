import { css } from "@microsoft/fast-element";
import { disabledCursor, display, focusVisible } from "@microsoft/fast-foundation";
import {
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    neutralFillInputActiveBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFillStealthRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior,
} from "../styles/recipes";
import { heightNumber } from "../styles/size";
import { elevation } from "../styles/elevation";

export const SelectStyles = css`
    ${display("inline-flex")} :host {
        --elevation: 14;
        color: ${neutralForegroundRestBehavior.var};
        contain: contents;
        position: relative;
        user-select: none;
        min-width: 250px;
    }

    :host(:${focusVisible}) .control {
        box-shadow:
            0 0 0 2px var(--background-color),
            0 0 0 4px ${neutralFocusBehavior.var};
    }

    :host(:${focusVisible}) .control,
    :host(:${focusVisible}) .listbox {
        border-color: ${neutralFocusBehavior.var};
    }

    .listbox {
        ${elevation}
        background: var(--background-color);
        border: calc(var(--outline-width) * 1px) solid ${accentFillRestBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        left: 0;
        max-height: calc(var(--max-height) - (${heightNumber} * 1px));
        overflow-y: auto;
        position: absolute;
        width: 100%;
        z-index: 1;
    }

    .control {
        background: ${neutralFillInputRestBehavior.var};
        border-radius: calc(var(--corner-radius) * 1px);
        border: calc(var(--outline-width) * 1px) solid ${accentFillRestBehavior.var};
        box-sizing: border-box;
        color: ${neutralForegroundRestBehavior.var};
        cursor: pointer;
        display: flex;
        font-size: var(--type-ramp-base-font-size);
        font: inherit;
        height: calc(${heightNumber} * 1px);
        line-height: var(--type-ramp-base-line-height);
        padding: calc(var(--design-unit) * 2px + 1px);
        width: 100%;
    }

    .control:hover {
        background: ${neutralFillInputHoverBehavior.var};
        border-color: ${accentFillHoverBehavior.var};
    }

    :host(:not(.disabled)) .control:active {
        background: ${neutralFillInputActiveBehavior.var};
        border-color: ${accentFillActiveBehavior.var};
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

    :host(.disabled) .control {
        cursor: ${disabledCursor};
    }

    .selected-value {
        flex: 1 1 auto;
        text-align: start;
    }

    .indicator {
        flex: 0 0 auto;
    }

    :host slot[name="listbox"] {
        display: none;
        width: 100%;
    }

    :host(.open) slot[name="listbox"] {
        display: flex;
        position: absolute;
        ${elevation}
    }

    :host(.open.above) .listbox {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        bottom: calc(${heightNumber} * 1px);
    }

    :host(.open.below) .listbox {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        top: calc(${heightNumber} * 1px);
    }

    :host .end {
        margin-inline-start: auto;
    }

    .start,
    .end,
    .indicator,
    ::slotted(svg) {
        ${`` /* Glyph size is temporary - replace when glyph-size var is added */}
        fill: ${neutralForegroundRestBehavior.var};
        height: 16px;
        width: 16px;
    }

`.withBehaviors(
    accentFillActiveBehavior,
    accentFillHoverBehavior,
    accentFillRestBehavior,
    neutralFillInputActiveBehavior,
    neutralFillInputHoverBehavior,
    neutralFillInputRestBehavior,
    neutralFocusBehavior,
    neutralForegroundRestBehavior
);
