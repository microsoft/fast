import { css, ElementStyles } from "@microsoft/fast-element";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
    SliderOptions,
} from "@microsoft/fast-foundation";
import { heightNumber } from "../styles";
import {
    accentForegroundRest,
    controlCornerRadius,
    density,
    designUnit,
    disabledOpacity,
    fillColor,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralForegroundActive,
    neutralForegroundFocus,
    neutralForegroundHover,
    neutralForegroundRest,
    neutralStrokeRest,
    strokeControlStrongActive,
    strokeControlStrongHover,
    strokeControlStrongRest,
    strokeWidth,
} from "../design-tokens";

/**
 * Styles for Slider
 * @public
 */
export const sliderStyles: FoundationElementTemplate<ElementStyles, SliderOptions> = (
    context,
    definition
) =>
    css`
        ${display("inline-grid")} :host {
            --thumb-size: calc((${heightNumber} / 2) + ${designUnit});
            --thumb-translate: calc(var(--thumb-size) * 0.5);
            --track-overhang: calc((${designUnit} / 2) * -1);
            --track-width: calc(${designUnit} / 2);
            align-items: center;
            width: 100%;
            margin: calc(${designUnit} * 1px) 0;
            user-select: none;
            box-sizing: border-box;
            border-radius: calc(${controlCornerRadius} * 1px);
            outline: none;
            cursor: pointer;
        }

        :host([orientation="horizontal"]) .positioning-region {
            position: relative;
            margin: 0 8px;
            display: grid;
            grid-template-rows: calc(var(--thumb-size) * 1px) 1fr;
        }

        :host([orientation="vertical"]) .positioning-region {
            position: relative;
            margin: 0 8px;
            display: grid;
            height: 100%;
            grid-template-columns: calc(var(--thumb-size) * 1px) 1fr;
        }

        .thumb-container {
            position: absolute;
            height: calc(var(--thumb-size) * 1px);
            width: calc(var(--thumb-size) * 1px);
            transition: all 0.2s ease;
        }

        .thumb-cursor {
            display: flex;
            position: relative;
            border: none;
            width: calc(var(--thumb-size) * 1px);
            height: calc(var(--thumb-size) * 1px);
            background: ${fillColor};
            border: calc(${strokeWidth} * 1px) solid ${strokeControlStrongRest};
            border-radius: 50%;
            box-sizing: border-box;
        }

        :host(:not([disabled])) .thumb-cursor:hover {
            background: ${neutralForegroundHover};
            border-color: ${strokeControlStrongHover};
        }

        :host(:not([disabled])) .thumb-cursor:active {
            background: ${neutralForegroundActive};
            border-color: ${strokeControlStrongActive};
        }

        :host(:${focusVisible}) .thumb-cursor {
            background: ${neutralForegroundFocus};
            border-color: ${fillColor};
            outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
        }

        .track-start {
            background: ${accentForegroundRest};
            position: absolute;
            height: 100%;
            left: 0;
            border-radius: calc(${controlCornerRadius} * 1px);
        }

        :host([orientation="horizontal"]) .thumb-container {
            transform: translateX(calc(var(--thumb-translate) * 1px));
        }

        :host([orientation="vertical"]) .thumb-container {
            transform: translateY(calc(var(--thumb-translate) * 1px));
        }

        :host([orientation="horizontal"]) {
            min-width: calc(var(--thumb-size) * 1px);
        }

        :host([orientation="horizontal"]) .track {
            right: calc(var(--track-overhang) * 1px);
            left: calc(var(--track-overhang) * 1px);
            align-self: start;
            margin-top: calc((${designUnit} + calc(${density} + 5)) * 1px);
            height: calc(var(--track-width) * 1px);
        }

        :host([orientation="vertical"]) .track {
            top: calc(var(--track-overhang) * 1px);
            bottom: calc(var(--track-overhang) * 1px);
            margin-inline-start: calc((${designUnit} + calc(${density} + 5)) * 1px);
            width: calc(var(--track-width) * 1px);
            height: 100%;
        }

        .track {
            background: ${neutralStrokeRest};
            border: 1px solid ${neutralStrokeRest};
            border-radius: 2px;
            box-sizing: border-box;
            position: absolute;
        }

        :host([orientation="vertical"]) {
            height: 100%;
            min-height: calc(${designUnit} * 60px);
            min-width: calc(${designUnit} * 20px);
        }

        :host([orientation="vertical"]) .track-start {
            height: auto;
            width: 100%;
            top: 0;
        }

        :host([disabled]),
        :host(.readonly) {
            cursor: ${disabledCursor};
        }

        :host([disabled]) {
            opacity: ${disabledOpacity};
        }

        ::slotted([slot="thumb"]) {
            color: ${neutralForegroundRest};
            fill: currentcolor;
        }
  `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                .thumb-cursor {
                    forced-color-adjust: none;
                    border-color: ${SystemColors.FieldText};
                    background: ${SystemColors.FieldText};
                }

                :host(:not([disabled])) .thumb-cursor:hover,
                :host(:not([disabled])) .thumb-cursor:active {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.Highlight};
                }

                .track {
                    background: ${SystemColors.FieldText};
                }

                :host(:${focusVisible}) .thumb-cursor {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.Highlight};
                    box-shadow: 0 0 0 2px ${SystemColors.Field}, 0 0 0 4px ${SystemColors.FieldText};
                }

                :host([disabled]) {
                    opacity: 1;
                }

                :host([disabled]) .track,
                :host([disabled]) .thumb-cursor {
                    forced-color-adjust: none;
                    background: ${SystemColors.GrayText};
                }
            `
        )
    );
