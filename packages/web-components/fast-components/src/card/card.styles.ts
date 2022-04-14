import { css, ElementStyles } from "@microsoft/fast-element";
import {
    display,
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import { controlCornerRadius, fillColor } from "../design-tokens.js";
import { elevation } from "../styles/index.js";

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
            --elevation: 4;
            display: block;
            contain: content;
            height: var(--card-height, 100%);
            width: var(--card-width, 100%);
            box-sizing: border-box;
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
