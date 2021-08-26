import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    bodyFont,
    neutralForegroundRest,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { heightNumber } from "../styles";

export const tabsStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
      ${display("grid")} :host {
        box-sizing: border-box;
        font-family: ${bodyFont};
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampBaseLineHeight};
        color: ${neutralForegroundRest};
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto 1fr;
      }

      .tablist {
        display: grid;
        grid-template-rows: calc(${heightNumber} * 1px); auto;
        grid-template-columns: auto;
        position: relative;
        width: max-content;
        align-self: end;
        grid-column-gap: 8px;
      }

      .start,
      .end {
        align-self: center;
      }

      .tabpanel {
        grid-row: 2;
        grid-column-start: 1;
        grid-column-end: 4;
        position: relative;
      }

      :host(.vertical) {
        grid-template-rows: auto 1fr auto;
        grid-template-columns: auto 1fr;
      }

      :host(.vertical) .tablist {
        grid-row-start: 2;
        grid-row-end: 2;
        display: grid;
        grid-template-rows: auto;
        grid-template-columns: auto 1fr;
        position: relative;
        width: max-content;
        justify-self: end;
        width: 100%;
        grid-row-gap: 8px;
      }

      :host(.vertical) .tabpanel {
        grid-column: 2;
        grid-row-start: 1;
        grid-row-end: 4;
      }

      :host(.vertical) .end {
        grid-row: 3;
      }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                .activeIndicator,
                :host(.vertical) .activeIndicator {
                    forced-color-adjust: none;
                    background: ${SystemColors.Highlight};
                }
            `
        )
    );
