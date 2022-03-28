import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    designUnit,
    fillColor,
    layerCornerRadius,
    neutralForegroundRest,
    neutralStrokeDividerRest,
    strokeWidth,
} from "../design-tokens.js";
import { styleModuleBehavior } from "../style-module/index.js";

/**
 * Styles for Menu
 * @public
 */
export const menuStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) =>
    css`
        ${display("block")} :host {
            background: ${fillColor};
            border: calc(${strokeWidth} * 1px) solid transparent;
            border-radius: calc(${layerCornerRadius} * 1px);
            margin: 0;
            border-radius: calc(${layerCornerRadius} * 1px);
            padding: calc((${designUnit} * 2) * 1px);
            max-width: 368px;
            min-width: 64px;
            color: ${neutralForegroundRest};
        }
        :host([slot="submenu"]) {
            width: max-content;
            margin: 0 calc(${designUnit} * 2px);
        }
        ::slotted(hr) {
            box-sizing: content-box;
            height: 0;
            margin: calc(${designUnit} * 1px) 0;
            border: none;
            border-top: calc(${strokeWidth} * 1px) solid ${neutralStrokeDividerRest};
        }
    `.withBehaviors(
        styleModuleBehavior(context.type),
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    background: ${SystemColors.Canvas};
                    border-color: ${SystemColors.CanvasText};
                }
            `
        )
    );
