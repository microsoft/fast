import { css, ElementStyles } from "@microsoft/fast-element";
import {
    forcedColorsStylesheetBehavior,
    FoundationElementTemplate,
} from "@microsoft/fast-foundation";
import { SystemColors } from "@microsoft/fast-web-utilities";
import {
    accentFillRest,
    foregroundOnAccentActive,
    neutralFillRest,
    neutralStrokeDividerRest,
    strokeWidth,
} from "../design-tokens";

/**
 * Styles for Data Grid row
 * @public
 */
export const dataGridRowStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) =>
    css`
        :host {
            display: grid;
            padding: 1px 0;
            box-sizing: border-box;
            width: 100%;
            border-bottom: calc(${strokeWidth} * 1px) solid ${neutralStrokeDividerRest};
        }

        :host(.header) {
        }

        :host(.sticky-header) {
            background: ${neutralFillRest};
            position: sticky;
            top: 0;
        }

        :host([aria-selected="true"]) {
            background: ${accentFillRest};
            color: ${foregroundOnAccentActive};
        }
    `.withBehaviors(
        forcedColorsStylesheetBehavior(
            css`
                :host {
                    border-color: transparent;
                    forced-color-adjust: none;
                    color: ${SystemColors.ButtonText};
                    fill: currentcolor;
                }
                :host([aria-selected="true"]) {
                    background: ${SystemColors.Highlight};
                    color: ${SystemColors.HighlightText};
                }
            `
        )
    );
