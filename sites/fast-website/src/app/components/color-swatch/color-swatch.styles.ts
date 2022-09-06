import {
    accentFillRest,
    bodyFont,
    controlCornerRadius,
    density,
    designUnit,
    disabledOpacity,
    focusStrokeOuter,
    foregroundOnAccentRest,
    neutralForegroundRest,
    neutralStrokeHover,
    neutralStrokeRest,
    strokeWidth,
} from "@microsoft/fast-components";
import { heightNumber } from "@microsoft/fast-components/dist/esm/styles/size";
import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";

export const ColorSwatchStyles = css`
    ${display("inline-flex")} :host {
        --input-size: calc((${heightNumber} / 2) + ${designUnit});
        align-items: center;
        outline: none;
        margin: calc(${designUnit} * 1px) 0;
        user-select: none;
        position: relative;
        flex-direction: row;
        transition: all 0.2s ease-in-out;
    }

    .control {
        background: ${accentFillRest};
        color: ${neutralForegroundRest};
        position: relative;
        width: calc(var(--input-size) * 1px);
        height: calc(var(--input-size) * 1px);
        box-sizing: border-box;
        border-radius: calc(${controlCornerRadius} * 1px);
        border: calc(${strokeWidth} * 1px) solid ${neutralStrokeRest};
        outline: none;
        cursor: pointer;
    }

    .label-hidden {
        display: none;
    }

    .label {
        font-family: ${bodyFont};
        color: ${neutralForegroundRest};
        /* TODO: Need to discuss with Brian how HorizontalSpacingNumber can work.
        https://github.com/microsoft/fast/issues/2766 */
        padding-inline-start: calc(${designUnit} * 2px + 2px);
        margin-inline-end: calc(${designUnit} * 2px + 2px);
        cursor: pointer;
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        font-size: calc(1rem + (${density} * 2px));
    }

    .checked-indicator {
        position: absolute;
        top: -1px;
        left: -1px;
        right: -1px;
        bottom: -1px;
        border-radius: calc(${controlCornerRadius} * 1px);
        display: inline-block;
        flex-shrink: 0;
        border: 1px solid ${neutralForegroundRest};
        opacity: 0;
        pointer-events: none;
    }

    ::slotted([slot="checked-indicator"]) {
        align-items: center;
        color: ${foregroundOnAccentRest};
        display: flex;
        fill: currentColor;
        justify-content: center;
    }

    .control:hover {
        border-color: ${neutralStrokeHover};
    }

    :host(:${focusVisible}) .control {
        box-shadow: 0 0 0 1px ${focusStrokeOuter} inset;
        border-color: ${focusStrokeOuter};
    }

    :host(.disabled) .label,
    :host(.readonly) .label,
    :host(.readonly) .control,
    :host(.disabled) .control {
        cursor: ${disabledCursor};
    }

    :host(.checked) .checked-indicator {
        opacity: 1;
    }

    :host(.disabled) {
        opacity: ${disabledOpacity};
    }
`.withBehaviors(
    forcedColorsStylesheetBehavior(
        css`
            .control,
            .control:hover,
            .control:active {
                forced-color-adjust: none;
                border-color: ${SystemColors.FieldText};
                background: ${SystemColors.Field};
            }
            :host(:${focusVisible}) .control {
                border-color: ${SystemColors.Highlight};
            }
            :host(.checked) .control:hover,
            .control:active {
                border-color: ${SystemColors.Highlight};
                background: ${SystemColors.Highlight};
            }
            :host(.checked) .checked-indicator {
                background: ${SystemColors.Highlight};
                fill: ${SystemColors.Highlight};
            }
            :host(.checked) .control:hover .checked-indicator {
                background: ${SystemColors.HighlightText};
                fill: ${SystemColors.HighlightText};
            }
            :host(.disabled) {
                forced-color-adjust: none;
                opacity: 1;
            }
            :host(.disabled) .label {
                color: ${SystemColors.GrayText};
            }
            :host(.disabled) .control,
            :host(.checked.disabled) .control:hover,
            .control:active {
                background: ${SystemColors.Field};
                border-color: ${SystemColors.GrayText};
            }
            :host(.disabled) .checked-indicator,
            :host(.checked.disabled) .control:hover .checked-indicator {
                fill: ${SystemColors.GrayText};
                background: ${SystemColors.GrayText};
            }
        `
    )
);
