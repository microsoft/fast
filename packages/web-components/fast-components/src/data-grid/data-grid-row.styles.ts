import { css, ElementStyles } from "@microsoft/fast-element";
import { FoundationElementTemplate } from "@microsoft/fast-foundation";
import {
    neutralFillRest,
    neutralStrokeDividerRest,
    strokeWidth,
} from "../design-tokens.js";

/**
 * Styles for Data Grid row
 * @public
 */
export const dataGridRowStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) => css`
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
`;
