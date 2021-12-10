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

    .container {
        background: repeating-linear-gradient(
            0deg,
            gray,
            gray 40px,
            darkgray 40px,
            darkgray 80px
        );
    }
`;
