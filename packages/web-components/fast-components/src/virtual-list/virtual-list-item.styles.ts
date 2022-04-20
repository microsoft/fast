import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    ElementDefinitionContext,
    forcedColorsStylesheetBehavior,
    FoundationElementDefinition,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { controlCornerRadius, fillColor } from "../design-tokens";
import { elevation } from "../styles/index";

/**
 * Styles for virtual-list-item
 * @public
 */
export const virtualListItemStyles: (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) => ElementStyles = (
    context: ElementDefinitionContext,
    definition: FoundationElementDefinition
) =>
    css`
        :host {
            position: absolute;
            display: block;
            contain: layout;
            box-sizing: border-box;
            height: auto;
            width: auto;
            background: ${fillColor};
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    forced-color-adjust: none;
                    background: ${SystemColors.Canvas};
                    box-shadow: 0 0 0 1px ${SystemColors.CanvasText};
                }
            `
        )
    );
