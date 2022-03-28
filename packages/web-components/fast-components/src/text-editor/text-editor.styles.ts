import { css, ElementStyles } from "@microsoft/fast-element";
import { focusVisible, FoundationElementTemplate } from "@microsoft/fast-foundation";
import {
    controlCornerRadius,
    fillColor,
    neutralStrokeFocus,
    strokeWidth,
} from "../design-tokens";
import { elevation } from "../styles/elevation";
import { heightNumber } from "../styles/index";

/**
 * Styles for Text Editor
 * @public
 */
export const textEditorStyles: FoundationElementTemplate<ElementStyles> = (
    context,
    definition
) => css`
    .toolbar {
        --elevation: 14;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .tooltip {
        margin: 0;
    }

    .toolbar-item {
        margin: 2px;
    }

    .color-combobox,
    .font-size-combobox {
        min-width: 100px;
    }

    .color-combobox {
        width: 160px;
    }

    .font-size-combobox {
        width: 80px;
    }
    .toolbar::part(positioning-region) {
        flex-flow: row wrap;
    }
    .editor {
    }
`;
