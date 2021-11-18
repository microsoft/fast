import { css, ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    ElementDefinitionContext,
    FlipperOptions,
    focusVisible,
    forcedColorsStylesheetBehavior,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { heightNumber } from "../styles";
import {
    designUnit,
    disabledOpacity,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillActive,
    neutralFillFocus,
    neutralFillHover,
    neutralFillRest,
    neutralForegroundActive,
    neutralForegroundFocus,
    neutralForegroundHover,
    neutralForegroundRest,
    strokeWidth,
} from "../design-tokens";

/**
 * Styles for Flipper
 * @public
 */
export const flipperStyles: (
    context: ElementDefinitionContext,
    definition: FlipperOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: FlipperOptions) =>
    css`
    ${display("inline-flex")} :host {
        width: calc((${heightNumber} + ${designUnit}) * 1px);
        height: calc((${heightNumber} + ${designUnit}) * 1px);
        justify-content: center;
        align-items: center;
        margin: 0;
        fill: currentcolor;
        color: ${neutralForegroundRest};
        background: ${neutralFillRest};
        box-sizing: border-box;
        border: calc(${strokeWidth} * 1px) solid transparent;
        border-radius: 50%;
        outline: none;
        padding: 0;
    }
    .next,
    .previous {
        display: flex;
    }
    :host(.disabled) {
        opacity: ${disabledOpacity};
        cursor: ${disabledCursor};
    }
    :host(:not(.disabled):hover) {
        cursor: pointer;
        background: ${neutralFillHover};
        fill: ${neutralForegroundHover};
    }
    :host(:not(.disabled):active) {
        background: ${neutralFillActive};
        fill: ${neutralForegroundActive};
    }
    :host(:${focusVisible}) {
        background: ${neutralFillFocus};
        border-color: ${focusStrokeOuter};
        box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter};
        fill: ${neutralForegroundFocus};
    }
    :host::-moz-focus-inner {
        border: 0;
    }
  `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    background: ${SystemColors.Canvas};
                }
                :host .next,
                :host .previous {
                    color: ${SystemColors.ButtonText};
                    fill: currentcolor;
                }
                :host {
                    background: ${SystemColors.Canvas};
                    border-color: ${SystemColors.ButtonText};
                }
                :host(:not(.disabled):hover) {
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.ButtonText};
                    opacity: 1;
                }
                :host(:not(.disabled):hover) .next,
                :host(:not(.disabled):hover) .previous,
                :host(:${focusVisible}) .next,
                :host(:${focusVisible}) .previous {
                    color: ${SystemColors.HighlightText};
                    fill: currentcolor;
                }
                :host(.disabled) {
                    opacity: 1;
                }
                :host(.disabled),
                :host(.disabled:hover),
                :host(.disabled) .next,
                :host(.disabled) .previous,
                :host(.disabled:hover) .next,
                :host(.disabled:hover) .previous {
                    background: ${SystemColors.Canvas};
                    border-color: ${SystemColors.GrayText};
                    color: ${SystemColors.GrayText};
                    fill: currentcolor;
                }
                :host(:${focusVisible}) {
                    forced-color-adjust: none;
                    background: ${SystemColors.Highlight};
                    border-color: ${SystemColors.Highlight};
                    box-shadow: 0 0 0 2px ${SystemColors.Field}, 0 0 0 4px ${SystemColors.FieldText};
                }
            `
        )
    );
