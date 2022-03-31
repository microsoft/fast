import { css, ElementStyles } from "@microsoft/fast-element";
import { FoundationElementTemplate } from "@microsoft/fast-foundation";

/**
 * Styles for Data Grid
 * @public
 */
export const dataGridStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) => css`
    :host {
        display: flex;
        position: relative;
        flex-direction: column;
    }

    :host([selection-mode="multi-row"]) {
        user-select: none;
    }
`;
