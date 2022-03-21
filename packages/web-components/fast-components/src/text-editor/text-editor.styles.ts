import { css, ElementStyles } from "@microsoft/fast-element";
import { FoundationElementTemplate } from "@microsoft/fast-foundation";
import { controlCornerRadius, fillColor, strokeWidth } from "../design-tokens";
import { elevation } from "../styles/elevation";

/**
 * Styles for Text Editor
 * @public
 */
export const textEditorStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) => css`
    :host {
        :host([contenteditable]) {
            border: 1px solid #000;
            padding: 0.25rem 0.5rem;
        }
    }
`;
