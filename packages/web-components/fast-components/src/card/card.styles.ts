import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    fillColor,
    layerCornerRadius,
    neutralForegroundRest,
    strokeWidth,
} from "../design-tokens.js";
import { styleModuleBehavior } from "../style-module/index.js";

/**
 * Styles for Card
 * @public
 */
export const cardStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) =>
    css`
        ${display("block")} :host {
            display: block;
            contain: content;
            height: var(--card-height, 100%);
            width: var(--card-width, 100%);
            box-sizing: border-box;
            background: ${fillColor};
            border: calc(${strokeWidth} * 1px) solid transparent;
            border-radius: calc(${layerCornerRadius} * 1px);
            color: ${neutralForegroundRest};
        }
        :host {
            content-visibility: auto;
        }
    `.withBehaviors(
        styleModuleBehavior(context.type),
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    background: ${SystemColors.Canvas};
                    color: ${SystemColors.CanvasText};
                    fill: currentcolor;
                }
            `
        )
    );
