import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
    TabsOptions,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    bodyFont,
    controlCornerRadius,
    designUnit,
    fillColor,
    neutralForegroundRest,
    typeRampBaseFontSize,
    typeRampBaseLineHeight,
} from "../design-tokens.js";
import { styleModuleBehavior } from "../style-module/index.js";
import { heightNumber } from "../styles/index.js";

/**
 * Styles for Tabs
 * @public
 */
export const tabsStyles: FoundationElementTemplate<ElementStyles, TabsOptions> = (
    context,
    definition
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
            grid-template-rows: calc(${heightNumber} * 1px) auto;
            grid-template-columns: auto;
            grid-column-gap: calc(${designUnit} * 2px);
            position: relative;
            width: max-content;
            align-self: end;
            background: ${fillColor};
            border-radius: calc(${controlCornerRadius} * 1px);
            padding: calc(${designUnit} * 1px);
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

        :host([orientation="vertical"]) {
            grid-template-rows: auto 1fr auto;
            grid-template-columns: auto 1fr;
        }

        :host([orientation="vertical"]) .tablist {
            grid-row-start: 2;
            grid-row-end: 2;
            display: grid;
            grid-template-rows: auto;
            grid-template-columns: auto 1fr;
            grid-row-gap: calc(${designUnit} * 2px);
            grid-column-gap: 0;
            position: relative;
            width: max-content;
            justify-self: end;
            width: 100%;
        }

        :host([orientation="vertical"]) .tabpanel {
            grid-column: 2;
            grid-row-start: 1;
            grid-row-end: 4;
        }

        :host([orientation="vertical"]) .end {
            grid-row: 3;
        }
    `.withBehaviors(
        styleModuleBehavior(context.type),
        forcedColorsStylesheetBehavior(
            css`
                .activeIndicator,
                :host([orientation="vertical"]) .activeIndicator {
                    forced-color-adjust: none;
                    background: ${SystemColors.Highlight};
                }
            `
        )
    );
