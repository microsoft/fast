import { css, ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    focusVisible,
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
    SliderOptions,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentForegroundRest,
    controlCornerRadius,
    designUnit,
    disabledOpacity,
    fillColor,
    focusStrokeOuter,
    neutralForegroundRest,
    neutralStrokeHover,
    neutralStrokeRest,
} from "../design-tokens.js";
import { DirectionalStyleSheetBehavior, heightNumber } from "../styles/index.js";

const ltr = css`
    .track-start {
        left: 0;
    }
`;

const rtl = css`
    .track-start {
        right: 0;
    }
`;

/**
 * Styles for Slider
 * @public
 */
export const sliderStyles: FoundationElementTemplate<ElementStyles, SliderOptions> = (
    context,
    definition
) =>
    css`
        :host([hidden]) {
            display: none;
        }

        ${display("inline-grid")} :host {
            --thumb-size: calc(${heightNumber} * 0.5 - ${designUnit});
            --thumb-translate: calc(var(--thumb-size) * -0.5 + var(--track-width) / 2);
            --track-overhang: calc((${designUnit} / 2) * -1);
            --track-width: ${designUnit};
            --fast-slider-height: calc(var(--thumb-size) * 10);
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

        :host(:${focusVisible}) .thumb-cursor {
            box-shadow: 0 0 0 2px ${fillColor}, 0 0 0 4px ${focusStrokeOuter};
        }

        .thumb-container {
            position: absolute;
            height: calc(var(--thumb-size) * 1px);
            width: calc(var(--thumb-size) * 1px);
            transition: all 0.2s ease;
            color: ${neutralForegroundRest};
            fill: currentcolor;
        }
        .thumb-cursor {
            border: none;
            width: calc(var(--thumb-size) * 1px);
            height: calc(var(--thumb-size) * 1px);
            background: ${neutralForegroundRest};
            border-radius: calc(${controlCornerRadius} * 1px);
        }
        .thumb-cursor:hover {
            background: ${neutralForegroundRest};
            border-color: ${neutralStrokeHover};
        }
        .thumb-cursor:active {
            background: ${neutralForegroundRest};
        }
        .track-start {
            background: ${accentForegroundRest};
            position: absolute;
            height: 100%;
            left: 0;
            border-radius: calc(${controlCornerRadius} * 1px);
        }
        :host([orientation="horizontal"]) .thumb-container {
            transform: translateX(calc(var(--thumb-size) * 0.5px)) translateY(calc(var(--thumb-translate) * 1px));
        }
        :host([orientation="vertical"]) .thumb-container {
            transform: translateX(calc(var(--thumb-translate) * 1px)) translateY(calc(var(--thumb-size) * 0.5px));
        }
        :host([orientation="horizontal"]) {
            min-width: calc(var(--thumb-size) * 1px);
        }
        :host([orientation="horizontal"]) .track {
            right: calc(var(--track-overhang) * 1px);
            left: calc(var(--track-overhang) * 1px);
            align-self: start;
            height: calc(var(--track-width) * 1px);
        }
        :host([orientation="vertical"]) .track {
            top: calc(var(--track-overhang) * 1px);
            bottom: calc(var(--track-overhang) * 1px);
            width: calc(var(--track-width) * 1px);
            height: 100%;
        }
        .track {
            background: ${neutralStrokeRest};
            position: absolute;
            border-radius: calc(${controlCornerRadius} * 1px);
        }
        :host([orientation="vertical"]) {
            height: calc(var(--fast-slider-height) * 1px);
            min-height: calc(var(--thumb-size) * 1px);
            min-width: calc(${designUnit} * 20px);
        }
        :host([orientation="vertical"]) .track-start {
            height: auto;
            width: 100%;
            top: 0;
        }
        :host([disabled]), :host([readonly]) {
            cursor: ${disabledCursor};
        }
        :host([disabled]) {
            opacity: ${disabledOpacity};
        }
    `.withBehaviors(
        new DirectionalStyleSheetBehavior(ltr, rtl),
        forcedColorsStylesheetBehavior(
            css`
                .thumb-cursor {
                    forced-color-adjust: none;
                    border-color: ${SystemColors.FieldText};
                    background: ${SystemColors.FieldText};
                }
                .thumb-cursor:hover,
                .thumb-cursor:active {
                    background: ${SystemColors.Highlight};
                }
                .track {
                    forced-color-adjust: none;
                    background: ${SystemColors.FieldText};
                }
                :host(:${focusVisible}) .thumb-cursor {
                    border-color: ${SystemColors.Highlight};
                }
                :host([disabled]) {
                    opacity: 1;
                }
                :host([disabled]) .track,
                :host([disabled]) .thumb-cursor {
                    forced-color-adjust: none;
                    background: ${SystemColors.GrayText};
                }

                :host(:${focusVisible}) .thumb-cursor {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.Highlight};
                    box-shadow: 0 0 0 2px ${SystemColors.Field}, 0 0 0 4px ${SystemColors.FieldText};
                }
            `
        )
    );
