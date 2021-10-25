import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    TextFieldOptions,
} from "@microsoft/fast-foundation";
import { designUnit } from "..";
import {
    accentFillRest,
    bodyFont,
    controlCornerRadius,
    neutralFillHover,
    neutralFillInputRest,
    neutralFillRest,
    neutralForegroundRest,
    neutralStrokeDividerRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { elevation } from "../styles/elevation";
import { heightNumber } from "../styles";

export const datePickerStyles = css`
    ${display("inline-block")} :host {
        font-family: ${bodyFont};
        outline: none;
        user-select: none;
    }

    :host {
        --cell-size: 30px;
        --panel-width: calc(var(--cell-size) * 7);
        --panel-height: calc(var(--panel-width) + 30px);
    }

    .root {
        box-sizing: border-box;
        position: relative;
        display: flex;
        flex-direction: row;
        color: ${neutralForegroundRest};
        background: ${neutralFillInputRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        border: calc(${strokeWidth} * 1px) solid ${accentFillRest};
        height: calc(${heightNumber} * 1px);
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        height: calc(100% - 4px);
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
        padding: 0 calc(${designUnit} * 2px + 1px);
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        vertical-align: middle;
    }

    .icon {
        margin: auto;
        margin-inline-end: calc(${designUnit} * 3px);
    }

    .flyout {
        --elevation: 14;
        ${elevation}
        height: calc(var(--panel-height) + 20px);
        padding: calc(${designUnit} * 3px);
        position: absolute;
        display: none;
        z-index: 1;
        background: ${neutralFillInputRest};
        border-radius: calc(${controlCornerRadius} * 1px);
    }

    .flyout.open {
        display: inline-block;
    }

    .time-picker,
    .calendar,
    .picker {
        --cell-height: var(--cell-size);
        width: var(--panel-width);
        height: var(--panel-height);
        display: inline-block;
        margin: 0 calc(${designUnit} * 2px);
        vertical-align: top;
    }

    * + .picker,
    * + .time-picker {
        border-left: calc(${strokeWidth} * 1px) solid ${neutralStrokeDividerRest};
        padding-left: calc(${designUnit} * 3px);
    }

    .calendar::part(title) {
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        text-align: left;
    }

    .calendar::part(date),
    .calendar::part(today) {
        padding: 0;
    }

    .calendar::part(day):hover {
        background: ${neutralFillHover};
    }

    .picker-grid {
        margin-top: calc(${designUnit} * 5px);
    }

    .picker-row {
        border: 0;
        grid-gap: calc(${designUnit} * 1px);
        margin-bottom: calc(${designUnit} * 1px);
    }

    .picker-cell {
        height: calc(var(--cell-size) * 1.5);
        width: calc(var(--cell-size) * 1.5);
        display: grid;
        align-items: center;
        background: ${neutralFillRest};
        cursor: pointer;
        padding: 0;
        text-align: center;
    }

    .picker-cell:hover {
        background: ${neutralFillHover};
    }

    .time-picker {
        display: inline-grid;
        grid-template-columns: 1fr auto 1fr 1fr;
    }

    .scroller {
        height: 100%;
        overflow: hidden;
    }

    .scroller:hover {
        overflow-y: overlay;
    }

    .listbox {
        width: 100%;
    }
`;
