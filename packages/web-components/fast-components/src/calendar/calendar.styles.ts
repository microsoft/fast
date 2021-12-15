import { css } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { focusVisible } from "@microsoft/fast-foundation";
import { heightNumber } from "../styles/index";
import {
    accentFillRest,
    accentForegroundRest,
    bodyFont,
    controlCornerRadius,
    designUnit,
    disabledOpacity,
    fillColor,
    focusStrokeInner,
    focusStrokeOuter,
    focusStrokeWidth,
    foregroundOnAccentRest,
    neutralFillHover,
    neutralFillRest,
    neutralForegroundHint,
    neutralForegroundHover,
    neutralForegroundRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
    typeRampPlus3FontSize,
    typeRampPlus3LineHeight,
} from "../design-tokens";

/**
 * Styles for Calendar
 * @public
 */
export const CalendarStyles = css`
    ${display("block")} :host {
        --cell-border: none;
        --cell-height: calc(${heightNumber} * 1px);
        --selected-day-outline: 1px solid ${accentForegroundRest};
        --selected-day-color: ${accentForegroundRest};
        --selected-day-background: ${neutralFillRest};
        --cell-padding: calc(${designUnit} * 1px);
        --disabled-day-opacity: ${disabledOpacity};
        --disabled-day-outline: 1px solid  ${neutralForegroundHint};
        --inactive-day-outline: 1px solid transparent;
        --inactive-day-color: ${neutralForegroundHint};
        border-radius: calc(${controlCornerRadius} * 1px);
        font-family: ${bodyFont};
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        color: ${neutralForegroundRest};
        background: ${fillColor};
    }

    .title {
        font-size: ${typeRampPlus3FontSize};
        line-height: ${typeRampPlus3LineHeight};
        padding: var(--cell-padding);
        text-align: center;
    }

    .week-days,
    .week {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-left: var(--cell-border, none);
        border-bottom: none;
        padding: 0;
    }

    .interact .week {
        grid-gap: calc(${designUnit} * 1px);
        margin-top: calc(${designUnit} * 1px);
    }

    .day,
    .week-day {
        border-bottom: var(--cell-border);
        border-right: var(--cell-border);
        padding: var(--cell-padding);
    }

    .week-day {
        text-align: center;
        border-radius: 0;
        border-top: var(--cell-border);
    }

    .day {
        box-sizing: border-box;
        vertical-align: top;
        outline-offset: -1px;
        line-height: var(--cell-line-height);
        white-space: normal;
    }

    .day:${focusVisible},
    .week-day:${focusVisible} {
        border-color: transparent;
        border-radius: calc(${controlCornerRadius} * 1px);
        box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter} inset;
        outline: none;
    }

    .today:not(.disabled, .inactive):${focusVisible} {
        border-color: ${focusStrokeOuter};
        box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${focusStrokeOuter} inset,
              0 0 0 calc(((${focusStrokeWidth} * 2) - ${strokeWidth}) * 1px) ${focusStrokeInner} inset ;
    }

    .interact .day {
        background: ${neutralFillRest};
        color: ${neutralForegroundRest};
        cursor: pointer;
    }

    .interact .day:not(.disabled, .inactive):hover {
        background: ${neutralFillHover};
        color: ${neutralForegroundHover};
        outline: none;
    }

    .day.inactive {
        background: var(--inactive-day-background);
        color: var(--inactive-day-color);
        opacity: var(--inactive-day-opacity);
        outline: var(--inactive-day-outline);
    }

    .day.disabled {
        background: var(--disabled-day-background);
        color: var(--disabled-day-color);
        cursor: ${disabledCursor};
        opacity: var(--disabled-day-opacity);
        outline: var(--disabled-day-outline);
    }

    .day.selected,
    .day.selected:not(.disabled, .inactive):hover {
        background: var(--selected-day-background);
        color: var(--selected-day-color);
        outline: var(--selected-day-outline);
    }

    .date {
        padding: var(--cell-padding);
        text-align: center;
    }

    .interact .today,
    .today,
    .interact .today:not(.disabled, .inactive):hover {
        background: ${accentFillRest};
        color: ${foregroundOnAccentRest};
        border-radius: calc(${controlCornerRadius} * 1px);
    }

    .today.inactive .date {
        background: transparent;
        color: inherit;
        width: auto;
    }
`.withBehaviors(
    forcedColorsStylesheetBehavior(
        css`
            :host {
                forced-color-adjust: auto;
                background: ${SystemColors.ButtonFace};
                outline: 1px solid ${SystemColors.CanvasText};
            }

            .day,
            .interact .day,
            .week-day {
                background: ${SystemColors.Canvas};
                color: ${SystemColors.CanvasText};
                fill: currentcolor;
            }

            .interact .day:not(.disabled, .inactive):hover {
                background: ${SystemColors.ButtonFace};
                color: ${SystemColors.ButtonText};
                outline: 1px solid ${SystemColors.Highlight};
            }

            .week-day:${focusVisible},
            .interact .day:not(.disabled, .inactive):${focusVisible} {
                forced-color-adjust: none;
                background: :${SystemColors.ButtonFace};
                border-color: transparent;
                box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.Highlight} inset;
                outline: none;
            }

            .day.disabled,
            .day.inactive {
                color: ${SystemColors.GrayText};
                opacity:1;
                outline: none;
            }

            .day.inactive:${focusVisible} {
                outline: calc(${focusStrokeWidth} * 1px) solid ${SystemColors.GrayText};
                box-shadow: none;
            }

            .day.selected,
            .day.selected:not(.disabled, .inactive):hover {
                color: ${SystemColors.Highlight};
                outline: 1px solid ${SystemColors.Highlight}
            }

            .interact .today,
            .today,
            .today .date ,
            .interact .today:not(.disabled, .inactive):hover {
                forced-color-adjust: none;
                background: ${SystemColors.Highlight};
                color: ${SystemColors.HighlightText};
                fill: currentcolor;
            }

            .interact .today:not(.disabled, .inactive):${focusVisible} {
                box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${SystemColors.Highlight} inset,
                    0 0 0 calc(((${focusStrokeWidth} * 2) - ${strokeWidth}) * 1px) ${SystemColors.HighlightText} inset ;
            }
        `
    )
);
