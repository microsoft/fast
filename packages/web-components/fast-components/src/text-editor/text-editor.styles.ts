import { css, ElementStyles } from "@microsoft/fast-element";
import { focusVisible, FoundationElementTemplate } from "@microsoft/fast-foundation";
import {
    controlCornerRadius,
    fillColor,
    neutralStrokeFocus,
    strokeWidth,
} from "../design-tokens";
import { elevation } from "../styles/elevation";

/**
 * Styles for Text Editor
 * @public
 */
export const textEditorStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) => css`
    ::slotted([slot="editor-region"]) {
        border: 2px solid green;
    }
`;
