import { html } from "@microsoft/fast-element";
import type { ViewTemplate } from "@microsoft/fast-element";
import { toggleBold, toggleItalic } from "roosterjs-editor-api";
import type { FoundationElementTemplate } from "../foundation-element";
import type { ElementDefinitionContext } from "../design-system";
import { Button } from "../button";
import { Toolbar } from "../toolbar";
import type { TextEditorToolbar } from "./text-editor-toolbar";

function createDefaultToolbarTemplate(
    context: ElementDefinitionContext
): ViewTemplate<TextEditorToolbar> {
    const toolbarTag: string = context.tagFor(Toolbar);
    const buttonTag: string = context.tagFor(Button);
    return html`
        <${toolbarTag}
            class="toolbar"
            part="toolbar"
        >
            <${buttonTag}
                @click="${x => toggleBold(x.editor)}"
            >
            Bold
            </${buttonTag}>
            <${buttonTag}
                @click="${x => toggleItalic(x.editor)}"
            >
            Italic
            </${buttonTag}>
        </${toolbarTag}>
`;
}

/**
 * The template for the
 * @public
 */
export const textEditorToolbarTemplate: FoundationElementTemplate<ViewTemplate<
    TextEditorToolbar
>> = (context, definition) => {
    const defaultToolbarTemplate: ViewTemplate<TextEditorToolbar> = createDefaultToolbarTemplate(
        context
    );
    return html<TextEditorToolbar>`
        <template
            slot="toolbar-region"
            :defaultToolbarTemplate="${defaultToolbarTemplate}"
        >
            <slot></slot>
        </template>
    `;
};
