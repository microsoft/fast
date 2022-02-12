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
            --elevation: 4;
            display: block;
            contain: strict;
            box-sizing: border-box;
            height: 100%;
            width: 100%;
            background: ${fillColor};
            border-radius: calc(${controlCornerRadius} * 1px);
            ${elevation}
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
