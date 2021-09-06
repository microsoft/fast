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
import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    disabledOpacity,
    focusStrokeInner,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillActive,
    neutralFillFocus,
    neutralFillHover,
    neutralFillRest,
    neutralFillStrongHover,
    neutralForegroundActive,
    neutralForegroundFocus,
    neutralForegroundHover,
    neutralForegroundRest,
} from "../design-tokens";
import { heightNumber } from "../styles/index";

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
      border: calc(${focusStrokeWidth} * 1px) solid transparent;
      border-radius: 50%;
      outline: none;
      padding: 0;
    }

    .next,
    .previous {
        position: relative;
        /* TODO: adaptive typography https://github.com/microsoft/fast/issues/2432 */
        width: 16px;
        height: 16px;
        display: grid;
    }

    :host([disabled]) {
        opacity: ${disabledOpacity};
        cursor: ${disabledCursor};
        fill: currentcolor;
        color: ${neutralForegroundRest};
    }

    :host([disabled])::before,
    :host([disabled]:hover)::before,
    :host([disabled]:active)::before {
        background: ${neutralFillStealthRest};
        border-color: ${neutralStrokeRest};
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
            :host::before {
                background: ${SystemColors.Canvas};
                border-color: ${SystemColors.ButtonText};
            }
            :host(:hover)::before {
                forced-color-adjust: none;
                background: ${SystemColors.Highlight};
                border-color: ${SystemColors.ButtonText};
                opacity: 1;
            }
            :host(:hover) .next,
            :host(:hover) .previous  {
                forced-color-adjust: none;
                color: ${SystemColors.HighlightText};
                fill: currentcolor;
            }
            :host([disabled]) {
                opacity: 1;
            }
            :host([disabled])::before,
            :host([disabled]:hover)::before,
            :host([disabled]) .next,
            :host([disabled]) .previous {
                forced-color-adjust: none;
                background: ${SystemColors.Canvas};
                border-color: ${SystemColors.GrayText};
                color: ${SystemColors.GrayText};
                fill: ${SystemColors.GrayText};
            }
            :host(:${focusVisible})::before {
                forced-color-adjust: none;
                border-color: ${SystemColors.Highlight};
                box-shadow: 0 0 0 calc((${focusStrokeWidth} - ${strokeWidth}) * 1px) ${SystemColors.Highlight} inset;
            }
        `
        )
    );
