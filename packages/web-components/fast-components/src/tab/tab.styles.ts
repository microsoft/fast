import { css, ElementStyles } from "@microsoft/fast-element";
import {
    disabledCursor,
    display,
    ElementDefinitionContext,
    focusVisible,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    bodyFont,
    controlCornerRadius,
    density,
    designUnit,
    disabledOpacity,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillHover,
    neutralFillRest,
    neutralForegroundHover,
    neutralForegroundRest,
    strokeWidth,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { heightNumber } from "../styles";

export const tabStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
      ${display("inline-flex")} :host {
        box-sizing: border-box;
        font-family: ${bodyFont};
        font-size: ${typeRampBaseFontSize};
        font-weight: 400;
        line-height: ${typeRampBaseLineHeight};
        height: calc(${heightNumber} * 1px);
        padding: 0 calc((6 + (${designUnit} * 2 * ${density})) * 1px);
        color: ${neutralForegroundRest};
        fill: currentcolor;
        background: ${neutralFillRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        border: calc(${strokeWidth} * 1px) solid transparent;
        align-items: center;
        justify-content: center;
        grid-row: 1 / 3;
        cursor: pointer;
        outline: none;
      }

      :host([aria-selected="true"]) {
        z-index: 2;
        background: ${neutralFillHover};
        color: ${neutralForegroundHover};
      }

      :host(:hover),
      :host(:active),
      :host(.vertical:hover),
      :host(.vertical:active) {
        color: ${neutralForegroundHover};
      }

      :host(:${focusVisible}) {
        border-color: ${focusStrokeOuter};
        box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${focusStrokeOuter} inset;
        color: ${neutralForegroundHover};
      }

      :host([disabled]) {
        cursor: ${disabledCursor};
        opacity: ${disabledOpacity};
    }

      :host(.vertical) {
        justify-content: start;
        grid-column: 1 / 3;
      }

      :host(.vertical[aria-selected="true"]) {
        z-index: 2;
      }

      :host(.vertical:hover[aria-selected="true"]) {
      }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
          :host {
            background: ${SystemColors.ButtonFace};
            color: ${SystemColors.ButtonText};
            fill: currentcolor;
          }
          :host(:hover),
          :host(.vertical:hover),
          :host([aria-selected="true"]),
          :host([aria-selected="true"]:hover) {
            border-color: ${SystemColors.Highlight};
            color: ${SystemColors.Highlight};
            fill: currentcolor;
          }
          :host(:${focusVisible}) {
            forced-color-adjust: none;
            background: ${SystemColors.ButtonFace};
            border-color: ${SystemColors.Highlight};
            box-shadow: 0 0 0 calc(${focusStrokeWidth} * 1px) ${SystemColors.Highlight} inset;
          }
        `
        )
    );
