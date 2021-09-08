import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    TabsOptions,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    bodyFont,
    controlCornerRadius,
    fillColor,
    neutralForegroundRest,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens";
import { heightNumber } from "../styles";

export const tabsStyles: (
    context: ElementDefinitionContext,
    definition: TabsOptions
) => ElementStyles = (context: ElementDefinitionContext, definition: TabsOptions) =>
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
        grid-column-gap: 8px;
        position: relative;
        width: max-content;
        align-self: end;
        background: ${fillColor};
        border-radius: calc(${controlCornerRadius} * 1px);
        padding: 4px;
      }
        :host([disabled]) {
            background: transparent;
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
        grid-row-gap: 8px;
        grid-column-gap: 0;
        position: relative;
        width: max-content;
        justify-self: end;
        width: 100%;
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
